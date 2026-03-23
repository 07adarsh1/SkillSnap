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
        if (score >= 80) return '#00d2ff'; // Primary cyan
        if (score >= 60) return '#fbbf24'; // Amber
        return '#f87171'; // Red
    };

    const getLabel = (score) => {
        if (score >= 80) return 'Ready to Apply';
        if (score >= 60) return 'Almost There';
        return 'Needs Work';
    };

    const scoreColor = getColor(score);

    return (
        <div className="w-full py-2">
            <div className="flex flex-col items-center">
                <div className="relative w-48 h-48 drop-shadow-[0_0_15px_rgba(0,210,255,0.2)]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <defs>
                                <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor={scoreColor} stopOpacity={1} />
                                    <stop offset="100%" stopColor={scoreColor === '#00d2ff' ? '#3a7bd5' : scoreColor === '#fbbf24' ? '#d97706' : '#dc2626'} stopOpacity={1} />
                                </linearGradient>
                            </defs>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={85}
                                startAngle={225}
                                endAngle={-45}
                                dataKey="value"
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth={2}
                                cornerRadius={8}
                            >
                                <Cell key="score" fill="url(#scoreGradient)" />
                                <Cell key="remaining" fill="rgba(255,255,255,0.05)" />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 drop-shadow-sm">{score}</span>
                        <span className="text-sm font-medium text-primary mt-1 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">{getLabel(score)}</span>
                    </div>
                </div>

                <div className="mt-8 w-full space-y-4">
                    <div>
                        <div className="flex justify-between items-center text-sm mb-1.5">
                            <span className="text-slate-400 font-medium">Resume Quality</span>
                            <span className="text-white font-bold tracking-wide">85%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '85%' }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center text-sm mb-1.5">
                            <span className="text-slate-400 font-medium">Skill Completeness</span>
                            <span className="text-white font-bold tracking-wide">70%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '70%' }}
                                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                                className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 shadow-[0_0_10px_rgba(250,204,21,0.5)]" 
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center text-sm mb-1.5">
                            <span className="text-slate-400 font-medium">Experience Match</span>
                            <span className="text-white font-bold tracking-wide">90%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '90%' }}
                                transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
                                className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-[0_0_10px_rgba(74,222,128,0.5)]" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobReadinessGauge;
