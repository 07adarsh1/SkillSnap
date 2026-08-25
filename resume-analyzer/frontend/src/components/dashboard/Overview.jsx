import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { FileText, Award, Briefcase, Clock, ArrowUpRight, Plus, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import JobReadinessGauge from './JobReadinessGauge';
import ATSHeatmap from './ATSHeatmap';
import ResumeSimulator from './ResumeSimulator';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { getUserAnalysisHistory } from '../../services/api';

const Overview = ({ userId, onUploadClick, onViewHistory }) => {
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const formatTimeAgo = (inputDate) => {
        const date = new Date(inputDate);
        if (!Number.isFinite(date.getTime())) return 'just now';

        const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const fetchHistory = useCallback(async () => {
        if (!userId) {
            setHistory([]);
            return;
        }

        setLoadingHistory(true);
        try {
            const data = await getUserAnalysisHistory(userId);
            const normalized = Array.isArray(data) ? data : [];
            const sorted = [...normalized].sort(
                (a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
            );
            setHistory(sorted);
        } catch (error) {
            console.error('Failed to load overview history', error);
            setHistory([]);
        } finally {
            setLoadingHistory(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    useEffect(() => {
        if (!userId) return;
        const timer = setInterval(fetchHistory, 30000);
        return () => clearInterval(timer);
    }, [userId, fetchHistory]);

    const analyzedItems = useMemo(
        () => history.filter((item) => item.analysis_result && typeof item.ats_score === 'number'),
        [history]
    );

    const averageScore = useMemo(() => {
        if (analyzedItems.length === 0) return 0;
        const total = analyzedItems.reduce((sum, item) => sum + (item.ats_score || 0), 0);
        return Math.round(total / analyzedItems.length);
    }, [analyzedItems]);

    const bestMatch = useMemo(() => {
        if (analyzedItems.length === 0) return null;
        return analyzedItems.reduce((best, item) => (item.ats_score > best.ats_score ? item : best), analyzedItems[0]);
    }, [analyzedItems]);

    const lastAnalyzed = history[0] || null;

    const chartData = useMemo(() => {
        const trendSource = [...analyzedItems].slice(0, 7).reverse();
        return trendSource.map((item, index) => ({
            name: item.filename ? `R${index + 1}` : `R${index + 1}`,
            score: Math.round(item.ats_score || 0),
        }));
    }, [analyzedItems]);

    const stats = [
        {
            label: 'Total Resumes',
            value: String(history.length),
            change: `${history.filter((item) => {
                const t = new Date(item.uploaded_at).getTime();
                return Number.isFinite(t) && Date.now() - t <= 7 * 24 * 60 * 60 * 1000;
            }).length} this week`,
            icon: FileText,
            color: 'indigo',
        },
        {
            label: 'Avg. ATS Score',
            value: analyzedItems.length > 0 ? `${averageScore}/100` : '--',
            change: analyzedItems.length > 0 ? `${analyzedItems.length} analyzed` : 'No analyses yet',
            icon: Award,
            color: 'emerald',
        },
        {
            label: 'Best Job Match',
            value: bestMatch ? `${Math.round(bestMatch.ats_score)}/100` : '--',
            change: bestMatch?.filename || 'Upload and analyze to start',
            icon: Briefcase,
            color: 'violet',
        },
        {
            label: 'Last Analysis',
            value: lastAnalyzed ? formatTimeAgo(lastAnalyzed.uploaded_at) : '--',
            change: lastAnalyzed?.filename || 'No uploads yet',
            icon: Clock,
            color: 'amber',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Top Welcome Banner */}
            <Card className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white border border-slate-200/80 shadow-sm rounded-3xl gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1">Welcome back</h2>
                    <p className="text-xs sm:text-sm text-slate-500">Here is your AI resume analysis & ATS performance overview.</p>
                </div>
                <Button
                    onClick={onUploadClick}
                    icon={<Plus className="w-4 h-4" />}
                    className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold shadow-md shadow-indigo-500/20 rounded-xl text-xs py-2.5 px-5 cursor-pointer"
                >
                    New Analysis
                </Button>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        key={index}
                        className="h-full"
                    >
                        <Card hover={true} className="h-full flex flex-col justify-between p-5 bg-white border border-slate-200/80 shadow-sm rounded-3xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl ${
                                    stat.color === 'indigo' ? 'bg-indigo-50 border border-indigo-100 text-indigo-600' :
                                    stat.color === 'emerald' ? 'bg-emerald-50 border border-emerald-100 text-emerald-600' :
                                    stat.color === 'violet' ? 'bg-violet-50 border border-violet-100 text-violet-600' :
                                    'bg-amber-50 border border-amber-100 text-amber-600'
                                } shadow-sm`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                {index === 1 && (
                                    <span className="text-xs font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full flex items-center gap-1 border border-emerald-200">
                                        <ArrowUpRight className="w-3 h-3" /> 12%
                                    </span>
                                )}
                            </div>
                            <div>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-0.5 tracking-tight">{stat.value}</h3>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                                <p className="text-xs text-indigo-600 mt-2 font-medium truncate">{stat.change}</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Job Readiness & Score Trend Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Job Readiness Gauge */}
                <Card className="bg-white border-slate-200/80 shadow-sm rounded-3xl">
                    <CardHeader className="pb-2 border-b border-slate-100">
                        <CardTitle className="text-base text-slate-900">Job Readiness</CardTitle>
                    </CardHeader>
                    <div className="p-6 pt-4 flex justify-center">
                        <JobReadinessGauge score={75} />
                    </div>
                </Card>

                {/* Score Trend Chart */}
                <Card className="lg:col-span-2 bg-white border-slate-200/80 shadow-sm rounded-3xl">
                    <CardHeader className="pb-2 border-b border-slate-100">
                        <CardTitle className="text-base text-slate-900">Score Improvement Trend</CardTitle>
                    </CardHeader>
                    <div className="p-6 pt-4 h-56 sm:h-64 w-full">
                        {chartData.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                                Analyze resumes to visualize score trends.
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '0.75rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                                        itemStyle={{ color: '#4F46E5', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </Card>
            </div>

            {/* ATS Heatmap */}
            <ATSHeatmap />

            {/* Resume Simulator */}
            <ResumeSimulator />

            {/* Recent Activity */}
            <Card className="bg-white border-slate-200/80 shadow-sm rounded-3xl">
                <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-base text-slate-900">Recent Activity</CardTitle>
                </CardHeader>
                <div className="p-6 pt-4 space-y-3">
                    {loadingHistory ? (
                        <div className="flex justify-center py-6">
                            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-slate-400 text-xs py-4 text-center">No activity yet. Upload a resume to begin.</div>
                    ) : (
                        history.slice(0, 4).map((item) => (
                            <div key={item.id} className="flex items-start sm:items-center gap-3.5 p-3.5 bg-slate-50 hover:bg-indigo-50/50 rounded-2xl transition-all cursor-pointer group border border-slate-100 hover:border-indigo-100">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100 text-indigo-600">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-xs font-bold text-slate-900 transition-colors group-hover:text-indigo-600 truncate">{item.filename}</h4>
                                    <p className="text-[11px] text-slate-500">Uploaded {formatTimeAgo(item.uploaded_at)}</p>
                                </div>
                                <div className="ml-0 sm:ml-auto mt-1 sm:mt-0">
                                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${typeof item.ats_score === 'number'
                                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                                        : 'text-amber-700 bg-amber-50 border-amber-200'
                                        }`}>
                                        {typeof item.ats_score === 'number' ? `${Math.round(item.ats_score)}/100` : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                    <button
                        onClick={onViewHistory}
                        className="w-full mt-3 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                    >
                        View All History
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default Overview;
