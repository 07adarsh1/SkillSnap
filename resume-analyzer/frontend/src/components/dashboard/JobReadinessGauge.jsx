import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const JobReadinessGauge = ({ score = 75 }) => {
    const data = [
        { name: 'Score', value: score },
        { name: 'Remaining', value: 100 - score }
    ];

    const getColor = (score) => {
        if (score >= 80) return '#059669'; // Emerald-600
        if (score >= 60) return '#4F46E5'; // Indigo-600
        return '#E11D48'; // Rose-600
    };

    const getLabel = (score) => {
        if (score >= 80) return 'Ready to Apply';
        if (score >= 60) return 'Solid Baseline';
        return 'Needs Work';
    };

    const scoreColor = getColor(score);

    return (
        <div className="w-full py-1">
            <div className="flex flex-col items-center">
                <div className="relative w-44 h-44">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <defs>
                                <linearGradient id="scoreGaugeGrad" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor={scoreColor} stopOpacity={1} />
                                    <stop offset="100%" stopColor={scoreColor === '#059669' ? '#10B981' : scoreColor === '#4F46E5' ? '#7C3AED' : '#F43F5E'} stopOpacity={1} />
                                </linearGradient>
                            </defs>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={68}
                                outerRadius={82}
                                startAngle={225}
                                endAngle={-45}
                                dataKey="value"
                                stroke="#f1f5f9"
                                strokeWidth={2}
                                cornerRadius={6}
                            >
                                <Cell key="score" fill="url(#scoreGaugeGrad)" />
                                <Cell key="remaining" fill="#F1F5F9" />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-slate-900 tracking-tight font-mono">{score}</span>
                        <span className="text-[11px] font-bold text-indigo-700 mt-1 px-3 py-0.5 bg-indigo-50 rounded-full border border-indigo-100">{getLabel(score)}</span>
                    </div>
                </div>

                <div className="mt-6 w-full space-y-3.5">
                    <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-slate-600 font-semibold">Resume Structure Quality</span>
                            <span className="text-slate-900 font-bold">85%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '85%' }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" 
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-slate-600 font-semibold">Skill Completeness</span>
                            <span className="text-slate-900 font-bold">72%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '72%' }}
                                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
                                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" 
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-slate-600 font-semibold">Impact Evidence</span>
                            <span className="text-slate-900 font-bold">90%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '90%' }}
                                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                                className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobReadinessGauge;
