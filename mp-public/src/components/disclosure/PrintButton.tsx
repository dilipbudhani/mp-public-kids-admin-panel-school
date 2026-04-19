"use client";

export const PrintButton = () => {
    return (
        <button
            onClick={() => window.print()}
            className="btn btn-primary print:hidden flex items-center gap-2"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.72 13.89l-2.1 2.1m2.1-2.1a3.375 3.375 0 014.773 0l6.301 6.301M18 12a3 3 0 11-6 0 3 3 0 016 0zm-6 0a2.91 2.91 0 01.814-1.99L15 7.19a2.98 2.98 0 01-1.242-.88 3.303 3.303 0 00-4.22-.553m-5.92 3.97a3.303 3.303 0 00-5.512 3.058 3.303 3.303 0 003.058 5.512 3.303 3.303 0 005.512-3.058 3.303 3.303 0 00-3.058-5.512z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
            </svg>
            Download as PDF
        </button>
    );
};
