import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getATSHeatmap } from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const ATSHeatmap = ({ resumeId, sections }) => {
    const [heatmapData, setHeatmapData] = useState(sections || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (resumeId && !sections) {
            fetchHeatmap();
        }
    }, [resumeId]);

    const fetchHeatmap = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getATSHeatmap(resumeId);
            setHeatmapData(data.sections || []);
        } catch (err) {
            console.error('Failed to fetch ATS heatmap:', err);
            setError('Failed to load ATS heatmap');
        } finally {
            setLoading(false);
        }
    };

    const getColorClass = (status) => {
        switch (status) {
            case 'excellent':
                return 'bg-green-500/10 border-green-500/30 hover:shadow-[0_0_15px_rgba(34,197,94,0.2)]';
            case 'good':
                return 'bg-blue-500/10 border-blue-500/30 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]';
            case 'moderate':
                return 'bg-yellow-500/10 border-yellow-500/30 hover:shadow-[0_0_15px_rgba(234,179,8,0.2)]';
            case 'needs-work':
                return 'bg-orange-500/10 border-orange-500/30 hover:shadow-[0_0_15px_rgba(249,115,22,0.2)]';
            case 'critical':
                return 'bg-red-500/10 border-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]';
            default:
                return 'bg-slate-500/10 border-slate-500/30';
        }
    };

    const getTextColor = (status) => {
        switch (status) {
            case 'excellent':
                return 'text-green-400';
            case 'good':
                return 'text-blue-400';
            case 'moderate':
                return 'text-yellow-400';
            case 'needs-work':
                return 'text-orange-400';
            case 'critical':
                return 'text-red-400';
            default:
                return 'text-slate-400';
        }
    };

    if (loading) {
        return (
            <Card>
                <div className="p-6">
                    <LoadingSpinner text="Analyzing ATS compatibility..." />
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <div className="p-6">
                    <p className="text-red-400">{error}</p>
                    <button
                        onClick={fetchHeatmap}
                        className="mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg"
                    >
                        Retry
                    </button>
                </div>
            </Card>
        );
    }

    if (!heatmapData || heatmapData.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>ATS Compatibility Heatmap</CardTitle>
                <p className="text-sm text-slate-400">Visual breakdown of how ATS systems will parse your resume</p>
            </CardHeader>
            <CardContent>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {heatmapData.map((section, index) => (
                    <motion.div
                        key={section.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`group relative p-4 rounded-xl border-2 transition-all cursor-pointer ${getColorClass(section.status)}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-white text-sm">{section.name}</h4>
                            <span className={`text-lg font-bold ${getTextColor(section.status)}`}>
                                {section.score}%
                            </span>
                        </div>

                        <div className="w-full bg-slate-700/50 rounded-full h-1.5 mb-2">
                            <div
                                className={`h-1.5 rounded-full transition-all ${section.status === 'excellent' ? 'bg-green-500' :
                                        section.status === 'good' ? 'bg-blue-500' :
                                            section.status === 'moderate' ? 'bg-yellow-500' :
                                                section.status === 'needs-work' ? 'bg-orange-500' :
                                                    'bg-red-500'
                                    }`}
                                style={{ width: `${section.score}%` }}
                            />
                        </div>

                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                            <p className="text-xs text-slate-300 leading-relaxed">{section.feedback}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500" />
                    <span className="text-slate-400">Excellent (90-100%)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-500" />
                    <span className="text-slate-400">Good (80-89%)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-yellow-500" />
                    <span className="text-slate-400">Moderate (70-79%)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-orange-500" />
                    <span className="text-slate-400">Needs Work (50-69%)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-500" />
                    <span className="text-slate-400">Critical (&lt;50%)</span>
                </div>
            </div>
            </CardContent>
        </Card>
    );
};

export default ATSHeatmap;
