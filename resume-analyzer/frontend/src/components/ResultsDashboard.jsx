import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CheckCircle, XCircle, AlertTriangle, Award, Sparkles, MessageSquare, HelpCircle, History, ShieldCheck } from 'lucide-react';
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

    const { ats_score, matched_skills, missing_skills, experience_match, ai_suggestions } = data;

    const scoreData = [
        { name: 'Score', value: ats_score },
        { name: 'Remaining', value: 100 - ats_score }
    ];

    const getColor = (score) => {
        if (score >= 75) return '#22c55e'; // Green
        if (score >= 50) return '#eab308'; // Yellow
        return '#ef4444'; // Red
    };

    const scoreColor = getColor(ats_score);

    const FeatureButton = ({ icon: Icon, title, desc, onClick, color }) => (
        <Card
            hover={true}
            className="group cursor-pointer border-l-4"
            style={{ borderLeftColor: color }}
            onClick={onClick}
        >
            <div className="p-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                        <Icon className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {title}
                    </h4>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{desc}</p>
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
                <Card className="col-span-1 flex flex-col items-center justify-center relative overflow-hidden bg-slate-900 text-white border-0">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                    <CardHeader className="text-center pb-2 z-10">
                        <CardTitle className="text-slate-200">ATS Match Score</CardTitle>
                    </CardHeader>
                    <CardContent className="w-full flex justify-center pb-8 z-10 relative">
                        <div className="relative w-48 h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={scoreData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        startAngle={90}
                                        endAngle={-270}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        <Cell key="score" fill={scoreColor} />
                                        <Cell key="remaining" fill="#334155" />
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold">{ats_score}%</span>
                                <Badge variant={experience_match === 'Strong' ? 'success' : 'warning'} className="mt-1">
                                    {experience_match} Match
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-slate-800/20 z-0" />
                </Card>

                {/* Skills Analysis */}
                <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-indigo-500" />
                            Skills Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-sm uppercase tracking-wider text-green-600 dark:text-green-400 font-semibold mb-3 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" /> Matched Skills
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {matched_skills.map((skill, i) => (
                                        <Badge key={i} variant="success">
                                            {skill}
                                        </Badge>
                                    ))}
                                    {matched_skills.length === 0 && <span className="text-slate-500 text-sm italic">No specific skills matched.</span>}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm uppercase tracking-wider text-red-600 dark:text-red-400 font-semibold mb-3 flex items-center gap-2">
                                    <XCircle className="w-4 h-4" /> Missing Skills
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {missing_skills.map((skill, i) => (
                                        <Badge key={i} variant="danger">
                                            {skill}
                                        </Badge>
                                    ))}
                                    {missing_skills.length === 0 && matched_skills.length > 0 && (
                                        <span className="text-slate-500 text-sm italic">Great job! No key skills missing.</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* AI Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-green-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                            <CheckCircle className="w-5 h-5" /> Strengths
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                            <p className="text-slate-600 dark:text-slate-300">
                                {matched_skills.length > 0
                                    ? `Identified ${matched_skills.length} key technical skills relevant to the role.`
                                    : "Resume format is parsable and clear."}
                            </p>
                        </div>
                        {ats_score > 70 && (
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                                <p className="text-slate-600 dark:text-slate-300">Strong ATS compatibility score ({ats_score}%).</p>
                            </div>
                        )}
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                            <p className="text-slate-600 dark:text-slate-300">Used active language in key sections.</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                            <AlertTriangle className="w-5 h-5" /> Improvements Needed
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {ai_suggestions.map((suggestion, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{suggestion}</p>
                            </div>
                        ))}
                        {ai_suggestions.length === 0 && (
                            <p className="text-slate-500 italic">No critical issues found.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Advanced Features */}
            <div className="pt-6">
                <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-6 h-6 text-indigo-500" />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Advanced AI Features</h3>
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
