import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    disabled = false,
    loading = false,
    className = '',
    ...props
}) => {
    const baseStyles = 'font-medium rounded-lg transition-all flex items-center justify-center gap-2';

    const variants = {
        primary: 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 disabled:bg-slate-700',
        secondary: 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 disabled:bg-slate-800',
        danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20 disabled:bg-slate-700',
        ghost: 'bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700',
        outline: 'bg-transparent hover:bg-slate-800/50 text-primary border border-primary/50 hover:border-primary'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg'
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${disabled || loading ? 'cursor-not-allowed opacity-50' : ''
                }`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading...
                </>
            ) : (
                <>
                    {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
                    {children}
                    {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
                </>
            )}
        </button>
    );
};

export default Button;
