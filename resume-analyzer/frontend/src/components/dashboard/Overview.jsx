import React, { useEffect, useMemo, useState } from 'react';
import { FileText, Award, Briefcase, Clock, ArrowUpRight, Plus, Loader2 } from 'lucide-react';
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

    const fetchHistory = async () => {
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
    };

    useEffect(() => {
        fetchHistory();
    }, [userId]);

    useEffect(() => {
        if (!userId) return;
        const timer = setInterval(fetchHistory, 30000);
        return () => clearInterval(timer);
    }, [userId]);

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
            color: 'blue',
        },
        {
            label: 'Avg. ATS Score',
            value: analyzedItems.length > 0 ? `${averageScore}/100` : '--',
            change: analyzedItems.length > 0 ? `${analyzedItems.length} analyzed` : 'No analyses yet',
            icon: Award,
            color: 'green',
        },
        {
            label: 'Best Job Match',
            value: bestMatch ? `${Math.round(bestMatch.ats_score)}/100` : '--',
            change: bestMatch?.filename || 'Upload and analyze to start',
            icon: Briefcase,
            color: 'purple',
        },
        {
            label: 'Last Analysis',
            value: lastAnalyzed ? formatTimeAgo(lastAnalyzed.uploaded_at) : '--',
            change: lastAnalyzed?.filename || 'No uploads yet',
            icon: Clock,
            color: 'orange',
        },
    ];

    return (
        <div className="space-y-6">
            <Card className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 sm:p-6 bg-[#121318]/60 backdrop-blur-xl border border-white/10 rounded-2xl gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Welcome back, User</h2>
                    <p className="text-sm sm:text-base text-slate-400">Here's what's happening with your job search today.</p>
                </div>
                <Button
                    onClick={onUploadClick}
                    icon={<Plus className="w-5 h-5" />}
                    className="w-full md:w-auto min-h-11 shadow-[0_0_15px_rgba(0,210,255,0.3)] hover:shadow-[0_0_25px_rgba(0,210,255,0.5)]"
                >
                    New Analysis
                </Button>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={index}
                        className="h-full"
                    >
                        <Card hover={true} className="h-full flex flex-col justify-between p-4 sm:p-6 border-white/10">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${
                                    stat.color === 'blue' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                    stat.color === 'green' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                    stat.color === 'purple' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                                    'bg-orange-500/10 border-orange-500/20 text-orange-400'
                                } border`}>
                                    <stat.icon className="w-6 h-6 drop-shadow-md" />
                                </div>
                                {index === 1 && <span className="text-xs font-bold px-2 py-1 bg-green-500/20 text-green-400 rounded-full flex items-center gap-1 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]"> <ArrowUpRight className="w-3 h-3" /> 12%</span>}
                            </div>
                            <div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</h3>
                                <p className="text-sm text-slate-400 font-light tracking-wide">{stat.label}</p>
                                <p className="text-xs text-primary/80 mt-2 font-medium">{stat.change}</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Job Readiness & Score Trend Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Job Readiness Gauge */}
                <Card>
                    <CardHeader>
                        <CardTitle>Job Readiness</CardTitle>
                    </CardHeader>
                    <div className="p-6 pt-0 flex justify-center">
                        <JobReadinessGauge score={75} />
                    </div>
                </Card>

                {/* Score Trend Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Score Improvement Trend</CardTitle>
                    </CardHeader>
                    <div className="p-4 sm:p-6 pt-0 h-56 sm:h-64 w-full">
                        {chartData.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                                Analyze resumes to see score trend.
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#00d2ff" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#121318', borderColor: 'rgba(255,255,255,0.1)', color: '#f8fafc', borderRadius: '0.75rem', backdropFilter: 'blur(12px)' }}
                                        itemStyle={{ color: '#00d2ff' }}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="#00d2ff" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
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
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <div className="p-4 sm:p-6 pt-0 space-y-4">
                    {loadingHistory ? (
                        <div className="flex justify-center py-6">
                            <Loader2 className="w-7 h-7 text-primary animate-spin" />
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-slate-400 text-sm py-4">No activity yet. Upload a resume to begin.</div>
                    ) : (
                        history.slice(0, 4).map((item) => (
                            <div key={item.id} className="flex items-start sm:items-center gap-3 sm:gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all cursor-pointer group border border-white/5 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(0,210,255,0.1)]">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                    <FileText className="w-5 h-5 text-primary drop-shadow-[0_0_5px_rgba(0,210,255,0.5)]" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-sm font-semibold text-white transition-colors group-hover:text-primary truncate">{item.filename}</h4>
                                    <p className="text-xs text-slate-400">Uploaded {formatTimeAgo(item.uploaded_at)}</p>
                                </div>
                                <div className="ml-0 sm:ml-auto mt-1 sm:mt-0">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-md border ${typeof item.ats_score === 'number'
                                        ? 'text-green-400 bg-green-500/10 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]'
                                        : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                                        }`}>
                                        {typeof item.ats_score === 'number' ? `${Math.round(item.ats_score)}/100` : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                    <Button
                        variant="secondary"
                        onClick={onViewHistory}
                        className="w-full mt-4 border border-white/10 hover:border-white/20"
                    >
                        View All History
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default Overview;
