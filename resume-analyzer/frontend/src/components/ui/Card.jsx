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
        default: 'bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10',
        glass: 'bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-white/10',
        gradient: 'bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-slate-900/40 border border-indigo-100 dark:border-indigo-900/30',
    };

    const hoverClass = hover ? 'hover:shadow-lg hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-800/50 cursor-pointer' : '';

    return (
        <div
            className={cn(
                'rounded-xl shadow-sm transition-all duration-300',
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
    <h3 className={cn('text-lg font-semibold text-slate-900 dark:text-white', className)} {...props}>
        {children}
    </h3>
);

export const CardDescription = ({ children, className, ...props }) => (
    <p className={cn('text-sm text-slate-600 dark:text-slate-400 mt-1', className)} {...props}>
        {children}
    </p>
);

export const CardContent = ({ children, className, ...props }) => (
    <div className={cn('p-6 pt-0', className)} {...props}>
        {children}
    </div>
);

export const CardFooter = ({ children, className, ...props }) => (
    <div className={cn('p-6 pt-4 border-t border-slate-200 dark:border-white/5', className)} {...props}>
        {children}
    </div>
);
