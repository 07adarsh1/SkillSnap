import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, TrendingUp, TrendingDown, Minus, Calendar, FileText, ArrowRight, X } from 'lucide-react';
import { getResumeVersions, compareVersions } from '../../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
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

    const chartData = versions.map(v => ({
        version: `v${v.version}`,
        score: v.ats_score || 0,
        date: new Date(v.uploaded_at).toLocaleDateString()
    }));

    const Container = ({ children }) => {
        if (onClose) {
            return (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        className="bg-white rounded-3xl border border-slate-200/90 max-w-6xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl text-slate-900"
                    >
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-start sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600">
                                    <GitBranch className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Version Control & Iteration Tracking</h2>
                                    <p className="text-xs text-slate-500">Track ATS score progression and diff changes across resume uploads</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {children}
                        </div>
                    </motion.div>
                </div>
            );
        }
        return <div className="space-y-6 animate-fade-in text-slate-900">{children}</div>;
    };

    return (
        <Container>
            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin w-7 h-7 border-3 border-indigo-600 border-t-transparent rounded-full" />
                </div>
            ) : error ? (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl">
                    {error}
                </div>
            ) : (
                <>
                    {/* Chart & History */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2 bg-white border-slate-200/80 shadow-sm rounded-3xl">
                            <CardHeader className="pb-2 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                                    Score Evolution
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="h-[220px] sm:h-[260px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                            <XAxis dataKey="version" stroke="#94a3b8" fontSize={11} />
                                            <YAxis stroke="#94a3b8" domain={[0, 100]} fontSize={11} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#ffffff',
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '0.75rem',
                                                    boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                                                    color: '#0f172a'
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="score"
                                                stroke="#4F46E5"
                                                strokeWidth={3}
                                                dot={{ fill: '#4F46E5', r: 4, strokeWidth: 2, stroke: '#ffffff' }}
                                                activeDot={{ r: 6 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border-slate-200/80 shadow-sm rounded-3xl">
                            <CardHeader className="pb-2 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-indigo-600" />
                                    Recorded Snapshots
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-2.5 max-h-[260px] overflow-y-auto custom-scrollbar">
                                {versions.map((v) => (
                                    <div key={v.version} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between hover:border-indigo-200 transition-colors">
                                        <div className="flex items-center gap-2.5">
                                            <Badge variant="primary" size="sm">v{v.version}</Badge>
                                            <div>
                                                <p className="text-[11px] text-slate-500 font-medium">
                                                    {new Date(v.uploaded_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-black font-mono text-slate-900">{v.ats_score || 0}/100</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Compare Section */}
                    {versions.length >= 2 && (
                        <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-3xl space-y-4">
                            <h3 className="text-sm font-bold text-slate-900">Compare Resume Snapshots</h3>
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <select
                                    className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 outline-none w-full sm:w-auto"
                                    value={selectedVersions[0] || ''}
                                    onChange={(e) => selectVersion(Number(e.target.value), 0)}
                                >
                                    <option value="">Select Base Version</option>
                                    {versions.map(v => (
                                        <option key={v.version} value={v.version}>v{v.version} ({v.ats_score} pts)</option>
                                    ))}
                                </select>
                                <span className="text-xs text-slate-400 font-bold">vs</span>
                                <select
                                    className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 outline-none w-full sm:w-auto"
                                    value={selectedVersions[1] || ''}
                                    onChange={(e) => selectVersion(Number(e.target.value), 1)}
                                >
                                    <option value="">Select Target Version</option>
                                    {versions.map(v => (
                                        <option key={v.version} value={v.version}>v{v.version} ({v.ats_score} pts)</option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleCompare}
                                    disabled={comparing || !selectedVersions[0] || !selectedVersions[1]}
                                    className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs rounded-xl shadow-sm disabled:opacity-50 cursor-pointer"
                                >
                                    {comparing ? 'Comparing...' : 'Run Version Diff'}
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </Container>
    );
};

export default VersionControl;
