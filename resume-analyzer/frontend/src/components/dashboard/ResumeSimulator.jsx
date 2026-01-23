import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, TrendingUp, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ResumeSimulator = () => {
    const [currentScore, setCurrentScore] = useState(75);
    const [currentJobMatch, setCurrentJobMatch] = useState(68);
    const [simulatedScore, setSimulatedScore] = useState(null);
    const [simulatedJobMatch, setSimulatedJobMatch] = useState(null);
    const [addedItems, setAddedItems] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [itemType, setItemType] = useState('skill');

    const handleAddItem = () => {
        if (!inputValue.trim()) return;

        const newItem = {
            id: Date.now(),
            type: itemType,
            value: inputValue,
            impact: Math.floor(Math.random() * 10) + 3 // Random impact 3-12%
        };

        setAddedItems([...addedItems, newItem]);

        // Simulate score improvement
        const scoreIncrease = newItem.impact;
        const jobMatchIncrease = Math.floor(newItem.impact * 0.8);

        setSimulatedScore(Math.min(100, currentScore + scoreIncrease));
        setSimulatedJobMatch(Math.min(100, currentJobMatch + jobMatchIncrease));

        setInputValue('');
    };

    const handleRemoveItem = (id) => {
        const item = addedItems.find(i => i.id === id);
        setAddedItems(addedItems.filter(i => i.id !== id));

        // Recalculate scores
        const remainingItems = addedItems.filter(i => i.id !== id);
        if (remainingItems.length === 0) {
            setSimulatedScore(null);
            setSimulatedJobMatch(null);
        } else {
            const totalImpact = remainingItems.reduce((sum, i) => sum + i.impact, 0);
            setSimulatedScore(Math.min(100, currentScore + totalImpact));
            setSimulatedJobMatch(Math.min(100, currentJobMatch + Math.floor(totalImpact * 0.8)));
        }
    };

    const chartData = [
        {
            name: 'Resume Score',
            current: currentScore,
            simulated: simulatedScore || currentScore
        },
        {
            name: 'Job Match',
            current: currentJobMatch,
            simulated: simulatedJobMatch || currentJobMatch
        }
    ];

    return (
        <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-white">Resume Improvement Simulator</h3>
            </div>

            <p className="text-sm text-slate-400 mb-6">
                Add skills, projects, or certifications to see how they impact your resume score and job match percentage in real-time.
            </p>

            {/* Input Section */}
            <div className="space-y-4 mb-6">
                <div className="flex gap-3">
                    <select
                        value={itemType}
                        onChange={(e) => setItemType(e.target.value)}
                        className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                        <option value="skill">Skill</option>
                        <option value="project">Project</option>
                        <option value="certification">Certification</option>
                        <option value="experience">Experience</option>
                    </select>

                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                        placeholder={`Add a ${itemType}...`}
                        className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />

                    <button
                        onClick={handleAddItem}
                        className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add
                    </button>
                </div>

                {/* Added Items */}
                <AnimatePresence>
                    {addedItems.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {addedItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full text-sm"
                                >
                                    <span className="text-primary font-medium capitalize">{item.type}:</span>
                                    <span className="text-white">{item.value}</span>
                                    <span className="text-green-400 text-xs">+{item.impact}%</span>
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="ml-1 text-slate-400 hover:text-white transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Comparison Chart */}
            <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                            />
                            <Legend />
                            <Bar dataKey="current" fill="#64748b" name="Current" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="simulated" fill="#3b82f6" name="Simulated" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Score Comparison */}
            {simulatedScore && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 gap-4"
                >
                    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                        <div className="text-sm text-slate-400 mb-1">Resume Score</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-white">{simulatedScore}%</span>
                            <span className="text-sm text-green-400 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                +{simulatedScore - currentScore}%
                            </span>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                        <div className="text-sm text-slate-400 mb-1">Job Match</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-white">{simulatedJobMatch}%</span>
                            <span className="text-sm text-green-400 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                +{simulatedJobMatch - currentJobMatch}%
                            </span>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ResumeSimulator;
