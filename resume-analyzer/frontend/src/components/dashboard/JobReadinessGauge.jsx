import React from 'react';
import { motion } from 'framer-motion';
import { Gauge } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const JobReadinessGauge = ({ score = 75 }) => {
    const data = [
        { name: 'Score', value: score },
        { name: 'Remaining', value: 100 - score }
    ];

    const getColor = (score) => {
        if (score >= 80) return '#22c55e';
        if (score >= 60) return '#eab308';
        return '#ef4444';
    };

    const getLabel = (score) => {
        if (score >= 80) return 'Ready to Apply';
        if (score >= 60) return 'Almost There';
        return 'Needs Work';
    };

    const scoreColor = getColor(score);

    return (
        <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-6">
                <Gauge className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-white">Job Readiness Score</h3>
            </div>

            <div className="flex flex-col items-center">
                <div className="relative w-48 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                startAngle={90}
                                endAngle={-270}
                                dataKey="value"
                                stroke="none"
                            >
                                <Cell key="score" fill={scoreColor} />
                                <Cell key="remaining" fill="#334155" />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold text-white">{score}</span>
                        <span className="text-sm text-slate-400 mt-1">{getLabel(score)}</span>
                    </div>
                </div>

                <div className="mt-6 w-full space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Resume Quality</span>
                        <span className="text-white font-semibold">85%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '85%' }} />
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Skill Completeness</span>
                        <span className="text-white font-semibold">70%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '70%' }} />
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Experience Match</span>
                        <span className="text-white font-semibold">90%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '90%' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobReadinessGauge;
