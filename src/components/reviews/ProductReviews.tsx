"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ReviewForm from './ReviewForm';
import ReviewList, { Review } from './ReviewList';
import RatingSummary from './RatingSummary';

interface ProductReviewsProps {
    productId: string; // Accepts string IDs (e.g. "D3P_1" or "9")
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('product_id', productId)
                .eq('is_visible', true)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching reviews:', error);
            } else {
                setReviews(data || []);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();

        // Real-time subscription
        const channel = supabase
            .channel('public:reviews')
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to INSERT, UPDATE, DELETE
                    schema: 'public',
                    table: 'reviews',
                    filter: `product_id=eq.${productId}`
                },
                (payload) => {
                    console.log('Real-time change received:', payload);
                    // For simplicity, just refetch sorted reviews to ensure correct order
                    // Or specifically handle INSERT to prepend
                    fetchReviews();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [productId]);

    return (
        <div className="mt-16 border-t border-gray-800 pt-16">
            <h2 className="text-3xl font-bold text-silver mb-8 text-center">Customer Reviews</h2>

            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-16">

                    {/* Left Column: Write Review Form */}
                    <div className="lg:w-1/2">
                        <ReviewForm
                            productId={productId}
                            onReviewSubmitted={() => { /* Realtime handles update */ }}
                        />
                    </div>

                    {/* Right Column: Summary & List */}
                    <div className="lg:w-1/2 flex flex-col gap-8">
                        <RatingSummary reviews={reviews} />

                        <div>
                            <h3 className="text-xl font-bold text-silver mb-6">Recent Reviews</h3>
                            {loading ? (
                                <div className="text-center py-8 text-gray-500">Loading reviews...</div>
                            ) : (
                                <div className="max-h-[400px] overflow-y-auto pr-2">
                                    <ReviewList reviews={reviews} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductReviews;
