// Color utilities
export const getScoreColor = (score) => {
    if (score >= 90) return { bg: 'bg-green-500', text: 'text-green-400', border: 'border-green-500' };
    if (score >= 80) return { bg: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-500' };
    if (score >= 70) return { bg: 'bg-yellow-500', text: 'text-yellow-400', border: 'border-yellow-500' };
    if (score >= 50) return { bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500' };
    return { bg: 'bg-red-500', text: 'text-red-400', border: 'border-red-500' };
};

export const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Moderate';
    if (score >= 50) return 'Needs Work';
    return 'Critical';
};

// Format utilities
export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const formatPercentage = (value) => {
    return `${Math.round(value)}%`;
};

// Validation utilities
export const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidFile = (file, allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']) => {
    return allowedTypes.includes(file.type);
};

// String utilities
export const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
};
