import React from 'react'
import { SkeletonCard } from '../skeleton/Skeleton'

function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 skeleton-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="skeleton-shimmer rounded h-8 w-48 mb-2" />
                <div className="skeleton-shimmer rounded h-4 w-72 mb-8" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Loading
