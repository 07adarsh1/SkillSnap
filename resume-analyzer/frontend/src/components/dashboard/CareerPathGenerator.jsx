import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, BookOpen, Award, Clock, ChevronRight, Sparkles } from 'lucide-react';
import { generateCareerPath } from '../../services/api';

const CareerPathGenerator = () => {
    const [currentRole, setCurrentRole] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [showRoadmap, setShowRoadmap] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [roadmapData, setRoadmapData] = useState(null);

    const generateRoadmap = async () => {
        setLoading(true);
        setError(null);
        setShowRoadmap(false);

        try {
            const data = await generateCareerPath(currentRole, targetRole, []);
            setRoadmapData(data);
            setShowRoadmap(true);
        } catch (err) {
            console.error("Failed to generate career path:", err);
            setError("Failed to generate roadmap. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const roadmapSteps = roadmapData?.roadmap || [];
    const totalDuration = roadmapData?.total_duration || '';

    const popularTransitions = [
        { from: 'Frontend Developer', to: 'Full Stack Developer', demand: 'High' },
        { from: 'Backend Developer', to: 'DevOps Platform Engineer', demand: 'Very High' },
        { from: 'Full Stack Developer', to: 'Solutions Architect', demand: 'High' },
        { from: 'Software Engineer', to: 'AI / ML Engineer', demand: 'Very High' },
    ];

    return (
        <div className="space-y-6 text-slate-900">
            {/* Input Form Card */}
            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
                <div className="flex items-center gap-2.5 mb-2">
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                        <Target className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">AI Career Path Generator</h3>
                </div>

                <p className="text-xs text-slate-500 mb-5">
                    Generate an actionable step-by-step upskilling roadmap based on your current background and target aspirational role.
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
                        {error}
                    </div>
                )}

                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Current Role
                        </label>
                        <input
                            type="text"
                            value={currentRole}
                            onChange={(e) => setCurrentRole(e.target.value)}
                            placeholder="e.g., Frontend Developer"
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Target Role
                        </label>
                        <input
                            type="text"
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                            placeholder="e.g., Full Stack Engineer"
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <button
                    onClick={generateRoadmap}
                    disabled={!currentRole || !targetRole || loading}
                    className="w-full py-3 px-5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Synthesizing Learning Milestones...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" />
                            <span>Generate Career Roadmap</span>
                        </>
                    )}
                </button>
            </div>

            {/* Popular Career Transitions */}
            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Popular Career Transitions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {popularTransitions.map((transition, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-indigo-50/50 rounded-2xl transition-all cursor-pointer group border border-slate-100 hover:border-indigo-100"
                            onClick={() => {
                                setCurrentRole(transition.from);
                                setTargetRole(transition.to);
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-600 group-hover:text-slate-900 font-medium">{transition.from}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                <span className="text-xs text-indigo-700 font-bold">{transition.to}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${transition.demand === 'Very High'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                }`}>
                                {transition.demand} Demand
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Roadmap Display */}
            {showRoadmap && (
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-6"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                        <h4 className="text-base font-bold text-slate-900">
                            Roadmap: {currentRole} → {targetRole}
                        </h4>
                        {totalDuration && (
                            <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Estimated Timeline: {totalDuration}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        {roadmapSteps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.08 }}
                                className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                                            {index + 1}
                                        </span>
                                        <h5 className="text-xs font-bold text-slate-900">{step.phase || step.title || `Phase ${index + 1}`}</h5>
                                    </div>
                                    {step.duration && (
                                        <span className="text-[11px] text-slate-500 font-medium">{step.duration}</span>
                                    )}
                                </div>
                                <div className="pl-8 space-y-2">
                                    {(step.milestone || step.description || step.focus) && (
                                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                            {step.milestone ? `🎯 Milestone: ${step.milestone}` : (step.description || step.focus)}
                                        </p>
                                    )}

                                    {step.skills?.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {step.skills.map((skill, i) => (
                                                <span key={i} className="text-[10px] font-semibold bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {step.resources?.length > 0 && (
                                        <div className="pt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                                            <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                            <span className="font-semibold text-slate-600">Resources:</span>
                                            {step.resources.map((res, ri) => (
                                                <span key={ri} className="bg-indigo-50/60 text-indigo-800 text-[10px] px-2 py-0.5 rounded-md border border-indigo-100 font-medium">
                                                    {res}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default CareerPathGenerator;
