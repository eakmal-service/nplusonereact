import React from 'react';
import Link from 'next/link';

export default function AdminLoginErrorPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const reason = searchParams.reason || 'Unknown error';

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Admin Access Denied</h1>
            <p className="text-xl mb-6">You were redirected here because:</p>

            <div className="bg-gray-900 p-6 rounded-lg border border-red-900 mb-8 max-w-lg w-full">
                <code className="text-red-400 break-words block">
                    {reason}
                </code>
            </div>

            <div className="text-gray-400 mb-8 max-w-md text-center">
                <p className="mb-2">Common reasons:</p>
                <ul className="list-disc text-left pl-6 space-y-1">
                    <li>You are not logged in.</li>
                    <li>Your session cookie is missing or invalid.</li>
                    <li>Your email is not in the hardcoded admin list.</li>
                    <li>The database check failed.</li>
                </ul>
            </div>

            <div className="flex gap-4">
                <Link
                    href="/"
                    className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors"
                >
                    Go Home
                </Link>
                <Link
                    href="/?login=true&next=/admin/dashboard"
                    className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition-colors"
                >
                    Login Again
                </Link>
            </div>
        </div>
    );
}
