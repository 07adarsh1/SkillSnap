import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import UserDashboard from './components/UserDashboard';
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/clerk-react";
import ResultsDashboard from './components/ResultsDashboard'; // Keeping for Demo Mode only

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
    const DemoView = () => (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <button onClick={handleExitDemo} className="mb-8 text-slate-400 hover:text-white">
                    ← Back to Home
                </button>
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-primary to-purple-400">
                        Demo Analysis Result
                    </h1>
                </div>
                <ResultsDashboard data={demoResults} />
            </div>
        </div>
    );

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
