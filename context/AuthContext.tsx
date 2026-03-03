'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { useCallback } from 'react';

interface User {
    email: string;
    roles: string[];
    name?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, redirectTo?: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

interface JWTPayload {
    email?: string;
    username?: string;
    roles?: string[];
    exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        router.push('/login');
    }, [router]);

    useEffect(() => {
        const checkToken = () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const decoded = jwtDecode<JWTPayload>(storedToken);
                    // Check if token is expired
                    if (decoded.exp * 1000 < Date.now()) {
                        logout();
                    } else {
                        setToken(storedToken);
                        setUser({
                            email: decoded.email || decoded.username || '',
                            roles: decoded.roles || [],
                        });
                    }
                } catch (error) {
                    console.error('Failed to decode token:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        const timeout = setTimeout(checkToken, 0);
        return () => clearTimeout(timeout);
    }, [logout]);

    const login = useCallback((newToken: string, redirectTo?: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        const decoded = jwtDecode<JWTPayload>(newToken);
        setUser({
            email: decoded.email || decoded.username || '',
            roles: decoded.roles || [],
        });

        if (redirectTo) {
            router.push(redirectTo);
        } else {
            // Default: if admin role exists, go to admin, else home
            const roles = decoded.roles || [];
            if (roles.includes('ROLE_ADMIN')) {
                router.push('/admin/dashboard');
            } else {
                router.push('/');
            }
        }
    }, [router]);

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
