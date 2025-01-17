'use client';

import Auth from '../auth/auth';

export default function AccountingDashboard() {
    return (
        <Auth requiredRole={['accounting']}>
            <div>
                <h2>Accounting Dashboard</h2>
                <p>Welcome to your dashboard, Accounting!</p>
            </div>
        </Auth>
    );
}