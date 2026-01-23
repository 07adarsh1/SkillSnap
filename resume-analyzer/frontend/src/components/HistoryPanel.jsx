import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Trash2, Calendar, ChevronRight, Loader2 } from 'lucide-react';
import { getUserAnalysisHistory, deleteResume } from '../services/api';

const HistoryPanel = ({ isOpen, onClose, userId, onLoadResult }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const fetchHistory = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const data = await getUserAnalysisHistory(userId);
            setHistory(data);
        } catch (error) {
            console.error("Failed to fetch history", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchHistory();
        }
    }, [isOpen, userId]);

    // Step 1: Trigger the modal
    const handleDeleteClick = (e, resumeId) => {
        e.stopPropagation();
        setDeleteConfirmId(resumeId);
    };

    // Step 2: Actually delete
    const confirmDelete = async () => {
        if (!deleteConfirmId) return;
        try {
            await deleteResume(deleteConfirmId);
            setHistory(history.filter(h => h.id !== deleteConfirmId));
            setDeleteConfirmId(null);
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-900 border-l border-slate-800 z-50 shadow-2xl flex flex-col"
                    >
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <FileText className="text-primary" /> Analysis History
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-6 space-y-4">
                            {loading ? (
                                <div className="flex justify-center py-10">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                </div>
                            ) : history.length === 0 ? (
                                <div className="text-center text-slate-500 py-10">
                                    <p>No analysis history found.</p>
                                </div>
                            ) : (
                                history.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => {
                                            if (item.analysis_result) {
                                                onLoadResult(item.analysis_result);
                                                onClose();
                                            }
                                        }}
                                        className="group p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-primary/50 rounded-xl cursor-pointer transition-all relative"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-white truncate pr-8">{item.filename}</h3>
                                            <button
                                                onClick={(e) => handleDeleteClick(e, item.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:bg-red-500/20 rounded transition-all absolute top-3 right-3"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(item.uploaded_at).toLocaleDateString()}
                                            </span>
                                            {item.ats_score && (
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.ats_score >= 70 ? 'bg-green-500/10 text-green-400' :
                                                        item.ats_score >= 50 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                                                    }`}>
                                                    Score: {item.ats_score}%
                                                </span>
                                            )}
                                        </div>

                                        {!item.analysis_result && (
                                            <div className="mt-2 text-xs text-yellow-500/70 italic">
                                                Analysis pending or incomplete
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </>
            )}

            {/* Custom Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-sm w-full shadow-2xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold text-white mb-2">Delete History?</h3>
                        <p className="text-slate-400 mb-6">
                            Are you sure you want to delete this resume analysis? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3 mt-auto">
                            <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-red-900/20"
                            >
                                <Trash2 className="w-4 h-4" /> Delete
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default HistoryPanel;
