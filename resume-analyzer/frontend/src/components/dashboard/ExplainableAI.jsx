import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, TrendingUp, TrendingDown, Target, Zap, AlertTriangle, CheckCircle2, Loader2, X } from 'lucide-react';
import { explainScore } from '../../services/api';

const ExplainableAI = ({ resumeId, currentScore, jobDescription, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [explanation, setExplanation] = useState(null);
    const [error, setError] = useState(null);

    const handleExplain = async () => {
        if (!jobDescription) {
            setError('A target job description is required to calculate score explanation');
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

    React.useEffect(() => {
        if (jobDescription && !explanation && !loading) {
            handleExplain();
        }
    }, []);

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
                            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                                <HelpCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Score Explainability (XAI)</h2>
                                <p className="text-xs text-slate-500">Deconstructing your ATS score and rubric calculations</p>
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
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-slate-900">
                    {!jobDescription && !explanation ? (
                        <div className="p-8 text-center bg-slate-50 border border-slate-200/80 rounded-3xl space-y-2">
                            <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                            <h3 className="text-sm font-bold text-slate-900">Target Job Description Required</h3>
                            <p className="text-xs text-slate-500 max-w-md mx-auto">
                                To see an in-depth score explanation and factor weights, please provide a target Job Description in the dashboard.
                            </p>
                        </div>
                    ) : loading ? (
                        <div className="py-16 text-center space-y-3">
                            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                            <p className="text-xs text-slate-500 font-medium">Computing factor attribution and SHAP weights...</p>
                        </div>
                    ) : error ? (
                        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700">
                            {error}
                        </div>
                    ) : explanation ? (
                        <div className="space-y-6">
                            {/* Summary Card */}
                            <div className="p-5 bg-gradient-to-r from-indigo-50/60 to-slate-50 border border-indigo-100 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-sm font-bold text-indigo-950">Calculated ATS Score: {currentScore || explanation.score}/100</h3>
                                    <p className="text-xs text-slate-600 mt-0.5">{explanation.summary || 'Rubric evaluation completed with sentence embeddings and rubric heuristics.'}</p>
                                </div>
                            </div>

                            {/* Positive & Negative Factors */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-5 bg-emerald-50/40 border border-emerald-100 rounded-3xl space-y-3">
                                    <h4 className="text-xs uppercase font-bold text-emerald-800 flex items-center gap-1.5">
                                        <TrendingUp className="w-4 h-4 text-emerald-600" /> Positive Score Drivers
                                    </h4>
                                    <ul className="space-y-2 text-xs text-slate-700">
                                        {(explanation.positive_factors || []).map((factor, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                                                <span>{factor}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-5 bg-rose-50/40 border border-rose-100 rounded-3xl space-y-3">
                                    <h4 className="text-xs uppercase font-bold text-rose-800 flex items-center gap-1.5">
                                        <TrendingDown className="w-4 h-4 text-rose-600" /> Score Penalties & Gaps
                                    </h4>
                                    <ul className="space-y-2 text-xs text-slate-700">
                                        {(explanation.negative_factors || []).map((factor, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 mt-0.5 shrink-0" />
                                                <span>{factor}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Recommendations to reach 95+ */}
                            {explanation.recommendations?.length > 0 && (
                                <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-3xl space-y-3">
                                    <h4 className="text-xs uppercase font-bold text-slate-900 flex items-center gap-1.5">
                                        <Target className="w-4 h-4 text-indigo-600" /> Action Items to Reach 90+ Match
                                    </h4>
                                    <div className="space-y-2">
                                        {explanation.recommendations.map((rec, i) => (
                                            <div key={i} className="p-3 bg-white border border-slate-200/70 rounded-xl text-xs text-slate-700 shadow-xs flex items-start gap-2">
                                                <Zap className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                                                <span>{rec}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            </motion.div>
        </div>
    );
};

export default ExplainableAI;
