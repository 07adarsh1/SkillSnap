import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { UserButton } from "@clerk/clerk-react";
import { Bell, Moon, Sun, Search } from 'lucide-react';
import { cn } from '../../utils/cn';

const DashboardLayout = ({ children, activeTab, setActiveTab, onLogout, user }) => {
    const [collapsed, setCollapsed] = useState(false);

    // Force Dark Mode
    useEffect(() => {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans flex text-slate-900 dark:text-white">
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
                <header className="h-16 px-8 flex items-center justify-between border-b border-white/5 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-10 transition-colors">
                    {/* Breadcrumbs / Page Title */}
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-semibold capitalize text-white">
                            {activeTab.replace('-', ' ')}
                        </h2>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search Bar - Hidden on small screens */}
                        <div className="hidden md:flex items-center px-3 py-1.5 bg-slate-800/50 border border-white/5 rounded-full text-sm w-64 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
                            <Search className="w-4 h-4 text-slate-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Search candidates or jobs..."
                                className="bg-transparent border-none outline-none text-slate-200 placeholder:text-slate-500 w-full"
                            />
                        </div>

                        {/* Notifications */}
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full relative transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
                        </button>

                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

                        {/* User Profile */}
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.fullName || 'Demo User'}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Pro Plan</p>
                            </div>
                            <UserButton afterSignOutUrl="/" />
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
