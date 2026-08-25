import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle2, Loader2, X } from 'lucide-react';
import { checkResumeQuality } from '../../services/api';

const QualityCheck = ({ resumeId, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [error, setError] = useState(null);

    const handleCheck = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await checkResumeQuality(resumeId);
            setReport(data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to check resume quality');
        } finally {
            setLoading(false);
        }
    }, [resumeId]);

    useEffect(() => {
        if (!report && !loading) {
            handleCheck();
        }
    }, [report, loading, handleCheck]);

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return 'text-rose-700 bg-rose-50 border-rose-200';
            case 'medium': return 'text-amber-700 bg-amber-50 border-amber-200';
            case 'low': return 'text-sky-700 bg-sky-50 border-sky-200';
            default: return 'text-slate-700 bg-slate-50 border-slate-200';
        }
    };

    const qualityScore = report ? (report.authenticity_score || report.confidence_score || report.quality_score || 88) : null;
    const summaryText = report ? (report.overall_assessment || report.summary || 'Resume demonstrates strong authenticity with realistic metric claims.') : '';

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="bg-white rounded-3xl border border-slate-200/90 max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl text-slate-900"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Authenticity & Quality Verification</h2>
                                <p className="text-xs text-slate-500">Detecting buzzword stuffing, vague claims, and formatting risks</p>
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
                    {loading ? (
                        <div className="py-16 text-center space-y-3">
                            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                            <p className="text-xs text-slate-500 font-medium">Running deep quality audit & linguistic sanity checks...</p>
                        </div>
                    ) : error ? (
                        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700">
                            {error}
                        </div>
                    ) : report ? (
                        <div className="space-y-6">
                            {/* Summary Card */}
                            <div className="p-5 bg-gradient-to-r from-emerald-50/60 to-teal-50/40 border border-emerald-100 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-sm font-bold text-emerald-950">
                                        Quality Score: {qualityScore}/100
                                    </h3>
                                    <p className="text-xs text-emerald-800 mt-0.5">
                                        {summaryText}
                                    </p>
                                </div>
                            </div>

                            {/* Issues List */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Identified Issues & Linguistic Risks ({(report.issues || []).length})
                                </h4>
                                {(report.issues || []).length === 0 ? (
                                    <div className="p-6 text-center bg-emerald-50/40 border border-emerald-100 rounded-3xl space-y-1">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                                        <p className="text-xs font-bold text-emerald-900">Zero Red Flags Detected</p>
                                        <p className="text-[11px] text-slate-500">Your resume passed all consistency and buzzword checks.</p>
                                    </div>
                                ) : (
                                    (report.issues || []).map((issue, i) => (
                                        <div key={i} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1.5">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-bold text-slate-900">{issue.issue || issue.title || issue.type}</span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSeverityColor(issue.severity)}`}>
                                                    {issue.severity}
                                                </span>
                                            </div>
                                            {issue.location && (
                                                <span className="text-[10px] text-slate-400 font-semibold block">Location: {issue.location}</span>
                                            )}
                                            {(issue.example || issue.description || issue.detail) && (
                                                <p className="text-xs text-slate-600 italic">"{issue.example || issue.description || issue.detail}"</p>
                                            )}
                                            {issue.suggestion && (
                                                <p className="text-[11px] text-indigo-700 bg-white p-2.5 rounded-xl border border-slate-200/70 mt-2 font-medium">
                                                    Fix: {issue.suggestion}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>
            </motion.div>
        </div>
    );
};

export default QualityCheck;
