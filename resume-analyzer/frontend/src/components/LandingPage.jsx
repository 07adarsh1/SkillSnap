import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';

const LandingPage = ({ onStart, isAuthenticated, userName, onLogout }) => {
    return (
        <div className="min-h-screen overflow-x-hidden bg-transparent text-white selection:bg-primary/30 flex flex-col">
            {/* Navbar Placeholder */}
            <nav className="absolute top-0 left-0 right-0 z-20 container mx-auto px-4 sm:px-6 py-5 sm:py-6 flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <span>Skill Snap</span>
                </div>
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <span className="text-sm text-slate-300 hidden sm:inline">{userName || 'Signed in'}</span>
                            <button
                                onClick={onLogout}
                                className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 transition-all cursor-pointer backdrop-blur-sm"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onStart}
                            className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 transition-all cursor-pointer backdrop-blur-sm"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex-1 w-full">
                <HeroGeometric
                    badge=""
                    title1="Craft the Perfect Resume"
                    title2="in Seconds"
                    subtitle="Stop guessing what recruiters want. Our AI analyzes your resume against top industry standards to increase your interview chances by 3x."
                    actions={(
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onStart}
                            className="group btn-gradient flex items-center gap-2 text-lg"
                        >
                            Analyze My Resume Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    )}
                />
            </main>
        </div>
    );
};

export default LandingPage;
