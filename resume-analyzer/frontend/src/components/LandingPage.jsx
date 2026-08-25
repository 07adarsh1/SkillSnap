import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, FileText } from 'lucide-react';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';
import { BrandLogo } from '@/components/ui/BrandLogo';

const LandingPage = ({ onStart, isAuthenticated, userName, onLogout }) => {
    return (
        <div className="min-h-screen overflow-x-hidden bg-[#F8FAFC] text-slate-900 selection:bg-indigo-500/20 flex flex-col">
            {/* Frosted Modern Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all">
                <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                    <BrandLogo size="md" />
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <span className="text-sm font-medium text-slate-600 hidden sm:inline">{userName || 'Signed in'}</span>
                                <button
                                    onClick={onLogout}
                                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium border border-slate-200 transition-all cursor-pointer"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onStart}
                                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex-1 w-full pt-16">
                <HeroGeometric
                    badge="Next-Gen AI Resume & ATS Intelligence"
                    title1="Craft the Perfect Resume"
                    title2="in Seconds"
                    subtitle="Stop guessing what recruiters want. Our AI analyzes your resume with sentence embeddings and cosine similarity against top industry benchmarks to maximize your interview rate."
                    actions={(
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onStart}
                            className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-lg shadow-[0_10px_30px_-5px_rgba(79,70,229,0.4)] flex items-center gap-3 transition-all cursor-pointer"
                        >
                            <span>Analyze My Resume Free</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    )}
                />

                {/* Value Highlights Cards */}
                <div className="container mx-auto px-4 sm:px-6 pb-20 -mt-10 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Sub-Second ATS Scoring</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Strict rubric scoring with section coverage, action verbs, and formatting checks.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Semantic Cosine Matching</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Dense sentence-transformer embeddings test contextual relevance beyond exact keywords.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 mb-4">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">AI Bullet Point Rewriter</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Powered by Groq LPU inference to transform weak bullets into high-impact STAR statements.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
