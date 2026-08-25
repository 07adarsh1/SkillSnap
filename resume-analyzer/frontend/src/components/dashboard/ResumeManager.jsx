import React, { useState, useEffect, useCallback } from 'react';
import { Upload, FileText, Trash2, Calendar, Search, Loader2, ArrowRight, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UploadSection from '../UploadSection';
import ResultsDashboard from '../ResultsDashboard';
import { getUserAnalysisHistory, deleteResume, analyzeResume, uploadResume } from '../../services/api';

const ResumeManager = ({ userId }) => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
    const [selectedResume, setSelectedResume] = useState(null);
    const [showUploadPanel, setShowUploadPanel] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [retryingId, setRetryingId] = useState(null);

    const fetchResumes = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const data = await getUserAnalysisHistory(userId);
            setResumes(data);
        } catch (error) {
            console.error("Failed to fetch resumes", error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchResumes();
    }, [fetchResumes]);

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        setDeleteConfirmId(id);
    };

    const confirmDelete = async () => {
        if (!deleteConfirmId) return;
        try {
            await deleteResume(deleteConfirmId);
            setResumes(resumes.filter(r => r.id !== deleteConfirmId));
            setDeleteConfirmId(null);
        } catch (error) {
            console.error("Failed to delete", error);
            alert("Failed to delete resume. Please try again.");
            setDeleteConfirmId(null);
        }
    };

    const handleViewAnalysis = (resume) => {
        setSelectedResume(resume);
        setViewMode('detail');
    };

    const handleBackToList = () => {
        setViewMode('list');
        setSelectedResume(null);
    };

    const filteredResumes = resumes.filter(r =>
        r.filename.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (viewMode === 'detail' && selectedResume) {
        return (
            <div className="space-y-6">
                <button
                    onClick={handleBackToList}
                    className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 transition-all bg-white hover:bg-slate-50 py-2 px-4 rounded-xl border border-slate-200 shadow-sm font-semibold text-xs w-fit cursor-pointer"
                >
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Back to Resumes
                </button>
                <div className="flex items-center justify-between bg-white border border-slate-200/80 p-5 rounded-3xl shadow-sm">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{selectedResume.filename}</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Resume ID: {selectedResume.id}</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                        Uploaded {new Date(selectedResume.uploaded_at).toLocaleDateString()}
                    </span>
                </div>
                {selectedResume.analysis_result ? (
                    <ResultsDashboard
                        data={selectedResume.analysis_result}
                        resumeId={selectedResume.id}
                        jobDescription={selectedResume.job_description || ""}
                    />
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
                        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
                        <p className="text-slate-500 text-xs">Analysis in progress or not found...</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6 text-slate-900">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Resume Management</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Upload, manage, and analyze your resumes with AI.</p>
                </div>
                <button
                    onClick={() => setShowUploadPanel(!showUploadPanel)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                >
                    <Upload className="w-4 h-4" />
                    {showUploadPanel ? "Cancel Upload" : "Upload New Resume"}
                </button>
            </div>

            <AnimatePresence>
                {showUploadPanel && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, scale: 0.98 }}
                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.98 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 mb-6 shadow-sm relative overflow-hidden">
                            <UploadSection
                                onUpload={async (file, optionalJobDesc = '') => {
                                    setIsProcessing(true);
                                    try {
                                        const uploadResp = await uploadResume(file, userId);
                                        setUploadSuccess(true);
                                        await fetchResumes();

                                        analyzeResume(uploadResp.resume_id, optionalJobDesc)
                                            .then(() => fetchResumes())
                                            .catch((error) => {
                                                console.error("Background analysis failed", error);
                                            });

                                        setTimeout(() => {
                                            setUploadSuccess(false);
                                            setIsProcessing(false);
                                            setShowUploadPanel(false);
                                        }, 800);
                                    } catch (error) {
                                        console.error("Upload failed", error);
                                        alert("Failed to upload and analyze resume.");
                                        setIsProcessing(false);
                                    }
                                }}
                                isUploading={isProcessing}
                                uploadSuccess={uploadSuccess}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search Bar */}
            <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all shadow-sm">
                <Search className="w-4 h-4 text-slate-400 ml-1" />
                <input
                    type="text"
                    placeholder="Search resumes by filename..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-slate-900 w-full placeholder:text-slate-400 outline-none text-xs"
                />
            </div>

            {/* Resume Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-white border border-slate-200 rounded-3xl animate-pulse shadow-sm" />
                    ))
                ) : filteredResumes.length > 0 ? (
                    filteredResumes.map((resume) => (
                        <motion.div
                            layout
                            key={resume.id}
                            className="group bg-white hover:bg-slate-50/50 border border-slate-200/80 hover:border-indigo-300 rounded-3xl p-5 transition-all duration-300 flex flex-col justify-between h-full relative shadow-sm hover:shadow-md"
                        >
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button
                                    onClick={(e) => handleDelete(resume.id, e)}
                                    className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all border border-rose-200"
                                    title="Delete"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600 shadow-sm">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="overflow-hidden flex-1">
                                        <h3 className="font-bold text-slate-900 text-sm truncate pr-6 tracking-tight" title={resume.filename}>{resume.filename}</h3>
                                        <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-normal">
                                            <Calendar className="w-3 h-3 text-slate-400" />
                                            {new Date(resume.uploaded_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {resume.analysis_result ? (
                                    <div className="space-y-2 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                                        <div className="flex justify-between items-center text-xs font-semibold">
                                            <span className="text-slate-600">ATS Score</span>
                                            <span className={`text-base font-black font-mono ${resume.ats_score > 70 ? 'text-emerald-700' :
                                                resume.ats_score > 50 ? 'text-amber-700' : 'text-rose-700'
                                                }`}>{Math.round(resume.ats_score)}/100</span>
                                        </div>
                                        <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-700 ${resume.ats_score > 70 ? 'bg-emerald-500' :
                                                    resume.ats_score > 50 ? 'bg-amber-500' : 'bg-rose-500'
                                                    }`}
                                                style={{ width: `${resume.ats_score}%` }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex flex-col items-center justify-center gap-2">
                                        <span className="flex items-center gap-1.5 text-amber-800 text-xs font-semibold">
                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" /> Processing Analysis...
                                        </span>
                                        <button
                                            onClick={async () => {
                                                setRetryingId(resume.id);
                                                try {
                                                    await analyzeResume(resume.id, "");
                                                    await fetchResumes();
                                                } catch (error) {
                                                    console.error("Retry analysis failed", error);
                                                    alert("Analysis retry failed. Please try again shortly.");
                                                } finally {
                                                    setRetryingId(null);
                                                }
                                            }}
                                            disabled={retryingId === resume.id}
                                            className="px-3 py-1 text-[11px] font-semibold rounded-lg bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 disabled:opacity-60 cursor-pointer shadow-xs"
                                        >
                                            {retryingId === resume.id ? "Retrying..." : "Retry Analysis"}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="mt-5 pt-3 border-t border-slate-100 flex gap-2">
                                <button
                                    onClick={() => handleViewAnalysis(resume)}
                                    className="flex-1 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <Eye className="w-3.5 h-3.5" /> View Full Analysis
                                </button>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
                        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100 text-indigo-600">
                            <FileText className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">No resumes uploaded yet</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">Upload your first resume to get actionable feedback and improve your callback rate.</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirmId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setDeleteConfirmId(null)}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden"
                        >
                            <div className="flex flex-col items-center text-center mb-5">
                                <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mb-3 border border-rose-100 text-rose-600">
                                    <Trash2 className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">Delete Resume?</h3>
                                <p className="text-xs text-slate-500">
                                    Are you sure you want to delete this resume and its analysis? All associated data will be permanently removed.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all border border-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ResumeManager;
