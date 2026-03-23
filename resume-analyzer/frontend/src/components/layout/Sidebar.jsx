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
                "bg-[#121318]/60 backdrop-blur-xl border-r border-white/10 flex flex-col h-screen fixed left-0 top-0 z-20 transition-all duration-300 overflow-hidden",
                collapsed ? "w-20" : "w-64"
            )}
        >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                {!collapsed && (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="font-bold text-white text-lg tracking-tight">
                            SkillSnap
                        </h1>
                    </div>
                )}
                {collapsed && (
                    <div className="mx-auto w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                        <span className="font-bold text-white">SS</span>
                    </div>
                )}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={cn(
                        "p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors",
                        collapsed && "absolute -right-3 top-6 bg-[#121318] border border-white/10 rounded-full shadow-lg"
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
                                    ? "bg-primary/20 text-primary shadow-[0_0_15px_rgba(0,210,255,0.15)] border border-primary/30"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                            )}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon className={cn("w-5 h-5 min-w-[20px]", isActive ? "text-primary" : "text-slate-400 group-hover:text-white transition-colors")} />

                            {!collapsed && (
                                <span className={cn("truncate transition-colors", isActive ? "text-primary" : "text-slate-400 group-hover:text-white")}>
                                    {item.label}
                                </span>
                            )}

                            {/* Tooltip for collapsed state */}
                            {collapsed && (
                                <div className="absolute left-full ml-4 px-3 py-1.5 bg-[#121318]/90 backdrop-blur-md text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50 border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                                    {item.label}
                                </div>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-white/10">
                <button
                    onClick={onLogout}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all font-medium group border border-transparent hover:border-red-500/20",
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
