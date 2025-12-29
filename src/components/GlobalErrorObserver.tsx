"use client";

import { useEffect } from 'react';

const GlobalErrorObserver = () => {
    useEffect(() => {
        // Handler for Runtime Errors
        const handleError = (event: ErrorEvent) => {
            const errorData = {
                error_message: event.message || 'Unknown Error',
                error_stack: event.error?.stack || 'No Stack Trace',
                url: window.location.href,
                user_agent: navigator.userAgent
            };
            logError(errorData);
        };

        // Handler for Unhandled Promise Rejections (Async errors)
        const handleRejection = (event: PromiseRejectionEvent) => {
            const errorData = {
                error_message: event.reason?.message || 'Unhandled Promise Rejection',
                error_stack: event.reason?.stack || String(event.reason),
                url: window.location.href,
                user_agent: navigator.userAgent
            };
            logError(errorData);
        };

        const logError = async (data: any) => {
            try {
                // simple fire-and-forget to avoid infinite loops if logging fails
                await fetch('/api/log-error', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } catch (err) {
                console.error("Failed to log system error to server:", err);
            }
        };

        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleRejection);
        };
    }, []);

    return null; // This component handles logic only, no UI
};

export default GlobalErrorObserver;
