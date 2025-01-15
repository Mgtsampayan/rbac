'use client'; // Mark this as a Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../utils/apiClient';

export default function Login() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await apiClient.post('/auth/login', { username, password });
            localStorage.setItem('token', res.data.token); // Save token to localStorage
            router.push('/dashboard'); // Redirect to dashboard after successful login
        } catch (err) {
            console.error(err);
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p>
                Don&apos;t have an account? <a href="/register">Register here</a>.
            </p>
        </div>
    );
}