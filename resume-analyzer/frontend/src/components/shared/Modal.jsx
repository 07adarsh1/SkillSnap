import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Modal Component
 * Used across all feature modals for consistent UX
 */
const Modal = ({
    isOpen,
    onClose,
    title,
    subtitle,
    icon: Icon,
    iconColor = 'primary',
    children,
    maxWidth = '4xl'
}) => {
    if (!isOpen) return null;

    const colorClasses = {
        primary: 'bg-primary/20 text-primary',
        blue: 'bg-blue-500/20 text-blue-400',
        green: 'bg-green-500/20 text-green-400',
        purple: 'bg-purple-500/20 text-purple-400',
        orange: 'bg-orange-500/20 text-orange-400',
        red: 'bg-red-500/20 text-red-400'
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-slate-900 rounded-2xl border border-slate-700 max-w-${maxWidth} w-full max-h-[90vh] overflow-hidden flex flex-col`}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-${iconColor}-600/10 to-purple-600/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {Icon && (
                                <div className={`w-12 h-12 rounded-xl ${colorClasses[iconColor]} flex items-center justify-center`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            )}
                            <div>
                                <h2 className="text-2xl font-bold text-white">{title}</h2>
                                {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white transition-colors text-2xl leading-none"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

export default Modal;
