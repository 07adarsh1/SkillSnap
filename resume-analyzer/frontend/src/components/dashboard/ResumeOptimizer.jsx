import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Building2, FileText, ArrowRight, Download, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { optimizeResume } from '../../services/api';

const ResumeOptimizer = ({ resumeId, onClose }) => {
    const [jobDescription, setJobDescription] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleOptimize = async () => {
        if (!jobDescription.trim()) {
            setError('Please provide a job description');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await optimizeResume(resumeId, jobDescription, companyName);
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to optimize resume');
        } finally {
            setLoading(false);
        }
    };

    const downloadOptimized = () => {
        // Create downloadable content
        const content = `
OPTIMIZED PROFESSIONAL SUMMARY:
${result.optimized_summary}

OPTIMIZED SKILLS:
${result.optimized_skills.join(', ')}

OPTIMIZED EXPERIENCE:
${result.optimized_experience.map((exp, i) => `
${i + 1}. ${exp.optimized}
   (Reason: ${exp.reason})
`).join('\n')}

CHANGES EXPLANATION:
${result.changes_explanation}

Expected ATS Improvement: +${result.ats_improvement_score} points
        `.trim();

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `optimized_resume_${companyName || 'generic'}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 rounded-2xl border border-slate-700 max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-primary/10 to-purple-600/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">AI Resume Optimizer</h2>
                                <p className="text-sm text-slate-400">Tailor your resume for maximum ATS impact</p>
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
                    {!result ? (
                        <>
                            {/* Input Form */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        <Building2 className="w-4 h-4 inline mr-2" />
                                        Company Name (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        placeholder="e.g., Google, Microsoft, Amazon"
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        <FileText className="w-4 h-4 inline mr-2" />
                                        Job Description *
                                    </label>
                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        placeholder="Paste the full job description here..."
                                        rows={10}
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                    />
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                                        <p className="text-red-400 text-sm">{error}</p>
                                    </div>
                                )}

                                <button
                                    onClick={handleOptimize}
                                    disabled={loading || !jobDescription.trim()}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Optimizing with AI...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Optimize Resume
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Results */}
                            <div className="space-y-6">
                                {/* Success Banner */}
                                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                                    <div>
                                        <p className="text-green-400 font-semibold">Optimization Complete!</p>
                                        <p className="text-sm text-slate-400">Expected ATS improvement: +{result.ats_improvement_score} points</p>
                                    </div>
                                </div>

                                {/* Optimized Summary */}
                                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-primary" />
                                        Optimized Professional Summary
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed">{result.optimized_summary}</p>
                                </div>

                                {/* Optimized Skills */}
                                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                                    <h3 className="text-lg font-bold text-white mb-3">Optimized Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.optimized_skills.map((skill, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm border border-primary/20"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Experience Improvements */}
                                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                                    <h3 className="text-lg font-bold text-white mb-4">Experience Improvements</h3>
                                    <div className="space-y-4">
                                        {result.optimized_experience.map((exp, i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex items-start gap-3">
                                                    <ArrowRight className="w-5 h-5 text-green-400 mt-1 shrink-0" />
                                                    <div className="flex-1">
                                                        <p className="text-slate-400 text-sm line-through mb-1">{exp.original}</p>
                                                        <p className="text-green-400 font-medium">{exp.optimized}</p>
                                                        <p className="text-xs text-slate-500 mt-1 italic">{exp.reason}</p>
                                                    </div>
                                                </div>
                                                {i < result.optimized_experience.length - 1 && (
                                                    <div className="border-b border-slate-700/50" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Changes Explanation */}
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
                                    <h3 className="text-lg font-bold text-blue-400 mb-2">What Changed?</h3>
                                    <p className="text-slate-300 leading-relaxed">{result.changes_explanation}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={downloadOptimized}
                                        className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-5 h-5" />
                                        Download Optimized Resume
                                    </button>
                                    <button
                                        onClick={() => setResult(null)}
                                        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all"
                                    >
                                        Optimize Another
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ResumeOptimizer;
