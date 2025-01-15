'use client';

import Auth from '../auth/auth';


export default function AdminDashboard() {
    return (
        <Auth allowedRoles={['admin']}>
            <div>
                <h1>Admin Dashboard</h1>
                <p> Welcome to the Admin Dashboard </p>
            </div>
        </Auth>
    );
}