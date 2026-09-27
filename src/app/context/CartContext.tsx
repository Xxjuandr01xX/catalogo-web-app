"use client";
import { createContext, useState, useContext, useCallback } from "react";
import type { CartItem } from "../types/cart.type";
import type { Productos } from "../types/productos.type";

type CartContextValue = {
    items: CartItem[];
    addToCart: (product: Productos) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, cantidad: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
};

const CartContext = createContext<CartContextValue | null>(null);

type CartContextProps = {
    children: React.ReactNode;
};

export const CartContextProvider = ({ children }: CartContextProps): React.ReactNode => {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = (product: Productos) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }
            return [...prev, { product, cantidad: 1 }];
        });
    };

    const removeFromCart = (productId: number) => {
        setItems((prev) => prev.filter((item) => item.product.id !== productId));
    };

    const updateQuantity = (productId: number, cantidad: number) => {
        if (cantidad <= 0) {
            setItems((prev) => prev.filter((item) => item.product.id !== productId));
            return;
        }
        setItems((prev) =>
            prev.map((item) =>
                item.product.id === productId
                    ? { ...item, cantidad }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.cantidad, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

/** Hook para consumir el contexto del carrito */
export const useCart = (): CartContextValue => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart debe usarse dentro de un <CartContextProvider>");
    }
    return context;
};
