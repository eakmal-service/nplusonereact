import React from 'react';
import { Skeleton } from '@/components/common/Skeleton';

export default function Loading() {
    return (
        <div className="bg-black min-h-screen text-white">
            {/* Navbar Saver */}
            <div className="h-20"></div>

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Left Column: Image Gallery Skeleton */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <Skeleton className="w-full aspect-[3/4] rounded-lg bg-gray-900" />

                        {/* Thumbnails */}
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="w-20 h-24 rounded-md flex-shrink-0" />
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Product Details Skeleton */}
                    <div className="space-y-8">
                        {/* Header */}
                        <div>
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-10 w-3/4 mb-4" />
                            <Skeleton className="h-8 w-32" />
                        </div>

                        {/* Sizes */}
                        <div>
                            <Skeleton className="h-4 w-16 mb-3" />
                            <div className="flex gap-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Skeleton key={i} className="w-12 h-12 rounded-full" />
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4">
                            <Skeleton className="h-14 flex-1 rounded-full" />
                            <Skeleton className="h-14 w-14 rounded-full" />
                        </div>

                        {/* Description */}
                        <div className="pt-8 space-y-3">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
