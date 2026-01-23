import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Button Component
 * Supports multiple variants, sizes, and loading states
 */
const Button = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon: Icon,
    fullWidth = false,
    className = '',
    type = 'button'
}) => {
    const baseClasses = 'font-medium transition-all flex items-center justify-center gap-2 rounded-lg';

    const variants = {
        primary: 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white',
        secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
        success: 'bg-green-600 hover:bg-green-700 text-white',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        outline: 'border-2 border-primary text-primary hover:bg-primary/10',
        ghost: 'text-slate-400 hover:text-white hover:bg-slate-800'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-3',
        lg: 'px-8 py-4 text-lg'
    };

    const disabledClasses = 'disabled:from-slate-700 disabled:to-slate-700 disabled:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                ${baseClasses}
                ${variants[variant]}
                ${sizes[size]}
                ${disabledClasses}
                ${fullWidth ? 'w-full' : ''}
                ${className}
            `}
        >
            {loading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading...
                </>
            ) : (
                <>
                    {Icon && <Icon className="w-5 h-5" />}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;
