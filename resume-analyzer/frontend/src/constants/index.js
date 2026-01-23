// Dashboard tabs
export const DASHBOARD_TABS = {
    OVERVIEW: 'overview',
    RESUMES: 'resumes',
    JOBS: 'jobs',
    ANALYTICS: 'analytics',
    CAREER_PATH: 'career-path'
};

// Score thresholds
export const SCORE_THRESHOLDS = {
    EXCELLENT: 90,
    GOOD: 80,
    MODERATE: 70,
    NEEDS_WORK: 50
};

// ATS Section Status
export const ATS_STATUS = {
    EXCELLENT: 'excellent',
    GOOD: 'good',
    MODERATE: 'moderate',
    NEEDS_WORK: 'needs-work',
    CRITICAL: 'critical'
};

// File upload
export const ALLOWED_FILE_TYPES = {
    PDF: 'application/pdf',
    DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// API endpoints
export const API_ENDPOINTS = {
    UPLOAD_RESUME: '/upload-resume',
    ANALYZE_RESUME: '/analyze-resume',
    GET_RESUMES: '/resumes',
    DELETE_RESUME: '/resumes',
    GET_HISTORY: '/resumes'
};

// Chart colors
export const CHART_COLORS = {
    PRIMARY: '#3b82f6',
    SUCCESS: '#22c55e',
    WARNING: '#eab308',
    DANGER: '#ef4444',
    INFO: '#06b6d4',
    PURPLE: '#a855f7'
};
