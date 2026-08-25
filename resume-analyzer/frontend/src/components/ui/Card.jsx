import React from 'react';
import { cn } from '../../utils/cn';

export const Card = ({
    children,
    className,
    variant = 'default',
    hover = false,
    ...props
}) => {
    const variants = {
        default: 'bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] text-slate-900',
        glass: 'bg-white/80 backdrop-blur-2xl border border-slate-200/70 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-slate-900',
        gradient: 'bg-gradient-to-br from-white via-indigo-50/30 to-slate-50 border border-indigo-100/80 shadow-[0_4px_20px_-4px_rgba(79,70,229,0.05)] text-slate-900',
    };

    const hoverClass = hover ? 'hover:shadow-[0_15px_35px_-5px_rgba(79,70,229,0.12),0_4px_12px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:border-indigo-300/80 cursor-pointer' : '';

    return (
        <div
            className={cn(
                'rounded-2xl transition-all duration-300',
                variants[variant],
                hoverClass,
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className, ...props }) => (
    <div className={cn('p-6 pb-4', className)} {...props}>
        {children}
    </div>
);

export const CardTitle = ({ children, className, ...props }) => (
    <h3 className={cn('text-xl font-bold text-slate-900 tracking-tight', className)} {...props}>
        {children}
    </h3>
);

export const CardDescription = ({ children, className, ...props }) => (
    <p className={cn('text-sm text-slate-500 font-normal mt-1', className)} {...props}>
        {children}
    </p>
);

export const CardContent = ({ children, className, ...props }) => (
    <div className={cn('p-6 pt-0', className)} {...props}>
        {children}
    </div>
);

export const CardFooter = ({ children, className, ...props }) => (
    <div className={cn('p-6 pt-4 border-t border-slate-100', className)} {...props}>
        {children}
    </div>
);
