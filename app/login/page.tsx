'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/login', { email, password });
            login(response.data.token);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-gray-800 p-8 shadow-2xl transition-all hover:shadow-cyan-500/20">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
                        Sign in to Admin
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Enter your credentials to access the panel
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="relative block w-full rounded-lg border-0 bg-gray-700 p-3 text-white placeholder-gray-400 ring-1 ring-inset ring-gray-600 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="relative block w-full rounded-lg border-0 bg-gray-700 p-3 text-white placeholder-gray-400 ring-1 ring-inset ring-gray-600 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-900/50 p-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-lg bg-cyan-600 px-3 py-3 text-sm font-semibold text-white hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 transition-all active:scale-95"
                        >
                            Sign in
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <Link href="/register" className="font-medium text-cyan-400 hover:text-cyan-300">
                            Don't have an account? Register now
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
