import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import UserDashboard from './components/UserDashboard';
import DashboardLayout from './components/layout/DashboardLayout';
import ResultsDashboard from './components/ResultsDashboard';
import JobMatcher from './components/dashboard/JobMatcher';
import VersionControl from './components/dashboard/VersionControl';
import CareerPathGenerator from './components/dashboard/CareerPathGenerator';
import ResumeOptimizer from './components/dashboard/ResumeOptimizer';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, loginWithEmail, loginWithGoogle, logoutUser, signupWithEmail } from './services/firebase';

function App() {
    const [demoMode, setDemoMode] = useState(false);
    const [demoResults, setDemoResults] = useState(null);
    const [firebaseUser, setFirebaseUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [showAuthPage, setShowAuthPage] = useState(false);
    const [authActionLoading, setAuthActionLoading] = useState(false);

    // Initialize from localStorage
    const [showDashboard, setShowDashboard] = useState(() => {
        const saved = localStorage.getItem("showDashboard");
        return saved !== null ? JSON.parse(saved) : true;
    });

    // Update localStorage
    React.useEffect(() => {
        localStorage.setItem("showDashboard", JSON.stringify(showDashboard));
    }, [showDashboard]);

    React.useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            setFirebaseUser(user);
            setAuthLoading(false);
        });
        return () => unsub();
    }, []);

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

    const handleSignIn = async () => {
        setAuthActionLoading(true);
        try {
            await loginWithGoogle();
            setShowDashboard(true);
            setShowAuthPage(false);
        } catch (error) {
            console.error('Firebase sign-in failed', error);
            throw error;
        } finally {
            setAuthActionLoading(false);
        }
    };

    const handleEmailLogin = async (email, password) => {
        setAuthActionLoading(true);
        try {
            await loginWithEmail(email, password);
            setShowDashboard(true);
            setShowAuthPage(false);
        } finally {
            setAuthActionLoading(false);
        }
    };

    const handleEmailSignup = async (name, email, password) => {
        setAuthActionLoading(true);
        try {
            await signupWithEmail(name, email, password);
            setShowDashboard(true);
            setShowAuthPage(false);
        } finally {
            setAuthActionLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error('Firebase sign-out failed', error);
        } finally {
            setShowDashboard(false);
        }
    };

    const user = firebaseUser
        ? {
            id: firebaseUser.uid,
            fullName: firebaseUser.displayName || firebaseUser.email || 'User',
            photoURL: firebaseUser.photoURL || '',
        }
        : null;

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
            <div className="neural-bg">
                <div className="neural-blob-1"></div>
                <div className="neural-blob-2"></div>
            </div>
            {/* Demo Mode Override */}
            {demoMode ? (
                <DemoView />
            ) : authLoading ? (
                <div className="min-h-screen flex items-center justify-center text-slate-300">Loading authentication...</div>
            ) : (
                <>
                    {!firebaseUser ? (
                        showAuthPage ? (
                            <AuthPage
                                onBack={() => setShowAuthPage(false)}
                                onGoogleSignIn={handleSignIn}
                                onEmailLogin={handleEmailLogin}
                                onEmailSignup={handleEmailSignup}
                                isLoading={authActionLoading}
                            />
                        ) : (
                            <LandingPage onStart={() => setShowAuthPage(true)} onDemo={handleDemo} />
                        )
                    ) : showDashboard ? (
                        <UserDashboard
                            user={user}
                            onClose={handleSignOut}
                        />
                    ) : (
                        <LandingPage
                            onStart={() => setShowDashboard(true)}
                            onDemo={handleDemo}
                            isAuthenticated={true}
                            userName={user?.fullName}
                            onLogout={handleSignOut}
                        />
                    )}
                </>
            )}
        </>
    );
}

export default App;
