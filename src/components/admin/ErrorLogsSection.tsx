"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Minimal interface for logs (Updated for system_logs table)
interface SystemLog {
    id: string;
    event_type: string;
    status: string;
    message: string;
    request_data: any;
    response_data: any;
    url: string;
    user_agent: string;
    created_at: string;
}

const ErrorLogsSection = () => {
    const [logs, setLogs] = useState<SystemLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('ALL');

    const fetchLogs = async () => {
        setLoading(true);
        let query = supabase
            .from('system_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50); // Fetch last 50

        if (filterType !== 'ALL') {
            query = query.eq('event_type', filterType);
        }

        const { data, error } = await query;
        if (error) {
            console.error('Error fetching logs:', error);
        } else {
            setLogs(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLogs();

        // Subscribe to new logs
        const channel = supabase
            .channel('public:system_logs')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'system_logs' }, (payload) => {
                const newLog = payload.new as SystemLog;
                setLogs(prev => [newLog, ...prev]);
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [filterType]);

    const getStatusColor = (status: string) => {
        if (status === 'SUCCESS') return 'text-green-400 border-green-900/50 bg-green-900/10';
        if (status === 'FAILURE') return 'text-red-400 border-red-900/50 bg-red-900/10';
        if (status === 'WARNING') return 'text-yellow-400 border-yellow-900/50 bg-yellow-900/10';
        return 'text-gray-400 border-gray-800 bg-gray-900';
    };

    return (
        <div className="bg-black p-6 rounded-lg border border-gray-800">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl text-white font-bold">System Logs & Errors</h2>
                <div className="flex gap-2">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-gray-800 text-sm text-silver border border-gray-700 rounded px-2 py-1"
                    >
                        <option value="ALL">All Events</option>
                        <option value="PINCODE_CHECK">Pincode Check</option>
                        <option value="ORDER_HOOK">Order Hook</option>
                        <option value="CLIENT_ERROR">Client Error</option>
                        <option value="SHIPMENT_TRACKING">Tracking</option>
                        <option value="SHIPMENT_CANCEL">Cancellation</option>
                        <option value="SHIPMENT_RETURN">Return/RTO</option>
                        <option value="LABEL_GENERATION">Label Gen</option>
                        <option value="MANIFEST_GENERATION">Manifest Gen</option>
                        <option value="WEBHOOK_EVENT">Webhook</option>
                    </select>
                    <button onClick={fetchLogs} className="text-sm text-silver hover:text-white underline">Refresh</button>
                </div>
            </div>

            {loading ? (
                <div className="text-gray-500 text-center py-8">Loading logs...</div>
            ) : logs.length === 0 ? (
                <div className="text-gray-500 text-center py-10 border border-dashed border-gray-800 rounded">
                    No logs found.
                </div>
            ) : (
                <div className="space-y-3">
                    {logs.map(log => (
                        <div key={log.id} className={`p-4 rounded border ${getStatusColor(log.status)} transition-colors`}>
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm tracking-wide">{log.event_type}</span>
                                    <span className="text-xs opacity-60">| {new Date(log.created_at).toLocaleString()}</span>
                                </div>
                                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-black/30">{log.status}</span>
                            </div>

                            <p className="font-medium text-sm mb-2">{log.message}</p>

                            {(log.request_data || log.response_data) && (
                                <details className="mt-2 text-xs">
                                    <summary className="cursor-pointer opacity-70 hover:opacity-100">View Details</summary>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                        {log.request_data && (
                                            <div className="bg-black/50 p-2 rounded overflow-x-auto">
                                                <strong className="block mb-1 opacity-50">Request:</strong>
                                                <pre>{JSON.stringify(log.request_data, null, 2)}</pre>
                                            </div>
                                        )}
                                        {log.response_data && (
                                            <div className="bg-black/50 p-2 rounded overflow-x-auto">
                                                <strong className="block mb-1 opacity-50">Response:</strong>
                                                <pre>{JSON.stringify(log.response_data, null, 2)}</pre>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-2 opacity-50">
                                        User Agent: {log.user_agent}
                                    </div>
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
