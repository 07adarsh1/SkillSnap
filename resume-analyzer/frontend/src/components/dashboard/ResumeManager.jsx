import React, { useState, useEffect } from 'react';
import { Upload, FileText, Trash2, Calendar, Search, Loader2, ArrowRight, RefreshCw, Eye } from 'lucide-react';
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

    const fetchResumes = async () => {
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
    };

    useEffect(() => {
        fetchResumes();
    }, [userId]);

    const handleUploadComplete = (newResumeData) => {
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
        setIsUploading(false);
        fetchResumes(); // Refresh list
    };

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
                    className="flex items-center gap-2 text-slate-300 hover:text-primary transition-all hover:shadow-[0_0_15px_rgba(0,210,255,0.3)] bg-white/5 py-2 px-4 rounded-xl border border-white/5 hover:border-primary/30 w-fit"
                >
                    <ArrowRight className="w-4 h-4 rotate-180" /> Back to Resumes
                </button>
                <div className="flex items-center justify-between bg-[#121318]/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold text-white tracking-tight">{selectedResume.filename}</h2>
                    <span className="text-sm font-medium text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
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
                    <div className="text-center py-20 bg-[#121318]/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg">
                        <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4 drop-shadow-[0_0_10px_rgba(0,210,255,0.8)]" />
                        <p className="text-slate-400">Analysis in progress or not found...</p>
                    </div>
                )}
            </div>
        );
    }

    return (
            <div className="space-y-8 text-white">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-black/45 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg gap-4">
                <h2 className="text-2xl font-bold text-white tracking-tight">Resume Management</h2>
                <button
                    onClick={() => setShowUploadPanel(!showUploadPanel)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-slate-900 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(0,210,255,0.3)] hover:shadow-[0_0_25px_rgba(0,210,255,0.5)] hover:-translate-y-0.5"
                >
                    <Upload className="w-5 h-5" />
                    {showUploadPanel ? "Cancel Upload" : "Upload New Resume"}
                </button>
            </div>

            <AnimatePresence>
                {showUploadPanel && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-black/45 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                            <UploadSection
                                onUpload={async (file) => {
                                    setIsProcessing(true);
                                    try {
                                        // 1. Upload
                                        const uploadResp = await uploadResume(file, userId);

                                        // 2. Show success immediately after upload.
                                        setUploadSuccess(true);
                                        await fetchResumes();

                                        // 3. Run analysis in background so rate limits don't block UI.
                                        analyzeResume(uploadResp.resume_id, "")
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

            {/* Search & Filter */}
            <div className="flex items-center gap-4 bg-[#121318]/60 backdrop-blur-xl p-3 rounded-xl border border-white/5 focus-within:border-primary/30 focus-within:shadow-[0_0_20px_rgba(0,210,255,0.1)] transition-all shadow-lg">
                <Search className="w-5 h-5 text-slate-400 ml-2" />
                <input
                    type="text"
                    placeholder="Search resumes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-white w-full placeholder:text-slate-500 outline-none text-base"
                />
            </div>

            {/* Resume List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-[#121318]/60 border border-white/5 backdrop-blur-md rounded-2xl animate-pulse shadow-lg" />
                    ))
                ) : filteredResumes.length > 0 ? (
                    filteredResumes.map((resume) => (
                        <motion.div
                            layout
                            key={resume.id}
                            className="group bg-[#121318]/60 backdrop-blur-xl hover:bg-[#121318]/80 border border-white/10 hover:border-primary/40 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between h-full relative hover:shadow-[0_0_30px_rgba(0,210,255,0.15)]"
                        >
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button
                                    onClick={(e) => handleDelete(resume.id, e)}
                                    className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20 hover:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div>
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[inset_0_0_10px_rgba(59,130,246,0.2)]">
                                        <FileText className="w-6 h-6 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                    </div>
                                    <div className="overflow-hidden flex-1">
                                        <h3 className="font-bold text-white text-lg truncate pr-8 tracking-tight" title={resume.filename}>{resume.filename}</h3>
                                        <span className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                            {new Date(resume.uploaded_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {resume.analysis_result ? (
                                    <div className="space-y-2.5 bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div className="flex justify-between items-center text-sm font-medium">
                                            <span className="text-slate-300">ATS Score</span>
                                            <span className={`text-lg font-bold drop-shadow-md ${resume.ats_score > 70 ? 'text-green-400' :
                                                resume.ats_score > 50 ? 'text-yellow-400' : 'text-red-400'
                                                }`}>{Math.round(resume.ats_score)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden shadow-inner">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(currentColor,0.5)] ${resume.ats_score > 70 ? 'bg-green-500' :
                                                    resume.ats_score > 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${resume.ats_score}%` }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-yellow-500/5 border border-yellow-500/20 p-4 rounded-xl flex flex-col items-center justify-center gap-3">
                                        <span className="flex items-center gap-2 text-yellow-400 text-sm font-semibold">
                                            <Loader2 className="w-4 h-4 animate-spin drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" /> Processing Analysis...
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
                                            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/10 disabled:opacity-60"
                                        >
                                            {retryingId === resume.id ? "Retrying..." : "Retry Analysis"}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-white/10 flex gap-3">
                                <button
                                    onClick={() => handleViewAnalysis(resume)}
                                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/40 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(0,210,255,0.2)] group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30"
                                >
                                    <Eye className="w-4 h-4" /> View Full Analysis
                                </button>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-24 bg-[#121318]/40 backdrop-blur-md rounded-2xl border border-white/5 border-dashed">
                        <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
                            <FileText className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(0,210,255,0.4)]" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No resumes found</h3>
                        <p className="text-slate-400 max-w-sm mx-auto">Upload your first resume to get actionable feedback and improve your callback rate.</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirmId && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDeleteConfirmId(null)}
                            className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        >
                            {/* Modal */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-[#121318]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
                                <div className="flex flex-col items-center text-center mb-6">
                                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20 shadow-[inset_0_0_15px_rgba(239,68,68,0.2)]">
                                        <Trash2 className="w-8 h-8 text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Delete Resume?</h3>
                                    <p className="text-slate-400">
                                        Are you sure you want to delete this resume and its analysis? All associated data will be <span className="text-red-400 font-medium">permanently removed</span>.
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setDeleteConfirmId(null)}
                                        className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10 font-medium hover:border-white/20"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="flex-1 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 rounded-xl transition-all flex items-center justify-center gap-2 border border-red-500/30 hover:border-red-500 font-bold hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Forever
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ResumeManager;
