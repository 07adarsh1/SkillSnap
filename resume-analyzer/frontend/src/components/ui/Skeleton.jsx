import React from 'react';
import { cn } from '../../utils/cn';

export const Skeleton = ({ className, ...props }) => (
    <div
        className={cn(
            'animate-pulse rounded-md bg-slate-200 dark:bg-slate-800',
            className
        )}
        {...props}
    />
);

export const SkeletonCard = () => (
    <div className="rounded-xl border border-slate-200 dark:border-white/10 p-6 space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-8 w-1/2" />
        <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
        </div>
    </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
    <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
        ))}
    </div>
);
