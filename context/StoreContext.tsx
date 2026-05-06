import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, SaleRecord } from '../types';
import { INITIAL_CART } from '../constants';

interface StoreContextType {
    cart: CartItem[];
    addToCart: (product: Product, type?: 'part' | 'labor' | 'tire', quantity?: number) => void;
    removeFromCart: (id: string | number) => void;
    updateCartItemQuantity: (id: string | number, delta: number) => void;
    clearCart: () => void;

    salesHistory: SaleRecord[];
    completeSale: (paymentMethod: string, customerName?: string) => void;

    inventory: Record<string, number>; // Maps product ID to stock count
    updateInventory: (productId: string | number, delta: number) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);
    const [salesHistory, setSalesHistory] = useState<SaleRecord[]>([]);
    const [inventory, setInventory] = useState<Record<string, number>>({});

    // Mock initial sales history for dashboard demo
    useEffect(() => {
        setSalesHistory([
            {
                id: 'ORD-2930',
                date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                total: 1250.00,
                items: [],
                paymentMethod: 'Credit Card',
                customerName: 'Alice Smith'
            },
            {
                id: 'ORD-2931',
                date: new Date().toISOString(), // Today
                total: 450.50,
                items: [],
                paymentMethod: 'Cash',
                customerName: 'Bob Jones'
            }
        ]);
    }, []);

    const addToCart = (product: Product, type: 'part' | 'labor' | 'tire' = 'part', quantity: number = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity, type }];
        });
    };

    const removeFromCart = (id: string | number) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateCartItemQuantity = (id: string | number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => {
        setCart([]);
    };

    const completeSale = (paymentMethod: string, customerName: string = 'Walk-in Customer') => {
        if (cart.length === 0) return;

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const newSale: SaleRecord = {
            id: `ORD-${Math.floor(Math.random() * 10000)}`,
            date: new Date().toISOString(),
            total,
            items: [...cart],
            paymentMethod,
            customerName
        };

        setSalesHistory(prev => [newSale, ...prev]);

        // Update inventory
        cart.forEach(item => {
            updateInventory(item.id, -item.quantity);
        });

        clearCart();
    };

    const updateInventory = (productId: string | number, delta: number) => {
        setInventory(prev => ({
            ...prev,
            [productId]: (prev[productId] || 100) + delta // Default mock stock 100 if unknown
        }));
    };

    return (
        <StoreContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateCartItemQuantity,
            clearCart,
            salesHistory,
            completeSale,
            inventory,
            updateInventory
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
};
