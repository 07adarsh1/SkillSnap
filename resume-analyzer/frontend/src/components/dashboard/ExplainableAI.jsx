import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, TrendingUp, TrendingDown, Target, Zap, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { explainScore } from '../../services/api';

const ExplainableAI = ({ resumeId, currentScore, jobDescription, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [explanation, setExplanation] = useState(null);
    const [error, setError] = useState(null);

    const handleExplain = async () => {
        if (!jobDescription) {
            setError('Job description is required to explain the score');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await explainScore(resumeId, jobDescription);
            setExplanation(data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to generate explanation');
        } finally {
            setLoading(false);
        }
    };

    // Auto-load on mount if job description is provided
    React.useEffect(() => {
        if (jobDescription && !explanation && !loading) {
            handleExplain();
        }
    }, []);

    const getImpactColor = (impact) => {
        switch (impact) {
            case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
            case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-500';
            case 'medium': return 'bg-yellow-500';
            case 'low': return 'bg-blue-500';
            default: return 'bg-slate-500';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 rounded-2xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                <HelpCircle className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Why This Score?</h2>
                                <p className="text-sm text-slate-400">AI-powered explanation of your ATS score</p>
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
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                            <p className="text-slate-400">Analyzing your score...</p>
                        </div>
                    ) : error ? (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    ) : explanation ? (
                        <>
                            {/* Current Score */}
                            <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl text-center">
                                <p className="text-sm text-slate-400 mb-2">Your Current ATS Score</p>
                                <p className="text-5xl font-bold text-white mb-2">{currentScore}%</p>
                                <div className="w-full bg-slate-700 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-primary to-purple-600 h-2 rounded-full transition-all"
                                        style={{ width: `${currentScore}%` }}
                                    />
                                </div>
                            </div>

                            {/* Main Reasoning */}
                            <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                <h3 className="text-lg font-bold text-blue-400 mb-3">Overall Reasoning</h3>
                                <p className="text-slate-300 leading-relaxed">{explanation.reasoning}</p>
                            </div>

                            {/* Score Breakdown */}
                            {explanation.score_breakdown && (
                                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                                    <h3 className="text-lg font-bold text-white mb-4">Score Breakdown</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.entries(explanation.score_breakdown).map(([key, value]) => (
                                            <div key={key} className="p-3 bg-slate-900/50 rounded-lg">
                                                <p className="text-xs text-slate-400 mb-1 capitalize">
                                                    {key.replace(/_/g, ' ')}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full ${value >= 75 ? 'bg-green-500' :
                                                                    value >= 50 ? 'bg-yellow-500' :
                                                                        'bg-red-500'
                                                                }`}
                                                            style={{ width: `${value}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-bold text-white">{value}%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Positive Factors */}
                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                                <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    What Helped Your Score
                                </h3>
                                <div className="space-y-3">
                                    {explanation.positive_factors.map((factor, i) => (
                                        <div key={i} className="p-3 bg-green-500/5 border border-green-500/10 rounded-lg">
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <p className="font-medium text-green-400">{factor.factor}</p>
                                                <span className={`text-xs px-2 py-1 rounded-full border ${getImpactColor(factor.impact)}`}>
                                                    {factor.impact} impact
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-400 italic">"{factor.evidence}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Negative Factors */}
                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                                <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                                    <TrendingDown className="w-5 h-5" />
                                    What Hurt Your Score
                                </h3>
                                <div className="space-y-3">
                                    {explanation.negative_factors.map((factor, i) => (
                                        <div key={i} className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <p className="font-medium text-red-400">{factor.factor}</p>
                                                <span className={`text-xs px-2 py-1 rounded-full border ${getImpactColor(factor.impact)}`}>
                                                    {factor.impact} impact
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-400 italic">"{factor.evidence}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Improvement Actions */}
                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-primary" />
                                    Recommended Actions
                                </h3>
                                <div className="space-y-3">
                                    {explanation.improvement_actions.map((action, i) => (
                                        <div key={i} className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <div className={`w-1 h-full ${getPriorityColor(action.priority)} rounded-full`} />
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between gap-3 mb-2">
                                                        <p className="font-medium text-white">{action.action}</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
                                                                {action.expected_impact}
                                                            </span>
                                                            <span className={`text-xs px-2 py-1 rounded-full ${action.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                                    action.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                                                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                                }`}>
                                                                {action.priority} priority
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <HelpCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400">Click below to generate explanation</p>
                            <button
                                onClick={handleExplain}
                                className="mt-4 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-all"
                            >
                                Explain My Score
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ExplainableAI;
