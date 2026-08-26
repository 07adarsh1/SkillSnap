import React, { useState, useEffect, useCallback } from 'react';
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
import { auth, loginWithEmail, loginWithGoogle, logoutUser, resetPasswordEmail, signupWithEmail } from './services/firebase';
import { claimScan, getScanReport } from './services/api';
import { Loader2, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
    const [demoMode, setDemoMode] = useState(false);
    const [demoResults, setDemoResults] = useState(null);
    const [firebaseUser, setFirebaseUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [showAuthPage, setShowAuthPage] = useState(false);
    const [authActionLoading, setAuthActionLoading] = useState(false);

    // Guest scan claiming states
    const [restoringScan, setRestoringScan] = useState(false);
    const [restoredScanResult, setRestoredScanResult] = useState(null);
    const [claimError, setClaimError] = useState(null);

    // Initialize from localStorage
    const [showDashboard, setShowDashboard] = useState(() => {
        const saved = localStorage.getItem("showDashboard");
        return saved !== null ? JSON.parse(saved) : true;
    });

    // Update localStorage
    useEffect(() => {
        localStorage.setItem("showDashboard", JSON.stringify(showDashboard));
    }, [showDashboard]);

    // Handle guest scan claiming upon authentication
    const processGuestScanClaim = useCallback(async () => {
        const guestScanId = localStorage.getItem("guestScanId");
        if (!guestScanId) return;

        setRestoringScan(true);
        setClaimError(null);

        try {
            // Step 1: Claim scan via backend
            await claimScan(guestScanId);

            // Step 2: Fetch the full scan report
            const fullReport = await getScanReport(guestScanId);

            // Step 3: Populate restored data and switch to dashboard
            setRestoredScanResult(fullReport);
            setShowDashboard(true);
            setShowAuthPage(false);

            // Step 4: ONLY remove from localStorage after successful claim and retrieval
            localStorage.removeItem("guestScanId");
        } catch (err) {
            console.error("Failed to restore guest scan:", err);
            const isExpired = err.response?.status === 410 || err.response?.data?.expired;
            if (isExpired) {
                localStorage.removeItem("guestScanId");
                setClaimError("Your free scan has expired. Please run a new scan.");
            } else {
                // Keep guestScanId in localStorage so the user can retry
                setClaimError(err.response?.data?.detail || "We couldn't restore your scan. Please try again.");
            }
        } finally {
            setRestoringScan(false);
        }
    }, []);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            setFirebaseUser(user);
            setAuthLoading(false);

            if (user) {
                await processGuestScanClaim();
            }
        });
        return () => unsub();
    }, [processGuestScanClaim]);

    const handleDemo = () => {
        setDemoResults({
            ats_score: 92.5,
            matched_skills: ["Python", "React", "AWS", "Machine Learning", "Docker", "FastAPI"],
            missing_skills: ["Kubernetes", "GraphQL"],
            experience_match: "Strong",
            strengths: [
                "Strong alignment with core backend and frontend technologies in the target role.",
                "Clear project-to-skill mapping with relevant cloud and API experience.",
                "Good ATS readability through structured sections and concise bullet points.",
            ],
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
            setRestoredScanResult(null);
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
    const DemoView = () => {
        const [activeTab, setActiveTab] = useState('overview');
        const demoUser = { fullName: 'Demo Guest', id: 'demo-user' };

        const renderContent = () => {
            switch (activeTab) {
                case 'overview':
                case 'resumes':
                    return (
                        <ResultsDashboard
                            data={demoResults}
                            resumeId="demo-resume-id"
                            jobDescription="Seeking a Senior Full Stack Engineer with expertise in Python, React, and AWS."
                        />
                    );
                case 'jobs':
                    return <JobMatcher />;
                case 'history':
                    return <VersionControl resumeId="demo-resume-id" />;
                case 'career-path':
                    return <CareerPathGenerator />;
                case 'optimizer':
                    return <ResumeOptimizer resumeId="demo-resume-id" onClose={() => setActiveTab('overview')} />;
                case 'analytics':
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

            {/* Restoring Scan Loading Overlay */}
            <AnimatePresence>
                {restoringScan && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/75 backdrop-blur-md text-white p-6"
                    >
                        <div className="bg-white text-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto animate-bounce">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                                    Restoring your scan...
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                    Linking your free ATS assessment and loading your full intelligence dashboard.
                                </p>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-indigo-600 pt-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Generating your personalized report...</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Claim Error Toast / Notice */}
            {claimError && (
                <div className="fixed bottom-6 right-6 z-50 max-w-md bg-rose-50 border border-rose-200 rounded-2xl p-4 shadow-xl text-rose-800 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1 text-xs">
                        <p className="font-bold text-slate-900">Scan Restoration Notice</p>
                        <p className="mt-0.5 text-rose-700">{claimError}</p>
                    </div>
                    <button
                        onClick={processGuestScanClaim}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                        <RefreshCw className="w-3 h-3" /> Retry
                    </button>
                    <button
                        onClick={() => setClaimError(null)}
                        className="text-rose-400 hover:text-rose-700 font-bold ml-1 text-sm"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Main Routing Views */}
            {demoMode ? (
                <DemoView />
            ) : authLoading ? (
                <div className="min-h-screen flex items-center justify-center text-slate-600 font-medium text-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-600 mr-2" />
                    Loading application...
                </div>
            ) : (
                <>
                    {!firebaseUser ? (
                        showAuthPage ? (
                            <AuthPage
                                onBack={() => setShowAuthPage(false)}
                                onGoogleSignIn={handleSignIn}
                                onEmailLogin={handleEmailLogin}
                                onEmailSignup={handleEmailSignup}
                                onForgotPassword={resetPasswordEmail}
                                isLoading={authActionLoading}
                            />
                        ) : (
                            <LandingPage
                                onStart={() => setShowAuthPage(true)}
                                onDemo={handleDemo}
                            />
                        )
                    ) : showDashboard ? (
                        <UserDashboard
                            user={user}
                            onClose={handleSignOut}
                            initialScanResult={restoredScanResult}
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
