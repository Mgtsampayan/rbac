'use client';

import { useState } from 'react';
// import { useRouter } from 'next/navigation';
import { useAuth } from '../utils/userContext';
import Link from 'next/link';

export default function RegisterPage() {
    // const router = useRouter();
    const { register, error, clearError } = useAuth(); // Include clearError
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [formError, setFormError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        clearError(); // Clear any previous auth errors

        if (formData.password !== formData.confirmPassword) {
            setFormError('Passwords do not match');
            return;
        }

        try {
            await register({
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            // router.push('/dashboard'); // Redirection is handled in userContext
        } catch (err) {
            console.error('Registration failed:', err);
            // Error is now handled and displayed by the AuthContext
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
                    Create your account
                </h2>
            </div>
            {(error || formError) && (
                <div>
                    <span>{error || formError}</span>
                    <span onClick={clearError}> {/* Make clickable */}
                        Close
                    </span>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
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
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <button
                        type="submit"
                    >
                        Register
                    </button>
                </div>
            </form>
            <div>
                <Link href="/login">
                    Already have an account? Sign in
                </Link>
            </div>
        </div>
    );
}