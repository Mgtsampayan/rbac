'use client';

import Auth from '../auth/auth';

export default function FacultyDashboard() {
    return (
        <Auth requiredRole={['faculty']}>
            <div>
                <h2>Faculty Dashboard</h2>
                <p>Welcome to your dashboard, Faculty!</p>
            </div>
        </Auth>
    );
}