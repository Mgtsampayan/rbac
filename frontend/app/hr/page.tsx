'use client';

import Auth from '../auth/auth';

export default function HRDashboard() {
    return (
        <Auth requiredRole={['hr']}>
            <div>
                <h2>HR Dashboard</h2>
                <p>Welcome to your dashboard, HR!</p>
            </div>
        </Auth>
    );
}