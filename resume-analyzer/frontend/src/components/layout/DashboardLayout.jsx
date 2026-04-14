import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Bell, Search } from 'lucide-react';
import { cn } from '../../utils/cn';

const DashboardLayout = ({ children, activeTab, setActiveTab, onLogout, user }) => {
    const [collapsed, setCollapsed] = useState(false);

    // Force Dark Mode
    useEffect(() => {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }, []);

    return (
        <div className="min-h-screen text-white font-sans flex relative z-10">
            {/* Sidebar */}
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={onLogout}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            {/* Main Content Wrapper */}
            <div
                className={cn(
                    "flex-1 flex flex-col min-h-screen transition-all duration-300",
                    collapsed ? "ml-20" : "ml-64"
                )}
            >
                {/* Top Navbar */}
                <header className="h-16 px-8 flex items-center justify-between border-b border-white/10 bg-[#121318]/60 backdrop-blur-xl sticky top-0 z-10 transition-colors shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                    {/* Breadcrumbs / Page Title */}
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold tracking-tight capitalize text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                            {activeTab.replace('-', ' ')}
                        </h2>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-6">
                        {/* Search Bar - Hidden on small screens */}
                        <div className="hidden md:flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm w-64 focus-within:border-primary/50 focus-within:shadow-[0_0_15px_rgba(0,210,255,0.15)] focus-within:bg-white/10 transition-all group">
                            <Search className="w-4 h-4 text-slate-400 mr-2 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search candidates or jobs..."
                                className="bg-transparent border-none outline-none text-white placeholder:text-slate-500 w-full"
                            />
                        </div>

                        {/* Notifications */}
                        <button className="p-2.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl relative transition-all border border-transparent hover:border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] border border-[#121318]"></span>
                        </button>

                        <div className="h-8 w-px bg-white/10 mx-1"></div>

                        {/* User Profile */}
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-semibold text-white">{user?.fullName || 'Demo User'}</p>
                                <p className="text-xs text-primary/80 font-medium">Pro Plan</p>
                            </div>
                            <div className="ring-2 ring-white/10 rounded-full p-0.5 hover:ring-primary/50 transition-all hover:shadow-[0_0_15px_rgba(0,210,255,0.3)]">
                                {user?.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt="User"
                                        className="w-9 h-9 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                                        {(user?.fullName || 'U').charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
