import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Code, Users, Lightbulb, Loader2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { generateInterviewQuestions } from '../../services/api';

const InterviewPrep = ({ resumeId, onClose }) => {
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('technical');
    const [expandedQuestions, setExpandedQuestions] = useState(new Set());

    const handleGenerate = async () => {
        if (!jobDescription.trim()) {
            setError('Please provide a job description');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await generateInterviewQuestions(resumeId, jobDescription);
            setQuestions(data);
            setActiveTab('technical');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to generate questions');
        } finally {
            setLoading(false);
        }
    };

    const toggleQuestion = (index) => {
        const newExpanded = new Set(expandedQuestions);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedQuestions(newExpanded);
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy': return 'text-green-400 bg-green-500/10 border-green-500/20';
            case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'hard': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    const tabs = [
        { id: 'technical', label: 'Technical', icon: Code, color: 'blue' },
        { id: 'behavioral', label: 'Behavioral', icon: Users, color: 'purple' },
        { id: 'situational', label: 'Situational', icon: Lightbulb, color: 'green' }
    ];

    const renderQuestions = (questionList) => (
        <div className="space-y-3">
            {questionList.map((q, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden"
                >
                    <button
                        onClick={() => toggleQuestion(index)}
                        className="w-full p-4 flex items-start justify-between gap-3 hover:bg-slate-700/30 transition-colors text-left"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(q.difficulty)}`}>
                                    {q.difficulty}
                                </span>
                                <span className="text-xs text-slate-500">{q.focus_area}</span>
                            </div>
                            <p className="text-white font-medium">{q.question}</p>
                        </div>
                        {expandedQuestions.has(index) ? (
                            <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                        )}
                    </button>

                    {expandedQuestions.has(index) && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 pb-4 border-t border-slate-700/50"
                        >
                            <div className="pt-4 space-y-2">
                                <p className="text-sm text-slate-400">
                                    <strong className="text-slate-300">Focus Area:</strong> {q.focus_area}
                                </p>
                                <div className="p-3 bg-slate-900/50 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">💡 Preparation Tip:</p>
                                    <p className="text-sm text-slate-300">
                                        Prepare examples from your experience that demonstrate {q.focus_area}.
                                        Use the STAR method (Situation, Task, Action, Result) for structured answers.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            ))}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 rounded-2xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <Brain className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Interview Readiness</h2>
                                <p className="text-sm text-slate-400">AI-generated questions based on your resume</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {!questions ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Job Description *
                                </label>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste the job description to generate relevant interview questions..."
                                    rows={10}
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                />
                            </div>

                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            <button
                                onClick={handleGenerate}
                                disabled={loading || !jobDescription.trim()}
                                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-600/90 hover:to-purple-600/90 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Generating Questions...
                                    </>
                                ) : (
                                    <>
                                        <Brain className="w-5 h-5" />
                                        Generate Interview Questions
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Overall Difficulty */}
                            <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">Overall Difficulty</p>
                                    <p className={`text-lg font-bold ${questions.overall_difficulty === 'easy' ? 'text-green-400' :
                                            questions.overall_difficulty === 'medium' ? 'text-yellow-400' :
                                                'text-red-400'
                                        }`}>
                                        {questions.overall_difficulty.toUpperCase()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-slate-400">Total Questions</p>
                                    <p className="text-lg font-bold text-white">
                                        {(questions.technical?.length || 0) +
                                            (questions.behavioral?.length || 0) +
                                            (questions.situational?.length || 0)}
                                    </p>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-2 border-b border-slate-700">
                                {tabs.map(tab => {
                                    const Icon = tab.icon;
                                    const count = questions[tab.id]?.length || 0;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${activeTab === tab.id
                                                    ? `border-${tab.color}-500 text-${tab.color}-400`
                                                    : 'border-transparent text-slate-400 hover:text-slate-300'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="font-medium">{tab.label}</span>
                                            <span className="text-xs px-2 py-0.5 bg-slate-700 rounded-full">{count}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Questions List */}
                            {renderQuestions(questions[activeTab] || [])}

                            {/* Preparation Tips */}
                            {questions.preparation_tips && questions.preparation_tips.length > 0 && (
                                <div className="mt-6 p-5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                    <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                                        <Lightbulb className="w-5 h-5" />
                                        Preparation Tips
                                    </h3>
                                    <ul className="space-y-2">
                                        {questions.preparation_tips.map((tip, i) => (
                                            <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                                <span className="text-blue-400 mt-1">•</span>
                                                <span>{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Actions */}
                            <button
                                onClick={() => setQuestions(null)}
                                className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all"
                            >
                                Generate New Questions
                            </button>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default InterviewPrep;
