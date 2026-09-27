"use client";
import React, { useState } from 'react';
import { useCart } from '@/app/context/CartContext';
import type { Productos } from '@/app/types/productos.type';

type CardCatalogoProps = {
    producto: Productos;
}

const CardCatalogo = ({ producto }: CardCatalogoProps) => {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        addToCart(producto);
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
    };

    return (
        <div className="group bg-white dark:bg-slate-800 block w-full border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 ease-out overflow-hidden hover:-translate-y-1">
            {/* Image container with overlay on hover */}
            <div className="relative overflow-hidden">
                <img
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    src={producto.imageurl}
                    alt={producto.name}
                />
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Category badge positioned over the image */}
                <span className="absolute top-3 left-3 inline-flex items-center bg-blue-600/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
                    {producto.category}
                </span>
            </div>

            {/* Content area */}
            <div className="p-5">
                <h5 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-1 line-clamp-2">
                    {producto.name}
                </h5>

                {/* Price with accent color */}
                <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">
                    ${producto.price.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                </p>

                {/* Add to cart button */}
                <button
                    className={`w-full inline-flex items-center justify-center gap-2 font-semibold rounded-xl text-sm px-5 py-2.5 transition-all duration-200 active:scale-95 cursor-pointer ${
                        added
                            ? 'text-white bg-gradient-to-r from-green-500 to-emerald-600'
                            : 'text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300/50 dark:focus:ring-blue-800/50'
                    }`}
                    onClick={handleAdd}
                >
                    {added ? (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            ¡Agregado!
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                            </svg>
                            Agregar
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default CardCatalogo;
