'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../utils/userContext';
import { useEffect } from 'react';

export default function LoginPage() {
    const router = useRouter();
    const { login, error, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(formData.email, formData.password);
            // Redirection is handled in the context on successful login
        } catch (err) {
            // Error is handled by the AuthContext
            console.error('Login failed:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div>
            <div>
                <h2>
                    Sign in to your account
                </h2>
            </div>
            {error && (
                <div>
                    <span>{error}</span>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <button
                        type="submit"
                    >
                        Sign in
                    </button>
                </div>
            </form>
        </div>
    );
}