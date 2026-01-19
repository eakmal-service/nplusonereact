"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface ReviewFormProps {
    productId: string;
    onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        checkUser();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setError('You must be logged in to submit a review');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        if (!comment.trim()) {
            setError('Please write a review');
            setIsSubmitting(false);
            return;
        }

        try {
            const { error: insertError } = await supabase
                .from('reviews')
                .insert([
                    {
                        product_id: productId,
                        user_id: user.id,
                        rating: rating,
                        comment: comment,
                    }
                ]);

            if (insertError) throw insertError;

            // Reset form
            setRating(5);
            setComment('');
            onReviewSubmitted();

        } catch (err: any) {
            setError(err.message || 'Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return (
            <div className="bg-black p-6 rounded-lg text-center border border-gray-800">
                <p className="text-gray-400 mb-4">Please log in to write a review.</p>
                <a href="/login" className="inline-block bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200 transition">
                    Log In
                </a>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-black p-0 rounded-lg">

            {error && (
                <div className="bg-red-900/30 text-red-200 p-3 rounded mb-6 text-sm border border-red-800/50">
                    {error}
                </div>
            )}

            <div className="mb-6">
                <p className="text-gray-400 text-sm mb-2">Reviewing as <span className="text-white font-semibold">{user.email}</span></p>
            </div>

            <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">Your Rating</label>
                <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`text-3xl focus:outline-none transition-transform hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-gray-800'}`}
                            title={`${star} stars`}
                        >
                            ★
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">What's your review?</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-white placeholder-gray-600 focus:border-silver outline-none h-32 resize-none transition-colors"
                    placeholder="Write your detailed review here..."
                />
                <div className="text-right text-xs text-gray-600 mt-1">{comment.length}/2000</div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-silver hover:bg-gray-300 text-black font-bold py-4 mb-10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg shadow-gray-900/20"
            >
                {isSubmitting ? 'Submitting Review...' : 'Submit your review'}
            </button>
        </form>
    );
};

export default ReviewForm;
