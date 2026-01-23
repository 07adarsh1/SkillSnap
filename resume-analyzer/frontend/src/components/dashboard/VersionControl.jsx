import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, TrendingUp, TrendingDown, Minus, Loader2, AlertCircle, Calendar, FileText } from 'lucide-react';
import { getResumeVersions, compareVersions } from '../../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const VersionControl = ({ resumeId, onClose }) => {
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVersions, setSelectedVersions] = useState([null, null]);
    const [comparison, setComparison] = useState(null);
    const [comparing, setComparing] = useState(false);

    useEffect(() => {
        loadVersions();
    }, [resumeId]);

    const loadVersions = async () => {
        try {
            const data = await getResumeVersions(resumeId);
            setVersions(data.versions || []);
        } catch (err) {
            setError('Failed to load version history');
        } finally {
            setLoading(false);
        }
    };

    const handleCompare = async () => {
        if (!selectedVersions[0] || !selectedVersions[1]) {
            setError('Please select two versions to compare');
            return;
        }

        setComparing(true);
        setError(null);

        try {
            const data = await compareVersions(
                resumeId,
                selectedVersions[0],
                selectedVersions[1]
            );
            setComparison(data);
        } catch (err) {
            setError('Failed to compare versions');
        } finally {
            setComparing(false);
        }
    };

    const selectVersion = (versionNum, slot) => {
        const newSelected = [...selectedVersions];
        newSelected[slot] = versionNum;
        setSelectedVersions(newSelected);
    };

    // Prepare chart data
    const chartData = versions.map(v => ({
        version: `v${v.version}`,
        score: v.ats_score || 0,
        date: new Date(v.uploaded_at).toLocaleDateString()
    }));

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'improved': return <TrendingUp className="w-5 h-5 text-green-400" />;
            case 'declined': return <TrendingDown className="w-5 h-5 text-red-400" />;
            default: return <Minus className="w-5 h-5 text-slate-400" />;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 rounded-2xl border border-slate-700 max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-green-600/10 to-blue-600/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <GitBranch className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Resume Version Control</h2>
                                <p className="text-sm text-slate-400">Track improvements across resume iterations</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-red-400">{error}</p>
                        </div>
                    ) : (
                        <>
                            {/* Score Progress Chart */}
                            {chartData.length > 1 && (
                                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                                    <h3 className="text-lg font-bold text-white mb-4">Score Progress</h3>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                            <XAxis dataKey="version" stroke="#94a3b8" />
                                            <YAxis stroke="#94a3b8" domain={[0, 100]} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#1e293b',
                                                    border: '1px solid #475569',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="score"
                                                stroke="#3b82f6"
                                                strokeWidth={2}
                                                dot={{ fill: '#3b82f6', r: 4 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            )}

                            {/* Version Selection */}
                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                                <h3 className="text-lg font-bold text-white mb-4">Compare Versions</h3>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-2">Version 1</label>
                                        <select
                                            value={selectedVersions[0] || ''}
                                            onChange={(e) => selectVersion(parseInt(e.target.value), 0)}
                                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                        >
                                            <option value="">Select version...</option>
                                            {versions.map(v => (
                                                <option key={v.version} value={v.version}>
                                                    v{v.version} - Score: {v.ats_score || 'N/A'}%
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-2">Version 2</label>
                                        <select
                                            value={selectedVersions[1] || ''}
                                            onChange={(e) => selectVersion(parseInt(e.target.value), 1)}
                                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                        >
                                            <option value="">Select version...</option>
                                            {versions.map(v => (
                                                <option key={v.version} value={v.version}>
                                                    v{v.version} - Score: {v.ats_score || 'N/A'}%
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCompare}
                                    disabled={comparing || !selectedVersions[0] || !selectedVersions[1]}
                                    className="w-full px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                                >
                                    {comparing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Comparing...
                                        </>
                                    ) : (
                                        <>
                                            <GitBranch className="w-5 h-5" />
                                            Compare Versions
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Comparison Results */}
                            {comparison && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-4"
                                >
                                    {/* Score Change */}
                                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                            {getTrendIcon(comparison.comparison.score_change.trend)}
                                            Score Change
                                        </h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                                                <p className="text-sm text-slate-400 mb-1">Previous</p>
                                                <p className="text-2xl font-bold text-white">
                                                    {comparison.comparison.score_change.previous}%
                                                </p>
                                            </div>
                                            <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                                                <p className="text-sm text-slate-400 mb-1">Change</p>
                                                <p className={`text-2xl font-bold ${comparison.comparison.score_change.delta > 0 ? 'text-green-400' :
                                                        comparison.comparison.score_change.delta < 0 ? 'text-red-400' :
                                                            'text-slate-400'
                                                    }`}>
                                                    {comparison.comparison.score_change.delta > 0 ? '+' : ''}
                                                    {comparison.comparison.score_change.delta}%
                                                </p>
                                            </div>
                                            <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                                                <p className="text-sm text-slate-400 mb-1">Current</p>
                                                <p className="text-2xl font-bold text-white">
                                                    {comparison.comparison.score_change.current}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Key Changes */}
                                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                                        <h3 className="text-lg font-bold text-white mb-4">Key Changes</h3>
                                        <div className="space-y-3">
                                            {comparison.comparison.key_changes.map((change, i) => (
                                                <div key={i} className="p-3 bg-slate-900/50 rounded-lg">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex-1">
                                                            <p className="font-medium text-white mb-1">{change.section}</p>
                                                            <p className="text-sm text-slate-400">{change.description}</p>
                                                        </div>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${change.impact === 'positive' ? 'bg-green-500/10 text-green-400' :
                                                                change.impact === 'negative' ? 'bg-red-500/10 text-red-400' :
                                                                    'bg-slate-500/10 text-slate-400'
                                                            }`}>
                                                            {change.change_type}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recommendation */}
                                    <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                        <h3 className="text-lg font-bold text-blue-400 mb-2">Recommendation</h3>
                                        <p className="text-slate-300">{comparison.comparison.recommendation}</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Version History */}
                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                                <h3 className="text-lg font-bold text-white mb-4">Version History</h3>
                                <div className="space-y-2">
                                    {versions.map((v, i) => (
                                        <div
                                            key={v.id}
                                            className="p-3 bg-slate-900/50 border border-slate-700 rounded-lg flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                                    <span className="text-xs font-bold text-primary">v{v.version}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{v.filename}</p>
                                                    <p className="text-xs text-slate-400 flex items-center gap-2">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(v.uploaded_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {v.ats_score && (
                                                    <p className="text-lg font-bold text-white">{v.ats_score}%</p>
                                                )}
                                                {v.is_optimized && (
                                                    <span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded-full">
                                                        Optimized
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default VersionControl;
