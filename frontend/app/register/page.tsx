'use client'; // Mark this as a Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../utils/apiClient';

export default function Register() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [role, setRole] = useState<string>('student'); // Default role
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await apiClient.post('/auth/register', { username, password, role });
            console.log(res.data.message); // "User registered successfully."
            router.push('/login'); // Redirect to login page after successful registration
        } catch (err) {
            console.log(err);
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div>
            <h1>Register</h1>
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
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                >
                    <option value="admin">Admin</option>
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="registrar">Registrar</option>
                    <option value="accounting">Accounting</option>
                    <option value="hr">HR</option>
                    <option value="parent">Parent</option>
                </select>
                <button type="submit">Register</button>
            </form>
            <p>
                Already have an account? <a href="/login">Login here</a>.
            </p>
        </div>
    );
}