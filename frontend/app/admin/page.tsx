'use client';

import Auth from '../auth/auth';
import { useAuth } from '../utils/userContext';
import { useState } from 'react';
import apiClient from '../utils/apiClient';

export default function AdminPage() {
    const { user } = useAuth();
    const [createUserFormData, setCreateUserFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'student', // Default role
    });
    const [createUserMessage, setCreateUserMessage] = useState('');
    const [createUserError, setCreateUserError] = useState('');

    const handleCreateUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCreateUserFormData({ ...createUserFormData, [e.target.name]: e.target.value });
    };

    const handleCreateUserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateUserMessage('');
        setCreateUserError('');

        try {
            const response = await apiClient.post('/api/auth/admin/register', createUserFormData);
            setCreateUserMessage(response.data.message);
            // Reset the form
            setCreateUserFormData({ username: '', email: '', password: '', role: 'student' });
        } catch (error: any) {
            setCreateUserError(error?.response?.data?.message || 'Error creating user.');
        }
    };

    return (
        <Auth requiredRole={['admin']}>
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                            </div>
                            <div className="flex items-center">
                                <span className="text-gray-700">Admin: {user?.username}</span>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
                            <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

                            <div className="mb-6 p-4 bg-white rounded-lg shadow">
                                <h3 className="text-lg font-semibold mb-4">Create New User</h3>
                                {createUserMessage && <div className="text-green-500 mb-2">{createUserMessage}</div>}
                                {createUserError && <div className="text-red-500 mb-2">{createUserError}</div>}
                                <form onSubmit={handleCreateUserSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={createUserFormData.username}
                                            onChange={handleCreateUserChange}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={createUserFormData.email}
                                            onChange={handleCreateUserChange}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={createUserFormData.password}
                                            onChange={handleCreateUserChange}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                                        <select
                                            id="role"
                                            name="role"
                                            value={createUserFormData.role}
                                            onChange={handleCreateUserChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                            <option value="student">Student</option>
                                            <option value="faculty">Faculty</option>
                                            <option value="registrar">Registrar</option>
                                            <option value="accounting">Accounting</option>
                                            <option value="hr">HR</option>
                                            <option value="parent">Parent</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <button type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            Create User
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="bg-white p-6 rounded-lg shadow">
                                    <h3 className="text-lg font-semibold mb-2">User Management</h3>
                                    {/* Add user management functionality here */}
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow">
                                    <h3 className="text-lg font-semibold mb-2">System Settings</h3>
                                    {/* Add settings management here */}
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow">
                                    <h3 className="text-lg font-semibold mb-2">Analytics</h3>
                                    {/* Add analytics dashboard here */}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </Auth>
    );
}