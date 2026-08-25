import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, FileText } from 'lucide-react';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';
import { BrandLogo } from '@/components/ui/BrandLogo';

const LandingPage = ({ onStart, isAuthenticated, userName, onLogout }) => {
    return (
        <div className="h-screen max-h-screen overflow-hidden bg-[#F8FAFC] text-slate-900 selection:bg-indigo-500/20 flex flex-col justify-between">
            {/* Frosted Modern Navbar */}
            <header className="shrink-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all h-16 flex items-center">
                <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center w-full">
                    <BrandLogo size="md" />
                    <div className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                <span className="text-xs sm:text-sm font-medium text-slate-600 hidden sm:inline">{userName || 'Signed in'}</span>
                                <button
                                    onClick={onLogout}
                                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium border border-slate-200 transition-all cursor-pointer"
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
            <main className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center w-full px-4 py-2">
                <HeroGeometric
                    className="h-full flex flex-col items-center justify-center py-0"
                    badge="Next-Gen AI Resume & ATS Intelligence"
                    title1="Craft the Perfect Resume"
                    title2="in Seconds"
                    subtitle="Stop guessing what recruiters want. Our AI analyzes your resume with sentence embeddings and cosine similarity against top industry benchmarks to maximize your interview rate."
                    actions={(
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onStart}
                            className="group px-6 py-3 sm:px-8 sm:py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm sm:text-base shadow-[0_10px_30px_-5px_rgba(79,70,229,0.4)] flex items-center gap-2.5 transition-all cursor-pointer"
                        >
                            <span>Analyze My Resume Free</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    )}
                />
            </main>

            {/* Value Highlights Cards Strip */}
            <footer className="shrink-0 relative z-20 pb-4 sm:pb-6 px-4 sm:px-6 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto">
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xs hover:-translate-y-0.5 transition-all flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                            <Zap className="w-4.5 h-4.5" />
                        </div>
                        <div>
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-0.5">Sub-Second ATS Scoring</h3>
                            <p className="text-[11px] text-slate-500 leading-snug">
                                Strict rubric scoring with section coverage and formatting checks.
                            </p>
                        </div>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xs hover:-translate-y-0.5 transition-all flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                            <ShieldCheck className="w-4.5 h-4.5" />
                        </div>
                        <div>
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-0.5">Semantic Cosine Matching</h3>
                            <p className="text-[11px] text-slate-500 leading-snug">
                                Dense sentence-transformer embeddings test contextual relevance.
                            </p>
                        </div>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xs hover:-translate-y-0.5 transition-all flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 shrink-0">
                            <FileText className="w-4.5 h-4.5" />
                        </div>
                        <div>
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-0.5">AI Bullet Rewriter</h3>
                            <p className="text-[11px] text-slate-500 leading-snug">
                                Groq LPU inference transforms weak bullets into high-impact statements.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
