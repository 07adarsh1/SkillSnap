import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getATSHeatmap } from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const ATSHeatmap = ({ resumeId, sections }) => {
    const [heatmapData, setHeatmapData] = useState(sections || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchHeatmap = useCallback(async () => {
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
    }, [resumeId]);

    useEffect(() => {
        if (resumeId && !sections) {
            fetchHeatmap();
        } else if (sections) {
            setHeatmapData(sections);
        }
    }, [resumeId, sections, fetchHeatmap]);

    const getColorClass = (status) => {
        switch (status) {
            case 'excellent':
                return 'bg-emerald-50/60 border-emerald-200 text-emerald-900';
            case 'good':
                return 'bg-indigo-50/60 border-indigo-200 text-indigo-900';
            case 'moderate':
                return 'bg-amber-50/60 border-amber-200 text-amber-900';
            case 'needs-work':
                return 'bg-orange-50/60 border-orange-200 text-orange-900';
            case 'critical':
                return 'bg-rose-50/60 border-rose-200 text-rose-900';
            default:
                return 'bg-slate-50 border-slate-200 text-slate-800';
        }
    };

    const getTextColor = (status) => {
        switch (status) {
            case 'excellent':
                return 'text-emerald-700';
            case 'good':
                return 'text-indigo-700';
            case 'moderate':
                return 'text-amber-700';
            case 'needs-work':
                return 'text-orange-700';
            case 'critical':
                return 'text-rose-700';
            default:
                return 'text-slate-700';
        }
    };

    if (loading) {
        return (
            <Card className="bg-white border-slate-200/80 shadow-sm rounded-3xl">
                <div className="p-6">
                    <LoadingSpinner text="Analyzing ATS section parsing compatibility..." />
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="bg-white border-slate-200/80 shadow-sm rounded-3xl">
                <div className="p-6">
                    <p className="text-rose-600 text-xs">{error}</p>
                    <button
                        onClick={fetchHeatmap}
                        className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
                    >
                        Retry Heatmap
                    </button>
                </div>
            </Card>
        );
    }

    if (!heatmapData || heatmapData.length === 0) {
        return null;
    }

    return (
        <Card className="bg-white border-slate-200/80 shadow-sm rounded-3xl">
            <CardHeader className="pb-2 border-b border-slate-100">
                <CardTitle className="text-base text-slate-900">ATS Compatibility Heatmap</CardTitle>
                <p className="text-xs text-slate-500">Visual breakdown of parser accuracy across standard ATS scanning engines</p>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {heatmapData.map((section, index) => (
                        <motion.div
                            key={section.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04 }}
                            className={`group relative p-4 rounded-2xl border transition-all cursor-pointer ${getColorClass(section.status)}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-slate-900 text-xs">{section.name}</h4>
                                <span className={`text-base font-black font-mono ${getTextColor(section.status)}`}>
                                    {section.score}%
                                </span>
                            </div>

                            <div className="w-full bg-white/70 rounded-full h-1.5 mb-2">
                                <div
                                    className={`h-1.5 rounded-full transition-all ${section.status === 'excellent' ? 'bg-emerald-500' :
                                            section.status === 'good' ? 'bg-indigo-500' :
                                                section.status === 'moderate' ? 'bg-amber-500' :
                                                    section.status === 'needs-work' ? 'bg-orange-500' :
                                                        'bg-rose-500'
                                        }`}
                                    style={{ width: `${section.score}%` }}
                                />
                            </div>

                            <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                                <p className="text-[11px] text-slate-600 leading-relaxed">{section.feedback}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Legend */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap gap-4 text-[11px]">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-slate-600 font-medium">Excellent (90-100%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                        <span className="text-slate-600 font-medium">Good (80-89%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span className="text-slate-600 font-medium">Moderate (70-79%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <span className="text-slate-600 font-medium">Needs Work (&lt;70%)</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ATSHeatmap;
