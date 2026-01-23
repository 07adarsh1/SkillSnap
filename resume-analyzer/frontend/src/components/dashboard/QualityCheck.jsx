import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle2, XCircle, Loader2, TrendingUp, FileWarning } from 'lucide-react';
import { checkResumeQuality } from '../../services/api';

const QualityCheck = ({ resumeId, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [error, setError] = useState(null);

    const handleCheck = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await checkResumeQuality(resumeId);
            setReport(data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to check resume quality');
        } finally {
            setLoading(false);
        }
    };

    // Auto-load on mount
    React.useEffect(() => {
        if (!report && !loading) {
            handleCheck();
        }
    }, []);

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
            case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'low': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    const getRiskColor = (risk) => {
        switch (risk) {
            case 'high': return 'text-red-400 bg-red-500/20';
            case 'medium': return 'text-yellow-400 bg-yellow-500/20';
            case 'low': return 'text-green-400 bg-green-500/20';
            default: return 'text-slate-400 bg-slate-500/20';
        }
    };

    const getIssueIcon = (type) => {
        switch (type) {
            case 'weak_language':
            case 'vague_claim':
                return <FileWarning className="w-5 h-5 text-yellow-400" />;
            case 'unrealistic':
            case 'inconsistency':
                return <XCircle className="w-5 h-5 text-red-400" />;
            default:
                return <AlertTriangle className="w-5 h-5 text-orange-400" />;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 rounded-2xl border border-slate-700 max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-orange-600/10 to-red-600/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                                <Shield className="w-6 h-6 text-orange-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Resume Quality Check</h2>
                                <p className="text-sm text-slate-400">AI-powered authenticity and confidence analysis</p>
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
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                            <p className="text-slate-400">Analyzing resume quality...</p>
                        </div>
                    ) : error ? (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    ) : report ? (
                        <>
                            {/* Score Cards */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 text-center">
                                    <p className="text-sm text-slate-400 mb-2">Confidence Score</p>
                                    <p className="text-4xl font-bold text-white mb-2">{report.confidence_score}%</p>
                                    <div className="w-full bg-slate-700 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${report.confidence_score >= 75 ? 'bg-green-500' :
                                                    report.confidence_score >= 50 ? 'bg-yellow-500' :
                                                        'bg-red-500'
                                                }`}
                                            style={{ width: `${report.confidence_score}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 text-center">
                                    <p className="text-sm text-slate-400 mb-2">Authenticity Score</p>
                                    <p className="text-4xl font-bold text-white mb-2">{report.authenticity_score}%</p>
                                    <div className="w-full bg-slate-700 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${report.authenticity_score >= 75 ? 'bg-green-500' :
                                                    report.authenticity_score >= 50 ? 'bg-yellow-500' :
                                                        'bg-red-500'
                                                }`}
                                            style={{ width: `${report.authenticity_score}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 text-center">
                                    <p className="text-sm text-slate-400 mb-2">Risk Level</p>
                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getRiskColor(report.risk_level)}`}>
                                        <Shield className="w-5 h-5" />
                                        <span className="text-xl font-bold uppercase">{report.risk_level}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Overall Assessment */}
                            <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                <h3 className="text-lg font-bold text-blue-400 mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Overall Assessment
                                </h3>
                                <p className="text-slate-300 leading-relaxed">{report.overall_assessment}</p>
                            </div>

                            {/* Issues Found */}
                            {report.issues && report.issues.length > 0 && (
                                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-orange-400" />
                                        Issues Found ({report.issues.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {report.issues.map((issue, i) => (
                                            <div
                                                key={i}
                                                className={`p-4 rounded-lg border ${getSeverityColor(issue.severity)}`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    {getIssueIcon(issue.type)}
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between gap-3 mb-2">
                                                            <p className="font-medium text-white capitalize">
                                                                {issue.type.replace(/_/g, ' ')}
                                                            </p>
                                                            <span className={`text-xs px-2 py-1 rounded-full border ${getSeverityColor(issue.severity)}`}>
                                                                {issue.severity} severity
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-slate-300 mb-2">{issue.issue}</p>
                                                        <div className="p-2 bg-slate-900/50 rounded border border-slate-700">
                                                            <p className="text-xs text-slate-400 mb-1">Location: {issue.location}</p>
                                                            <p className="text-sm text-slate-300 italic">"{issue.example}"</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Suggestions */}
                            {report.suggestions && report.suggestions.length > 0 && (
                                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-green-400" />
                                        Improvement Suggestions
                                    </h3>
                                    <div className="space-y-4">
                                        {report.suggestions.map((suggestion, i) => (
                                            <div key={i} className="p-4 bg-green-500/5 border border-green-500/10 rounded-lg">
                                                <p className="text-sm font-medium text-green-400 mb-2 capitalize">
                                                    {suggestion.issue_type.replace(/_/g, ' ')}
                                                </p>
                                                <div className="grid grid-cols-2 gap-4 mb-2">
                                                    <div>
                                                        <p className="text-xs text-slate-500 mb-1">Current:</p>
                                                        <p className="text-sm text-red-400 line-through">"{suggestion.current}"</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500 mb-1">Suggested:</p>
                                                        <p className="text-sm text-green-400 font-medium">"{suggestion.suggested}"</p>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-slate-400 italic">{suggestion.reason}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* No Issues */}
                            {(!report.issues || report.issues.length === 0) && (
                                <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
                                    <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                                    <h3 className="text-lg font-bold text-green-400 mb-2">Excellent Quality!</h3>
                                    <p className="text-slate-300">No major issues found in your resume.</p>
                                </div>
                            )}

                            {/* Actions */}
                            <button
                                onClick={handleCheck}
                                className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                            >
                                <Shield className="w-5 h-5" />
                                Re-check Quality
                            </button>
                        </>
                    ) : null}
                </div>
            </motion.div>
        </div>
    );
};

export default QualityCheck;
