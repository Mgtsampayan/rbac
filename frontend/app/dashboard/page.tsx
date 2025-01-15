'use client';
import Auth from '../auth/auth';


export default function Dashboard() {
    return (
        <Auth allowedRoles={['admin', 'student', 'faculty', 'registrar', 'accounting', 'hr', 'parent']}>
            <div>
                <h1>Dashboard</h1>
                <p> Welcome to the Dashboard </p>
            </div>
        </Auth>
    );
}