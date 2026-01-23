import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import UserDashboard from './components/UserDashboard';
import DashboardLayout from './components/layout/DashboardLayout';
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/clerk-react";
import ResultsDashboard from './components/ResultsDashboard';
import JobMatcher from './components/dashboard/JobMatcher';
import VersionControl from './components/dashboard/VersionControl';
import CareerPathGenerator from './components/dashboard/CareerPathGenerator';
import ResumeOptimizer from './components/dashboard/ResumeOptimizer';

function App() {
    const [demoMode, setDemoMode] = useState(false);
    const [demoResults, setDemoResults] = useState(null);

    // Initialize from localStorage
    const [showDashboard, setShowDashboard] = useState(() => {
        const saved = localStorage.getItem("showDashboard");
        return saved !== null ? JSON.parse(saved) : true;
    });

    // Update localStorage
    React.useEffect(() => {
        localStorage.setItem("showDashboard", JSON.stringify(showDashboard));
    }, [showDashboard]);

    const clerk = useClerk();
    const { user } = useUser();

    const handleDemo = () => {
        setDemoResults({
            ats_score: 92.5,
            matched_skills: ["Python", "React", "AWS", "Machine Learning", "Docker", "FastAPI"],
            missing_skills: ["Kubernetes", "GraphQL"],
            experience_match: "Strong",
            ai_suggestions: [
                "Quantify the impact of your 'AI Resume Architect' project with user growth metrics.",
                "Mention the specific AWS services used (e.g., Lambda, S3) in your cloud project.",
                "Add a 'Certifications' section to validate your cloud expertise."
            ]
        });
        setDemoMode(true);
    };

    const handleExitDemo = () => {
        setDemoMode(false);
        setDemoResults(null);
    };

    // Shared Dashboard Wrapper for Demo
    // Shared Dashboard Wrapper for Demo
    const DemoView = () => {
        const [activeTab, setActiveTab] = useState('overview');

        // Mock Demo User
        const demoUser = { fullName: 'Demo Guest', id: 'demo-user' };

        const renderContent = () => {
            switch (activeTab) {
                case 'overview':
                    return <ResultsDashboard
                        data={demoResults}
                        resumeId="demo-resume-id"
                        jobDescription="Seeking a Senior Full Stack Engineer with expertise in Python, React, and AWS."
                    />;
                case 'resumes':
                    return <ResultsDashboard
                        data={demoResults}
                        resumeId="demo-resume-id"
                        jobDescription="Seeking a Senior Full Stack Engineer with expertise in Python, React, and AWS."
                    />;
                case 'jobs':
                    return <JobMatcher />;
                case 'history':
                    return <VersionControl resumeId="demo-resume-id" />;
                case 'career-path':
                    return <CareerPathGenerator />;
                case 'optimizer':
                    return <ResumeOptimizer resumeId="demo-resume-id" onClose={() => setActiveTab('overview')} />;
                case 'analytics':
                    // Just reusing ResultsDashboard pie chart logic or keep placeholder if Analytics component is complex
                    // Actually let's use ResultsDashboard for simplicity in Demo
                    return <ResultsDashboard data={demoResults} resumeId="demo-resume-id" />;
                default:
                    return <ResultsDashboard data={demoResults} />;
            }
        };

        return (
            <DashboardLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={handleExitDemo}
                user={demoUser}
            >
                {renderContent()}
            </DashboardLayout>
        );
    };

    return (
        <>
            {/* Demo Mode Override */}
            {demoMode ? (
                <DemoView />
            ) : (
                <>
                    <SignedOut>
                        <LandingPage onStart={() => clerk.openSignIn()} onDemo={handleDemo} />
                    </SignedOut>

                    <SignedIn>
                        {showDashboard ? (
                            <UserDashboard
                                user={user}
                                onClose={() => {
                                    setShowDashboard(false);
                                    clerk.signOut();
                                }}
                            />
                        ) : (
                            <LandingPage onStart={() => setShowDashboard(true)} onDemo={handleDemo} />
                        )}
                    </SignedIn>
                </>
            )}
        </>
    );
}

export default App;
