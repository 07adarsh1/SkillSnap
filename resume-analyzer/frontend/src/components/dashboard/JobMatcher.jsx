import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Building, CheckCircle, XCircle, ArrowRight, ExternalLink, Search } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

const JobMatcher = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [filter, setFilter] = useState('All');

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
                skills_matched: ["React", "Node.js", "Express", "Docker", "AWS"],
                skills_missing: ["GraphQL"],
                description: "We are looking for a senior engineer to lead our core platform team building real-time collaboration tools...",
                logo_color: "indigo"
            },
            {
                id: 2,
                title: "Backend Platform Developer",
                company: "DataStream Inc.",
                location: "New York, NY (Hybrid)",
                type: "Full-time",
                salary: "$130k - $160k",
                match_score: 82,
                skills_matched: ["Node.js", "Docker", "PostgreSQL", "REST APIs"],
                skills_missing: ["Kubernetes", "Redis"],
                description: "Join our data infrastructure team to build high-scale processing pipelines and reliable microservices...",
                logo_color: "emerald"
            },
            {
                id: 3,
                title: "Frontend Architect",
                company: "Creative Pulse",
                location: "Austin, TX",
                type: "Contract",
                salary: "$120k - $150k",
                match_score: 68,
                skills_matched: ["React", "Tailwind CSS", "Vite"],
                skills_missing: ["Next.js", "TypeScript", "Figma"],
                description: "Seeking a frontend expert to modernize our design system and client web experience...",
                logo_color: "purple"
            },
            {
                id: 4,
                title: "AI Solutions Engineer",
                company: "NeuralNet Corp",
                location: "Remote",
                type: "Full-time",
                salary: "$160k - $200k",
                match_score: 88,
                skills_matched: ["Node.js", "Vector Embeddings", "Transformers", "Python"],
                skills_missing: ["LangChain", "Fine-tuning"],
                description: "Build the next generation of AI search and document analysis applications using modern LLMs...",
                logo_color: "orange"
            }
        ];

        setTimeout(() => {
            setJobs(mockJobs);
            setLoading(false);
        }, 600);
    }, []);

    const getMatchColor = (score) => {
        if (score >= 90) return 'success';
        if (score >= 70) return 'primary';
        return 'warning';
    };

    const handleApply = (e) => {
        e.stopPropagation();
        alert("Redirecting to job application portal...");
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-170px)] lg:h-[calc(100vh-140px)] gap-4 sm:gap-6 text-slate-900">
            {/* Left Side: Job List */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${selectedJob ? 'hidden lg:flex lg:w-5/12' : 'w-full'}`}>

                {/* Filters */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex gap-2 flex-wrap">
                        {['All', 'Remote', 'Full-time'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${filter === f
                                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{jobs.length} matched jobs</span>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <Card key={i} className="h-32 bg-white border border-slate-200 rounded-3xl animate-pulse" />
                        ))
                    ) : (
                        jobs.map((job) => (
                            <div
                                key={job.id}
                                onClick={() => setSelectedJob(job)}
                                className={`cursor-pointer rounded-3xl p-5 transition-all border ${selectedJob?.id === job.id
                                    ? 'bg-indigo-50/50 border-indigo-500 shadow-sm'
                                    : 'bg-white border-slate-200/80 hover:border-indigo-300 hover:shadow-sm'
                                }`}
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center font-bold text-base text-indigo-600 border border-indigo-100">
                                                {job.company[0]}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-sm tracking-tight">{job.title}</h3>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                                    <Building className="w-3.5 h-3.5" /> {job.company}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant={getMatchColor(job.match_score)} className="font-bold text-xs">
                                            {job.match_score}% Match
                                        </Badge>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}</span>
                                        <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-slate-400" /> {job.salary}</span>
                                    </div>

                                    <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                                        <div className="flex -space-x-1">
                                            {job.skills_matched.slice(0, 3).map((skill, i) => (
                                                <div key={i} className="w-5 h-5 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[8px] text-slate-700 font-bold" title={skill}>
                                                    {skill[0]}
                                                </div>
                                            ))}
                                            {job.skills_matched.length > 3 && (
                                                <div className="w-5 h-5 rounded-full bg-indigo-50 border border-white flex items-center justify-center text-[8px] text-indigo-600 font-bold">
                                                    +{job.skills_matched.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                                            View Match Analysis <ArrowRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Side: Details View */}
            <AnimatePresence mode='wait'>
                {selectedJob ? (
                    <motion.div
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 15 }}
                        className="fixed inset-3 sm:inset-4 lg:inset-auto lg:static flex-1 lg:w-7/12 bg-white border border-slate-200/90 rounded-3xl overflow-hidden flex flex-col shadow-xl z-40 lg:z-20"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <button
                                        onClick={() => setSelectedJob(null)}
                                        className="lg:hidden text-slate-500 hover:text-slate-900 mb-2 flex items-center gap-1 text-xs font-semibold"
                                    >
                                        <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Back to job list
                                    </button>
                                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{selectedJob.title}</h2>
                                    <div className="flex items-center gap-3 text-slate-500 text-xs mt-1">
                                        <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5" /> {selectedJob.company}</span>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {selectedJob.location}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleApply}
                                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 cursor-pointer"
                                >
                                    <span>Apply Now</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
                                    <span className="block text-2xl font-black text-indigo-700 font-mono">{selectedJob.match_score}%</span>
                                    <span className="text-[10px] text-indigo-600 uppercase font-bold tracking-wider">ATS Match Score</span>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
                                    <span className="block text-2xl font-black text-slate-900 font-mono">{selectedJob.salary}</span>
                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Est. Compensation</span>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

                            {/* Skills Analysis */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2.5">
                                        <CheckCircle className="w-4 h-4 text-emerald-600" /> Matched Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedJob.skills_matched.map(skill => (
                                            <Badge key={skill} variant="success">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider mb-2.5">
                                        <XCircle className="w-4 h-4 text-rose-600" /> Missing Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedJob.skills_missing.map(skill => (
                                            <Badge key={skill} variant="danger">
                                                {skill}
                                            </Badge>
                                        ))}
                                        {selectedJob.skills_missing.length === 0 && (
                                            <span className="text-emerald-700 text-xs font-semibold">Perfect technical match!</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Comparison Insight */}
                            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                                <h3 className="text-xs font-bold text-indigo-900 mb-1.5 flex items-center gap-1.5">
                                    <Search className="w-3.5 h-3.5 text-indigo-600" /> AI Alignment Insights
                                </h3>
                                <p className="text-slate-700 text-xs leading-relaxed">
                                    Your resume strongly aligns with the <strong>{selectedJob.title}</strong> position at {selectedJob.company}.
                                    Key strengths include {selectedJob.skills_matched.slice(0, 3).join(", ")}.
                                    To maximize interview probability, highlight experience with {selectedJob.skills_missing[0] || "system design and architecture"}.
                                </p>
                            </div>

                            {/* Job Description (Excerpt) */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 mb-2">About the Role</h3>
                                <p className="text-slate-600 leading-relaxed text-xs">
                                    {selectedJob.description}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="hidden lg:flex flex-1 items-center justify-center bg-white rounded-3xl border border-slate-200/80 shadow-sm">
                        <div className="text-center text-slate-400 p-6">
                            <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-40 text-indigo-600" />
                            <p className="text-sm font-semibold text-slate-600">Select a job from the list to view AI comparison</p>
                            <p className="text-xs text-slate-400 mt-1">Review matched skills, missing keywords, and salary insights.</p>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JobMatcher;
