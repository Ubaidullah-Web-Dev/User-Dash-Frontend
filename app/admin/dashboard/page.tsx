'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const { user, logout, loading, isAuthenticated } = useAuth();
    const [adminData, setAdminData] = useState<any>(null);
    const [fetchError, setFetchError] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [loading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            api.get('/admin/dashboard')
                .then(response => setAdminData(response.data))
                .catch(err => setFetchError('Failed to load admin data'));
        }
    }, [isAuthenticated]);

    if (loading || !isAuthenticated) {
        return <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white text-xl">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            {/* Sidebar/Header Navigation (Simplified) */}
            <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Admin Panel
                </h1>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-400">Welcome, {user?.email}</span>
                    <button
                        onClick={logout}
                        className="bg-red-600 hover:bg-red-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <main className="p-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Stats Cards */}
                    {[
                        { label: 'Total Sales', value: '$12,450', color: 'from-green-400 to-emerald-600' },
                        { label: 'New Customers', value: '48', color: 'from-blue-400 to-indigo-600' },
                        { label: 'Pending Orders', value: '12', color: 'from-amber-400 to-orange-600' }
                    ].map((stat, i) => (stat &&
                        <div key={i} className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
                            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                            <h3 className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                                {stat.value}
                            </h3>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl">
                    <h2 className="text-xl font-semibold mb-6">System Status</h2>
                    {adminData ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-700/50 rounded-lg">
                                <p className="text-cyan-400 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                                    {JSON.stringify(adminData, null, 2)}
                                </p>
                            </div>
                            <div className="flex items-center text-green-400 text-sm">
                                <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                                Backend API Connection: Active
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-500 animate-pulse">
                            {fetchError || 'Fetching secure data...'}
                        </div>
                    )}
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                        <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-center transition-all">
                                <span className="block text-2xl mb-1">📦</span>
                                Add Product
                            </button>
                            <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-center transition-all">
                                <span className="block text-2xl mb-1">👥</span>
                                View Users
                            </button>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                        <h3 className="text-lg font-medium mb-4">Security Insights</h3>
                        <ul className="space-y-3">
                            <li className="flex justify-between text-sm">
                                <span className="text-gray-400">Auth Method</span>
                                <span className="text-cyan-400">JWT stateless</span>
                            </li>
                            <li className="flex justify-between text-sm">
                                <span className="text-gray-400">Current Role</span>
                                <span className="text-cyan-400">{user?.roles.join(', ')}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
