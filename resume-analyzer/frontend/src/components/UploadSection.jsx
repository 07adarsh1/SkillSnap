import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const UploadSection = ({ onUpload, isUploading, uploadSuccess }) => {
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles?.length > 0) {
            onUpload(acceptedFiles[0]);
        }
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        multiple: false
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto"
        >
            <div
                {...getRootProps()}
                className={`
          relative border-2 border-dashed rounded-3xl p-10 cursor-pointer transition-all duration-500
          flex flex-col items-center justify-center gap-4
          ${isDragActive ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(0,210,255,0.2)]' : 'border-white/20 bg-[#121318]/60 backdrop-blur-xl hover:border-primary/50 hover:bg-[#1e1f25]/80 hover:shadow-[0_0_20px_rgba(0,210,255,0.15)]'}
          ${uploadSuccess ? 'border-green-500 bg-green-500/10 shadow-[0_0_30px_rgba(34,197,94,0.2)]' : ''}
        `}
            >
                <input {...getInputProps()} />

                {isUploading ? (
                    <div className="flex flex-col items-center gap-2 text-primary">
                        <Loader2 className="w-12 h-12 animate-spin drop-shadow-[0_0_10px_rgba(0,210,255,0.8)]" />
                        <p className="font-medium animate-pulse text-primary tracking-wide">Parsing Resume...</p>
                    </div>
                ) : uploadSuccess ? (
                    <div className="flex flex-col items-center gap-2 text-green-400">
                        <CheckCircle className="w-12 h-12 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                        <p className="font-medium tracking-wide">Resume Uploaded Successfully!</p>
                    </div>
                ) : (
                    <>
                        <div className="p-5 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl border border-white/5 shadow-[0_0_15px_rgba(0,210,255,0.1)] group-hover:shadow-[0_0_25px_rgba(0,210,255,0.3)] transition-all">
                            <UploadCloud className="w-10 h-10 text-primary drop-shadow-[0_0_8px_rgba(0,210,255,0.5)]" />
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-semibold text-white tracking-wide">
                                {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
                            </p>
                            <p className="text-sm text-slate-400 mt-2 font-light">
                                PDF or DOCX (Max 5MB)
                            </p>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default UploadSection;
