'use client';

import Auth from '../auth/auth';

export default function StudentDashboard() {
    return (
        <Auth requiredRole={['student']}>
            <div>
                <h2>Student Dashboard</h2>
                <p>Welcome to your dashboard, Student!</p>
            </div>
        </Auth>
    );
}