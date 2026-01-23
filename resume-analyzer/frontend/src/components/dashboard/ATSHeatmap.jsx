import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getATSHeatmap } from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';

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
                return 'bg-green-500/20 border-green-500/50 hover:bg-green-500/30';
            case 'good':
                return 'bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/30';
            case 'moderate':
                return 'bg-yellow-500/20 border-yellow-500/50 hover:bg-yellow-500/30';
            case 'needs-work':
                return 'bg-orange-500/20 border-orange-500/50 hover:bg-orange-500/30';
            case 'critical':
                return 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30';
            default:
                return 'bg-slate-500/20 border-slate-500/50';
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
            <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
                <LoadingSpinner text="Analyzing ATS compatibility..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
                <p className="text-red-400">{error}</p>
                <button
                    onClick={fetchHeatmap}
                    className="mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!heatmapData || heatmapData.length === 0) {
        return null;
    }

    return (
        <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-2">ATS Compatibility Heatmap</h3>
                <p className="text-sm text-slate-400">Visual breakdown of how ATS systems will parse your resume</p>
            </div>

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
            <div className="mt-6 pt-4 border-t border-slate-700/50 flex flex-wrap gap-4 text-xs">
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
        </div>
    );
};

export default ATSHeatmap;
