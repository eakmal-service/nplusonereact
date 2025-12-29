"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Review } from '@/components/reviews/ReviewList';

const ReviewsSection = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchReviews = async () => {
        setLoading(true);
        // Public client can read (RLS allows "Reviews are viewable by everyone")
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching reviews:', error);
        } else {
            setReviews(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchReviews();

        // Optional: Realtime subscription for admin too
        const channel = supabase
            .channel('admin:reviews')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'reviews' },
                () => fetchReviews()
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) return;

        setDeletingId(id);
        try {
            const response = await fetch('/api/admin/delete-review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to delete');
            }

            // Ideally realtime handles this, but optimistic update is good too
            setReviews(prev => prev.filter(r => r.id !== id));
            alert('Review deleted successfully');
        } catch (error: any) {
            alert(`Error: ${error.message}\n(Did you add the SUPABASE_SERVICE_ROLE_KEY to .env.local?)`);
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) return <div className="text-white">Loading reviews...</div>;

    return (
        <div className="bg-black p-6 rounded-lg border border-gray-800">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-silver">All Customer Reviews</h2>
                <button onClick={fetchReviews} className="text-sm text-gray-400 hover:text-white">
                    Refresh
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-gray-300">
                    <thead className="text-gray-500 uppercase text-xs border-b border-gray-800">
                        <tr>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Product ID</th>
                            <th className="px-4 py-3">Rating</th>
                            <th className="px-4 py-3 w-1/3">Comment</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {reviews.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                    No reviews found.
                                </td>
                            </tr>
                        ) : (
                            reviews.map(review => (
                                <tr key={review.id} className="hover:bg-gray-900 transition-colors">
                                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4 font-medium text-white">{review.user_name}</td>
                                    <td className="px-4 py-4 text-sm font-mono text-gray-400">{review.product_id}</td>
                                    <td className="px-4 py-4 text-yellow-500">
                                        {'★'.repeat(review.rating)}
                                        <span className="text-gray-700">{'★'.repeat(5 - review.rating)}</span>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-300 truncate max-w-xs" title={review.comment}>
                                        {review.comment}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(review.id)}
                                            disabled={deletingId === review.id}
                                            className="text-red-500 hover:text-red-400 font-medium text-sm disabled:opacity-50"
                                        >
                                            {deletingId === review.id ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReviewsSection;
