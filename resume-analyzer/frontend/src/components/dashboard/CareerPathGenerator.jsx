import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, BookOpen, Award, Clock, ChevronRight } from 'lucide-react';

const CareerPathGenerator = () => {
    const [currentRole, setCurrentRole] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [showRoadmap, setShowRoadmap] = useState(false);

    const generateRoadmap = () => {
        setShowRoadmap(true);
    };

    // Mock roadmap data
    const roadmapSteps = [
        {
            phase: 'Phase 1: Foundation',
            duration: '2-3 months',
            skills: ['TypeScript', 'Advanced React Patterns', 'State Management (Redux/Zustand)'],
            resources: ['Official TypeScript Docs', 'React Advanced Patterns Course', 'Redux Toolkit Tutorial'],
            milestone: 'Build a complex dashboard application'
        },
        {
            phase: 'Phase 2: Backend & APIs',
            duration: '2-3 months',
            skills: ['Node.js/Express', 'RESTful APIs', 'Database Design (PostgreSQL)'],
            resources: ['Node.js Complete Guide', 'API Design Best Practices', 'PostgreSQL Mastery'],
            milestone: 'Create a full-stack CRUD application'
        },
        {
            phase: 'Phase 3: DevOps & Deployment',
            duration: '1-2 months',
            skills: ['Docker', 'CI/CD (GitHub Actions)', 'AWS/Cloud Deployment'],
            resources: ['Docker for Developers', 'GitHub Actions Tutorial', 'AWS Fundamentals'],
            milestone: 'Deploy application to production with CI/CD'
        },
        {
            phase: 'Phase 4: System Design & Scale',
            duration: '2-3 months',
            skills: ['System Design', 'Microservices', 'Performance Optimization'],
            resources: ['System Design Interview Prep', 'Microservices Patterns', 'Web Performance Guide'],
            milestone: 'Design and document a scalable system architecture'
        }
    ];

    const popularTransitions = [
        { from: 'Frontend Developer', to: 'Full Stack Developer', demand: 'High' },
        { from: 'Backend Developer', to: 'DevOps Engineer', demand: 'Very High' },
        { from: 'Full Stack Developer', to: 'Solutions Architect', demand: 'High' },
        { from: 'Software Engineer', to: 'ML Engineer', demand: 'Very High' },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-6">
                    <Target className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold text-white">AI Career Path Generator</h3>
                </div>

                <p className="text-sm text-slate-400 mb-6">
                    Get a personalized learning roadmap based on your current skills and career goals.
                </p>

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
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent"
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
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                </div>

                <button
                    onClick={generateRoadmap}
                    disabled={!currentRole || !targetRole}
                    className="w-full px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                >
                    <TrendingUp className="w-5 h-5" />
                    Generate Career Roadmap
                </button>
            </div>

            {/* Popular Career Transitions */}
            <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
                <h4 className="text-md font-bold text-white mb-4">Popular Career Transitions</h4>
                <div className="space-y-3">
                    {popularTransitions.map((transition, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer group"
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
                                    ? 'bg-green-500/10 text-green-400'
                                    : 'bg-blue-500/10 text-blue-400'
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
                    className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-bold text-white">
                            Your Personalized Roadmap: {currentRole} → {targetRole}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Clock className="w-4 h-4" />
                            <span>Total: 7-11 months</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {roadmapSteps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative pl-8 pb-6 border-l-2 border-primary/30 last:border-l-0 last:pb-0"
                            >
                                {/* Timeline dot */}
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-slate-800" />

                                <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50">
                                    <div className="flex items-center justify-between mb-3">
                                        <h5 className="text-lg font-bold text-white">{step.phase}</h5>
                                        <span className="text-sm text-primary font-medium flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {step.duration}
                                        </span>
                                    </div>

                                    {/* Skills to Learn */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <BookOpen className="w-4 h-4 text-blue-400" />
                                            <span className="text-sm font-semibold text-blue-400">Skills to Learn</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {step.skills.map((skill, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm border border-blue-500/20"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Resources */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <BookOpen className="w-4 h-4 text-purple-400" />
                                            <span className="text-sm font-semibold text-purple-400">Recommended Resources</span>
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
                                    <div className="flex items-start gap-2 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                                        <Award className="w-4 h-4 text-green-400 mt-0.5" />
                                        <div>
                                            <span className="text-xs font-semibold text-green-400 uppercase">Milestone</span>
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
