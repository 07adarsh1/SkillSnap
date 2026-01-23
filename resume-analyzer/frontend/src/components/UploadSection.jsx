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
          relative border-2 border-dashed rounded-xl p-10 cursor-pointer transition-all duration-300
          flex flex-col items-center justify-center gap-4
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-slate-600 hover:border-primary/50 hover:bg-slate-800/50'}
          ${uploadSuccess ? 'border-green-500 bg-green-500/10' : ''}
        `}
            >
                <input {...getInputProps()} />

                {isUploading ? (
                    <div className="flex flex-col items-center gap-2 text-primary">
                        <Loader2 className="w-12 h-12 animate-spin" />
                        <p className="font-medium animate-pulse">Parsing Resume...</p>
                    </div>
                ) : uploadSuccess ? (
                    <div className="flex flex-col items-center gap-2 text-green-400">
                        <CheckCircle className="w-12 h-12" />
                        <p className="font-medium">Resume Uploaded Successfully!</p>
                    </div>
                ) : (
                    <>
                        <div className="p-4 bg-slate-800 rounded-full">
                            <UploadCloud className="w-8 h-8 text-primary" />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-medium text-slate-200">
                                {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
                            </p>
                            <p className="text-sm text-slate-400 mt-1">
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
