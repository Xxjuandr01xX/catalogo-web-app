import React from 'react';
import CardCatalogo from '@/app/components/CardCatalogo';


const Page = () => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
            {/* Header con gradiente y glassmorphism */}
            <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold tracking-tight">
                                Catálogo
                            </span>
                        </div>

                        {/* Search bar */}
                        <div className="hidden md:flex flex-1 max-w-md mx-8">
                            <div className="relative w-full">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Buscar productos..."
                                    className="w-full pl-10 pr-4 py-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all"
                                />
                            </div>
                        </div>

                        {/* Nav actions */}
                        <div className="flex items-center gap-3">
                            <button className="relative p-2 hover:bg-white/10 rounded-xl transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                                </svg>
                                {/* Badge del carrito */}
                                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    4
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero section */}
            <section className="w-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-12 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
                        Encuentra los mejores
                        <span className="block text-blue-200">repuestos y accesorios</span>
                    </h1>
                    <p className="text-blue-200/80 text-lg max-w-2xl mx-auto">
                        Explora nuestro catálogo con los mejores precios del mercado
                    </p>
                </div>
            </section>

            {/* Category filter chips */}
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-5">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {['Todos', 'Repuestos', 'Accesorios', 'Herramientas', 'Lubricantes'].map((cat, i) => (
                        <button
                            key={cat}
                            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm ${i === 0
                                    ? 'bg-blue-600 text-white shadow-blue-500/30'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Productos grid */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Productos destacados
                    </h2>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                        4 productos
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <CardCatalogo
                        titulo="Tripa para Caucho"
                        categoria="Repuestos"
                        price="1.50$"
                        imageUrl="https://picsum.photos/id/237/400/300"
                    />

                    <CardCatalogo
                        titulo="Tripa para Caucho"
                        categoria="Repuestos"
                        price="1.50$"
                        imageUrl="https://picsum.photos/id/238/400/300"
                    />

                    <CardCatalogo
                        titulo="Tripa para Caucho"
                        categoria="Repuestos"
                        price="1.50$"
                        imageUrl="https://picsum.photos/id/239/400/300"
                    />

                    <CardCatalogo
                        titulo="Tripa para Caucho"
                        categoria="Repuestos"
                        price="1.50$"
                        imageUrl="https://picsum.photos/id/240/400/300"
                    />
                </div>
            </main>

            {/* Footer mejorado */}
            <footer className="w-full bg-slate-900 text-slate-400 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <span className="text-white font-semibold">Catálogo</span>
                        </div>

                        <p className="text-sm">
                            Desarrollado con 💙 por <span className="text-white font-medium">Devjuand</span> © 2026
                        </p>

                        <div className="flex items-center gap-4">
                            <a href="#" className="hover:text-white transition-colors text-sm">Términos</a>
                            <a href="#" className="hover:text-white transition-colors text-sm">Privacidad</a>
                            <a href="#" className="hover:text-white transition-colors text-sm">Contacto</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Page;
