import React, { useState } from 'react';
import Sidebar from './dashboard/Sidebar';
import Overview from './dashboard/Overview';
import ResumeManager from './dashboard/ResumeManager';
import JobMatcher from './dashboard/JobMatcher';
import Analytics from './dashboard/Analytics';
import CareerPathGenerator from './dashboard/CareerPathGenerator';
import { Menu, X } from 'lucide-react';
import { UserButton } from "@clerk/clerk-react";

const UserDashboard = ({ user, onClose }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <Overview onUploadClick={() => setActiveTab('resumes')} />;
            case 'resumes':
                return <ResumeManager userId={user?.id} />;
            case 'jobs':
                return <JobMatcher />;
            case 'analytics':
                return <Analytics userId={user?.id} />;
            case 'career-path':
                return <CareerPathGenerator />;
            default:
                return <Overview />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-primary/30 flex">

            {/* Desktop Sidebar */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onClose} />

            {/* Mobile Header */}
            <div className="fixed top-0 left-0 w-full z-30 bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center md:hidden">
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-400">
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                    <span className="font-bold text-lg">Resume Architect</span>
                </div>
                <UserButton afterSignOutUrl="/" />
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="w-64 bg-slate-900 h-full p-4 pt-20" onClick={e => e.stopPropagation()}>
                        <div className="space-y-4">
                            {['overview', 'resumes', 'jobs', 'analytics', 'career-path'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => { setActiveTab(tab); setIsMobileMenuOpen(false); }}
                                    className={`block w-full text-left px-4 py-3 rounded-xl capitalize ${activeTab === tab ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                                >
                                    {tab.replace('-', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 min-h-screen overflow-x-hidden">
                {/* Header for Desktop */}
                <div className="hidden md:flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-white capitalize">{activeTab.replace('-', ' ')}</h1>
                    <div className="flex items-center gap-4">
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </div>

                {renderContent()}
            </main>
        </div>
    );
};

export default UserDashboard;
