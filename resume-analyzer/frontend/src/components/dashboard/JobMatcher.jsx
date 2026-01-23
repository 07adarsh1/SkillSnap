import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Building, CheckCircle, XCircle, ArrowRight, Filter, ExternalLink, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const JobMatcher = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [filters, setFilters] = useState({
        role: 'All',
        type: 'All',
        location: 'All'
    });

    // Mock Data Generator
    useEffect(() => {
        const mockJobs = [
            {
                id: 1,
                title: "Senior Full Stack Engineer",
                company: "TechFlow Solutions",
                location: "San Francisco, CA (Remote)",
                type: "Full-time",
                salary: "$140k - $180k",
                match_score: 94,
                skills_matched: ["React", "Python", "AWS", "Docker", "FastAPI"],
                skills_missing: ["GraphQL"],
                description: "We are looking for a senior engineer to lead our core platform team...",
                logo_color: "blue"
            },
            {
                id: 2,
                title: "Backend Developer",
                company: "DataStream Inc.",
                location: "New York, NY (Hybrid)",
                type: "Full-time",
                salary: "$130k - $160k",
                match_score: 82,
                skills_matched: ["Python", "Docker", "PostgreSQL"],
                skills_missing: ["Kubernetes", "Redis"],
                description: "Join our data team to build high-scale pipelines...",
                logo_color: "green"
            },
            {
                id: 3,
                title: "Frontend Architect",
                company: "Creative Pulse",
                location: "Austin, TX",
                type: "Contract",
                salary: "$120k - $150k",
                match_score: 68,
                skills_matched: ["React", "Tailwind CSS"],
                skills_missing: ["Next.js", "TypeScript", "Figma"],
                description: "Seeking a frontend expert to redesign our client portal...",
                logo_color: "purple"
            },
            {
                id: 4,
                title: "AI Engineer",
                company: "NeuralNet Corp",
                location: "Remote",
                type: "Full-time",
                salary: "$160k - $200k",
                match_score: 88,
                skills_matched: ["Python", "Machine Learning", "PyTorch"],
                skills_missing: ["TensorFlow", "NLP"],
                description: "Build the next generation of LLM applications...",
                logo_color: "orange"
            }
        ];

        setTimeout(() => {
            setJobs(mockJobs);
            setLoading(false);
        }, 1500);
    }, []);

    const getColor = (score) => {
        if (score >= 90) return 'text-green-400 border-green-500/50 bg-green-500/10';
        if (score >= 70) return 'text-blue-400 border-blue-500/50 bg-blue-500/10';
        return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10';
    };

    const handleApply = (e) => {
        e.stopPropagation();
        alert("Redirecting to job application...");
    };

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6">
            {/* Left Side: Job List & Filters */}
            <div className={`flex-1 flex flex-col transition-all ${selectedJob ? 'hidden lg:flex lg:w-1/2' : 'w-full'}`}>

                {/* Header & Filters */}
                <div className="mb-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">Recommended Jobs</h2>
                        <button className="text-slate-400 hover:text-primary transition-colors">
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {['All', 'Remote', 'Full-time', 'High Match (>90%)'].map((filter) => (
                            <button
                                key={filter}
                                className="px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-sm text-slate-300 hover:bg-slate-700 whitespace-nowrap transition-colors"
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Job List */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-48 bg-slate-800/50 rounded-2xl animate-pulse" />
                        ))
                    ) : (
                        jobs.map((job) => (
                            <motion.div
                                key={job.id}
                                layoutId={`job-card-${job.id}`}
                                onClick={() => setSelectedJob(job)}
                                className={`p-5 rounded-2xl border cursor-pointer transition-all hover:bg-slate-800 ${selectedJob?.id === job.id
                                        ? 'bg-slate-800 border-primary/50 ring-1 ring-primary/50'
                                        : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl bg-${job.logo_color}-500/20 flex items-center justify-center font-bold text-${job.logo_color}-400 text-xl`}>
                                            {job.company[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-lg">{job.title}</h3>
                                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                                <Building className="w-3 h-3" /> {job.company}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-sm font-bold border ${getColor(job.match_score)}`}>
                                        {job.match_score}% Match
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-4">
                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {job.type}</span>
                                    <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {job.salary}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {job.skills_matched.slice(0, 3).map((skill, i) => (
                                            <div key={i} className="w-6 h-6 rounded-full bg-slate-700 border border-slate-800 flex items-center justify-center text-[10px] text-white" title={skill}>
                                                {skill[0]}
                                            </div>
                                        ))}
                                        {job.skills_matched.length > 3 && (
                                            <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] text-slate-400">
                                                +{job.skills_matched.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-xs text-slate-500">skills match</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedJob(job);
                                        }}
                                        className="ml-auto text-primary hover:text-white text-sm font-medium flex items-center gap-1 transition-colors"
                                    >
                                        View Details <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Side: Comparison View */}
            <AnimatePresence mode='wait'>
                {selectedJob && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col fixed inset-0 z-30 lg:static lg:z-auto"
                    >
                        {/* Comparison Header */}
                        <div className="p-6 border-b border-slate-800 bg-slate-900/95 backdrop-blur flex justify-between items-center sticky top-0">
                            <div>
                                <button
                                    onClick={() => setSelectedJob(null)}
                                    className="lg:hidden text-slate-400 hover:text-white mb-2 flex items-center gap-1"
                                >
                                    <ArrowRight className="w-4 h-4 rotate-180" /> Back
                                </button>
                                <h2 className="text-xl font-bold text-white">Match Analysis</h2>
                                <p className="text-slate-400 text-sm">Comparing your profile with {selectedJob.title}</p>
                            </div>
                            <button
                                onClick={handleApply}
                                className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-lg shadow-primary/25 flex items-center gap-2 transition-all"
                            >
                                Apply Now <ExternalLink className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Score Breakdown */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
                                    <span className="block text-3xl font-bold text-white mb-1">{selectedJob.match_score}%</span>
                                    <span className="text-xs text-slate-400 uppercase tracking-wider">Overall Match</span>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
                                    <span className="block text-3xl font-bold text-green-400 mb-1">{Math.round((selectedJob.skills_matched.length / (selectedJob.skills_matched.length + selectedJob.skills_missing.length)) * 100)}%</span>
                                    <span className="text-xs text-slate-400 uppercase tracking-wider">Skill Overlap</span>
                                </div>
                            </div>

                            {/* Why it Matches */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">Why this role?</h3>
                                <p className="text-slate-300 leading-relaxed text-sm bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl">
                                    Your experience with <span className="text-blue-300 font-semibold">{selectedJob.skills_matched.slice(0, 3).join(", ")}</span> makes you a strong candidate.
                                    The role aligns with your seniority level, and you have {Math.round(selectedJob.match_score / 10)}/10 of the critical requirements.
                                </p>
                            </div>

                            {/* Skill Comparison */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="flex items-center gap-2 font-semibold text-green-400 mb-4 border-b border-slate-800 pb-2">
                                        <CheckCircle className="w-4 h-4" /> You Have
                                    </h4>
                                    <div className="space-y-2">
                                        {selectedJob.skills_matched.map(skill => (
                                            <div key={skill} className="flex items-center justify-between p-2 rounded-lg bg-green-500/5 border border-green-500/10">
                                                <span className="text-slate-300 text-sm">{skill}</span>
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="flex items-center gap-2 font-semibold text-red-400 mb-4 border-b border-slate-800 pb-2">
                                        <XCircle className="w-4 h-4" /> Missing / To Improve
                                    </h4>
                                    <div className="space-y-2">
                                        {selectedJob.skills_missing.map(skill => (
                                            <div key={skill} className="flex items-center justify-between p-2 rounded-lg bg-red-500/5 border border-red-500/10">
                                                <span className="text-slate-300 text-sm">{skill}</span>
                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-700">Course rec.</span>
                                            </div>
                                        ))}
                                        {selectedJob.skills_missing.length === 0 && (
                                            <p className="text-slate-500 italic text-sm">Perfect skill match! No missing skills.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JobMatcher;
