"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../utils/userContext';

interface AuthProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const Auth = ({ children, allowedRoles }: AuthProps) => {
    const router = useRouter();
    const { user, isLoading, error } = useUser();


    useEffect(() => {
        if (!isLoading && error === 'Failed to fetch user data.') {
            router.push('/login');
            return
        }
    }, [isLoading, error, router]);

    useEffect(() => {
        if (!user || isLoading) {
            return;
        }

        const userRole = user.role;

        if (allowedRoles && !allowedRoles.includes(userRole)) {
            router.push('/not-authorized');
        }
    }, [user, allowedRoles, router, isLoading]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return null
    }

    return <>{children}</>;
};

export default Auth;