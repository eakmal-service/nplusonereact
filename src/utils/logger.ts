export type LogEventType = 'PINCODE_CHECK' | 'ORDER_HOOK' | 'CLIENT_ERROR' | 'PAYMENT_ERROR';
export type LogStatus = 'SUCCESS' | 'FAILURE' | 'WARNING';

interface LogEventData {
    eventType: LogEventType;
    status: LogStatus;
    message: string;
    requestData?: any;
    responseData?: any;
    userId?: string;
    url?: string;
}

export const logEvent = async (data: LogEventData) => {
    try {
        // Client-side logging to server
        if (typeof window !== 'undefined') {
            const payload = {
                ...data,
                userAgent: navigator.userAgent,
                url: data.url || window.location.href,
                timestamp: new Date().toISOString()
            };

            await fetch('/api/log-error', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            // Server-side logging (if called from a server component/utils, slightly different path)
            // Ideally we call the DB directly if server-side to save a hop, 
            // but for consistency we can also just console log or ensure this utility supports server DB calls.
            // For now, let's keep it simple: mainly for client usage or API-to-API calls if base url known.
            console.log('Server log:', data);
        }
    } catch (error) {
        console.error('Failed to log event:', error);
    }
};
