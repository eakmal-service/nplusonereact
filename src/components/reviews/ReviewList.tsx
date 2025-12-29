"use client";

import React from 'react';

export interface Review {
    id: string; // Changed to string to support UUIDs from Supabase
    product_id: string;
    user_name: string;
    rating: number;
    comment: string;
    created_at: string;
}

interface ReviewListProps {
    reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
    if (reviews.length === 0) {
        return (
            <div className="text-center py-10 bg-gray-900 rounded-lg border border-gray-800">
                <p className="text-gray-400">No reviews yet. Be the first to write one!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="bg-black border border-gray-800 p-6 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className="font-bold text-silver text-lg">{review.user_name}</h4>
                            <div className="flex items-center mt-1">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`text-lg ${i < review.rating ? 'text-yellow-500' : 'text-gray-700'}`}>
                                        ★
                                    </span>
                                ))}
                            </div>
                        </div>
                        <span className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="text-gray-300 mt-3 leading-relaxed">
                        {review.comment}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;
