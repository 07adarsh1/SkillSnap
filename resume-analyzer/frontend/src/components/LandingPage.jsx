import React from 'react';
import { motion } from 'framer-motion';
import { Bot, FileCheck, Search, Zap, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const LandingPage = ({ onStart, onDemo }) => {
    return (
        <div className="min-h-screen bg-dark text-white selection:bg-primary/30 flex flex-col">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-float" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[40%] left-[30%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '4s' }} />
            </div>

            {/* Navbar Placeholder */}
            <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="p-2 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg">
                        <Bot className="text-white w-6 h-6" />
                    </div>
                    <span>AI Resume Architect</span>
                </div>
                <div className="flex items-center gap-4">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="px-5 py-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 text-white text-sm font-medium border border-slate-700 transition-all cursor-pointer backdrop-blur-sm">
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-8 backdrop-blur-md shadow-xl">
                        <SparklesIcon className="w-4 h-4 text-yellow-400 animate-pulse" />
                        <span className="text-sm text-slate-300">Powered by Advanced Google Gemini 1.5 Pro</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                        Craft the Perfect Resume <br />
                        <span className="text-gradient">
                            in Seconds
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        Stop guessing what recruiters want. Our AI analyzes your resume against top industry standards to increase your interview chances by <span className="text-green-400 font-bold">3x</span>.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onStart}
                            className="group btn-gradient flex items-center gap-2 text-lg"
                        >
                            Analyze My Resume Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>

                        <button
                            onClick={onDemo}
                            className="px-8 py-3.5 bg-slate-800/40 hover:bg-slate-800/60 rounded-xl text-white font-medium text-lg border border-slate-700 transition-all backdrop-blur-sm"
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
                <div className="mt-24 border-t border-white/5 w-full max-w-5xl pt-12 flex justify-center gap-12 flex-wrap text-slate-500">
                    <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Secure & Private</div>
                    <div className="flex items-center gap-2"><Cpu className="w-5 h-5" /> Local Processing Available</div>
                    <div className="flex items-center gap-2"> 100% Free for Developers</div>
                </div>
            </main>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="glass-card glass-card-hover p-6 rounded-2xl group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10">
            <div className="mb-4 p-3 bg-slate-800/50 rounded-xl inline-block group-hover:bg-slate-800 transition-colors border border-white/5">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                {desc}
            </p>
        </div>
    </div>
);

const SparklesIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
)

export default LandingPage;
