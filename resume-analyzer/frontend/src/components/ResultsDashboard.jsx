import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CheckCircle, XCircle, AlertTriangle, Award, Sparkles, MessageSquare, HelpCircle, History, ShieldCheck, BarChart3, ChevronDown, ArrowRight, Loader2, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { analyzeResume } from '../services/api';

import ResumeOptimizer from './dashboard/ResumeOptimizer';
import InterviewPrep from './dashboard/InterviewPrep';
import ExplainableAI from './dashboard/ExplainableAI';
import VersionControl from './dashboard/VersionControl';
import QualityCheck from './dashboard/QualityCheck';

const ResultsDashboard = ({ data: initialData, resumeId, jobDescription: initialJobDescription }) => {
    const [data, setData] = useState(initialData);
    const [currentJd, setCurrentJd] = useState(initialJobDescription || '');
    const [isReanalyzing, setIsReanalyzing] = useState(false);
    const [showJdBox, setShowJdBox] = useState(false);

    const [showOptimizer, setShowOptimizer] = useState(false);
    const [showInterviewPrep, setShowInterviewPrep] = useState(false);
    const [showExplainer, setShowExplainer] = useState(false);
    const [showVersions, setShowVersions] = useState(false);
    const [showQualityCheck, setShowQualityCheck] = useState(false);
    const [showBreakdown, setShowBreakdown] = useState(false);

    // Synchronize if initial props change
    React.useEffect(() => {
        setData(initialData);
    }, [initialData]);

    if (!data) return null;

    const {
        ats_score,
        resume_skills = [],
        matched_skills,
        missing_skills,
        strengths,
        ai_suggestions,
        score_breakdown,
    } = data;

    const safeScore = Number.isFinite(Number(ats_score)) ? Number(ats_score) : 0;
    const safeResumeSkills = Array.isArray(resume_skills) ? resume_skills : [];
    const safeMatchedSkills = Array.isArray(matched_skills) ? matched_skills : [];
    const safeMissingSkills = Array.isArray(missing_skills) ? missing_skills : [];
    const hasJobDescription = Boolean(String(currentJd || '').trim());
    const displaySkills = hasJobDescription ? safeMatchedSkills : safeResumeSkills;

    const handleReanalyzeWithJd = async (e) => {
        e?.preventDefault?.();
        if (!resumeId) return;

        setIsReanalyzing(true);
        try {
            const updatedResult = await analyzeResume(resumeId, currentJd.trim());
            setData(updatedResult);
        } catch (err) {
            console.error('Failed to re-analyze resume with JD:', err);
            alert('Failed to re-analyze resume. Please try again.');
        } finally {
            setIsReanalyzing(false);
        }
    };

    const scoreData = [
        { name: 'Score', value: safeScore },
        { name: 'Remaining', value: Math.max(0, 100 - safeScore) }
    ];

    const getColor = (score) => {
        if (score >= 75) return '#059669'; // Emerald-600
        if (score >= 50) return '#D97706'; // Amber-600
        return '#E11D48'; // Rose-600
    };

    const getMatchLabel = (score) => {
        if (score >= 80) return 'Strong Match';
        if (score >= 60) return 'Moderate Match';
        return 'Needs Improvement';
    };

    const scoreColor = getColor(safeScore);
    const matchLabel = getMatchLabel(safeScore);
    const matchVariant = safeScore >= 80 ? 'success' : safeScore >= 60 ? 'warning' : 'danger';

    const breakdownLabels = {
        skills_alignment: 'Skills Alignment',
        semantic_relevance: 'Semantic Relevance (Cosine Similarity)',
        section_coverage: 'Section Coverage',
        impact_evidence: 'Impact Evidence & Action Verbs',
        formatting_quality: 'Formatting & Layout Quality',
        strictness_deductions: 'Strictness Deductions (Penalties)',
    };

    const breakdownEntries = score_breakdown
        ? Object.entries(score_breakdown).filter(([key]) => key !== 'total')
        : [];

    const normalizedSuggestions = Array.from(
        new Set((ai_suggestions || []).map((item) => String(item || '').trim()).filter(Boolean))
    )
        .map((item) => (item.length > 120 ? `${item.slice(0, 117)}...` : item))
        .slice(0, 4);

    const normalizedStrengths = Array.from(
        new Set((strengths || []).map((item) => String(item || '').trim()).filter(Boolean))
    )
        .map((item) => (item.length > 120 ? `${item.slice(0, 117)}...` : item))
        .slice(0, 4);

    const FeatureButton = ({ icon: Icon, title, desc, onClick, color }) => (
        <div
            className="group cursor-pointer rounded-2xl p-5 bg-white border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(79,70,229,0.1)] hover:-translate-y-1 hover:border-indigo-200 transition-all"
            onClick={onClick}
        >
            <div className="flex items-center gap-3.5 mb-2">
                <div
                    className="p-2.5 rounded-xl transition-all shadow-sm"
                    style={{ backgroundColor: `${color}12`, color: color }}
                >
                    <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">
                    {title}
                </h4>
            </div>
            <p className="text-xs text-slate-500 font-normal leading-relaxed">{desc}</p>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Target Job Description Matcher Banner */}
            <div className="bg-gradient-to-r from-indigo-50/70 via-sky-50/60 to-white border border-indigo-100 rounded-3xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                        <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
                            <Target className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-base">
                                {hasJobDescription ? 'Target Job Matching Active' : 'General ATS Audit Mode'}
                            </h3>
                            <p className="text-xs text-slate-600 mt-0.5">
                                {hasJobDescription
                                    ? `Semantic relevance & cosine distance calculated against your job requirements.`
                                    : `Currently evaluating baseline ATS structure. Paste a Job Description to calculate vector embeddings & keyword fit.`}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowJdBox(!showJdBox)}
                        className="px-4 py-2 bg-white hover:bg-slate-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all self-end sm:self-auto shrink-0 cursor-pointer"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        {showJdBox ? 'Hide Job Description' : hasJobDescription ? 'Edit Target Job' : 'Match With Target Job'}
                    </button>
                </div>

                <AnimatePresence>
                    {showJdBox && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mt-4 pt-4 border-t border-indigo-100/80 space-y-3"
                        >
                            <textarea
                                value={currentJd}
                                onChange={(e) => setCurrentJd(e.target.value)}
                                placeholder="Paste the job description or role requirements here (e.g. Senior Backend Engineer with Node.js, Docker, AWS)..."
                                rows={4}
                                disabled={isReanalyzing}
                                className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-all shadow-inner"
                            />
                            <div className="flex justify-end gap-3">
                                {hasJobDescription && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCurrentJd('');
                                            handleReanalyzeWithJd();
                                        }}
                                        disabled={isReanalyzing}
                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 rounded-xl text-xs font-medium transition-all"
                                    >
                                        Clear (General Audit)
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={handleReanalyzeWithJd}
                                    disabled={isReanalyzing || !currentJd.trim()}
                                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all cursor-pointer"
                                >
                                    {isReanalyzing ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            <span>Computing Cosine Embeddings...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Run Semantic Matching</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                {/* Score Card */}
                <Card className="col-span-1 flex flex-col items-center justify-center relative overflow-hidden bg-white border-slate-200/80 shadow-sm">
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500" />
                    <CardHeader className="text-center pb-2 z-10">
                        <CardTitle className="text-slate-900 text-lg">ATS Match Score</CardTitle>
                    </CardHeader>
                    <CardContent className="w-full flex justify-center pb-8 z-10 relative">
                        <div className="relative w-48 h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={scoreData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={72}
                                        outerRadius={94}
                                        startAngle={90}
                                        endAngle={-270}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        <Cell key="score" fill={scoreColor} />
                                        <Cell key="remaining" fill="#F1F5F9" />
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                <span
                                    className="text-[2.6rem] leading-none font-black font-mono tracking-tight"
                                    style={{ color: scoreColor }}
                                >
                                    {Math.round(safeScore)}
                                </span>
                                <Badge variant={matchVariant} className="px-3.5 py-0.5 font-bold text-xs">
                                    {matchLabel}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Skills Analysis */}
                <Card className="col-span-1 md:col-span-2 border-slate-200/80 bg-white shadow-sm">
                    <CardHeader className="pb-3 border-b border-slate-100">
                        <CardTitle className="flex items-center gap-2 text-base text-slate-900">
                            <Award className="w-5 h-5 text-indigo-600" />
                            {hasJobDescription ? 'Role Skills Matching' : 'Extracted Resume Skills'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {!hasJobDescription ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between gap-3 rounded-xl border border-indigo-100 bg-indigo-50/40 px-4 py-3">
                                    <div>
                                        <p className="text-xs font-bold text-indigo-900">Resume skills extracted from your file</p>
                                        <p className="text-[11px] text-slate-500 mt-0.5">Use the "Match With Target Job" banner above to evaluate role-specific fit.</p>
                                    </div>
                                    <Badge variant="primary" className="shrink-0 font-bold">{safeResumeSkills.length} Found</Badge>
                                </div>

                                <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto custom-scrollbar">
                                    {displaySkills.map((skill, i) => (
                                        <Badge key={i} variant="primary">
                                            {skill}
                                        </Badge>
                                    ))}
                                    {displaySkills.length === 0 && (
                                        <span className="text-slate-400 text-xs italic">No resume skills extracted yet.</span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-xs uppercase tracking-wider text-emerald-700 font-bold mb-3 flex items-center gap-1.5">
                                        <CheckCircle className="w-4 h-4 text-emerald-600" /> Matched Skills ({safeMatchedSkills.length})
                                    </h4>
                                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                                        {safeMatchedSkills.map((skill, i) => (
                                            <Badge key={i} variant="success">
                                                {skill}
                                            </Badge>
                                        ))}
                                        {safeMatchedSkills.length === 0 && <span className="text-slate-400 text-xs italic">No specific skills matched.</span>}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs uppercase tracking-wider text-rose-700 font-bold mb-3 flex items-center gap-1.5">
                                        <XCircle className="w-4 h-4 text-rose-600" /> Missing Role Skills ({safeMissingSkills.length})
                                    </h4>
                                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                                        {safeMissingSkills.map((skill, i) => (
                                            <Badge key={i} variant="danger">
                                                {skill}
                                            </Badge>
                                        ))}
                                        {safeMissingSkills.length === 0 && (
                                            <span className="text-emerald-600 text-xs font-semibold">All required role skills matched!</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Scoring Breakdown Accordion */}
            {breakdownEntries.length > 0 && (
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
                    <div
                        className="flex items-center justify-between cursor-pointer select-none"
                        onClick={() => setShowBreakdown(!showBreakdown)}
                    >
                        <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm">
                            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                                <BarChart3 className="w-4 h-4" />
                            </div>
                            <span>Scoring Breakdown</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-mono font-bold text-slate-700">
                                OVERALL ATS SCORE: {safeScore} / 100
                            </span>
                            <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1 hover:text-indigo-700">
                                {showBreakdown ? 'Hide details' : 'Show details'}
                                <ChevronDown className={`w-4 h-4 transition-transform ${showBreakdown ? 'rotate-180' : ''}`} />
                            </span>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showBreakdown && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden mt-5 space-y-4 pt-4 border-t border-slate-100"
                            >
                                {breakdownEntries.map(([key, item]) => {
                                    const score = Number(item?.score || 0);
                                    const max = Number(item?.max || 1);
                                    const percentage = Math.min(100, Math.max(0, (score / max) * 100));
                                    const isDeduction = key === 'strictness_deductions';
                                    const isSemantic = key === 'semantic_relevance';

                                    return (
                                        <div key={key} className="space-y-1.5">
                                            <div className="flex justify-between text-xs">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-700 font-semibold">{breakdownLabels[key] || key}</span>
                                                    {isSemantic && !hasJobDescription && (
                                                        <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 font-medium">
                                                            Optional JD required
                                                        </span>
                                                    )}
                                                    {isDeduction && score === 0 && (
                                                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">
                                                            0 Penalties (Clean)
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="font-mono text-slate-700 font-bold">
                                                    {score.toFixed(1)} / {max.toFixed(0)}
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${
                                                        isDeduction
                                                            ? score > 0 ? 'bg-rose-500' : 'bg-emerald-500'
                                                            : percentage >= 75
                                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                                                            : percentage >= 50
                                                            ? 'bg-gradient-to-r from-amber-500 to-emerald-500'
                                                            : 'bg-gradient-to-r from-rose-500 to-amber-500'
                                                    }`}
                                                    style={{ width: `${isDeduction && score === 0 ? 0 : percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-emerald-500 border-y-slate-200/80 border-r-slate-200/80 bg-white shadow-sm">
                    <CardHeader className="pb-3 border-b border-slate-100">
                        <CardTitle className="flex items-center gap-2 text-emerald-700 text-sm font-bold">
                            <Award className="w-4 h-4" /> Key Strengths
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4 min-h-[160px]">
                        {normalizedStrengths.length > 0 ? (
                            normalizedStrengths.map((strength, index) => (
                                <div key={index} className="flex items-start gap-2.5">
                                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                                    <p className="text-slate-700 font-normal text-xs leading-relaxed">{strength}</p>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-start gap-2.5">
                                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                                <p className="text-slate-500 font-normal text-xs">Resume content parsed and ready for job evaluation.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-rose-500 border-y-slate-200/80 border-r-slate-200/80 bg-white shadow-sm">
                    <CardHeader className="pb-3 border-b border-slate-100">
                        <CardTitle className="flex items-center gap-2 text-rose-700 text-sm font-bold">
                            <AlertTriangle className="w-4 h-4" /> Recommendations & Improvements
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4 min-h-[160px]">
                        {normalizedSuggestions.map((suggestion, index) => (
                            <div key={index} className="flex items-start gap-2.5">
                                <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                                <p className="text-slate-700 font-normal text-xs leading-relaxed">{suggestion}</p>
                            </div>
                        ))}
                        {normalizedSuggestions.length === 0 && (
                            <p className="text-slate-400 text-xs italic">No critical formatting or structural issues found.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Advanced Features */}
            <div className="pt-2">
                <div className="flex items-center gap-2.5 mb-5">
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Advanced AI Features</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FeatureButton
                        icon={Sparkles}
                        title="Resume Optimizer"
                        desc="Tailor your resume for specific companies and roles"
                        onClick={() => setShowOptimizer(true)}
                        color="#4F46E5"
                    />
                    <FeatureButton
                        icon={MessageSquare}
                        title="Interview Prep"
                        desc="Get AI-generated interview questions for this role"
                        onClick={() => setShowInterviewPrep(true)}
                        color="#059669"
                    />
                    <FeatureButton
                        icon={HelpCircle}
                        title="Why This Score?"
                        desc="Understand how your ATS score was calculated"
                        onClick={() => setShowExplainer(true)}
                        color="#D97706"
                    />
                    <FeatureButton
                        icon={History}
                        title="Version History"
                        desc="Track resume changes and score improvements"
                        onClick={() => setShowVersions(true)}
                        color="#7C3AED"
                    />
                    <FeatureButton
                        icon={ShieldCheck}
                        title="Quality Check"
                        desc="Verify authenticity and confidence levels"
                        onClick={() => setShowQualityCheck(true)}
                        color="#DB2777"
                    />
                </div>
            </div>

            {/* Advanced Feature Modals */}
            {showOptimizer && resumeId && (
                <ResumeOptimizer
                    resumeId={resumeId}
                    jobDescription={currentJd}
                    onClose={() => setShowOptimizer(false)}
                />
            )}

            {showInterviewPrep && resumeId && (
                <InterviewPrep
                    resumeId={resumeId}
                    jobDescription={currentJd}
                    onClose={() => setShowInterviewPrep(false)}
                />
            )}

            {showExplainer && resumeId && (
                <ExplainableAI
                    resumeId={resumeId}
                    currentScore={safeScore}
                    jobDescription={currentJd}
                    onClose={() => setShowExplainer(false)}
                />
            )}

            {showVersions && resumeId && (
                <VersionControl
                    resumeId={resumeId}
                    onClose={() => setShowVersions(false)}
                />
            )}

            {showQualityCheck && resumeId && (
                <QualityCheck
                    resumeId={resumeId}
                    onClose={() => setShowQualityCheck(false)}
                />
            )}
        </div>
    );
};

export default ResultsDashboard;
