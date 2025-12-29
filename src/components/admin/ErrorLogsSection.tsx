"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface SystemError {
    id: string;
    error_message: string;
    error_stack: string;
    url: string;
    created_at: string;
    status: string;
}

const ErrorLogsSection = () => {
    const [errors, setErrors] = useState<SystemError[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<string | null>(null);

    const fetchErrors = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('system_errors')
            .select('*')
            .eq('status', 'open') // Only show open errors
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching system logs:', error);
        } else {
            setErrors(data || []);
        }
        setLoading(false);
    };

    const resolveError = async (id: string) => {
        // In database we can just DELETE it or set status to 'resolved'.
        // User asked: "ek bar resolve ho jaaye the clear ho jana chiya" -> implied deletion or moved from view.
        // Let's delete it for cleanliness as per "clear ho jana chiya".

        const { error } = await supabase
            .from('system_errors')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Failed to resolve error');
        } else {
            // Optimistic update
            setErrors(prev => prev.filter(e => e.id !== id));
        }
    };

    useEffect(() => {
        fetchErrors();

        // Real-time Subscription
        const channel = supabase
            .channel('public:system_errors')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'system_errors'
                },
                (payload) => {
                    console.log('New Error Logged:', payload);
                    const newError = payload.new as SystemError;
                    setErrors(prev => [newError, ...prev]);

                    // Show Toast / Pop-up
                    setToast(`New Error Detected: ${newError.error_message}`);
                    // Auto hide toast after 5s
                    setTimeout(() => setToast(null), 5000);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <div className="bg-black p-6 rounded-lg border border-gray-800 relative">
            {/* Toast Notification for New Errors */}
            {toast && (
                <div className="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-4 rounded shadow-2xl z-50 animate-bounce">
                    <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <h4 className="font-bold">System Alert!</h4>
                            <p className="text-sm">{toast}</p>
                        </div>
                        <button onClick={() => setToast(null)} className="ml-4 font-bold text-red-200 hover:text-white">✕</button>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl text-white font-bold">System Error Logs</h2>
                <button
                    onClick={fetchErrors}
                    className="text-sm text-silver hover:text-white underline"
                >
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="text-gray-400 text-center py-8">Loading logs...</div>
            ) : errors.length === 0 ? (
                <div className="text-green-500 text-center py-12 bg-gray-900 rounded border border-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>All clear! No active system errors.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {errors.map(err => (
                        <div key={err.id} className="bg-gray-900 border border-red-900/30 p-4 rounded hover:border-red-500 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-red-400 font-mono text-xs bg-red-900/10 px-2 py-1 rounded">
                                    {new Date(err.created_at).toLocaleString()}
                                </span>
                                <button
                                    onClick={() => resolveError(err.id)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-bold"
                                >
                                    Resolve
                                </button>
                            </div>
                            <h3 className="text-white font-bold mb-1">{err.error_message}</h3>
                            <p className="text-gray-500 text-xs mb-2 truncate">URL: {err.url}</p>

                            {err.error_stack && (
                                <details className="mt-2">
                                    <summary className="text-gray-600 text-xs cursor-pointer hover:text-gray-400">View Stack Trace</summary>
                                    <pre className="mt-2 bg-black p-2 rounded text-red-300 text-xs overflow-x-auto font-mono whitespace-pre-wrap">
                                        {err.error_stack}
                                    </pre>
                                </details>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ErrorLogsSection;
