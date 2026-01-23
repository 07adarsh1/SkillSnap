import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CheckCircle, XCircle, AlertTriangle, Lightbulb, Award, Sparkles, MessageSquare, HelpCircle, History, ShieldCheck } from 'lucide-react';
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

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                {/* Score Card */}
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="card col-span-1 md:col-span-1 flex flex-col items-center justify-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                    <h3 className="text-xl font-semibold text-slate-300 mb-4">ATS Match Score</h3>
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
                            <span className="text-4xl font-bold text-white">{ats_score}%</span>
                            <span className="text-sm text-slate-400">{experience_match} Match</span>
                        </div>
                    </div>
                </motion.div>

                {/* Skills Analysis */}
                <div className="card col-span-1 md:col-span-2">
                    <h3 className="text-xl font-semibold text-slate-300 mb-6 flex items-center gap-2">
                        <Award className="text-primary" /> Skills Analysis
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-sm uppercase tracking-wider text-green-400 font-semibold mb-3 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" /> Matched Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {matched_skills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm border border-green-500/20">
                                        {skill}
                                    </span>
                                ))}
                                {matched_skills.length === 0 && <span className="text-slate-500 text-sm italic">No specific skills matched.</span>}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm uppercase tracking-wider text-red-400 font-semibold mb-3 flex items-center gap-2">
                                <XCircle className="w-4 h-4" /> Missing Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {missing_skills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-sm border border-red-500/20">
                                        {skill}
                                    </span>
                                ))}
                                {missing_skills.length === 0 && matched_skills.length > 0 && (
                                    <span className="text-slate-500 text-sm italic">Great job! No key skills missing.</span>
                                )}
                                {missing_skills.length === 0 && matched_skills.length === 0 && (
                                    <span className="text-yellow-500 text-sm italic">Could not analyze job skills. Try a more detailed job description.</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Insights: Pros & Cons */}
                <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Pros / Strengths */}
                    <div className="card bg-green-900/10 border-green-500/20 text-green-100">
                        <h3 className="text-xl font-semibold text-green-400 mb-6 flex items-center gap-2">
                            <CheckCircle className="text-green-400" /> Strengths
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/10">
                                <CheckCircle className="w-5 h-5 text-green-400 mt-1 shrink-0" />
                                <p className="text-slate-300">
                                    {matched_skills.length > 0
                                        ? `Identified ${matched_skills.length} key technical skills relevant to the role.`
                                        : "Resume format is parsable and clear."}
                                </p>
                            </div>
                            {ats_score > 70 && (
                                <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/10">
                                    <CheckCircle className="w-5 h-5 text-green-400 mt-1 shrink-0" />
                                    <p className="text-slate-300">Strong ATS compatibility score ({ats_score}%).</p>
                                </div>
                            )}
                            {experience_match === "Strong" && (
                                <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/10">
                                    <CheckCircle className="w-5 h-5 text-green-400 mt-1 shrink-0" />
                                    <p className="text-slate-300">Experience level aligns well with job requirements.</p>
                                </div>
                            )}
                            <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/10">
                                <CheckCircle className="w-5 h-5 text-green-400 mt-1 shrink-0" />
                                <p className="text-slate-300">Used active language in key sections.</p>
                            </div>
                        </div>
                    </div>

                    {/* Cons / Improvements */}
                    <div className="card bg-red-900/10 border-red-500/20">
                        <h3 className="text-xl font-semibold text-red-400 mb-6 flex items-center gap-2">
                            <AlertTriangle className="text-red-400" /> Improvements Needed
                        </h3>
                        <div className="space-y-4">
                            {ai_suggestions.map((suggestion, index) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    key={index}
                                    className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/10 hover:bg-red-500/20 transition-colors"
                                >
                                    <div className="mt-1 min-w-[20px]">
                                        <AlertTriangle className="w-5 h-5 text-red-400" />
                                    </div>
                                    <p className="text-slate-300 leading-relaxed">{suggestion}</p>
                                </motion.div>
                            ))}
                            {ai_suggestions.length === 0 && (
                                <p className="text-slate-500 italic">No critical issues found.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Advanced Features Section */}
                <div className="col-span-1 md:col-span-3">
                    <div className="card bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30">
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles className="w-6 h-6 text-purple-400" />
                            <h3 className="text-2xl font-semibold text-white">Advanced AI Features</h3>
                        </div>

                        <p className="text-slate-300 mb-6">
                            Unlock powerful AI-driven insights to optimize your resume, prepare for interviews, and understand your scores better.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Resume Optimizer */}
                            <button
                                onClick={() => setShowOptimizer(true)}
                                className="group p-4 bg-slate-800/50 hover:bg-gradient-to-br hover:from-blue-600/20 hover:to-purple-600/20 border border-slate-700 hover:border-blue-500/50 rounded-xl transition-all text-left"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 flex items-center justify-center transition-colors">
                                        <Sparkles className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <h4 className="font-semibold text-white">Resume Optimizer</h4>
                                </div>
                                <p className="text-sm text-slate-400">Tailor your resume for specific companies and roles</p>
                            </button>

                            {/* Interview Prep */}
                            <button
                                onClick={() => setShowInterviewPrep(true)}
                                className="group p-4 bg-slate-800/50 hover:bg-gradient-to-br hover:from-green-600/20 hover:to-emerald-600/20 border border-slate-700 hover:border-green-500/50 rounded-xl transition-all text-left"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 flex items-center justify-center transition-colors">
                                        <MessageSquare className="w-5 h-5 text-green-400" />
                                    </div>
                                    <h4 className="font-semibold text-white">Interview Prep</h4>
                                </div>
                                <p className="text-sm text-slate-400">Get AI-generated interview questions for this role</p>
                            </button>

                            {/* Explainable AI */}
                            <button
                                onClick={() => setShowExplainer(true)}
                                className="group p-4 bg-slate-800/50 hover:bg-gradient-to-br hover:from-yellow-600/20 hover:to-orange-600/20 border border-slate-700 hover:border-yellow-500/50 rounded-xl transition-all text-left"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-lg bg-yellow-500/10 group-hover:bg-yellow-500/20 flex items-center justify-center transition-colors">
                                        <HelpCircle className="w-5 h-5 text-yellow-400" />
                                    </div>
                                    <h4 className="font-semibold text-white">Why This Score?</h4>
                                </div>
                                <p className="text-sm text-slate-400">Understand how your ATS score was calculated</p>
                            </button>

                            {/* Version Control */}
                            <button
                                onClick={() => setShowVersions(true)}
                                className="group p-4 bg-slate-800/50 hover:bg-gradient-to-br hover:from-indigo-600/20 hover:to-violet-600/20 border border-slate-700 hover:border-indigo-500/50 rounded-xl transition-all text-left"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 group-hover:bg-indigo-500/20 flex items-center justify-center transition-colors">
                                        <History className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <h4 className="font-semibold text-white">Version History</h4>
                                </div>
                                <p className="text-sm text-slate-400">Track resume changes and score improvements</p>
                            </button>

                            {/* Quality Check */}
                            <button
                                onClick={() => setShowQualityCheck(true)}
                                className="group p-4 bg-slate-800/50 hover:bg-gradient-to-br hover:from-pink-600/20 hover:to-rose-600/20 border border-slate-700 hover:border-pink-500/50 rounded-xl transition-all text-left"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-lg bg-pink-500/10 group-hover:bg-pink-500/20 flex items-center justify-center transition-colors">
                                        <ShieldCheck className="w-5 h-5 text-pink-400" />
                                    </div>
                                    <h4 className="font-semibold text-white">Quality Check</h4>
                                </div>
                                <p className="text-sm text-slate-400">Verify authenticity and confidence levels</p>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

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
        </>
    );
};

export default ResultsDashboard;
