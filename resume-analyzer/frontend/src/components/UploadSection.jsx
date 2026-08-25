import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, CheckCircle, Loader2, Sparkles, X, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UploadSection = ({ onUpload, isUploading, uploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [showJdInput, setShowJdInput] = useState(false);

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles?.length > 0) {
            setSelectedFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        multiple: false
    });

    const handleStartAnalysis = (e) => {
        e?.stopPropagation?.();
        if (!selectedFile) return;
        onUpload(selectedFile, jobDescription.trim());
    };

    const handleRemoveFile = (e) => {
        e.stopPropagation();
        setSelectedFile(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto space-y-4"
        >
            {/* File Dropzone / File Selected Card */}
            {!selectedFile ? (
                <div
                    {...getRootProps()}
                    className={`
                        relative border-2 border-dashed rounded-3xl p-8 sm:p-10 cursor-pointer transition-all duration-300
                        flex flex-col items-center justify-center gap-4 text-center
                        ${isDragActive
                            ? 'border-indigo-500 bg-indigo-50/70 shadow-[0_10px_30px_rgba(79,70,229,0.12)]'
                            : 'border-slate-300/90 bg-white hover:border-indigo-400 hover:bg-indigo-50/20 hover:shadow-[0_10px_30px_rgba(79,70,229,0.06)]'
                        }
                    `}
                >
                    <input {...getInputProps()} />

                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600 shadow-sm transition-all">
                        <UploadCloud className="w-9 h-9" />
                    </div>
                    <div>
                        <p className="text-lg font-bold text-slate-900 tracking-tight">
                            {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            Supports PDF or DOCX format (Max 10MB)
                        </p>
                    </div>
                </div>
            ) : (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-bold text-slate-900 truncate text-sm">{selectedFile.name}</p>
                                <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB • Ready for evaluation</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleRemoveFile}
                            disabled={isUploading}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            title="Remove file"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Optional Job Description Box */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm transition-all">
                <button
                    type="button"
                    onClick={() => setShowJdInput(!showJdInput)}
                    className="w-full flex items-center justify-between text-left text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span>Target Job Description <span className="text-slate-400 font-normal">(Optional for Semantic Cosine Match)</span></span>
                    </div>
                    {showJdInput ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                <AnimatePresence>
                    {showJdInput && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mt-3 pt-3 border-t border-slate-100 space-y-2"
                        >
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the target job description or role requirements here to calculate semantic cosine distance and missing skills..."
                                rows={4}
                                disabled={isUploading}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-all"
                            />
                            <p className="text-[11px] text-slate-500">
                                If left blank, the system performs a general ATS structure & health audit.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Analyze Action Button (When file is selected) */}
            {selectedFile && (
                <motion.button
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleStartAnalysis}
                    disabled={isUploading}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm shadow-[0_8px_25px_-4px_rgba(79,70,229,0.35)] flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Computing Embeddings & Rubric...</span>
                        </>
                    ) : uploadSuccess ? (
                        <>
                            <CheckCircle className="w-4 h-4 text-emerald-300" />
                            <span>Analysis Complete!</span>
                        </>
                    ) : (
                        <>
                            <span>Analyze Resume {jobDescription.trim() ? 'Against Job Requirements' : '(General Audit)'}</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </motion.button>
            )}
        </motion.div>
    );
};

export default UploadSection;
