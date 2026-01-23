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
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowRight className="w-4 h-4 rotate-180" /> Back to Resumes
                </button>
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">{selectedResume.filename}</h2>
                    <span className="text-sm text-slate-400">Uploaded {new Date(selectedResume.uploaded_at).toLocaleDateString()}</span>
                </div>
                {selectedResume.analysis_result ? (
                    <ResultsDashboard
                        data={selectedResume.analysis_result}
                        resumeId={selectedResume.id}
                        jobDescription={selectedResume.job_description || ""}
                    />
                ) : (
                    <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                        <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                        <p className="text-slate-400">Analysis in progress or not found...</p>
                        {/* Add Analyze Button here if needed */}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Resume Management</h2>
                <button
                    onClick={() => setShowUploadPanel(!showUploadPanel)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-all"
                >
                    <Upload className="w-4 h-4" />
                    {showUploadPanel ? "Cancel Upload" : "Upload New Resume"}
                </button>
            </div>

            <AnimatePresence>
                {showUploadPanel && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 mb-8">
                            <UploadSection
                                onUpload={async (file) => {
                                    setIsProcessing(true);
                                    try {
                                        // 1. Upload
                                        const uploadResp = await uploadResume(file, userId);

                                        // 2. Auto-analyze (default empty JD for general analysis)
                                        await analyzeResume(uploadResp.resume_id, "");

                                        // 3. Success & Refresh
                                        setUploadSuccess(true);
                                        await fetchResumes();
                                        setTimeout(() => {
                                            setUploadSuccess(false);
                                            setIsProcessing(false);
                                            setShowUploadPanel(false);
                                        }, 1500);
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
            <div className="flex items-center gap-4 bg-slate-800/50 p-2 rounded-xl border border-slate-700/50">
                <Search className="w-5 h-5 text-slate-500 ml-2" />
                <input
                    type="text"
                    placeholder="Search resumes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-white w-full placeholder:text-slate-500"
                />
            </div>

            {/* Resume List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-40 bg-slate-800/50 rounded-2xl animate-pulse" />
                    ))
                ) : filteredResumes.length > 0 ? (
                    filteredResumes.map((resume) => (
                        <motion.div
                            layout
                            key={resume.id}
                            className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-primary/50 rounded-2xl p-5 transition-all flex flex-col justify-between h-full relative"
                        >
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button
                                    onClick={(e) => handleDelete(resume.id, e)}
                                    className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="font-semibold text-white truncate pr-8" title={resume.filename}>{resume.filename}</h3>
                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(resume.uploaded_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {resume.analysis_result ? (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-400">ATS Score</span>
                                            <span className={`font-bold ${resume.ats_score > 70 ? 'text-green-400' :
                                                resume.ats_score > 50 ? 'text-yellow-400' : 'text-red-400'
                                                }`}>{resume.ats_score}%</span>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-1.5">
                                            <div
                                                className={`h-1.5 rounded-full ${resume.ats_score > 70 ? 'bg-green-500' :
                                                    resume.ats_score > 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${resume.ats_score}%` }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-medium">
                                        <Loader2 className="w-3 h-3 animate-spin" /> Processing
                                    </span>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-700/50 flex gap-3">
                                <button
                                    onClick={() => handleViewAnalysis(resume)}
                                    className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <Eye className="w-4 h-4" /> View Analysis
                                </button>
                                {/* <button className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors">
                                    <RefreshCw className="w-4 h-4" />
                                </button> */}
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 text-slate-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No resumes found. Upload one to get started.</p>
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
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        >
                            {/* Modal */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                                        <Trash2 className="w-6 h-6 text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Delete Resume?</h3>
                                        <p className="text-sm text-slate-400">This action cannot be undone</p>
                                    </div>
                                </div>

                                <p className="text-slate-300 mb-6">
                                    Are you sure you want to delete this resume and its analysis? All associated data will be permanently removed.
                                </p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setDeleteConfirmId(null)}
                                        className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 font-medium"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
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
