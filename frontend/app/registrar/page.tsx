'use client';

import Auth from '../auth/auth';

export default function RegistrarDashboard() {
    return (
        <Auth requiredRole={['registrar']}>
            <div>
                <h2>Registrar Dashboard</h2>
                <p>Welcome to your dashboard, Registrar!</p>
            </div>
        </Auth>
    );
}