import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CheckCircle, XCircle, AlertTriangle, Award, Sparkles, MessageSquare, HelpCircle, History, ShieldCheck, BarChart3 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';

import ResumeOptimizer from './dashboard/ResumeOptimizer';
import InterviewPrep from './dashboard/InterviewPrep';
import ExplainableAI from './dashboard/ExplainableAI';
import VersionControl from './dashboard/VersionControl';
import QualityCheck from './dashboard/QualityCheck';

const ResultsDashboard = ({ data, resumeId, jobDescription }) => {
    const [showOptimizer, setShowOptimizer] = useState(false);
    const [showInterviewPrep, setShowInterviewPrep] = useState(false);
    const [showExplainer, setShowExplainer] = useState(false);
    const [showVersions, setShowVersions] = useState(false);
    const [showQualityCheck, setShowQualityCheck] = useState(false);

    if (!data) return null;

    const { ats_score, matched_skills, missing_skills, experience_match, strengths, ai_suggestions, score_breakdown } = data;

    const scoreData = [
        { name: 'Score', value: ats_score },
        { name: 'Remaining', value: 100 - ats_score }
    ];

    const getColor = (score) => {
        if (score >= 75) return '#22c55e'; // Green
        if (score >= 50) return '#eab308'; // Yellow
        return '#ef4444'; // Red
    };

    const getMatchLabel = (score) => {
        if (score >= 80) return 'Strong Match';
        if (score >= 60) return 'Moderate Match';
        return 'Weak Match';
    };

    const scoreColor = getColor(ats_score);
    const matchLabel = getMatchLabel(ats_score);
    const matchVariant = ats_score >= 80 ? 'success' : ats_score >= 60 ? 'warning' : 'danger';

    const breakdownLabels = {
        skills_alignment: 'Skills Alignment',
        semantic_relevance: 'Semantic Relevance',
        section_coverage: 'Section Coverage',
        impact_evidence: 'Impact Evidence',
        formatting_quality: 'Formatting Quality',
        strictness_deductions: 'Strictness Deductions',
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
        <Card
            hover={true}
            className="group cursor-pointer border-l-4 transition-all hover:bg-white/5 border-white/10"
            style={{ borderLeftColor: color }}
            onClick={onClick}
        >
            <div className="p-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all shadow-[0_0_10px_rgba(0,0,0,0.3)] group-hover:shadow-[0_0_15px_rgba(0,210,255,0.3)]">
                        <Icon className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                    </div>
                    <h4 className="font-semibold text-white group-hover:text-primary transition-colors tracking-wide">
                        {title}
                    </h4>
                </div>
                <p className="text-sm text-slate-400 font-light">{desc}</p>
            </div>
        </Card>
    );

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                {/* Score Card */}
                <Card className="col-span-1 flex flex-col items-center justify-center relative overflow-hidden text-white border-white/10">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-secondary shadow-[0_0_20px_rgba(0,210,255,0.5)]" />
                    <CardHeader className="text-center pb-2 z-10">
                        <CardTitle className="text-slate-200 tracking-wide">ATS Match Score</CardTitle>
                    </CardHeader>
                    <CardContent className="w-full flex justify-center pb-8 z-10 relative">
                        <div className="relative w-52 h-52 drop-shadow-[0_0_20px_rgba(0,210,255,0.3)]">
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
                                        <Cell key="score" fill={scoreColor} style={{ filter: `drop-shadow(0px 0px 5px ${scoreColor})` }} />
                                        <Cell key="remaining" fill="rgba(255,255,255,0.05)" />
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                <span
                                    className="text-[2.6rem] leading-none font-bold font-mono tracking-tight"
                                    style={{ color: scoreColor, textShadow: `0 0 22px ${scoreColor}` }}
                                >
                                    {Math.round(ats_score)}/100
                                </span>
                                <Badge variant={matchVariant} className="backdrop-blur-md px-3.5 py-1 font-semibold border border-white/15">
                                    {matchLabel}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Skills Analysis */}
                <Card className="col-span-1 md:col-span-2 border-white/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-indigo-500" />
                            Skills Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-sm uppercase tracking-wider text-green-400 font-semibold mb-3 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">
                                    <CheckCircle className="w-4 h-4" /> Matched Skills
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {matched_skills.map((skill, i) => (
                                        <Badge key={i} variant="success" className="shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                                            {skill}
                                        </Badge>
                                    ))}
                                    {matched_skills.length === 0 && <span className="text-slate-500 text-sm italic font-light">No specific skills matched.</span>}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm uppercase tracking-wider text-red-500 font-semibold mb-3 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                                    <XCircle className="w-4 h-4" /> Missing Skills
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {missing_skills.map((skill, i) => (
                                        <Badge key={i} variant="danger" className="shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                                            {skill}
                                        </Badge>
                                    ))}
                                    {missing_skills.length === 0 && matched_skills.length > 0 && (
                                        <span className="text-slate-500 text-sm italic font-light">Great job! No key skills missing.</span>
                                    )}
                                    {missing_skills.length === 0 && matched_skills.length === 0 && (
                                        <span className="text-slate-500 text-sm italic font-light">
                                            Add a detailed job description to enable skill-gap detection.
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {breakdownEntries.length > 0 && (
                <Card className="relative overflow-hidden border-white/10 bg-gradient-to-br from-[#121318]/75 to-[#0b1220]/70">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500/50 via-primary/80 to-indigo-500/50 shadow-[0_0_20px_rgba(0,210,255,0.45)]" />
                    <CardHeader>
                        <CardTitle className="text-slate-100 flex items-center gap-2 tracking-wide">
                            <BarChart3 className="w-5 h-5 text-primary drop-shadow-[0_0_6px_rgba(0,210,255,0.7)]" />
                            Scoring Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {breakdownEntries.map(([key, value]) => {
                            const score = Number(value?.score || 0);
                            const max = Number(value?.max || 1);
                            const percentage = Math.max(0, Math.min(100, (score / max) * 100));
                            const isDeduction = key === 'strictness_deductions';

                            return (
                                <div key={key} className="space-y-1.5 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-200 font-medium tracking-wide">{breakdownLabels[key] || key}</span>
                                        <span className="text-slate-100 font-semibold px-2 py-0.5 rounded-md bg-white/10 border border-white/15">{score.toFixed(1)} / {max.toFixed(0)}</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/10">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ${isDeduction ? 'bg-gradient-to-r from-red-500/70 via-red-400/80 to-orange-400/70' : 'bg-gradient-to-r from-cyan-400/80 via-primary/80 to-indigo-400/80'}`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        {score_breakdown?.total && (
                            <div className="mt-2 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 px-4 py-3">
                                <span className="text-sm uppercase tracking-widest text-primary font-semibold">Overall ATS Score</span>
                                <span className="text-xl font-bold text-white drop-shadow-[0_0_10px_rgba(0,210,255,0.5)]">
                                    {Number(score_breakdown.total.score).toFixed(1)} / {Number(score_breakdown.total.max).toFixed(0)}
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* AI Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-green-500 border-y-white/10 border-r-white/10 bg-gradient-to-br from-[#121318]/60 to-green-900/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">
                            <CheckCircle className="w-5 h-5" /> Strengths
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 min-h-[250px]">
                        {normalizedStrengths.length > 0 ? (
                            normalizedStrengths.map((point, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                                    <p className="text-slate-300 font-light leading-relaxed">{point}</p>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                                <p className="text-slate-300 font-light">No strengths generated yet. Re-run analysis with a job description.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500 border-y-white/10 border-r-white/10 bg-gradient-to-br from-[#121318]/60 to-red-900/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                            <AlertTriangle className="w-5 h-5" /> Improvements Needed
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 min-h-[250px]">
                        {normalizedSuggestions.map((suggestion, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                                <p className="text-slate-300 font-light leading-relaxed">{suggestion}</p>
                            </div>
                        ))}
                        {normalizedSuggestions.length === 0 && (
                            <p className="text-slate-500 font-light italic">No critical issues found.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Advanced Features */}
            <div className="pt-6">
                <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(0,210,255,0.8)]" />
                    <h3 className="text-2xl font-bold text-white tracking-wide">Advanced AI Features</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FeatureButton
                        icon={Sparkles}
                        title="Resume Optimizer"
                        desc="Tailor your resume for specific companies and roles"
                        onClick={() => setShowOptimizer(true)}
                        color="#3b82f6"
                    />
                    <FeatureButton
                        icon={MessageSquare}
                        title="Interview Prep"
                        desc="Get AI-generated interview questions for this role"
                        onClick={() => setShowInterviewPrep(true)}
                        color="#22c55e"
                    />
                    <FeatureButton
                        icon={HelpCircle}
                        title="Why This Score?"
                        desc="Understand how your ATS score was calculated"
                        onClick={() => setShowExplainer(true)}
                        color="#eab308"
                    />
                    <FeatureButton
                        icon={History}
                        title="Version History"
                        desc="Track resume changes and score improvements"
                        onClick={() => setShowVersions(true)}
                        color="#6366f1"
                    />
                    <FeatureButton
                        icon={ShieldCheck}
                        title="Quality Check"
                        desc="Verify authenticity and confidence levels"
                        onClick={() => setShowQualityCheck(true)}
                        color="#ec4899"
                    />
                </div>
            </div>

            {/* Advanced Feature Modals */}
            {showOptimizer && resumeId && (
                <ResumeOptimizer
                    resumeId={resumeId}
                    jobDescription={jobDescription}
                    onClose={() => setShowOptimizer(false)}
                />
            )}

            {showInterviewPrep && resumeId && (
                <InterviewPrep
                    resumeId={resumeId}
                    jobDescription={jobDescription}
                    onClose={() => setShowInterviewPrep(false)}
                />
            )}

            {showExplainer && resumeId && (
                <ExplainableAI
                    resumeId={resumeId}
                    currentScore={ats_score}
                    jobDescription={jobDescription}
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
