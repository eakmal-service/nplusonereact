import React from 'react';
import { Skeleton } from './Skeleton';

interface ProductGridSkeletonProps {
    count?: number;
}

const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({ count = 8 }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="flex flex-col space-y-3">
                    {/* Image Skeleton */}
                    <Skeleton className="w-full aspect-[3/4] rounded-lg" />

                    {/* Title Skeleton */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>

                    {/* Price Skeleton */}
                    <div className="flex gap-2 items-center pt-1">
                        <Skeleton className="h-5 w-20" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductGridSkeleton;
