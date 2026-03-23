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
        default: 'bg-white/5 border border-white/10 text-slate-200 shadow-[0_0_10px_rgba(255,255,255,0.05)]',
        primary: 'bg-primary/10 border border-primary/30 text-primary-light shadow-[0_0_10px_rgba(0,210,255,0.2)]',
        success: 'bg-green-500/10 border border-green-500/30 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.2)]',
        warning: 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.2)]',
        danger: 'bg-red-500/10 border border-red-500/30 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
        info: 'bg-blue-500/10 border border-blue-500/30 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded-full font-medium',
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
