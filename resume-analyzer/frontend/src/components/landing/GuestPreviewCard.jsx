import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, CheckCircle2, AlertTriangle, Sparkles, RefreshCw, Zap, ShieldAlert, FileText, ChevronRight } from 'lucide-react';

const GuestPreviewCard = ({ previewData, onUnlock, onResetScan, isRestoring }) => {
    if (!previewData) return null;

    const { score = 0, keywordMatch = 0, issues = [] } = previewData;

    const getScoreColor = (val) => {
        if (val >= 75) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
        if (val >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
        return 'text-rose-600 bg-rose-50 border-rose-200';
    };

    const getScoreBadgeText = (val) => {
        if (val >= 80) return 'Strong Foundation';
        if (val >= 60) return 'Moderate Alignment';
        return 'Needs Improvement';
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-2xl mx-auto bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-xl p-6 sm:p-8 space-y-6 text-left"
        >
            {/* Header / Score Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                            <Sparkles className="w-3 h-3 text-indigo-600" /> Free ATS Assessment
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getScoreColor(score)}`}>
                            {getScoreBadgeText(score)}
                        </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        Your ATS Score Preview
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        We analyzed your resume structure, keyword density, and formatting.
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-slate-200/80 rounded-2xl px-4 py-3 shrink-0">
                    <div className="text-right">
                        <div className="text-2xl sm:text-3xl font-black text-indigo-600 leading-none">
                            {score}<span className="text-xs sm:text-sm text-slate-400 font-semibold">/100</span>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">ATS Score</span>
                    </div>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-amber-500" /> Keyword Alignment
                        </span>
                        <span className="text-xs font-extrabold text-slate-900">{keywordMatch}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-indigo-500 to-violet-600 h-full rounded-full transition-all duration-700"
                            style={{ width: `${Math.min(100, Math.max(5, keywordMatch))}%` }}
                        />
                    </div>
                    <p className="text-[11px] text-slate-500">
                        {keywordMatch >= 70 ? 'Good keyword distribution' : 'Critical industry keywords missing'}
                    </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-500" /> Action Items Identified
                    </span>
                    <div className="text-xl font-black text-slate-900">
                        {issues.length > 0 ? `${issues.length}+ High Impact Gaps` : '3 Recommendations'}
                    </div>
                    <p className="text-[11px] text-slate-500">
                        Fixing these will significantly improve recruiter discovery.
                    </p>
                </div>
            </div>

            {/* Top Issues Discovered */}
            <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Key Insights Found
                </h4>
                <div className="space-y-2">
                    {issues.map((issue, idx) => (
                        <div
                            key={idx}
                            className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 text-slate-800 text-xs sm:text-[13px] leading-relaxed"
                        >
                            <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                            </span>
                            <span>{issue}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Locked Content Teaser */}
            <div className="relative rounded-2xl border border-dashed border-indigo-200 bg-gradient-to-b from-indigo-50/30 to-violet-50/40 p-4 sm:p-5 overflow-hidden">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Lock className="w-3.5 h-3.5" />
                    </div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                        Unlock Your Complete ATS Intelligence Report
                    </h5>
                </div>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    Create a free account or sign in to instantly unlock all deep insights without rescanning:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 mb-2">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>Missing Keyword & Skill Gaps</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>AI Bullet Point Rewriter</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>6-Factor Rubric Breakdown</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>Live Job Description Matcher</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onUnlock}
                    disabled={isRestoring}
                    className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60"
                >
                    <Lock className="w-4 h-4" />
                    <span>{isRestoring ? 'Restoring Scan...' : 'Unlock Full Analysis (Free)'}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                </motion.button>

                <button
                    type="button"
                    onClick={onResetScan}
                    className="w-full sm:w-auto py-3 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Scan Another</span>
                </button>
            </div>
        </motion.div>
    );
};

export default GuestPreviewCard;
