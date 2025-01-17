'use client';

import Auth from '../auth/auth';

export default function ParentDashboard() {
    return (
        <Auth requiredRole={['parent']}>
            <div>
                <h2>Parent Dashboard</h2>
                <p>Welcome to your dashboard, Parent!</p>
            </div>
        </Auth>
    );
}