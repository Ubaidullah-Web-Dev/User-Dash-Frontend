'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { useAuth } from './AuthContext';

interface CartContextType {
    cartCount: number;
    fetchCartCount: () => Promise<void>;
}

interface CartItem {
    id: number;
    isSavedForLater: boolean;
}

const CartContext = createContext<CartContextType>({
    cartCount: 0,
    fetchCartCount: async () => { },
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartCount, setCartCount] = useState(0);
    const { isAuthenticated } = useAuth();

    const fetchCartCount = useCallback(async () => {
        if (!isAuthenticated) {
            setCartCount(0);
            return;
        }
        try {
            const response = await api.get('/cart');
            const items: CartItem[] = response.data;
            const activeItems = items.filter((item) => !item.isSavedForLater);
            setCartCount(activeItems.length);
        } catch (error) {
            console.error('Failed to fetch cart count', error);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchCartCount();
        }, 0);
        return () => clearTimeout(timeout);
    }, [fetchCartCount]);

    return (
        <CartContext.Provider value={{ cartCount, fetchCartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
