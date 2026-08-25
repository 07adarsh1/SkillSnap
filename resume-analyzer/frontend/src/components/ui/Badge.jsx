import React from 'react';
import { cn } from '../../utils/cn';

export const Badge = ({
    children,
    className,
    variant = 'default',
    size = 'md',
    ...props
}) => {
    const variants = {
        default: 'bg-slate-100 border border-slate-200 text-slate-700 font-medium',
        primary: 'bg-indigo-50 border border-indigo-200/80 text-indigo-700 font-semibold shadow-[0_2px_8px_rgba(79,70,229,0.08)]',
        success: 'bg-emerald-50 border border-emerald-200/80 text-emerald-700 font-semibold shadow-[0_2px_8px_rgba(16,185,129,0.08)]',
        warning: 'bg-amber-50 border border-amber-200/80 text-amber-700 font-semibold shadow-[0_2px_8px_rgba(245,158,11,0.08)]',
        danger: 'bg-rose-50 border border-rose-200/80 text-rose-700 font-semibold shadow-[0_2px_8px_rgba(244,63,94,0.08)]',
        info: 'bg-sky-50 border border-sky-200/80 text-sky-700 font-semibold shadow-[0_2px_8px_rgba(14,165,233,0.08)]',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3.5 py-1.5 text-base',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded-full',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};
