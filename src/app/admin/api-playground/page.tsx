"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Trash2, Copy, Check } from 'lucide-react';

export default function ApiPlaygroundPage() {
    const [method, setMethod] = useState('POST');
    const [url, setUrl] = useState('/api/admin/coupons');
    const [body, setBody] = useState('{\n  \n}');
    const [response, setResponse] = useState<any>(null);
    const [responseStatus, setResponseStatus] = useState<number | null>(null);
    const [responseTime, setResponseTime] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSendRequest = async () => {
        setLoading(true);
        setResponse(null);
        setResponseStatus(null);
        setResponseTime(null);

        const startTime = performance.now();

        try {
            const options: RequestInit = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            if (method !== 'GET' && method !== 'HEAD') {
                try {
                    options.body = JSON.stringify(JSON.parse(body));
                } catch (e) {
                    alert('Invalid JSON in body');
                    setLoading(false);
                    return;
                }
            }

            const res = await fetch(url, options);
            const endTime = performance.now();
            setResponseTime(Math.round(endTime - startTime));
            setResponseStatus(res.status);

            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await res.json();
                setResponse(data);
            } else {
                const text = await res.text();
                setResponse(text);
            }

        } catch (error: any) {
            setResponse({ error: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleCopyResponse = () => {
        if (!response) return;
        navigator.clipboard.writeText(JSON.stringify(response, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatJson = () => {
        try {
            const parsed = JSON.parse(body);
            setBody(JSON.stringify(parsed, null, 2));
        } catch (e) {
            // Ignore error
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="p-2 hover:bg-gray-800 rounded-full transition">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            API Playground
                        </h1>
                    </div>
                </div>

                {/* Request Builder */}
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Method Selector */}
                        <select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 font-mono font-bold text-blue-400 focus:ring-2 focus:ring-blue-500 outline-none min-w-[120px]"
                        >
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                            <option value="PATCH">PATCH</option>
                        </select>

                        {/* URL Input */}
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 font-mono text-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Enter API URL (e.g., /api/validate-coupon)"
                        />

                        {/* Send Button */}
                        <button
                            onClick={handleSendRequest}
                            disabled={loading}
                            className={`flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-bold transition-all ${loading
                                    ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/20'
                                }`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Play className="w-5 h-5 fill-current" />
                                    Send
                                </>
                            )}
                        </button>
                    </div>

                    {/* Body Editor (Only for non-GET) */}
                    {method !== 'GET' && method !== 'HEAD' && (
                        <div className="mt-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium text-gray-400 ml-1">Request Body (JSON)</label>
                                <button
                                    onClick={formatJson}
                                    className="text-xs text-blue-400 hover:text-blue-300 transition"
                                >
                                    Format JSON
                                </button>
                            </div>
                            <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                className="w-full h-64 bg-gray-950 border border-gray-800 rounded-lg p-4 font-mono text-sm text-green-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                                spellCheck={false}
                            />
                        </div>
                    )}
                </div>

                {/* Response Viewer */}
                {responseStatus !== null && (
                    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-4">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xl font-bold text-gray-200">Response</h2>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${responseStatus >= 200 && responseStatus < 300
                                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                    }`}>
                                    Status: {responseStatus}
                                </span>
                                <span className="text-xs text-gray-500 font-mono">
                                    {responseTime}ms
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleCopyResponse}
                                    className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition"
                                    title="Copy Response"
                                >
                                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => {
                                        setResponse(null);
                                        setResponseStatus(null);
                                    }}
                                    className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-red-400 transition"
                                    title="Clear"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="relative group">
                            <pre className="w-full bg-gray-950 rounded-lg p-4 overflow-x-auto border border-gray-800 text-sm font-mono leading-relaxed">
                                <code className="text-yellow-100">
                                    {typeof response === 'object' ? JSON.stringify(response, null, 2) : response}
                                </code>
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
