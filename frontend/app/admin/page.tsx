'use client';

import Auth from '../auth/auth';
import { useAuth } from '../utils/userContext';

export default function AdminPage() {
    const { user } = useAuth();

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
                        <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
                            <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
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