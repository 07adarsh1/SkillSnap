import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Building, CheckCircle, XCircle, ArrowRight, ExternalLink, RefreshCw, Search } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
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
                skills_matched: ["React", "Python", "AWS", "Docker", "FastAPI"],
                skills_missing: ["GraphQL"],
                description: "We are looking for a senior engineer to lead our core platform team...",
                logo_color: "indigo"
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
        }, 1000);
    }, []);

    const getMatchColor = (score) => {
        if (score >= 90) return 'success';
        if (score >= 70) return 'primary';
        return 'warning';
    };

    const handleApply = (e) => {
        e.stopPropagation();
        alert("Redirecting to job application...");
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-6">
            {/* Left Side: Job List */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${selectedJob ? 'hidden lg:flex lg:w-5/12' : 'w-full'}`}>

                {/* Filters */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex gap-2">
                        {['All', 'Remote', 'Full-time'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-slate-800 text-slate-400 hover:text-white'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <span className="text-sm text-slate-500">{jobs.length} jobs found</span>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <Card key={i} className="h-32 bg-slate-800/50 animate-pulse border-0" />
                        ))
                    ) : (
                        jobs.map((job) => (
                            <Card
                                key={job.id}
                                hover={true}
                                onClick={() => setSelectedJob(job)}
                                className={`cursor-pointer transition-all border-l-4 ${selectedJob?.id === job.id
                                        ? 'bg-slate-800 border-indigo-500 ring-1 ring-indigo-500/50 custom-shadow'
                                        : 'bg-slate-900/40 border-l-transparent hover:bg-slate-800 hover:border-l-indigo-500/50'
                                    }`}
                            >
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg bg-${job.logo_color}-500/20 text-${job.logo_color}-400`}>
                                                {job.company[0]}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-white">{job.title}</h3>
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <Building className="w-3 h-3" /> {job.company}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant={getMatchColor(job.match_score)}>{job.match_score}%</Badge>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                                        <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {job.salary}</span>
                                    </div>

                                    <div className="flex justify-between items-center border-t border-slate-700/50 pt-3">
                                        <div className="flex -space-x-1.5">
                                            {job.skills_matched.slice(0, 3).map((skill, i) => (
                                                <div key={i} className="w-5 h-5 rounded-full bg-slate-700 border border-slate-800 flex items-center justify-center text-[8px] text-white font-medium" title={skill}>
                                                    {skill[0]}
                                                </div>
                                            ))}
                                            {job.skills_matched.length > 3 && (
                                                <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[8px] text-slate-400">
                                                    +{job.skills_matched.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-xs font-medium text-indigo-400 group-hover:underline">View Analysis</span>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* Right Side: Details View */}
            <AnimatePresence mode='wait'>
                {selectedJob ? (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex-1 lg:w-7/12 bg-slate-900 border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl absolute inset-0 z-20 lg:static"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 bg-slate-900/95 backdrop-blur sticky top-0 z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <button
                                        onClick={() => setSelectedJob(null)}
                                        className="lg:hidden text-slate-400 hover:text-white mb-2 flex items-center gap-1 text-sm"
                                    >
                                        <ArrowRight className="w-4 h-4 rotate-180" /> Back to list
                                    </button>
                                    <h2 className="text-2xl font-bold text-white mb-1">{selectedJob.title}</h2>
                                    <div className="flex items-center gap-3 text-slate-400 text-sm">
                                        <span className="flex items-center gap-1"><Building className="w-3 h-3" /> {selectedJob.company}</span>
                                        <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {selectedJob.location}</span>
                                    </div>
                                </div>
                                <Button onClick={handleApply} icon={<ExternalLink className="w-4 h-4" />}>
                                    Apply Now
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                                    <span className="block text-2xl font-bold text-indigo-400">{selectedJob.match_score}%</span>
                                    <span className="text-xs text-indigo-300/70 uppercase font-semibold">Match Score</span>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-800 border border-white/5 text-center">
                                    <span className="block text-2xl font-bold text-white">{selectedJob.salary}</span>
                                    <span className="text-xs text-slate-500 uppercase font-semibold">Est. Compensation</span>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                            {/* Skills Analysis */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="flex items-center gap-2 text-sm font-bold text-green-400 uppercase mb-3">
                                        <CheckCircle className="w-4 h-4" /> Matched Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedJob.skills_matched.map(skill => (
                                            <Badge key={skill} variant="success" className="bg-green-500/10 border border-green-500/20 text-green-400">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="flex items-center gap-2 text-sm font-bold text-red-400 uppercase mb-3">
                                        <XCircle className="w-4 h-4" /> Missing Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedJob.skills_missing.map(skill => (
                                            <Badge key={skill} variant="danger" className="bg-red-500/10 border border-red-500/20 text-red-400">
                                                {skill}
                                            </Badge>
                                        ))}
                                        {selectedJob.skills_missing.length === 0 && (
                                            <span className="text-slate-500 text-sm italic">None! You are a perfect technical match.</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Comparison Insight */}
                            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                <h3 className="text-sm font-bold text-blue-400 mb-2 flex items-center gap-2">
                                    <Search className="w-4 h-4" /> AI Analysis
                                </h3>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    Your profile strongly aligns with the <strong>{selectedJob.title}</strong> role at {selectedJob.company}.
                                    Key strengths include {selectedJob.skills_matched.slice(0, 3).join(", ")}.
                                    To increase your chances to 99%, consider adding a project demonstrating {selectedJob.skills_missing[0] || "leadership skills"}.
                                </p>
                            </div>

                            {/* Job Description (Excerpt) */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">About the Role</h3>
                                <p className="text-slate-400 leading-relaxed text-sm">
                                    {selectedJob.description}
                                    <br /><br />
                                    (Full job description would be parsed here via Gemini...)
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="hidden lg:flex flex-1 items-center justify-center bg-slate-900/40 rounded-2xl border border-white/5 border-dashed">
                        <div className="text-center text-slate-500">
                            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">Select a job to view AI comparison</p>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JobMatcher;
