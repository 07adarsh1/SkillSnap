import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bot, Mail, Lock, UserRound } from 'lucide-react';

const mapAuthError = (err, isGoogle = false) => {
    const code = err?.code || '';

    if (code === 'auth/configuration-not-found') {
        return isGoogle
            ? 'Google auth is not configured in Firebase. Enable Google provider in Firebase Console.'
            : 'Email/password auth is not configured in Firebase. Enable Email/Password provider in Firebase Console.';
    }

    if (code === 'auth/operation-not-allowed') {
        return 'This sign-in method is disabled in Firebase Console.';
    }

    if (code === 'auth/unauthorized-domain') {
        return 'Current domain is not authorized. Add localhost/127.0.0.1 in Firebase Auth -> Settings -> Authorized domains.';
    }

    if (code === 'auth/invalid-api-key') {
        return 'Firebase API key is invalid for this project.';
    }

    if (code === 'auth/popup-closed-by-user') {
        return 'Google sign-in popup was closed before completion.';
    }

    return code ? code.replace('auth/', '').replace(/-/g, ' ') : 'Authentication failed.';
};

const AuthPage = ({ onBack, onGoogleSignIn, onEmailLogin, onEmailSignup, isLoading }) => {
    const [mode, setMode] = useState('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Email and password are required.');
            return;
        }

        if (mode === 'signup') {
            if (!name.trim()) {
                setError('Name is required for sign up.');
                return;
            }
            if (password.length < 6) {
                setError('Password must be at least 6 characters.');
                return;
            }
            if (password !== confirmPassword) {
                setError('Passwords do not match.');
                return;
            }
        }

        try {
            if (mode === 'login') {
                await onEmailLogin(email, password);
            } else {
                await onEmailSignup(name.trim(), email, password);
            }
        } catch (err) {
            setError(mapAuthError(err));
        }
    };

    const handleGoogleAuth = async () => {
        setError('');
        try {
            await onGoogleSignIn();
        } catch (err) {
            setError(mapAuthError(err, true));
        }
    };

    return (
        <div className="min-h-screen bg-transparent text-white selection:bg-primary/30 flex items-center justify-center px-4 py-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md rounded-3xl border border-white/10 bg-[#121318]/70 backdrop-blur-xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
            >
                <button
                    onClick={onBack}
                    className="inline-flex items-center gap-2 text-slate-300 hover:text-white text-sm mb-6"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <div className="flex items-center gap-2 font-bold text-xl tracking-tight mb-6">
                    <div className="p-2 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-lg">
                        <Bot className="text-white w-5 h-5" />
                    </div>
                    <span>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl border border-white/10 mb-6">
                    <button
                        onClick={() => setMode('login')}
                        className={`py-2 rounded-lg text-sm font-semibold transition ${mode === 'login' ? 'bg-primary text-slate-900' : 'text-slate-300 hover:bg-white/5'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setMode('signup')}
                        className={`py-2 rounded-lg text-sm font-semibold transition ${mode === 'signup' ? 'bg-primary text-slate-900' : 'text-slate-300 hover:bg-white/5'}`}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'signup' && (
                        <div className="relative">
                            <UserRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                            <input
                                type="text"
                                placeholder="Full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-primary/50"
                            />
                        </div>
                    )}

                    <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-primary/50"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-primary/50"
                        />
                    </div>

                    {mode === 'signup' && (
                        <div className="relative">
                            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                            <input
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-primary/50"
                            />
                        </div>
                    )}

                    {error && (
                        <p className="text-red-400 text-sm capitalize">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2.5 rounded-xl bg-primary text-slate-900 font-bold hover:bg-primary/90 disabled:opacity-60"
                    >
                        {isLoading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
                    </button>
                </form>

                <div className="relative my-5">
                    <div className="h-px bg-white/10" />
                    <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 text-xs bg-[#121318] px-2 text-slate-500">OR</span>
                </div>

                <button
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-medium disabled:opacity-60"
                >
                    Continue with Google
                </button>
            </motion.div>
        </div>
    );
};

export default AuthPage;
