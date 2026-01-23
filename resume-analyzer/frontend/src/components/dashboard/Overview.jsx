import React from 'react';
import { FileText, Award, Briefcase, Clock, ArrowUpRight, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import JobReadinessGauge from './JobReadinessGauge';
import ATSHeatmap from './ATSHeatmap';
import ResumeSimulator from './ResumeSimulator';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

const Overview = ({ onUploadClick }) => {
    // Mock Data
    const stats = [
        { label: 'Total Resumes', value: '12', change: '+2 this week', icon: FileText, color: 'blue' },
        { label: 'Avg. ATS Score', value: '78%', change: '+5% improvement', icon: Award, color: 'green' },
        { label: 'Best Job Match', value: '92%', change: 'Senior Dev Role', icon: Briefcase, color: 'purple' },
        { label: 'Last Analysis', value: '2h ago', change: 'Software Engineer', icon: Clock, color: 'orange' },
    ];

    const chartData = [
        { name: 'Mon', score: 65 },
        { name: 'Tue', score: 72 },
        { name: 'Wed', score: 68 },
        { name: 'Thu', score: 85 },
        { name: 'Fri', score: 82 },
        { name: 'Sat', score: 90 },
        { name: 'Sun', score: 88 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-white/5 backdrop-blur-sm shadow-sm dark:shadow-none">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Welcome back, User</h2>
                    <p className="text-slate-500 dark:text-slate-400">Here's what's happening with your job search today.</p>
                </div>
                <Button
                    onClick={onUploadClick}
                    icon={<Plus className="w-5 h-5" />}
                    className="shadow-lg shadow-indigo-500/20"
                >
                    New Analysis
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={index}
                    >
                        <Card hover={true} className="h-full flex flex-col justify-between">
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl bg-${stat.color}-500/10`}>
                                        <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                                    </div>
                                    {index === 1 && <span className="text-xs font-bold px-2 py-1 bg-green-500/20 text-green-400 rounded-full flex items-center gap-1"> <ArrowUpRight className="w-3 h-3" /> 12%</span>}
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{stat.value}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{stat.change}</p>
                                </div>
                            </CardContent>
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
                    <CardContent className="flex justify-center">
                        <JobReadinessGauge score={75} />
                    </CardContent>
                </Card>

                {/* Score Trend Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Score Improvement Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
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
                <CardContent className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer group border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Software_Eng_Resume_v{i}.pdf</h4>
                                <p className="text-xs text-slate-500">Analyzed {i * 2} hours ago</p>
                            </div>
                            <div className="ml-auto">
                                <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/10 px-2 py-1 rounded">8{i}%</span>
                            </div>
                        </div>
                    ))}
                    <Button variant="secondary" className="w-full mt-4">
                        View All History
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Overview;
