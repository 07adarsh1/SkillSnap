import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, Menu, Search, X } from 'lucide-react';
import { getUserAnalysisHistory } from '../../services/api';
import { BrandLogo } from '../ui/BrandLogo';

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
        { id: 'jobs', label: 'Job Matcher' },
        { id: 'career-path', label: 'Career Path' },
        { id: 'history', label: 'History' },
        { id: 'analytics', label: 'Analytics' },
    ];

    // Initialize Light Mode
    useEffect(() => {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }, []);

    const notificationStorageKey = user?.id ? `skillsnap:lastReadNotif:${user.id}` : null;
    const dismissedStorageKey = user?.id ? `skillsnap:dismissedNotif:${user.id}` : null;

    const toTimestamp = (value) => {
        const timestamp = new Date(value || 0).getTime();
        return Number.isFinite(timestamp) ? timestamp : 0;
    };

    const persistReadState = useCallback((timestamp) => {
        const safeTimestamp = Number.isFinite(timestamp) ? timestamp : Date.now();
        setLastReadAt(safeTimestamp);
        if (notificationStorageKey) {
            localStorage.setItem(notificationStorageKey, String(safeTimestamp));
        }
    }, [notificationStorageKey]);

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

    const resolveTabFromQuery = (rawQuery) => {
        const normalized = rawQuery.trim().toLowerCase();
        if (!normalized) return null;

        const aliases = {
            overview: 'overview',
            dash: 'overview',
            dashboard: 'overview',
            resume: 'resumes',
            resumes: 'resumes',
            job: 'jobs',
            jobs: 'jobs',
            career: 'career-path',
            path: 'career-path',
            history: 'history',
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

    const loadNotifications = useCallback(async ({ markAsRead = false } = {}) => {
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
    }, [user?.id, dismissedNotificationIds, lastReadAt, persistReadState]);

    useEffect(() => {
        if (user?.id) {
            loadNotifications();
        }
    }, [user?.id, loadNotifications]);

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
        <div className="min-h-screen text-slate-900 font-sans relative z-10 px-4 md:px-8 py-6">
            <header className="relative z-40 max-w-7xl mx-auto mb-8 rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05),0_10px_30px_-4px_rgba(79,70,229,0.04)]">
                <div className="min-h-16 px-4 sm:px-5 md:px-6 py-2 flex items-center justify-between gap-3 sm:gap-4">
                    <BrandLogo
                        size="md"
                        onClick={() => setActiveTab('overview')}
                    />

                    <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/60">
                        {navItems.map((item) => {
                            const isActive = item.id === activeTab;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive
                                        ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/60'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'}`}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-3">
                        <div className="hidden lg:flex items-center px-3.5 py-2 bg-slate-100/70 border border-slate-200/70 rounded-xl text-sm w-64 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all group">
                            <Search className="w-4 h-4 text-slate-400 mr-2 group-focus-within:text-indigo-600 transition-colors" />
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
                                placeholder="Search tabs..."
                                className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 outline-none text-xs"
                            />
                        </div>
                        <div ref={notificationRef} className="relative">
                            <button
                                onClick={handleBellClick}
                                className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/80 rounded-xl relative transition-all border border-slate-200/60"
                            >
                                <Bell className="w-4 h-4" />
                                {hasUnread && (
                                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold bg-rose-600 text-white rounded-full shadow-sm">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>
                            {isNotifOpen && (
                                <div className="absolute right-0 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xl z-30">
                                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                                        <div className="text-sm font-bold text-slate-900">Notifications</div>
                                        {notifications.length > 0 && (
                                            <button
                                                onClick={clearNotifications}
                                                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                                            >
                                                Clear all
                                            </button>
                                        )}
                                    </div>
                                    {loadingNotifications ? (
                                        <div className="text-xs text-slate-500 py-3 text-center">Loading notifications...</div>
                                    ) : notifications.length === 0 ? (
                                        <div className="text-xs text-slate-500 py-3 text-center">No notifications yet.</div>
                                    ) : (
                                        <div className="space-y-2 max-h-72 overflow-auto custom-scrollbar pr-1">
                                            {notifications.map((item) => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => {
                                                        setActiveTab('history');
                                                        setIsNotifOpen(false);
                                                    }}
                                                    className="w-full text-left rounded-xl p-3 bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 hover:border-indigo-100 transition-all"
                                                >
                                                    <div className="text-xs font-semibold text-slate-900 flex items-center justify-between gap-2">
                                                        <span>{item.title}</span>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.status === 'ready' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-slate-500 truncate mt-1">{item.detail}</div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={onLogout}
                            className="hidden sm:inline-flex px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-medium transition-all"
                        >
                            Logout
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsMobileNavOpen((prev) => !prev)}
                            className="md:hidden p-2.5 text-slate-700 hover:text-slate-900 bg-slate-100 rounded-xl border border-slate-200"
                            aria-label="Toggle navigation"
                        >
                            {isMobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                {isMobileNavOpen && (
                    <div className="md:hidden px-5 pb-4 space-y-3 border-t border-slate-100">
                        <div className="grid grid-cols-2 gap-2 pt-3">
                            {navItems.map((item) => {
                                const isActive = item.id === activeTab;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-all ${isActive
                                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                            : 'text-slate-600 bg-slate-50 border border-slate-200/60 hover:bg-slate-100'}`}
                                    >
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex items-center px-3 py-2 bg-slate-100 rounded-xl text-xs border border-slate-200">
                            <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
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
                                placeholder="Search tabs..."
                                className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 outline-none"
                            />
                        </div>
                    </div>
                )}
                {searchError && (
                    <div className="px-5 md:px-6 pb-3 text-xs text-amber-600 font-medium">{searchError}</div>
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
