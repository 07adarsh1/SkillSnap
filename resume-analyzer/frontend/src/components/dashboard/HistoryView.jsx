import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Calendar, Clock3, FileText, Loader2, Search } from 'lucide-react';
import { getUserAnalysisHistory } from '../../services/api';

const HistoryView = ({ userId, onOpenResumes }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');

    const fetchHistory = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const data = await getUserAnalysisHistory(userId);
            setItems(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load history', error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const filteredItems = useMemo(() => {
        const normalized = query.trim().toLowerCase();
        if (!normalized) {
            return items;
        }
        return items.filter((item) => (item.filename || '').toLowerCase().includes(normalized));
    }, [items, query]);

    return (
        <div className="space-y-6 text-slate-900">
            {/* Header */}
            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Analysis History</h2>
                        <p className="text-slate-500 text-xs mt-1">Review your previously uploaded resumes and ATS evaluation history.</p>
                    </div>
                    <button
                        onClick={onOpenResumes}
                        className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-all cursor-pointer"
                    >
                        Manage Resumes
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all shadow-sm">
                <Search className="w-4 h-4 text-slate-400 ml-1" />
                <input
                    type="text"
                    placeholder="Search history by resume name..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-slate-900 w-full placeholder:text-slate-400 outline-none text-xs"
                />
            </div>

            {loading ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
                    <p className="text-slate-500 text-xs font-medium">Loading history records...</p>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
                    <FileText className="w-10 h-10 text-indigo-600/40 mx-auto mb-3" />
                    <p className="text-slate-900 font-bold text-sm">No history records found</p>
                    <p className="text-slate-500 text-xs mt-1">Upload resumes from the Resumes tab to generate historical logs.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
                        >
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <h3 className="font-bold text-slate-900 text-sm truncate" title={item.filename}>{item.filename}</h3>
                                {item.analysis_result ? (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        Ready
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                        Pending
                                    </span>
                                )}
                            </div>

                            <div className="space-y-1.5 text-xs text-slate-500">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{new Date(item.uploaded_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock3 className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{new Date(item.uploaded_at).toLocaleTimeString()}</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100">
                                <div className="flex items-center justify-between text-xs font-semibold">
                                    <span className="text-slate-600">ATS Score</span>
                                    <span className="font-black text-slate-900 font-mono text-sm">
                                        {typeof item.ats_score === 'number' ? `${Math.round(item.ats_score)}/100` : '--'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryView;
