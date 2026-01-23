import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, TrendingUp, TrendingDown, Minus, Calendar, FileText, ArrowRight, X } from 'lucide-react';
import { getResumeVersions, compareVersions } from '../../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

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
            case 'improved': return <TrendingUp className="w-5 h-5 text-green-500" />;
            case 'declined': return <TrendingDown className="w-5 h-5 text-red-500" />;
            default: return <Minus className="w-5 h-5 text-slate-400" />;
        }
    };

    // Responsive container depending on mode (Modal vs Full Page)
    const Container = ({ children }) => {
        if (onClose) {
            return (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card bg-slate-900 rounded-2xl border border-white/10 max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                    >
                        {/* Modal Header */}
                        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-green-600/10 to-blue-600/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/10 rounded-lg">
                                    <GitBranch className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Version Control</h2>
                                    <p className="text-sm text-slate-400">Comparing versions for Resume ID: {resumeId}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {children}
                        </div>
                    </motion.div>
                </div>
            );
        }
        return <div className="space-y-6 animate-fade-in">{children}</div>;
    };

    return (
        <Container>
            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
                </div>
            ) : error ? (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
                    {error}
                </div>
            ) : (
                <>
                    {/* Top Section: Chart & History */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Chart */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-indigo-500" />
                                    Score History
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                                            <XAxis dataKey="version" stroke="#94a3b8" />
                                            <YAxis stroke="#94a3b8" domain={[0, 100]} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#0f172a',
                                                    border: '1px solid #334155',
                                                    borderRadius: '8px',
                                                    color: '#f8fafc'
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="score"
                                                stroke="#6366f1"
                                                strokeWidth={3}
                                                dot={{ fill: '#6366f1', r: 4, strokeWidth: 2, stroke: '#fff' }}
                                                activeDot={{ r: 6 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Versions List */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-indigo-500" />
                                    Recent Versions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                                {versions.map((v) => (
                                    <div key={v.version} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 flex items-center justify-between group hover:border-indigo-500/30 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Badge variant="primary" size="sm">v{v.version}</Badge>
                                            <div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    {new Date(v.uploaded_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-slate-700 dark:text-white">{v.ats_score}%</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Compare Section */}
                    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-indigo-500/20">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <GitBranch className="w-5 h-5 text-indigo-400" />
                                Comparative Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-6">
                                <div>
                                    <label className="text-sm text-slate-400 mb-2 block">Base Version</label>
                                    <select
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                        onChange={(e) => selectVersion(parseInt(e.target.value), 0)}
                                    >
                                        <option value="">Select Version...</option>
                                        {versions.map(v => <option key={v.version} value={v.version}>v{v.version} ({v.ats_score}%)</option>)}
                                    </select>
                                </div>
                                <div className="hidden md:flex justify-center pb-3">
                                    <ArrowRight className="text-slate-500" />
                                </div>
                                <div>
                                    <label className="text-sm text-slate-400 mb-2 block">Target Version</label>
                                    <select
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                        onChange={(e) => selectVersion(parseInt(e.target.value), 1)}
                                    >
                                        <option value="">Select Version...</option>
                                        {versions.map(v => <option key={v.version} value={v.version}>v{v.version} ({v.ats_score}%)</option>)}
                                    </select>
                                </div>
                            </div>

                            <Button
                                onClick={handleCompare}
                                disabled={comparing || !selectedVersions[0] || !selectedVersions[1]}
                                loading={comparing}
                                className="w-full md:w-auto"
                            >
                                Compare Metrics
                            </Button>

                            {/* Comparison Output */}
                            {comparison && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-8 pt-8 border-t border-white/10"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        <div className="text-center p-4 bg-slate-950/50 rounded-xl border border-white/5">
                                            <p className="text-slate-400 text-sm mb-1">Score Delta</p>
                                            <div className="flex items-center justify-center gap-2">
                                                {getTrendIcon(comparison.comparison.score_change.trend)}
                                                <span className={`text-3xl font-bold ${comparison.comparison.score_change.delta > 0 ? 'text-green-400' : 'text-slate-200'
                                                    }`}>
                                                    {comparison.comparison.score_change.delta > 0 && '+'}
                                                    {comparison.comparison.score_change.delta}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-span-2 p-4 bg-slate-950/50 rounded-xl border border-white/5">
                                            <p className="text-indigo-400 font-bold mb-2">AI Recommendation</p>
                                            <p className="text-slate-300 text-sm leading-relaxed">
                                                {comparison.comparison.recommendation}
                                            </p>
                                        </div>
                                    </div>

                                    <h4 className="font-bold text-white mb-4">Key Changes Detected</h4>
                                    <div className="grid gap-3">
                                        {comparison.comparison.key_changes.map((change, i) => (
                                            <div key={i} className="p-4 bg-slate-950 rounded-lg border border-white/5 flex items-start gap-4">
                                                <div className={`mt-1 w-2 h-2 rounded-full ${change.impact === 'positive' ? 'bg-green-500' :
                                                        change.impact === 'negative' ? 'bg-red-500' : 'bg-slate-500'
                                                    }`} />
                                                <div>
                                                    <p className="font-medium text-white text-sm">{change.section}</p>
                                                    <p className="text-slate-400 text-sm">{change.description}</p>
                                                </div>
                                                <Badge variant={change.impact === 'positive' ? 'success' : 'default'} className="ml-auto text-xs">
                                                    {change.change_type}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </Container>
    );
};

export default VersionControl;
