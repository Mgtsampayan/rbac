'use client';

import Auth from '../auth/auth';
import { useAuth } from '../utils/userContext';

export default function DashboardPage() {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <Auth>
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <h1 className="text-xl font-semibold">Dashboard</h1>
                            </div>
                            <div className="flex items-center">
                                <span className="mr-4">Welcome, {user?.username}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
                            <h2 className="text-2xl font-bold mb-4">Your Dashboard</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="bg-white p-6 rounded-lg shadow">
                                    <h3 className="text-lg font-semibold mb-2">User Information</h3>
                                    <p>Role: {user?.role}</p>
                                    <p>Email: {user?.email}</p>
                                </div>
                                {/* Add more dashboard widgets here */}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </Auth>
    );
}