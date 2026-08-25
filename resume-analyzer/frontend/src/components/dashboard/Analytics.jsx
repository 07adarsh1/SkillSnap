import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const Analytics = () => {
    const mockTrendData = [
        { date: 'Oct 01', score: 65, skills: 45 },
        { date: 'Oct 15', score: 68, skills: 50 },
        { date: 'Nov 01', score: 75, skills: 60 },
        { date: 'Nov 15', score: 72, skills: 58 },
        { date: 'Dec 01', score: 82, skills: 70 },
        { date: 'Dec 15', score: 88, skills: 75 },
        { date: 'Jan 01', score: 92, skills: 85 },
    ];

    const mockSkillGapData = [
        { subject: 'Python', A: 120, B: 110, fullMark: 150 },
        { subject: 'React', A: 98, B: 130, fullMark: 150 },
        { subject: 'AWS', A: 86, B: 130, fullMark: 150 },
        { subject: 'System Design', A: 99, B: 100, fullMark: 150 },
        { subject: 'SQL', A: 85, B: 90, fullMark: 150 },
        { subject: 'DevOps', A: 65, B: 85, fullMark: 150 },
    ];

    return (
        <div className="space-y-6 text-slate-900">
            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Performance Analytics</h2>
                <p className="text-xs text-slate-500 mt-1">Visualize historical ATS scores, skill competency benchmarks, and market alignment.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Score Trend */}
                <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">ATS Score & Skill Competency Trend</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mockTrendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.75rem', color: '#0f172a', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}
                                />
                                <Legend />
                                <Line type="monotone" name="ATS Score" dataKey="score" stroke="#4F46E5" strokeWidth={3} activeDot={{ r: 7 }} />
                                <Line type="monotone" name="Skills Index" dataKey="skills" stroke="#10B981" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Skill Radar */}
                <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Skill Profile vs Industry Market Demand</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={mockSkillGapData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 'bold' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                <Radar name="My Skills Profile" dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.4} />
                                <Radar name="Market Target Benchmark" dataKey="B" stroke="#10B981" fill="#10B981" fillOpacity={0.25} />
                                <Legend />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Target Improvement Areas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1">
                        <h4 className="font-bold text-slate-900 text-xs">High Leverage: DevOps & Cloud</h4>
                        <p className="text-xs text-slate-600">Your cloud infrastructure coverage is 20% below target benchmark for Senior roles.</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1">
                        <h4 className="font-bold text-slate-900 text-xs">Metric Evidence Optimization</h4>
                        <p className="text-xs text-slate-600">Incorporate quantified percentages and revenue impact to technical projects.</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1">
                        <h4 className="font-bold text-slate-900 text-xs">Top Core Strength: Frontend & APIs</h4>
                        <p className="text-xs text-slate-600">You rank in the top 10% for modern React and fullstack state management patterns.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
