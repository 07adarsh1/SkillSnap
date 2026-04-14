import React, { useState, useEffect } from 'react';
import { Bell, Search } from 'lucide-react';

const DashboardLayout = ({ children, activeTab, setActiveTab, onLogout, user }) => {
    const navItems = [
        { id: 'overview', label: 'Dashboard' },
        { id: 'resumes', label: 'Resumes' },
        { id: 'jobs', label: 'Jobs' },
        { id: 'career-path', label: 'Career Path' },
        { id: 'history', label: 'History' },
        { id: 'analytics', label: 'Analytics' },
    ];

    // Force Dark Mode
    useEffect(() => {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }, []);

    return (
        <div className="min-h-screen text-white font-sans relative z-10 px-4 md:px-8 py-6">
            <header className="max-w-7xl mx-auto mb-8 rounded-2xl border border-white/10 bg-[rgba(5,5,5,0.92)] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55)]">
                <div className="h-16 px-5 md:px-6 flex items-center justify-between gap-4">
                    <div className="font-bold text-xl tracking-tight text-white">Streakify</div>

                    <nav className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => {
                            const isActive = item.id === activeTab;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`px-4 py-2 rounded-xl text-sm transition-all ${isActive
                                        ? 'bg-white/12 text-white shadow-[0_0_24px_rgba(255,255,255,0.12)]'
                                        : 'text-slate-300 hover:text-white hover:bg-white/8'}`}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-3">
                        <button className="hidden lg:flex items-center px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm w-56 focus-within:border-primary/50 transition-all group">
                            <Search className="w-4 h-4 text-slate-400 mr-2" />
                            <span className="text-slate-500">Search...</span>
                        </button>
                        <button className="p-2.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl relative transition-all border border-transparent hover:border-white/10">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-slate-300 rounded-full border border-[#0b0f16]"></span>
                        </button>
                        <button
                            onClick={onLogout}
                            className="px-4 py-2 rounded-xl border border-white/15 text-slate-200 hover:bg-white/10"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto overflow-x-hidden">
                <div className="space-y-8 animate-fade-in">
                    {children}
                </div>
            </main>

            <div className="fixed bottom-4 right-4 hidden md:flex items-center gap-3 rounded-full border border-white/10 bg-[rgba(5,5,5,0.9)] backdrop-blur-xl px-3 py-2">
                {user?.photoURL ? (
                    <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                        {(user?.fullName || 'U').charAt(0).toUpperCase()}
                    </div>
                )}
                <span className="text-sm text-slate-300">{user?.fullName || 'Demo User'}</span>
            </div>
        </div>
    );
};

export default DashboardLayout;
