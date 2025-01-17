// frontend/utils/userContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // Start with loading true for initial check
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const isAuthenticated = !!user;

    // Function to store user data (consider more secure options)
    const storeUser = (userData: User) => {
        try {
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (e) {
            console.error("Error storing user data in localStorage:", e);
        }
    };

    // Function to remove user data
    const removeUser = () => {
        try {
            localStorage.removeItem('user');
        } catch (e) {
            console.error("Error removing user data from localStorage:", e);
        }
    };

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                }
            } catch (error) {
                console.error("Error loading user from localStorage:", error);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            setActionLoading(true);
            const { user: userData } = await authApi.login({ email, password });
            storeUser(userData);
            setUser(userData);
            // Redirect based on role
            switch (userData.role) {
                case 'admin':
                    router.push('/admin');
                    break;
                case 'student':
                    router.push('/student');
                    break;
                case 'faculty':
                    router.push('/faculty');
                    break;
                case 'registrar':
                    router.push('/registrar');
                    break;
                case 'accounting':
                    router.push('/accounting');
                    break;
                case 'hr':
                    router.push('/hr');
                    break;
                case 'parent':
                    router.push('/parent');
                    break;
                default:
                    router.push('/dashboard'); // Default fallback
                    break;
            }
        } catch (err: any) {
            setError(err.message || 'Login failed');
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
            storeUser(newUser);
            setUser(newUser);
            // Redirect to default dashboard after registration
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setActionLoading(false);
        }
    };

    const logout = async () => {
        try {
            setError(null);
            setActionLoading(true);
            await authApi.logout();
            removeUser();
            setUser(null);
            router.push('/login');
        } catch (err: any) {
            setError(err.message || 'Logout failed');
        } finally {
            setActionLoading(false);
        }
    };

    const updateProfile = async (data: UpdateProfileData) => {
        try {
            setError(null);
            setActionLoading(true);
            const updatedUser = await authApi.updateProfile(data);
            storeUser(updatedUser);
            setUser(updatedUser);
        } catch (err: any) {
            setError(err.message || 'Profile update failed');
        } finally {
            setActionLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    const contextValue: AuthContextType = {
        user,
        loading,
        actionLoading,
        error,
        login,
        register,
        logout,
        updateProfile,
        clearError,
        isAuthenticated,
    };

    return (
        <AuthContext.Provider value={contextValue}>
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