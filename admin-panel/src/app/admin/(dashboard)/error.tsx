'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Admin Dashboard Error:', error);
    }, [error]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>

            <h1 className="text-3xl font-bold font-playfair text-gray-900 mb-2">
                Something went wrong
            </h1>

            <p className="text-gray-600 max-w-md mb-8">
                {error.message || "An unexpected error occurred while loading this page."}
                {error.digest && (
                    <span className="block mt-2 text-xs font-mono text-gray-400">
                        Error ID: {error.digest}
                    </span>
                )}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <button
                    onClick={reset}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <RefreshCcw className="w-4 h-4" />
                    Try again
                </button>

                <Link
                    href="/admin"
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                    <Home className="w-4 h-4" />
                    Back to Dashboard
                </Link>
            </div>

            <div className="mt-12 p-4 bg-gray-50 rounded-2xl border border-gray-100 max-w-2xl w-full text-left">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Technical Details</p>
                <div className="text-xs font-mono text-gray-500 overflow-x-auto whitespace-pre-wrap break-words">
                    {error.stack || error.toString()}
                </div>
            </div>
        </div>
    );
}
