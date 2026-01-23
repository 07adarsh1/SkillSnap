import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { getUserAnalysisHistory } from '../../services/api';

const Analytics = ({ userId }) => {
    // Mock Data for demonstration if history is empty
    const mockTrendData = [
        { date: '2023-10-01', score: 65, skills: 45 },
        { date: '2023-10-15', score: 68, skills: 50 },
        { date: '2023-11-01', score: 75, skills: 60 },
        { date: '2023-11-15', score: 72, skills: 58 },
        { date: '2023-12-01', score: 82, skills: 70 },
        { date: '2023-12-15', score: 88, skills: 75 },
        { date: '2024-01-01', score: 92, skills: 85 },
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
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">Performance Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Score Trend */}
                <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-6">ATS Score Trend</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mockTrendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="skills" stroke="#22c55e" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Skill Radar */}
                <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-6">Skill Profile vs Market Demand</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mockSkillGapData}>
                                <PolarGrid stroke="#334155" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                <Radar name="My Skills" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                <Radar name="Market Avg" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                                <Legend />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-4">Improvement Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                        <h4 className="font-bold text-yellow-400 mb-2">Focus Area: DevOps</h4>
                        <p className="text-sm text-slate-400">Your DevOps score is 20% below market average for Senior roles.</p>
                        <button className="mt-3 text-sm text-primary hover:underline">View Courses</button>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                        <h4 className="font-bold text-blue-400 mb-2">Keyword Optimization</h4>
                        <p className="text-sm text-slate-400">Add detailed metrics to "Project Management" sections to boost ATS score.</p>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                        <h4 className="font-bold text-green-400 mb-2">Strength: React</h4>
                        <p className="text-sm text-slate-400">You are in the top 10% for React development skills. Leverage this!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
