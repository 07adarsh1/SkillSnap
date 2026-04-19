import React, { useState, useEffect, useRef } from 'react';
import { Bell, Menu, Search, X } from 'lucide-react';
import { getUserAnalysisHistory } from '../../services/api';

const DashboardLayout = ({ children, activeTab, setActiveTab, onLogout, user }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchError, setSearchError] = useState('');
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [lastReadAt, setLastReadAt] = useState(0);
    const [dismissedNotificationIds, setDismissedNotificationIds] = useState([]);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const notificationRef = useRef(null);

    const navItems = [
        { id: 'overview', label: 'Dashboard' },
        { id: 'resumes', label: 'Resumes' },
        { id: 'jobs', label: 'Jobs' },
        { id: 'career-path', label: 'Career Path' },
        { id: 'history', label: 'History' },
        { id: 'analytics', label: 'Analytics' },
    ];

    // Force Dark Mode
    useEffect(() => {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }, []);

    const notificationStorageKey = user?.id ? `skillsnap:lastReadNotif:${user.id}` : null;
    const dismissedStorageKey = user?.id ? `skillsnap:dismissedNotif:${user.id}` : null;

    const toTimestamp = (value) => {
        const timestamp = new Date(value || 0).getTime();
        return Number.isFinite(timestamp) ? timestamp : 0;
    };

    const persistReadState = (timestamp) => {
        const safeTimestamp = Number.isFinite(timestamp) ? timestamp : Date.now();
        setLastReadAt(safeTimestamp);
        if (notificationStorageKey) {
            localStorage.setItem(notificationStorageKey, String(safeTimestamp));
        }
    };

    useEffect(() => {
        if (!notificationStorageKey) {
            setLastReadAt(0);
            setUnreadCount(0);
            return;
        }

        const saved = Number(localStorage.getItem(notificationStorageKey) || 0);
        setLastReadAt(Number.isFinite(saved) ? saved : 0);
    }, [notificationStorageKey]);

    useEffect(() => {
        if (!dismissedStorageKey) {
            setDismissedNotificationIds([]);
            return;
        }

        try {
            const saved = JSON.parse(localStorage.getItem(dismissedStorageKey) || '[]');
            setDismissedNotificationIds(Array.isArray(saved) ? saved : []);
        } catch {
            setDismissedNotificationIds([]);
        }
    }, [dismissedStorageKey]);

    const resolveTabFromQuery = (query) => {
        const normalized = query.trim().toLowerCase();
        if (!normalized) return null;

        const aliases = {
            dashboard: 'overview',
            overview: 'overview',
            resume: 'resumes',
            resumes: 'resumes',
            upload: 'resumes',
            job: 'jobs',
            jobs: 'jobs',
            career: 'career-path',
            path: 'career-path',
            history: 'history',
            analytics: 'analytics',
        };

        if (aliases[normalized]) {
            return aliases[normalized];
        }

        const matchingItem = navItems.find((item) => item.label.toLowerCase().includes(normalized));
        return matchingItem ? matchingItem.id : null;
    };

    const handleSearchSubmit = () => {
        const targetTab = resolveTabFromQuery(searchQuery);
        if (!targetTab) {
            setSearchError('No matching section found');
            return;
        }

        setSearchError('');
        setActiveTab(targetTab);
    };

    const loadNotifications = async ({ markAsRead = false } = {}) => {
        if (!user?.id) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        setLoadingNotifications(true);
        try {
            const history = await getUserAnalysisHistory(user.id);
            const sortedHistory = [...(history || [])].sort(
                (a, b) => toTimestamp(b.uploaded_at) - toTimestamp(a.uploaded_at)
            );

            const visibleHistory = sortedHistory.filter((item) => !dismissedNotificationIds.includes(item.id));

            const topItems = visibleHistory.slice(0, 5).map((item) => ({
                id: item.id,
                title: item.analysis_result ? 'Analysis completed' : 'Analysis pending',
                detail: item.filename,
                time: item.uploaded_at,
                status: item.analysis_result ? 'ready' : 'pending',
            }));

            const nextUnread = visibleHistory.filter(
                (item) => toTimestamp(item.uploaded_at) > lastReadAt
            ).length;

            setNotifications(topItems);
            setUnreadCount(nextUnread);

            if (markAsRead && visibleHistory.length > 0) {
                const newestTimestamp = toTimestamp(visibleHistory[0].uploaded_at);
                persistReadState(newestTimestamp);
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Failed to load notifications', error);
            setNotifications([]);
            setUnreadCount(0);
        } finally {
            setLoadingNotifications(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            loadNotifications();
        }
    }, [user?.id, lastReadAt, dismissedNotificationIds]);

    const clearNotifications = () => {
        const idsToDismiss = notifications.map((item) => item.id);
        const mergedIds = Array.from(new Set([...dismissedNotificationIds, ...idsToDismiss]));

        if (dismissedStorageKey) {
            localStorage.setItem(dismissedStorageKey, JSON.stringify(mergedIds));
        }

        setDismissedNotificationIds(mergedIds);
        setNotifications([]);
        setUnreadCount(0);
        persistReadState(Date.now());
    };

    const handleBellClick = async () => {
        const nextOpen = !isNotifOpen;
        setIsNotifOpen(nextOpen);
        if (nextOpen) {
            await loadNotifications({ markAsRead: true });
        }
    };

    const hasUnread = unreadCount > 0;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!isNotifOpen) return;
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotifOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isNotifOpen]);

    useEffect(() => {
        setIsMobileNavOpen(false);
    }, [activeTab]);

    return (
        <div className="min-h-screen text-white font-sans relative z-10 px-4 md:px-8 py-6">
            <header className="relative z-40 max-w-7xl mx-auto mb-8 rounded-2xl border border-white/10 bg-[rgba(5,5,5,0.92)] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55)]">
                <div className="min-h-16 px-4 sm:px-5 md:px-6 py-2 flex items-center justify-between gap-3 sm:gap-4">
                    <button
                        type="button"
                        onClick={() => setActiveTab('overview')}
                        className="font-bold text-lg sm:text-xl tracking-tight text-white hover:text-slate-100 transition-colors"
                    >
                        SkillSnap
                    </button>

                    <nav className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => {
                            const isActive = item.id === activeTab;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`px-4 py-2 rounded-xl text-sm transition-all ${isActive
                                        ? 'bg-white/12 text-white shadow-[0_0_24px_rgba(255,255,255,0.12)]'
                                        : 'text-slate-300 hover:text-white hover:bg-white/8'}`}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-3">
                        <div className="hidden lg:flex items-center px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm w-64 focus-within:border-primary/50 transition-all group">
                            <Search className="w-4 h-4 text-slate-400 mr-2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(event) => {
                                    setSearchQuery(event.target.value);
                                    if (searchError) {
                                        setSearchError('');
                                    }
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        handleSearchSubmit();
                                    }
                                }}
                                placeholder="Search sections..."
                                className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 outline-none"
                            />
                        </div>
                        <div ref={notificationRef} className="relative">
                        <button
                            onClick={handleBellClick}
                            className="p-3 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl relative transition-all border border-transparent hover:border-white/10"
                        >
                            <Bell className="w-5 h-5" />
                            {hasUnread && (
                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold bg-slate-200 text-slate-900 rounded-full border border-[#0b0f16]">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>
                            {isNotifOpen && (
                                <div className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-white/10 bg-[#0e1118] p-3 shadow-2xl z-30">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-sm font-semibold text-white">Notifications</div>
                                        {notifications.length > 0 && (
                                            <button
                                                onClick={clearNotifications}
                                                className="text-xs sm:text-sm text-slate-400 hover:text-white min-h-9 px-2"
                                            >
                                                Clear all
                                            </button>
                                        )}
                                    </div>
                                    {loadingNotifications ? (
                                        <div className="text-sm text-slate-400 py-3">Loading...</div>
                                    ) : notifications.length === 0 ? (
                                        <div className="text-sm text-slate-400 py-3">No notifications yet.</div>
                                    ) : (
                                        <div className="space-y-2 max-h-72 overflow-auto custom-scrollbar pr-1">
                                            {notifications.map((item) => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => {
                                                        setActiveTab('history');
                                                        setIsNotifOpen(false);
                                                    }}
                                                    className="w-full text-left rounded-lg p-3 hover:bg-white/5 transition-colors"
                                                >
                                                    <div className="text-sm text-white flex items-center justify-between gap-3">
                                                        <span>{item.title}</span>
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.status === 'ready' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-slate-400 truncate">{item.detail}</div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={onLogout}
                            className="hidden sm:inline-flex min-h-11 px-4 py-2 rounded-xl border border-white/15 text-slate-200 hover:bg-white/10"
                        >
                            Logout
                        </button>
                        <button
                            onClick={onLogout}
                            className="sm:hidden inline-flex min-h-11 px-3 py-2 rounded-xl border border-white/15 text-slate-200 hover:bg-white/10 text-sm"
                        >
                            Exit
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsMobileNavOpen((prev) => !prev)}
                            className="md:hidden p-3 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10"
                            aria-label="Toggle navigation"
                        >
                            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
                {isMobileNavOpen && (
                    <div className="md:hidden px-5 pb-4 space-y-3 border-t border-white/10">
                        <div className="grid grid-cols-2 gap-2 pt-3">
                            {navItems.map((item) => {
                                const isActive = item.id === activeTab;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`px-3 py-2.5 rounded-lg text-sm text-left transition-all ${isActive
                                            ? 'bg-white/12 text-white border border-white/20'
                                            : 'text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10'}`}
                                    >
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex items-center px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus-within:border-primary/50 transition-all">
                            <Search className="w-4 h-4 text-slate-400 mr-2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(event) => {
                                    setSearchQuery(event.target.value);
                                    if (searchError) {
                                        setSearchError('');
                                    }
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        handleSearchSubmit();
                                    }
                                }}
                                placeholder="Search sections..."
                                className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 outline-none"
                            />
                        </div>
                    </div>
                )}
                {searchError && (
                    <div className="px-5 md:px-6 pb-3 text-xs text-yellow-400">{searchError}</div>
                )}
            </header>

            <main className="max-w-7xl mx-auto overflow-x-hidden">
                <div className="space-y-8 animate-fade-in">
                    {children}
                </div>
            </main>

        </div>
    );
};

export default DashboardLayout;
