import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Code, Users, Lightbulb, Loader2, AlertCircle, ChevronDown, X, Sparkles } from 'lucide-react';
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
            setError('Please provide a target job description');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await generateInterviewQuestions(resumeId, jobDescription);
            setQuestions(data);
            setActiveTab('technical');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to generate interview questions');
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
            case 'easy': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
            case 'medium': return 'text-amber-700 bg-amber-50 border-amber-200';
            case 'hard': return 'text-rose-700 bg-rose-50 border-rose-200';
            default: return 'text-slate-700 bg-slate-50 border-slate-200';
        }
    };

    const tabs = [
        { id: 'technical', label: 'Technical', icon: Code },
        { id: 'behavioral', label: 'Behavioral', icon: Users },
        { id: 'situational', label: 'Situational', icon: Lightbulb }
    ];

    const renderQuestions = (questionList) => (
        <div className="space-y-3">
            {questionList.map((q, index) => (
                <div
                    key={index}
                    className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs"
                >
                    <button
                        onClick={() => toggleQuestion(index)}
                        className="w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-slate-50/70 transition-colors cursor-pointer"
                    >
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getDifficultyColor(q.difficulty)}`}>
                                    {q.difficulty}
                                </span>
                                {(q.focus_area || q.topic) && (
                                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200 font-medium">
                                        {q.focus_area || q.topic}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs font-bold text-slate-900 leading-snug">{q.question}</p>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 mt-1 transition-transform ${expandedQuestions.has(index) ? 'rotate-180' : ''}`} />
                    </button>

                    {expandedQuestions.has(index) && (
                        <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50/50 space-y-2.5 text-xs">
                            {(q.expected_points || q.focus_area) && (
                                <div>
                                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-1">Key Evaluation Focus:</span>
                                    {Array.isArray(q.expected_points) ? (
                                        <ul className="list-disc list-inside space-y-1 text-slate-600">
                                            {q.expected_points.map((pt, i) => (
                                                <li key={i}>{pt}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-slate-600">{q.focus_area || 'Core competency evaluation'}</p>
                                    )}
                                </div>
                            )}
                            {q.sample_answer && (
                                <div>
                                    <span className="font-bold text-indigo-700 uppercase tracking-wider text-[10px] block mb-1">Framework / Sample Answer:</span>
                                    <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80 leading-relaxed">{q.sample_answer}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="bg-white rounded-3xl border border-slate-200/90 max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                                <Brain className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">AI Interview Preparation</h2>
                                <p className="text-xs text-slate-500">Customized interview questions formulated from your resume and target role</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {!questions ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    Target Job Description *
                                </label>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste the target job description or role requirements here..."
                                    rows={8}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-700 text-xs">
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <button
                                onClick={handleGenerate}
                                disabled={loading || !jobDescription.trim()}
                                className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>{loading ? 'Synthesizing Interview Questions...' : 'Generate Interview Questions'}</span>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {/* Tips banner if provided */}
                            {questions.preparation_tips?.length > 0 && (
                                <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl space-y-1.5">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 block">Interview Preparation Tips:</span>
                                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
                                        {questions.preparation_tips.map((tip, ti) => (
                                            <li key={ti}>{tip}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Tabs */}
                            <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/60">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    const count = questions[tab.id]?.length || 0;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${isActive
                                                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/60'
                                                : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            <Icon className="w-3.5 h-3.5" />
                                            <span>{tab.label} ({count})</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Questions Render */}
                            {questions[activeTab]?.length > 0 ? (
                                renderQuestions(questions[activeTab])
                            ) : (
                                <p className="text-xs text-slate-400 text-center py-8">No {activeTab} questions generated for this role.</p>
                            )}

                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={() => setQuestions(null)}
                                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
                                >
                                    Generate For Another Role
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default InterviewPrep;
