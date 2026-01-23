import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Loading Spinner Component
 */
export const LoadingSpinner = ({ size = 'md', message, className = '' }) => {
    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    };

    return (
        <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
            <Loader2 className={`${sizes[size]} text-primary animate-spin mb-4`} />
            {message && <p className="text-slate-400">{message}</p>}
        </div>
    );
};

/**
 * Reusable Empty State Component
 */
export const EmptyState = ({ icon: Icon, title, message, action, className = '' }) => {
    return (
        <div className={`text-center py-12 ${className}`}>
            {Icon && <Icon className="w-16 h-16 text-slate-600 mx-auto mb-4" />}
            {title && <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>}
            {message && <p className="text-slate-400 mb-4">{message}</p>}
            {action}
        </div>
    );
};

/**
 * Reusable Badge Component
 */
export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
    const variants = {
        default: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        primary: 'bg-primary/10 text-primary border-primary/20',
        success: 'bg-green-500/10 text-green-400 border-green-500/20',
        warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        danger: 'bg-red-500/10 text-red-400 border-red-500/20',
        info: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    };

    const sizes = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-2'
    };

    return (
        <span className={`inline-flex items-center rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}>
            {children}
        </span>
    );
};

/**
 * Reusable Progress Bar Component
 */
export const ProgressBar = ({ value, max = 100, color = 'primary', showLabel = false, className = '' }) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const colors = {
        primary: 'bg-primary',
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        danger: 'bg-red-500',
        info: 'bg-blue-500'
    };

    return (
        <div className={className}>
            <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all ${colors[color]}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {showLabel && (
                <p className="text-xs text-slate-400 mt-1 text-right">{Math.round(percentage)}%</p>
            )}
        </div>
    );
};

/**
 * Reusable Input Component
 */
export const Input = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    icon: Icon,
    required = false,
    className = '',
    ...props
}) => {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    {Icon && <Icon className="w-4 h-4 inline mr-2" />}
                    {label}
                    {required && <span className="text-red-400 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full px-4 py-3 bg-slate-800 border ${error ? 'border-red-500' : 'border-slate-600'
                    } rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent`}
                {...props}
            />
            {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
        </div>
    );
};

/**
 * Reusable Textarea Component
 */
export const Textarea = ({
    label,
    value,
    onChange,
    placeholder,
    error,
    icon: Icon,
    required = false,
    rows = 4,
    className = '',
    ...props
}) => {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    {Icon && <Icon className="w-4 h-4 inline mr-2" />}
                    {label}
                    {required && <span className="text-red-400 ml-1">*</span>}
                </label>
            )}
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className={`w-full px-4 py-3 bg-slate-800 border ${error ? 'border-red-500' : 'border-slate-600'
                    } rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent resize-none`}
                {...props}
            />
            {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
        </div>
    );
};

/**
 * Reusable Tabs Component
 */
export const Tabs = ({ tabs, activeTab, onChange, className = '' }) => {
    return (
        <div className={`flex gap-2 border-b border-slate-700 ${className}`}>
            {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${activeTab === tab.id
                                ? `border-${tab.color || 'primary'}-500 text-${tab.color || 'primary'}-400`
                                : 'border-transparent text-slate-400 hover:text-slate-300'
                            }`}
                    >
                        {Icon && <Icon className="w-4 h-4" />}
                        <span className="font-medium">{tab.label}</span>
                        {tab.count !== undefined && (
                            <span className="text-xs px-2 py-0.5 bg-slate-700 rounded-full">
                                {tab.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};
