import React from 'react';
import { getScoreColor } from '../../utils/helpers';

const ProgressBar = ({
    value,
    max = 100,
    label,
    showPercentage = true,
    size = 'md',
    className = ''
}) => {
    const percentage = Math.min((value / max) * 100, 100);
    const colors = getScoreColor(percentage);

    const sizes = {
        sm: 'h-1',
        md: 'h-1.5',
        lg: 'h-2'
    };

    return (
        <div className={className}>
            {label && (
                <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-slate-400">{label}</span>
                    {showPercentage && (
                        <span className={`font-semibold ${colors.text}`}>
                            {Math.round(percentage)}%
                        </span>
                    )}
                </div>
            )}
            <div className={`w-full bg-slate-700 rounded-full ${sizes[size]}`}>
                <div
                    className={`${colors.bg} ${sizes[size]} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
