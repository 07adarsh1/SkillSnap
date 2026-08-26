import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, FileText, X, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';
import { BrandLogo } from '@/components/ui/BrandLogo';
import UploadSection from './UploadSection';
import GuestPreviewCard from './landing/GuestPreviewCard';
import { runGuestScan } from '../services/api';

const LandingPage = ({ onStart, isAuthenticated, userName, onLogout, onDemo }) => {
    const [showScanModal, setShowScanModal] = useState(false);
    const [scanState, setScanState] = useState('idle'); // 'idle' | 'scanning' | 'preview' | 'error'
    const [previewData, setPreviewData] = useState(null);
    const [scanError, setScanError] = useState('');

    const handleOpenScanner = () => {
        if (isAuthenticated) {
            onStart?.();
            return;
        }
        setShowScanModal(true);
        if (scanState === 'idle') {
            setScanError('');
        }
    };

    const handleRunGuestScan = async (file, jobDescription) => {
        setScanState('scanning');
        setScanError('');
        try {
            const response = await runGuestScan(file, jobDescription);
            if (response?.scanId) {
                // Save ONLY guestScanId in localStorage
                localStorage.setItem('guestScanId', response.scanId);
                setPreviewData(response.preview);
                setScanState('preview');
            } else {
                throw new Error('Invalid response received from scan service.');
            }
        } catch (err) {
            console.error('Guest scan failed:', err);
            const msg = err.response?.data?.detail || err.message || 'Failed to scan resume. Please try again.';
            setScanError(msg);
            setScanState('error');
        }
    };

    const handleUnlockFullReport = () => {
        setShowScanModal(false);
        onStart?.();
    };

    const handleResetScan = () => {
        setScanState('idle');
        setPreviewData(null);
        setScanError('');
    };

    return (
        <div className="h-screen max-h-screen overflow-hidden bg-[#F8FAFC] text-slate-900 selection:bg-indigo-500/20 flex flex-col justify-between select-none">
            {/* Frosted Modern Navbar */}
            <header className="shrink-0 z-30 bg-white/70 backdrop-blur-md border-b border-slate-200/60 transition-all h-14 sm:h-16 flex items-center">
                <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center w-full">
                    <BrandLogo size="md" />
                    <div className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                <span className="text-xs sm:text-sm font-medium text-slate-600 hidden sm:inline">
                                    {userName || 'Signed in'}
                                </span>
                                <button
                                    onClick={onLogout}
                                    className="px-3.5 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium border border-slate-200/80 transition-all cursor-pointer"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onStart}
                                className="px-4 py-1.5 sm:px-5 sm:py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center w-full px-4 overflow-hidden">
                <HeroGeometric
                    className="h-full flex flex-col items-center justify-center py-0"
                    badge="Next-Gen AI Resume & ATS Intelligence"
                    title1="Craft the Perfect Resume"
                    title2="in Seconds"
                    subtitle="Stop guessing what recruiters want. Run a free instant ATS scan with sentence embeddings and cosine similarity against top industry benchmarks."
                    actions={(
                        <div className="flex flex-col sm:flex-row items-center gap-3.5">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleOpenScanner}
                                className="group px-6 py-3 sm:px-8 sm:py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs sm:text-sm md:text-base shadow-[0_10px_30px_-5px_rgba(79,70,229,0.4)] flex items-center gap-2.5 transition-all cursor-pointer"
                            >
                                <Sparkles className="w-4 h-4 text-indigo-200 group-hover:rotate-12 transition-transform" />
                                <span>Analyze Your Resume for Free</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </div>
                    )}
                />
            </main>

            {/* Value Highlights Strip - Blended Glassmorphism without obscuring hero */}
            <footer className="shrink-0 relative z-20 pb-3 sm:pb-5 px-4 sm:px-6 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-4xl mx-auto">
                    <div className="p-3 rounded-2xl bg-white/40 hover:bg-white/70 backdrop-blur-md border border-slate-200/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 transition-all flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50/80 border border-indigo-100/60 flex items-center justify-center text-indigo-600 shrink-0">
                            <Zap className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-xs font-bold text-slate-900 truncate">Sub-Second ATS Scoring</h3>
                            <p className="text-[10.5px] text-slate-500 line-clamp-1">
                                Strict rubric scoring with section coverage and format checks.
                            </p>
                        </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/40 hover:bg-white/70 backdrop-blur-md border border-slate-200/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 transition-all flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50/80 border border-emerald-100/60 flex items-center justify-center text-emerald-600 shrink-0">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-xs font-bold text-slate-900 truncate">Semantic Cosine Matching</h3>
                            <p className="text-[10.5px] text-slate-500 line-clamp-1">
                                Dense sentence-transformer embeddings test relevance.
                            </p>
                        </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/40 hover:bg-white/70 backdrop-blur-md border border-slate-200/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 transition-all flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-violet-50/80 border border-violet-100/60 flex items-center justify-center text-violet-600 shrink-0">
                            <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-xs font-bold text-slate-900 truncate">AI Bullet Rewriter</h3>
                            <p className="text-[10.5px] text-slate-500 line-clamp-1">
                                Groq LPU inference transforms weak bullets into impact points.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Guest Free ATS Scanner Modal */}
            <AnimatePresence>
                {showScanModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="shrink-0 flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                                            Free Guest ATS Scan
                                        </h3>
                                        <p className="text-[11px] text-slate-500">
                                            No login required to scan. Get your instant score.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowScanModal(false)}
                                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-5 sm:p-6 overflow-y-auto flex-1">
                                {scanState === 'scanning' ? (
                                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                                        <div className="relative">
                                            <div className="w-14 h-14 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 animate-pulse">
                                                <Loader2 className="w-7 h-7 animate-spin" />
                                            </div>
                                            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-ping" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm sm:text-base font-bold text-slate-900">
                                                Evaluating Your Resume...
                                            </h4>
                                            <p className="text-xs text-slate-500 max-w-sm mt-1">
                                                Running NLP sentence embeddings, rubric parsing, and keyword matching.
                                            </p>
                                        </div>
                                    </div>
                                ) : scanState === 'preview' && previewData ? (
                                    <GuestPreviewCard
                                        previewData={previewData}
                                        onUnlock={handleUnlockFullReport}
                                        onResetScan={handleResetScan}
                                    />
                                ) : (
                                    <div className="space-y-4">
                                        {scanError && (
                                            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                                                <div>
                                                    <p className="font-semibold">{scanError}</p>
                                                    <p className="text-[11px] mt-0.5 text-rose-600/80">Please check your file format and try again.</p>
                                                </div>
                                            </div>
                                        )}

                                        <UploadSection
                                            onUpload={handleRunGuestScan}
                                            isUploading={scanState === 'scanning'}
                                            uploadSuccess={false}
                                        />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LandingPage;
