/**
 * Application-wide constants
 * Centralized configuration for easy maintenance
 */

// API Configuration
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3
};

// Feature Flags
export const FEATURES = {
    RESUME_OPTIMIZER: true,
    INTERVIEW_PREP: true,
    EXPLAINABLE_AI: true,
    VERSION_CONTROL: true,
    QUALITY_CHECK: true,
    CAREER_PATH: true,
    JOB_MATCHER: true
};

// Score Thresholds
export const SCORE_THRESHOLDS = {
    EXCELLENT: 90,
    GOOD: 75,
    AVERAGE: 60,
    POOR: 40
};

// Color Schemes
export const COLORS = {
    primary: {
        light: '#60a5fa',
        DEFAULT: '#3b82f6',
        dark: '#2563eb'
    },
    success: {
        light: '#4ade80',
        DEFAULT: '#22c55e',
        dark: '#16a34a'
    },
    warning: {
        light: '#fbbf24',
        DEFAULT: '#f59e0b',
        dark: '#d97706'
    },
    danger: {
        light: '#f87171',
        DEFAULT: '#ef4444',
        dark: '#dc2626'
    },
    info: {
        light: '#38bdf8',
        DEFAULT: '#0ea5e9',
        dark: '#0284c7'
    }
};

// Severity Levels
export const SEVERITY_LEVELS = {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
};

// Priority Levels
export const PRIORITY_LEVELS = {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
};

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard'
};

// Question Categories
export const QUESTION_CATEGORIES = {
    TECHNICAL: 'technical',
    BEHAVIORAL: 'behavioral',
    SITUATIONAL: 'situational'
};

// File Upload Limits
export const UPLOAD_LIMITS = {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
    ],
    ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx', '.txt']
};

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
};

// Animation Durations (milliseconds)
export const ANIMATION = {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
};

// Toast Durations (milliseconds)
export const TOAST_DURATION = {
    SHORT: 2000,
    NORMAL: 3000,
    LONG: 5000
};

// Local Storage Keys
export const STORAGE_KEYS = {
    USER_PREFERENCES: 'user_preferences',
    RECENT_RESUMES: 'recent_resumes',
    THEME: 'theme',
    LANGUAGE: 'language'
};

// Routes
export const ROUTES = {
    HOME: '/',
    DASHBOARD: '/dashboard',
    UPLOAD: '/upload',
    ANALYZE: '/analyze',
    HISTORY: '/history',
    SETTINGS: '/settings'
};

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    FILE_TOO_LARGE: 'File size exceeds the maximum limit.',
    INVALID_FILE_TYPE: 'Invalid file type. Please upload a supported format.',
    GENERIC_ERROR: 'An error occurred. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
    UPLOAD_SUCCESS: 'Resume uploaded successfully!',
    ANALYSIS_COMPLETE: 'Analysis completed successfully!',
    OPTIMIZATION_COMPLETE: 'Resume optimization completed!',
    SAVE_SUCCESS: 'Changes saved successfully!',
    DELETE_SUCCESS: 'Deleted successfully!',
    COPY_SUCCESS: 'Copied to clipboard!'
};

// Validation Rules
export const VALIDATION = {
    MIN_RESUME_LENGTH: 100,
    MAX_RESUME_LENGTH: 50000,
    MIN_JOB_DESC_LENGTH: 50,
    MAX_JOB_DESC_LENGTH: 10000,
    MIN_COMPANY_NAME_LENGTH: 2,
    MAX_COMPANY_NAME_LENGTH: 100
};

// Feature Icons (Lucide React icon names)
export const FEATURE_ICONS = {
    RESUME_OPTIMIZER: 'Sparkles',
    INTERVIEW_PREP: 'Brain',
    EXPLAINABLE_AI: 'HelpCircle',
    VERSION_CONTROL: 'GitBranch',
    QUALITY_CHECK: 'Shield',
    CAREER_PATH: 'Target',
    JOB_MATCHER: 'Briefcase'
};

// Chart Configuration
export const CHART_CONFIG = {
    COLORS: {
        primary: '#3b82f6',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444'
    },
    GRID_COLOR: '#334155',
    TEXT_COLOR: '#94a3b8'
};

// Regex Patterns
export const REGEX = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^[\d\s\-\+\(\)]+$/,
    URL: /^https?:\/\/.+/,
    LINKEDIN: /^https?:\/\/(www\.)?linkedin\.com\/.+/
};

// Date Formats
export const DATE_FORMATS = {
    SHORT: 'MM/DD/YYYY',
    LONG: 'MMMM DD, YYYY',
    WITH_TIME: 'MM/DD/YYYY HH:mm',
    ISO: 'YYYY-MM-DD'
};

// Export all as default for convenience
export default {
    API_CONFIG,
    FEATURES,
    SCORE_THRESHOLDS,
    COLORS,
    SEVERITY_LEVELS,
    PRIORITY_LEVELS,
    DIFFICULTY_LEVELS,
    QUESTION_CATEGORIES,
    UPLOAD_LIMITS,
    PAGINATION,
    ANIMATION,
    TOAST_DURATION,
    STORAGE_KEYS,
    ROUTES,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    VALIDATION,
    FEATURE_ICONS,
    CHART_CONFIG,
    REGEX,
    DATE_FORMATS
};
