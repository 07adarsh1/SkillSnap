import React, { useState } from 'react';
import DashboardLayout from './layout/DashboardLayout';
import Overview from './dashboard/Overview';
import ResumeManager from './dashboard/ResumeManager';
import JobMatcher from './dashboard/JobMatcher';
import Analytics from './dashboard/Analytics';
import CareerPathGenerator from './dashboard/CareerPathGenerator';
import ResumeOptimizer from './dashboard/ResumeOptimizer';
import VersionControl from './dashboard/VersionControl';

const UserDashboard = ({ user, onClose }) => {
    const [activeTab, setActiveTab] = useState('overview');

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
            case 'optimizer':
                // Assuming we pass a selected resume ID logic later, for now render empty or default wrapper
                // Or maybe we need a wrapper to select resume first? 
                // Let's render the component. It might need props.
                return <div className="text-center text-slate-400 mt-20">Select a resume from "My Resumes" to optimize.</div>;
            case 'history':
                return <div className="text-center text-slate-400 mt-20">Select a resume from "My Resumes" to view history.</div>;
            default:
                return <Overview />;
        }
    };

    return (
        <DashboardLayout
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={onClose}
            user={user}
        >
            {renderContent()}
        </DashboardLayout>
    );
};

export default UserDashboard;
