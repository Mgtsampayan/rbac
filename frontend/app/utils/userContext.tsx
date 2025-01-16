'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi, User, UpdateProfileData } from './apiClient';
import { useRouter } from 'next/navigation'; // Import useRouter

interface AuthContextType {
    user: User | null;
    loading: boolean;
    actionLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: { username: string; email: string; password: string; role?: string }) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: UpdateProfileData) => Promise<void>;
    clearError: () => void; // Add a function to clear the error
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter(); // Initialize useRouter

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            try {
                const userData = await authApi.getCurrentUser();
                if (isMounted) setUser(userData);
            } catch (err) {
                if (isMounted) {
                    console.error('Auth check failed:', err);
                    // Optionally, don't set an error here if it's the initial load and the user is simply not logged in
                    // setError('Failed to check authentication status');
                    setUser(null);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        checkAuth();

        return () => {
            isMounted = false;
        };
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            setActionLoading(true);
            const { user } = await authApi.login({ email, password });
            setUser(user);
            router.push('/dashboard'); // Redirect on successful login
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setActionLoading(false);
        }
    };

    const register = async (userData: { username: string; email: string; password: string; role?: string }) => {
        try {
            setError(null);
            setActionLoading(true);
            const { user } = await authApi.register({
                ...userData,
                role: userData.role || 'student', // Match backend default
            });
            setUser(user);
            router.push('/dashboard'); // Redirect on successful registration
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setActionLoading(false);
        }
    };

    const logout = async () => {
        try {
            setError(null);
            setActionLoading(true);
            await authApi.logout();
            setUser(null);
            router.push('/login'); // Redirect to login after logout
        } catch (err: any) {
            setError(err.response?.data?.message || 'Logout failed');
        } finally {
            setActionLoading(false);
        }
    };

    const updateProfile = async (data: UpdateProfileData) => {
        try {
            setError(null);
            setActionLoading(true);
            const updatedUser = await authApi.updateProfile(data);
            setUser(updatedUser);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Profile update failed');
        } finally {
            setActionLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, actionLoading, error, login, register, logout, updateProfile, clearError }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export { AuthContext };