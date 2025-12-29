"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface ReviewFormProps {
    productId: string;
    onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onReviewSubmitted }) => {
    const [name, setName] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!name.trim() || !comment.trim()) {
            setError('Please fill in your name and review');
            setIsSubmitting(false);
            return;
        }

        try {
            // Simple insert without image logic
            const { error: insertError } = await supabase
                .from('reviews')
                .insert([
                    {
                        product_id: productId,
                        user_name: name,
                        rating: rating,
                        comment: comment,
                    }
                ]);

            if (insertError) throw insertError;

            // Reset form
            setName('');
            setRating(5);
            setComment('');
            onReviewSubmitted();

        } catch (err: any) {
            setError(err.message || 'Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-black p-0 rounded-lg">

            {error && (
                <div className="bg-red-900/30 text-red-200 p-3 rounded mb-6 text-sm border border-red-800/50">
                    {error}
                </div>
            )}

            <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">What's your name?</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-white placeholder-gray-600 focus:border-silver outline-none transition-colors"
                    placeholder="First and Last Name"
                />
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
