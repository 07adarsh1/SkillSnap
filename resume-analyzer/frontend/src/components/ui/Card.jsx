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
        default: 'bg-[#121318]/60 backdrop-blur-xl border border-white/10',
        glass: 'bg-white/5 backdrop-blur-3xl border border-white/20',
        gradient: 'bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/10',
    };

    const hoverClass = hover ? 'hover:shadow-[0_8px_30px_rgba(0,210,255,0.15)] hover:-translate-y-1 hover:border-primary/50 cursor-pointer' : '';

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
    <h3 className={cn('text-xl font-bold text-white tracking-wide', className)} {...props}>
        {children}
    </h3>
);

export const CardDescription = ({ children, className, ...props }) => (
    <p className={cn('text-sm text-slate-400 font-light mt-1', className)} {...props}>
        {children}
    </p>
);

export const CardContent = ({ children, className, ...props }) => (
    <div className={cn('p-6 pt-0', className)} {...props}>
        {children}
    </div>
);

export const CardFooter = ({ children, className, ...props }) => (
    <div className={cn('p-6 pt-4 border-t border-white/5', className)} {...props}>
        {children}
    </div>
);
