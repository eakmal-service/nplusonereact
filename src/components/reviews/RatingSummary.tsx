"use client";

import React from 'react';
import { Review } from './ReviewList';

interface RatingSummaryProps {
    reviews: Review[];
}

const RatingSummary: React.FC<RatingSummaryProps> = ({ reviews }) => {
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
        : "0.0";

    return (
        <div className="space-y-4">
            <div className="bg-black p-6 rounded-lg border border-gray-800">
                <h3 className="text-3xl font-bold text-silver mb-2">{averageRating}</h3>
                <div className="flex items-center mb-0">
                    <div className="flex text-yellow-500 text-lg mr-2">
                        {[1, 2, 3, 4, 5].map(star => (
                            <span key={star}>{parseFloat(averageRating) >= star ? '★' : '☆'}</span>
                        ))}
                    </div>
                    <p className="text-gray-400 text-sm">Based on {totalReviews} reviews</p>
                </div>
            </div>

            <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(star => {
                    const count = reviews.filter(r => r.rating === star).length;
                    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                    return (
                        <div key={star} className="flex items-center text-sm text-gray-400">
                            <span className="w-8">{star} ★</span>
                            <div className="flex-1 h-2 mx-2 bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-silver" style={{ width: `${percentage}%` }} />
                            </div>
                            <span className="w-8 text-right">{count}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RatingSummary;
