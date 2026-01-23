import React from 'react';
import { FileText, Award, Briefcase, Clock, ArrowUpRight, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import JobReadinessGauge from './JobReadinessGauge';
import ATSHeatmap from './ATSHeatmap';
import ResumeSimulator from './ResumeSimulator';

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
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Welcome back, User</h2>
                    <p className="text-slate-400">Here's what's happening with your job search today.</p>
                </div>
                <button
                    onClick={onUploadClick}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-all shadow-lg shadow-primary/25"
                >
                    <Plus className="w-5 h-5" />
                    New Analysis
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={index}
                        className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl flex flex-col justify-between hover:border-slate-600 transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-${stat.color}-500/10`}>
                                <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                            </div>
                            {index === 1 && <span className="text-xs font-bold px-2 py-1 bg-green-500/20 text-green-400 rounded-full flex items-center gap-1"> <ArrowUpRight className="w-3 h-3" /> 12%</span>}
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                            <p className="text-sm text-slate-400">{stat.label}</p>
                            <p className="text-xs text-slate-500 mt-2">{stat.change}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Job Readiness & Score Trend Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Job Readiness Gauge */}
                <JobReadinessGauge score={75} />

                {/* Score Trend Chart */}
                <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-6">Score Improvement Trend</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ATS Heatmap */}
            <ATSHeatmap />

            {/* Resume Simulator */}
            <ResumeSimulator />

            {/* Recent Activity */}
            <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-6">Recent Activity</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer group">
                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 text-slate-400 group-hover:text-white" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-white group-hover:text-primary transition-colors">Software_Eng_Resume_v{i}.pdf</h4>
                                <p className="text-xs text-slate-500">Analyzed {i * 2} hours ago</p>
                            </div>
                            <div className="ml-auto">
                                <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded">8{i}%</span>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-6 py-2 text-sm text-slate-400 hover:text-white font-medium border border-slate-700 hover:bg-slate-800 rounded-lg transition-all">
                    View All History
                </button>
            </div>
        </div>
    );
};

export default Overview;
