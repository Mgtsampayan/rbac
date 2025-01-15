"use client"

import Link from 'next/link';

export default function NotAuthorized() {
    return (
        <div>
            <h1>Not Authorized</h1>
            <p>You do not have permission to access this page.</p>
            <Link href="/">Go Home</Link>
        </div>
    );
}