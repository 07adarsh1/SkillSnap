import React, { useState } from 'react';
import { Plus, X, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const ResumeSimulator = () => {
    const [currentScore] = useState(75);
    const [currentJobMatch] = useState(68);
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
            impact: Math.floor(Math.random() * 8) + 4
        };

        const nextItems = [...addedItems, newItem];
        setAddedItems(nextItems);

        const totalImpact = nextItems.reduce((sum, i) => sum + i.impact, 0);
        setSimulatedScore(Math.min(100, currentScore + totalImpact));
        setSimulatedJobMatch(Math.min(100, currentJobMatch + Math.floor(totalImpact * 0.8)));

        setInputValue('');
    };

    const handleRemoveItem = (id) => {
        const remainingItems = addedItems.filter(i => i.id !== id);
        setAddedItems(remainingItems);

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
            name: 'ATS Score',
            Current: currentScore,
            Simulated: simulatedScore || currentScore
        },
        {
            name: 'Role Match',
            Current: currentJobMatch,
            Simulated: simulatedJobMatch || currentJobMatch
        }
    ];

    return (
        <Card className="bg-white border-slate-200/80 shadow-sm rounded-3xl">
            <CardHeader className="pb-2 border-b border-slate-100">
                <CardTitle className="text-base text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Interactive Resume What-If Simulator
                </CardTitle>
                <p className="text-xs text-slate-500">Test how adding certifications, skills, or metrics elevates your score in real time</p>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Simulator Inputs */}
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <select
                                value={itemType}
                                onChange={(e) => setItemType(e.target.value)}
                                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
                            >
                                <option value="skill">Skill</option>
                                <option value="certification">Certification</option>
                                <option value="metric">STAR Metric</option>
                            </select>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                                placeholder="e.g. AWS Solutions Architect, Docker..."
                                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500"
                            />
                            <button
                                onClick={handleAddItem}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add
                            </button>
                        </div>

                        {/* Added Items Pill Container */}
                        <div className="flex flex-wrap gap-2 min-h-[50px] p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                            {addedItems.length === 0 ? (
                                <span className="text-slate-400 text-xs italic self-center">No simulated additions yet. Add one above!</span>
                            ) : (
                                addedItems.map(item => (
                                    <span
                                        key={item.id}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-indigo-200 text-indigo-800 rounded-xl text-xs font-semibold shadow-xs"
                                    >
                                        <span>{item.value} (+{item.impact}%)</span>
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="text-slate-400 hover:text-rose-600 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Simulation Result Comparison Chart */}
                    <div className="h-52 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.75rem', color: '#0f172a' }}
                                />
                                <Legend />
                                <Bar dataKey="Current" fill="#94A3B8" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="Simulated" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ResumeSimulator;
