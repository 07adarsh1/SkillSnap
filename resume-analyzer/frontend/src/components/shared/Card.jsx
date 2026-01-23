import React from 'react';

/**
 * Reusable Card Component
 * For consistent content containers
 */
const Card = ({
    children,
    title,
    subtitle,
    icon: Icon,
    variant = 'default',
    className = ''
}) => {
    const variants = {
        default: 'bg-slate-800/50 border-slate-700',
        primary: 'bg-primary/10 border-primary/20',
        success: 'bg-green-500/10 border-green-500/20',
        warning: 'bg-yellow-500/10 border-yellow-500/20',
        danger: 'bg-red-500/10 border-red-500/20',
        info: 'bg-blue-500/10 border-blue-500/20'
    };

    return (
        <div className={`border rounded-xl p-5 ${variants[variant]} ${className}`}>
            {(title || Icon) && (
                <div className="mb-4">
                    {title && (
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            {Icon && <Icon className="w-5 h-5" />}
                            {title}
                        </h3>
                    )}
                    {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
                </div>
            )}
            {children}
        </div>
    );
};

export default Card;
