import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

/**
 * Reusable Alert Component
 * For errors, success messages, warnings, and info
 */
const Alert = ({ type = 'info', message, title, onClose, className = '' }) => {
    const config = {
        error: {
            icon: AlertCircle,
            bgColor: 'bg-red-500/10',
            borderColor: 'border-red-500/20',
            textColor: 'text-red-400',
            titleColor: 'text-red-300'
        },
        success: {
            icon: CheckCircle2,
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500/20',
            textColor: 'text-green-400',
            titleColor: 'text-green-300'
        },
        warning: {
            icon: AlertTriangle,
            bgColor: 'bg-yellow-500/10',
            borderColor: 'border-yellow-500/20',
            textColor: 'text-yellow-400',
            titleColor: 'text-yellow-300'
        },
        info: {
            icon: Info,
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20',
            textColor: 'text-blue-400',
            titleColor: 'text-blue-300'
        }
    };

    const { icon: Icon, bgColor, borderColor, textColor, titleColor } = config[type];

    return (
        <div className={`p-4 ${bgColor} border ${borderColor} rounded-lg flex items-start gap-3 ${className}`}>
            <Icon className={`w-5 h-5 ${textColor} mt-0.5 shrink-0`} />
            <div className="flex-1">
                {title && <p className={`font-semibold ${titleColor} mb-1`}>{title}</p>}
                <p className={`text-sm ${textColor}`}>{message}</p>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className={`${textColor} hover:opacity-70 transition-opacity`}
                >
                    ✕
                </button>
            )}
        </div>
    );
};

export default Alert;
