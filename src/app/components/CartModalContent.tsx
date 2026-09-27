"use client";
import React from "react";
import { useCart } from "@/app/context/CartContext";

const CartModalContent = ({ fase }: { fase: (fase: string) => void }) => {
    const { items, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                </div>
                <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tu carrito está vacío
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Agrega productos desde el catálogo para verlos aquí.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Items list */}
            <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto pr-1">
                {items.map((item) => (
                    <div
                        key={item.product.id}
                        className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                        {/* Product image */}
                        <img
                            src={item.product.imageurl}
                            alt={item.product.name}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-slate-200 dark:border-slate-600"
                        />

                        {/* Product info */}
                        <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                {item.product.name}
                            </h5>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {item.product.category}
                            </p>
                            <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                                ${item.product.price.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                            </p>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => updateQuantity(item.product.id, item.cantidad - 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors text-sm font-bold cursor-pointer"
                                aria-label="Disminuir cantidad"
                            >
                                −
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-slate-900 dark:text-white tabular-nums">
                                {item.cantidad}
                            </span>
                            <button
                                onClick={() => updateQuantity(item.product.id, item.cantidad + 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors text-sm font-bold cursor-pointer"
                                aria-label="Aumentar cantidad"
                            >
                                +
                            </button>
                        </div>

                        {/* Remove button */}
                        <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors cursor-pointer"
                            aria-label="Eliminar del carrito"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200 dark:border-slate-600" />

            {/* Summary */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span>Productos ({totalItems})</span>
                    <span>${totalPrice.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white">
                    <span>Total</span>
                    <span className="text-blue-600 dark:text-blue-400">
                        ${totalPrice.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
                <button
                    onClick={clearCart}
                    className="flex-1 py-2.5 px-4 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-xl transition-colors cursor-pointer"
                >
                    Vaciar carrito
                </button>
                <button
                    onClick={() => fase('Pay')}
                    className="flex-[2] py-2.5 px-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-md shadow-blue-500/25 cursor-pointer"
                >
                    Proceder al pago
                </button>
            </div>
        </div>
    );
};

export default CartModalContent;
