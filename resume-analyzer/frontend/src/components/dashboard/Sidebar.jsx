import React from 'react';
import { LayoutDashboard, FileText, Briefcase, BarChart2, Settings, LogOut } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'resumes', label: 'My Resumes', icon: FileText },
        { id: 'jobs', label: 'Job Matcher', icon: Briefcase },
        { id: 'analytics', label: 'Analytics', icon: BarChart2 },
        { id: 'career-path', label: 'Career Path', icon: Settings },
    ];

    return (
        <aside className="w-64 bg-white/95 backdrop-blur-xl border-r border-slate-200/80 flex flex-col h-screen fixed left-0 top-0 z-20 hidden md:flex">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                <BrandLogo size="md" />
            </div>

            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${isActive
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-sm font-semibold'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all font-medium text-sm"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
