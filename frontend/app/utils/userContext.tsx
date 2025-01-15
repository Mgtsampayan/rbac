"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from './apiClient';

interface User {
    username: string;
    role: string;
}

interface UserContextType {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

const UserContext = createContext<UserContextType>({
    user: null,
    isLoading: true,
    error: null
});


export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();


    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const res = await apiClient.get('/auth/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(res.data);
            } catch (err) {
                console.error('Failed to fetch user:', err);
                setError('Failed to fetch user data.');
                localStorage.removeItem('token');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [router]);


    return (
        <UserContext.Provider value={{ user, isLoading, error }}>
            {children}
        </UserContext.Provider>
    );
};


export const useUser = () => {
    return useContext(UserContext);
};