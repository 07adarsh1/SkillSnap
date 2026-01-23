import React from 'react';
import { motion } from 'framer-motion';
import { Bot, FileCheck, Search, Zap, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const LandingPage = ({ onStart, onDemo }) => {
    return (
        <div className="min-h-screen bg-dark text-white selection:bg-primary/30 flex flex-col">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] left-[30%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
            </div>

            {/* Navbar Placeholder */}
            <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <Bot className="text-primary" />
                    <span>AI Resume Architect</span>
                </div>
                <div className="flex items-center gap-4">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="px-5 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium border border-slate-700 transition-all cursor-pointer">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-4 mt-12 mb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-8 backdrop-blur-sm">
                        <SparklesIcon className="w-4 h-4 text-yellow-400 animate-pulse" />
                        <span className="text-sm text-slate-300">Powered by Advanced NLP & AI</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                        Craft the Perfect Resume <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-primary to-purple-400">
                            in Seconds
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Stop guessing what recruiters want. Our AI analyzes your resume against industry standards to increase your interview chances by 3x.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onStart}
                            className="group relative px-8 py-4 bg-primary hover:bg-primary/90 rounded-full text-white font-semibold text-lg shadow-lg shadow-primary/25 transition-all flex items-center gap-2"
                        >
                            Analyze My Resume Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>

                        <button
                            onClick={onDemo}
                            className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 rounded-full text-white font-semibold text-lg border border-slate-700 transition-all"
                        >
                            View Demo
                        </button>
                    </div>
                </motion.div>

                {/* Feature Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl mx-auto w-full px-4"
                >
                    <FeatureCard
                        icon={<FileCheck className="w-8 h-8 text-green-400" />}
                        title="ATS Optimization"
                        desc="Ensure your resume parses correctly. We identify formatting errors that automatic systems hate."
                    />
                    <FeatureCard
                        icon={<Search className="w-8 h-8 text-blue-400" />}
                        title="Skill Gap Analysis"
                        desc="Instantly see which key skills you are missing tailored to your target job role."
                    />
                    <FeatureCard
                        icon={<Zap className="w-8 h-8 text-yellow-400" />}
                        title="AI Actionable Feedback"
                        desc="Get specific, sentence-level suggestions to improve impact and readability."
                    />
                </motion.div>

                {/* Trust Badges / Stats */}
                <div className="mt-24 border-t border-slate-800 w-full max-w-5xl pt-12 flex justify-center gap-12 flex-wrap text-slate-500 grayscale opacity-70">
                    <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Secure & Private</div>
                    <div className="flex items-center gap-2"><Cpu className="w-5 h-5" /> Local Processing Available</div>
                    <div className="flex items-center gap-2"> 100% Free for Developers</div>
                </div>
            </main>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm hover:border-slate-700 hover:bg-slate-800/40 transition-all group">
        <div className="mb-4 p-3 bg-slate-800/50 rounded-lg inline-block group-hover:bg-slate-800 transition-colors">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed">
            {desc}
        </p>
    </div>
);

const SparklesIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
)

export default LandingPage;
