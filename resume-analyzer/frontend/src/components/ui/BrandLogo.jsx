import React from 'react';

export const BrandMark = ({ size = 32, className = '' }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`shrink-0 ${className}`}
        >
            <defs>
                {/* Primary Indigo to Violet Gradient */}
                <linearGradient id="ss-grad-primary" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>

                {/* Accent Cyan to Blue Gradient */}
                <linearGradient id="ss-grad-accent" x1="0" y1="18" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>

                {/* Subtle Glow Filter */}
                <filter id="ss-glow" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#4F46E5" floodOpacity="0.25" />
                </filter>
            </defs>

            {/* Container Base with rounded modern squircle */}
            <rect
                x="1.5"
                y="1.5"
                width="33"
                height="33"
                rx="10"
                fill="#0F172A"
                stroke="url(#ss-grad-primary)"
                strokeWidth="1.5"
                filter="url(#ss-glow)"
            />

            {/* Top Snap Bracket (Part of the S) */}
            <path
                d="M10 13.5C10 11.567 11.567 10 13.5 10H23.5C24.3284 10 25 10.6716 25 11.5V13.5C25 14.3284 24.3284 15 23.5 15H15.5C14.1193 15 13 16.1193 13 17.5V18"
                stroke="url(#ss-grad-primary)"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Bottom Snap Bracket (Complementing S) */}
            <path
                d="M26 22.5C26 24.433 24.433 26 22.5 26H12.5C11.6716 26 11 25.3284 11 24.5V22.5C11 21.6716 11.6716 21 12.5 21H20.5C21.8807 21 23 19.8807 23 18.5V18"
                stroke="url(#ss-grad-accent)"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Dynamic Geometric Energy Notch */}
            <circle cx="21" cy="13.5" r="1.5" fill="#38BDF8" />
            <circle cx="15" cy="22.5" r="1.5" fill="#818CF8" />
        </svg>
    );
};

export const BrandLogo = ({
    size = 'md',
    showText = true,
    className = '',
    onClick,
}) => {
    const markSizes = {
        sm: 26,
        md: 32,
        lg: 40,
    };

    const textSizes = {
        sm: 'text-base',
        md: 'text-lg',
        lg: 'text-2xl',
    };

    return (
        <div
            onClick={onClick}
            className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
        >
            <BrandMark size={markSizes[size] || 32} />
            {showText && (
                <div className={`font-black tracking-tight leading-none text-slate-900 ${textSizes[size] || 'text-lg'} flex items-baseline`}>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950">Skill</span>
                    <span className="text-indigo-600 font-extrabold ml-[1px]">Snap</span>
                </div>
            )}
        </div>
    );
};

export default BrandLogo;
