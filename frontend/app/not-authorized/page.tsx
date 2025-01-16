'use client';

import Link from 'next/link';

export default function NotAuthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                    Not Authorized
                </h2>
                <p className="text-gray-600 mb-8">
                    You do not have permission to access this page.
                </p>
                <Link
                    href="/login"
                    className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                    Return to Login
                </Link>
            </div>
        </div>
    );
}