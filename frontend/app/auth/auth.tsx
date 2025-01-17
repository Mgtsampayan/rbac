'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../utils/userContext';

interface AuthProps {
    children: React.ReactNode;
    requiredRole?: string[];
}

const Auth: React.FC<AuthProps> = ({ children, requiredRole }) => {
    const router = useRouter();
    const { user, loading } = useAuth();

    React.useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (requiredRole && !requiredRole.some(role => user.role === role)) {
                router.push('/not-authorized');
            }
        }
    }, [user, loading, router, requiredRole]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return null;
    }

    if (requiredRole && !requiredRole.some(role => user.role === role)) {
        return null;
    }

    return <>{children}</>;
};

export default Auth;