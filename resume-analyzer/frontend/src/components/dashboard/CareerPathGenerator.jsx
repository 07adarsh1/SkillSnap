import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, BookOpen, Award, Clock, ChevronRight } from 'lucide-react';

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
            const { generateCareerPath } = await import('../../services/api');
            const data = await generateCareerPath(currentRole, targetRole, []); // Pass empty array for currentSkills for now
            setRoadmapData(data);
            setShowRoadmap(true);
        } catch (err) {
            console.error("Failed to generate career path:", err);
            setError("Failed to generate roadmap. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Use API data or fallback to empty array if not yet loaded
    const roadmapSteps = roadmapData?.roadmap || [];
    const totalDuration = roadmapData?.total_duration || '';

    const popularTransitions = [
        { from: 'Frontend Developer', to: 'Full Stack Developer', demand: 'High' },
        { from: 'Backend Developer', to: 'DevOps Engineer', demand: 'Very High' },
        { from: 'Full Stack Developer', to: 'Solutions Architect', demand: 'High' },
        { from: 'Software Engineer', to: 'ML Engineer', demand: 'Very High' },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-black/45 border border-white/10 p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-6">
                    <Target className="w-5 h-5 text-white" />
                    <h3 className="text-lg font-bold text-white">AI Career Path Generator</h3>
                </div>

                <p className="text-sm text-slate-400 mb-6">
                    Get a personalized learning roadmap based on your current skills and career goals.
                </p>

                {error && (
                    <div className="mb-6 p-4 bg-white/5 border border-white/10 text-slate-200 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Input Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Current Role
                        </label>
                        <input
                            type="text"
                            value={currentRole}
                            onChange={(e) => setCurrentRole(e.target.value)}
                            placeholder="e.g., Frontend Developer"
                            className="w-full px-4 py-2 bg-black/60 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-white/20 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Target Role
                        </label>
                        <input
                            type="text"
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                            placeholder="e.g., Full Stack Developer"
                            className="w-full px-4 py-2 bg-black/60 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-white/20 focus:border-transparent"
                        />
                    </div>
                </div>

                <button
                    onClick={generateRoadmap}
                    disabled={!currentRole || !targetRole || loading}
                    className="w-full px-6 py-3 bg-white/10 hover:bg-white/15 disabled:bg-black/60 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 border border-white/10"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Generating Roadmap...
                        </>
                    ) : (
                        <>
                            <TrendingUp className="w-5 h-5" />
                            Generate Career Roadmap
                        </>
                    )}
                </button>
            </div>

            {/* Popular Career Transitions */}
            <div className="bg-black/45 border border-white/10 p-6 rounded-2xl">
                <h4 className="text-md font-bold text-white mb-4">Popular Career Transitions</h4>
                <div className="space-y-3">
                    {popularTransitions.map((transition, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-black/50 rounded-lg hover:bg-black/65 transition-colors cursor-pointer group border border-white/5"
                            onClick={() => {
                                setCurrentRole(transition.from);
                                setTargetRole(transition.to);
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-slate-300">{transition.from}</span>
                                <ChevronRight className="w-4 h-4 text-slate-500" />
                                <span className="text-white font-medium">{transition.to}</span>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${transition.demand === 'Very High'
                                ? 'bg-white/10 text-white'
                                : 'bg-white/5 text-slate-200'
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/45 border border-white/10 p-6 rounded-2xl"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-bold text-white">
                            Your Personalized Roadmap: {currentRole} → {targetRole}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Clock className="w-4 h-4" />
                            <span>Total: {totalDuration}</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {roadmapSteps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative pl-8 pb-6 border-l-2 border-white/10 last:border-l-0 last:pb-0"
                            >
                                {/* Timeline dot */}
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-black" />

                                <div className="bg-black/55 rounded-xl p-5 border border-white/10">
                                    <div className="flex items-center justify-between mb-3">
                                        <h5 className="text-lg font-bold text-white">{step.phase}</h5>
                                        <span className="text-sm text-white font-medium flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {step.duration}
                                        </span>
                                    </div>

                                    {/* Skills to Learn */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <BookOpen className="w-4 h-4 text-white" />
                                            <span className="text-sm font-semibold text-white">Skills to Learn</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {step.skills.map((skill, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1 bg-white/5 text-slate-200 rounded-full text-sm border border-white/10"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Resources */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <BookOpen className="w-4 h-4 text-white" />
                                            <span className="text-sm font-semibold text-white">Recommended Resources</span>
                                        </div>
                                        <ul className="space-y-1">
                                            {step.resources.map((resource, i) => (
                                                <li key={i} className="text-sm text-slate-300 flex items-center gap-2">
                                                    <ChevronRight className="w-3 h-3 text-slate-500" />
                                                    {resource}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Milestone */}
                                    <div className="flex items-start gap-2 p-3 bg-white/5 border border-white/10 rounded-lg">
                                        <Award className="w-4 h-4 text-white mt-0.5" />
                                        <div>
                                            <span className="text-xs font-semibold text-white uppercase">Milestone</span>
                                            <p className="text-sm text-slate-300 mt-1">{step.milestone}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Action Button */}
                    <div className="mt-6 pt-6 border-t border-slate-700/50">
                        <button className="w-full px-6 py-3 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            Start Learning Journey
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default CareerPathGenerator;
