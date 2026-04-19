import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Clock3, FileText, Loader2, Search } from 'lucide-react';
import { getUserAnalysisHistory } from '../../services/api';

const HistoryView = ({ userId, onOpenResumes }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');

    const fetchHistory = async () => {
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
    };

    useEffect(() => {
        fetchHistory();
    }, [userId]);

    const filteredItems = useMemo(() => {
        const normalized = query.trim().toLowerCase();
        if (!normalized) {
            return items;
        }
        return items.filter((item) => (item.filename || '').toLowerCase().includes(normalized));
    }, [items, query]);

    return (
        <div className="space-y-6">
            <div className="bg-black/45 backdrop-blur-xl border border-white/10 p-4 sm:p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Analysis History</h2>
                        <p className="text-slate-400 text-sm mt-1">Review your previously uploaded resumes and ATS results.</p>
                    </div>
                    <button
                        onClick={onOpenResumes}
                        className="w-full sm:w-auto min-h-11 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10"
                    >
                        Manage Resumes
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-3 bg-[#121318]/60 backdrop-blur-xl p-3 rounded-xl border border-white/5 focus-within:border-primary/30 transition-all shadow-lg">
                <Search className="w-5 h-5 text-slate-400 ml-1" />
                <input
                    type="text"
                    placeholder="Search history by file name..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-white w-full placeholder:text-slate-500 outline-none text-sm sm:text-base"
                />
            </div>

            {loading ? (
                <div className="text-center py-20 bg-[#121318]/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Loading history...</p>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="text-center py-20 bg-[#121318]/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg">
                    <FileText className="w-10 h-10 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-300 font-medium">No history records found</p>
                    <p className="text-slate-500 text-sm mt-1">Upload resumes from the Resumes tab to see entries here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-[#121318]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <h3 className="font-semibold text-white truncate" title={item.filename}>{item.filename}</h3>
                                {item.analysis_result ? (
                                    <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-400">Ready</span>
                                ) : (
                                    <span className="text-xs px-2 py-1 rounded bg-yellow-500/10 text-yellow-400">Pending</span>
                                )}
                            </div>

                            <div className="mt-4 space-y-2 text-sm text-slate-400">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(item.uploaded_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock3 className="w-4 h-4" />
                                    <span>{new Date(item.uploaded_at).toLocaleTimeString()}</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/10">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-300">ATS Score</span>
                                    <span className="font-bold text-white">
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
