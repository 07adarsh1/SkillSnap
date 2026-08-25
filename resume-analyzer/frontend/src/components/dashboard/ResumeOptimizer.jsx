import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Building2, FileText, ArrowRight, Download, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { optimizeResume } from '../../services/api';
import { Badge } from '../ui/Badge';

const ResumeOptimizer = ({ resumeId, onClose }) => {
    const [jobDescription, setJobDescription] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleOptimize = async () => {
        if (!jobDescription.trim()) {
            setError('Please provide a target job description');
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
        if (!result) return;
        const skillsList = Array.isArray(result.optimized_skills) ? result.optimized_skills.join(', ') : (result.optimized_skills || '');
        const experienceList = Array.isArray(result.optimized_experience) 
            ? result.optimized_experience.map((exp, i) => `\n${i + 1}. ${exp.optimized || exp.original || ''}\n   (Reason: ${exp.reason || 'ATS optimization'})\n`).join('\n')
            : '';

        const content = `
OPTIMIZED PROFESSIONAL SUMMARY:
${result.optimized_summary || ''}

OPTIMIZED SKILLS:
${skillsList}

OPTIMIZED EXPERIENCE:
${experienceList}

CHANGES EXPLANATION:
${result.changes_explanation || ''}

Expected ATS Improvement: +${result.ats_improvement_score || 15} points
        `.trim();

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `optimized_resume_${companyName || 'tailored'}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

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
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">AI Resume Optimizer</h2>
                                <p className="text-xs text-slate-500">Tailor your resume for specific companies with Groq LPU inference</p>
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
                    {!result ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    <Building2 className="w-3.5 h-3.5 inline mr-1 text-indigo-600" />
                                    Target Company (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="e.g., Google, Microsoft, Stripe..."
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    <FileText className="w-3.5 h-3.5 inline mr-1 text-indigo-600" />
                                    Target Job Description *
                                </label>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste the full target job description or requirements here..."
                                    rows={7}
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
                                onClick={handleOptimize}
                                disabled={loading || !jobDescription.trim()}
                                className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>{loading ? 'Optimizing Resume with AI...' : 'Generate Tailored Resume'}</span>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Success Banner */}
                            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-emerald-900">Optimization Complete!</p>
                                    <p className="text-xs text-emerald-700">Estimated ATS score increase: +{result.ats_improvement_score} points</p>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Optimized Professional Summary
                                </h3>
                                <p className="text-xs text-slate-700 leading-relaxed">{result.optimized_summary}</p>
                            </div>

                            {/* Skills */}
                            {(result.optimized_skills || []).length > 0 && (
                                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Recommended Skills Alignment</h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {(result.optimized_skills || []).map((skill, i) => (
                                            <Badge key={i} variant="primary">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Experience */}
                            {(result.optimized_experience || []).length > 0 && (
                                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Experience Bullet Transformations</h3>
                                    <div className="space-y-3">
                                        {(result.optimized_experience || []).map((exp, i) => (
                                            <div key={i} className="text-xs space-y-1 pb-3 border-b border-slate-200/60 last:border-0 last:pb-0">
                                                {exp.original && <p className="text-slate-400 line-through">{exp.original}</p>}
                                                <p className="text-emerald-700 font-semibold flex items-start gap-1">
                                                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                                                    <span>{exp.optimized || exp.bullet || ''}</span>
                                                </p>
                                                {exp.reason && <p className="text-[11px] text-slate-500 italic pl-4.5">{exp.reason}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Explanation */}
                            <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4">
                                <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1">AI Rationale</h3>
                                <p className="text-xs text-slate-700 leading-relaxed">{result.changes_explanation}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    onClick={downloadOptimized}
                                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Download Optimized Content
                                </button>
                                <button
                                    onClick={() => setResult(null)}
                                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
                                >
                                    Tailor For Another Role
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ResumeOptimizer;
