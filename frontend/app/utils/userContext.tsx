'use client';

import React, { createContext, useContext, useState } from 'react';
import { authApi, User, UpdateProfileData } from './apiClient';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    actionLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: { username: string; email: string; password: string; role?: string }) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: UpdateProfileData) => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        // Check if we're in the browser and if there's a stored user
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        }
        return null;
    });
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            setActionLoading(true);
            const { user: userData } = await authApi.login({ email, password });
            
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
            throw err;
        } finally {
            setActionLoading(false);
        }
    };

    const register = async (userData: { username: string; email: string; password: string; role?: string }) => {
        try {
            setError(null);
            setActionLoading(true);
            const { user: newUser } = await authApi.register({
                ...userData,
                role: userData.role || 'student',
            });
            
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(newUser));
            setUser(newUser);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
            throw err;
        } finally {
            setActionLoading(false);
        }
    };

    const logout = async () => {
        try {
            setError(null);
            setActionLoading(true);
            await authApi.logout();
            
            // Clear user data from localStorage
            localStorage.removeItem('user');
            setUser(null);
            router.push('/login');
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
            
            // Update user data in localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser));
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
        <AuthContext.Provider value={{
            user,
            loading,
            actionLoading,
            error,
            login,
            register,
            logout,
            updateProfile,
            clearError
        }}>
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