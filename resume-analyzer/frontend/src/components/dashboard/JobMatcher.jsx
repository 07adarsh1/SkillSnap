import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase,
    MapPin,
    DollarSign,
    Building,
    CheckCircle,
    XCircle,
    ArrowRight,
    ExternalLink,
    Search,
    RefreshCw,
    Sparkles,
    FileText,
    Calendar,
    Globe
} from 'lucide-react';
import { getRealJobs, syncJobs, getUserAnalysisHistory } from '../../services/api';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

const JobMatcher = ({ userId }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [userResumes, setUserResumes] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState('');

    const categories = [
        { id: 'All', label: 'All Roles' },
        { id: 'Software', label: 'Software Dev' },
        { id: 'Data', label: 'AI & Data' },
        { id: 'Devops', label: 'DevOps & Cloud' },
        { id: 'Design', label: 'UI/UX Design' },
        { id: 'Product', label: 'Product & PM' },
        { id: 'Marketing', label: 'Marketing' },
        { id: 'Finance', label: 'Finance & Ops' },
        { id: 'QA', label: 'QA & Testing' },
    ];

    // Load User Resumes for the dropdown
    useEffect(() => {
        const loadResumes = async () => {
            if (!userId) return;
            try {
                const data = await getUserAnalysisHistory(userId);
                const list = Array.isArray(data) ? data : data?.resumes || [];
                setUserResumes(list);
                if (list.length > 0) {
                    setSelectedResumeId(list[0].id || '');
                }
            } catch (err) {
                console.warn('Could not load user resumes for matcher:', err.message);
            }
        };
        loadResumes();
    }, [userId]);

    // Fetch Jobs from backend API
    const fetchJobs = async () => {
        setLoading(true);
        try {
            const data = await getRealJobs({
                search: searchQuery,
                category: selectedCategory === 'All' ? '' : selectedCategory,
                resumeId: selectedResumeId,
            });
            const fetchedList = Array.isArray(data?.jobs) ? data.jobs : [];
            setJobs(fetchedList);
            if (fetchedList.length > 0 && !selectedJob) {
                setSelectedJob(fetchedList[0]);
            }
        } catch (err) {
            console.error('Failed to load real jobs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchJobs();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedCategory, selectedResumeId]);

    const handleSync = async () => {
        setSyncing(true);
        try {
            await syncJobs();
            await fetchJobs();
        } catch (err) {
            console.error('Failed to sync jobs:', err);
        } finally {
            setSyncing(false);
        }
    };

    const getMatchColor = (score) => {
        if (score >= 85) return 'success';
        if (score >= 70) return 'primary';
        return 'warning';
    };

    const handleApply = (url) => {
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="space-y-4 text-slate-900">
            {/* Top Toolbar: Match Against Resume & Search */}
            <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-indigo-600" />
                                Live Remote Job Matcher
                            </h2>
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Live Feed
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Real verified remote jobs scored against your resume via vector semantic matching.
                        </p>
                    </div>

                    {/* Resume Selector & Force Refresh */}
                    <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                        {userResumes.length > 0 && (
                            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-2xl">
                                <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                                <span className="text-xs text-slate-500 font-medium shrink-0">Match with:</span>
                                <select
                                    value={selectedResumeId}
                                    onChange={(e) => setSelectedResumeId(e.target.value)}
                                    className="bg-transparent text-xs font-bold text-slate-800 outline-none max-w-[160px] truncate"
                                >
                                    {userResumes.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.filename || `Resume v${r.version || 1}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button
                            onClick={handleSync}
                            disabled={syncing}
                            title="Refresh latest jobs feed"
                            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all border border-slate-200 disabled:opacity-50 cursor-pointer"
                        >
                            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin text-indigo-600' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Category Pills & Search Input */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1 border-t border-slate-100">
                    <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                        {categories.map((cat) => {
                            const isActive = selectedCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                        isActive
                                            ? 'bg-indigo-600 text-white shadow-xs font-bold'
                                            : 'bg-slate-50 text-slate-600 border border-slate-200/70 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-2xl focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all w-full lg:w-72">
                        <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <input
                            type="text"
                            placeholder="Filter by title, company, skill..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none text-xs text-slate-900 w-full placeholder:text-slate-400 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Main Split Layout: Job List & Details View */}
            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-270px)] lg:h-[calc(100vh-250px)] gap-4 text-slate-900">
                {/* Left: Job List Feed */}
                <div className={`flex-1 flex flex-col transition-all ${selectedJob ? 'hidden lg:flex lg:w-5/12' : 'w-full'}`}>
                    <div className="flex justify-between items-center px-1 mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {jobs.length} Opportunities Found
                        </span>
                        <span className="text-[11px] text-indigo-600 font-medium">Ranked by ATS Match</span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                        {loading ? (
                            [1, 2, 3, 4].map((i) => (
                                <Card key={i} className="h-32 bg-white border border-slate-200 rounded-3xl animate-pulse" />
                            ))
                        ) : jobs.length === 0 ? (
                            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-2">
                                <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
                                <h4 className="font-bold text-sm text-slate-800">No matching jobs found</h4>
                                <p className="text-xs text-slate-500">Try adjusting your search keywords or switching category filters.</p>
                            </div>
                        ) : (
                            jobs.map((job) => {
                                const isSelected = selectedJob?.id === job.id;
                                return (
                                    <div
                                        key={job.id}
                                        onClick={() => setSelectedJob(job)}
                                        className={`cursor-pointer rounded-3xl p-4.5 transition-all border ${
                                            isSelected
                                                ? 'bg-indigo-50/50 border-indigo-500 shadow-sm'
                                                : 'bg-white border-slate-200/80 hover:border-indigo-300 hover:shadow-xs'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-2.5">
                                            <div className="flex items-center gap-3">
                                                {job.company_logo ? (
                                                    <img
                                                        src={job.company_logo}
                                                        alt={job.company_name}
                                                        className="w-10 h-10 rounded-2xl object-contain border border-slate-100 bg-white p-0.5 shrink-0"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center font-bold text-sm text-indigo-700 border border-indigo-100 shrink-0">
                                                        {job.company_name ? job.company_name[0] : 'J'}
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-sm tracking-tight line-clamp-1">
                                                        {job.title}
                                                    </h3>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                                        <Building className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                                                        <span className="font-medium text-slate-700">{job.company_name}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge variant={getMatchColor(job.match_score)} className="font-mono font-bold text-xs shrink-0">
                                                {job.match_score}% Match
                                            </Badge>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-2.5">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3 text-slate-400" /> {job.candidate_required_location}
                                            </span>
                                            {job.salary && (
                                                <span className="flex items-center gap-1 font-semibold text-slate-700">
                                                    <DollarSign className="w-3 h-3 text-slate-400" /> {job.salary}
                                                </span>
                                            )}
                                        </div>

                                        {/* Skill tags */}
                                        <div className="flex justify-between items-center border-t border-slate-100 pt-2.5">
                                            <div className="flex flex-wrap gap-1 max-w-[70%]">
                                                {(job.tags || []).slice(0, 3).map((tag, i) => (
                                                    <span
                                                        key={i}
                                                        className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {(job.tags || []).length > 3 && (
                                                    <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-full">
                                                        +{job.tags.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-700">
                                                Match Details <ArrowRight className="w-3 h-3" />
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right: Detailed Job & Match Breakdown */}
                <AnimatePresence mode="wait">
                    {selectedJob ? (
                        <motion.div
                            key={selectedJob.id}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="fixed inset-3 sm:inset-4 lg:inset-auto lg:static flex-1 lg:w-7/12 bg-white border border-slate-200/90 rounded-3xl overflow-hidden flex flex-col shadow-xl z-40 lg:z-20"
                        >
                            {/* Sticky Top Header */}
                            <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-10 space-y-3">
                                <div className="flex justify-between items-start gap-3">
                                    <div>
                                        <button
                                            onClick={() => setSelectedJob(null)}
                                            className="lg:hidden text-slate-500 hover:text-slate-900 mb-2 flex items-center gap-1 text-xs font-semibold"
                                        >
                                            <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Back to job listings
                                        </button>
                                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                                            {selectedJob.title}
                                        </h2>
                                        <div className="flex flex-wrap items-center gap-3 text-slate-500 text-xs mt-1">
                                            <span className="flex items-center gap-1 font-semibold text-slate-800">
                                                <Building className="w-3.5 h-3.5 text-slate-400" /> {selectedJob.company_name}
                                            </span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span className="flex items-center gap-1">
                                                <Globe className="w-3.5 h-3.5 text-slate-400" /> {selectedJob.candidate_required_location}
                                            </span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span className="capitalize">{selectedJob.job_type}</span>
                                        </div>
                                    </div>

                                    {/* Direct Apply Button */}
                                    <button
                                        onClick={() => handleApply(selectedJob.url)}
                                        className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 cursor-pointer shrink-0"
                                    >
                                        <span>Apply on Site</span>
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {/* Score & Compensation Highlights */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
                                        <span className="block text-2xl font-black text-indigo-700 font-mono">
                                            {selectedJob.match_score}%
                                        </span>
                                        <span className="text-[10px] text-indigo-600 uppercase font-bold tracking-wider">
                                            ATS Semantic Match
                                        </span>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
                                        <span className="block text-xl font-black text-slate-900 font-mono">
                                            {selectedJob.salary || 'Competitive'}
                                        </span>
                                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                                            Est. Compensation
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Scrollable Body */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                {/* Skills Alignment Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-2">
                                        <h3 className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                                            <CheckCircle className="w-4 h-4 text-emerald-600" /> Matched Competencies
                                        </h3>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(selectedJob.skills_matched || []).map((skill, i) => (
                                                <Badge key={i} variant="success">
                                                    {skill}
                                                </Badge>
                                            ))}
                                            {(selectedJob.skills_matched || []).length === 0 && (
                                                <span className="text-xs text-slate-400 italic">No direct keyword overlap</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl space-y-2">
                                        <h3 className="flex items-center gap-1.5 text-xs font-bold text-rose-800 uppercase tracking-wider">
                                            <XCircle className="w-4 h-4 text-rose-600" /> Missing / Target Keywords
                                        </h3>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(selectedJob.skills_missing || []).map((skill, i) => (
                                                <Badge key={i} variant="danger">
                                                    {skill}
                                                </Badge>
                                            ))}
                                            {(selectedJob.skills_missing || []).length === 0 && (
                                                <span className="text-xs text-emerald-700 font-semibold">
                                                    Complete skillset coverage!
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* AI Recommendation Box */}
                                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1.5">
                                    <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> AI Application Advice
                                    </h4>
                                    <p className="text-xs text-slate-700 leading-relaxed">
                                        You hold strong alignment with this <strong>{selectedJob.title}</strong> vacancy at{' '}
                                        <strong>{selectedJob.company_name}</strong>. Highlight your proven metrics with{' '}
                                        {selectedJob.skills_matched?.slice(0, 2).join(' and ') || 'core tools'} in your resume bullet points before submitting.
                                    </p>
                                </div>

                                {/* Full Job Description */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 mb-2">Job Description & Requirements</h3>
                                    <div className="text-slate-600 leading-relaxed text-xs space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 whitespace-pre-line">
                                        {selectedJob.description}
                                    </div>
                                </div>

                                {/* Source Attribution */}
                                <div className="pt-2 text-center">
                                    <p className="text-[11px] text-slate-400">
                                        Live remote positions aggregated via <a href="https://remotive.com" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline font-semibold">Remotive Public API</a>.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="hidden lg:flex flex-1 items-center justify-center bg-white rounded-3xl border border-slate-200/80 shadow-sm">
                            <div className="text-center text-slate-400 p-6 space-y-2">
                                <Briefcase className="w-10 h-10 mx-auto opacity-40 text-indigo-600" />
                                <p className="text-sm font-semibold text-slate-700">Select an opportunity to view AI match breakdown</p>
                                <p className="text-xs text-slate-400">Examine skill gaps, salary insights, and apply directly.</p>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default JobMatcher;
