import React, { useState } from 'react';
import {
    LayoutDashboard,
    FileText,
    Briefcase,
    BarChart2,
    History,
    Target,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    LogOut
} from 'lucide-react';
import { cn } from '../../utils/cn';

const Sidebar = ({ activeTab, setActiveTab, onLogout, collapsed, setCollapsed }) => {
    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'resumes', label: 'Resume Analyzer', icon: FileText },
        { id: 'jobs', label: 'Job Matcher', icon: Briefcase },
        { id: 'optimizer', label: 'Optimizer', icon: Sparkles },
        { id: 'career-path', label: 'Career Path', icon: Target },
        { id: 'history', label: 'History', icon: History },
        { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    ];

    return (
        <aside
            className={cn(
                "bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-20 transition-all duration-300 overflow-hidden",
                collapsed ? "w-20" : "w-64"
            )}
        >
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                {!collapsed && (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="font-bold text-slate-800 dark:text-white text-lg tracking-tight">
                            Resume AI
                        </h1>
                    </div>
                )}
                {collapsed && (
                    <div className="mx-auto w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-white">RA</span>
                    </div>
                )}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={cn(
                        "p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
                        collapsed && "absolute -right-3 top-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-lg"
                    )}
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium group relative",
                                isActive
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                            )}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon className={cn("w-5 h-5 min-w-[20px]", isActive ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white")} />

                            {!collapsed && (
                                <span className="truncate">{item.label}</span>
                            )}

                            {/* Tooltip for collapsed state */}
                            {collapsed && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-slate-700 shadow-xl">
                                    {item.label}
                                </div>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800">
                <button
                    onClick={onLogout}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-500 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-all font-medium group",
                        collapsed && "justify-center"
                    )}
                >
                    <LogOut className="w-5 h-5 min-w-[20px]" />
                    {!collapsed && <span>Sign Out</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
