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
            <Card className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-[#121318]/60 backdrop-blur-xl border border-white/10 rounded-2xl gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Welcome back, User</h2>
                    <p className="text-slate-400">Here's what's happening with your job search today.</p>
                </div>
                <Button
                    onClick={onUploadClick}
                    icon={<Plus className="w-5 h-5" />}
                    className="shadow-[0_0_15px_rgba(0,210,255,0.3)] hover:shadow-[0_0_25px_rgba(0,210,255,0.5)]"
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
                        <Card hover={true} className="h-full flex flex-col justify-between p-6 border-white/10">
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
                                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
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
                    <div className="p-6 pt-0 h-64 w-full">
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
                <div className="p-6 pt-0 space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all cursor-pointer group border border-white/5 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(0,210,255,0.1)]">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                <FileText className="w-5 h-5 text-primary drop-shadow-[0_0_5px_rgba(0,210,255,0.5)]" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-white transition-colors group-hover:text-primary">Software_Eng_Resume_v{i}.pdf</h4>
                                <p className="text-xs text-slate-400">Analyzed {i * 2} hours ago</p>
                            </div>
                            <div className="ml-auto">
                                <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                                    8{i}%
                                </span>
                            </div>
                        </div>
                    ))}
                    <Button variant="secondary" className="w-full mt-4 border border-white/10 hover:border-white/20">
                        View All History
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default Overview;
