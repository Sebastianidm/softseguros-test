import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CartItem, Product } from '../types';
import { api } from '../services/api';

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    saveCartToBackend: () => Promise<void>;
    total: number;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('softseguros_cart');
        return saved ? JSON.parse(saved) : [];
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem('softseguros_cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (product: Product) => {
        setItems(prev => {
            const existing = prev.find(i => i.product_id === product.id);
            if (existing) {
                return prev.map(i => i.product_id === product.id
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
                );
            }
            return [...prev, {
                product_id: product.id,
                product_name: product.name,
                price: product.price,
                quantity: 1,
                image_url: product.image_url
            }];
        });
    };

    const removeFromCart = (productId: number) => {
        setItems(prev => prev.filter(i => i.product_id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity < 1) return;
        setItems(prev => prev.map(i => i.product_id === productId ? { ...i, quantity } : i));
    };

    const saveCartToBackend = async () => {
        try {
            setIsLoading(true);
            await api.saveCart(items);
            alert('Carrito guardado correctamente en BD');
            setItems([]);
            localStorage.removeItem('softseguros_cart');
        } catch (error) {
            console.error(error);
            alert('Error al guardar el carrito');
        } finally {
            setIsLoading(false);
        }
    };

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, saveCartToBackend, total, isLoading }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
    return context;
};