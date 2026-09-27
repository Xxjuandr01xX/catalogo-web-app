"use client"
import React, { useState, useEffect } from 'react';
import CardCatalogo from '@/app/components/CardCatalogo';
import CartModalContent from '@/app/components/CartModalContent';
import Modal from '@/app/components/ui/Modal';
import PayPage from '@/app/components/PayPage';

// Nuevos componentes de UI
import Header from '@/app/components/landing/Header';
import HeroSection from '@/app/components/landing/HeroSection';
import Footer from '@/app/components/landing/Footer';

// Servicios y Contextos
import { get_all_productos } from '../../services/ProductosServices';
import { get_all_category } from '@/app/services/CategoryService';
import type { Productos } from '@/app/types/productos.type';
import type { category } from '@/app/types/category.type';
import { CartContextProvider, useCart } from '@/app/context/CartContext';
import { ConfigProvider, useConfig } from '@/app/context/ConfigContext';

const PageContent = () => {
    const [originalProductos, setOriginalProductos] = useState<Productos[]>([]);
    const [productosList, SetProductosList] = useState<Productos[]>([]);
    const [categoryList, SetCategoryList] = useState<category[]>([]);
    const [inputFilter, SetInputFilter] = useState<string>('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [fase, setFase] = useState<string>('select')

    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const { totalItems } = useCart();
    const { config, isLoading: isConfigLoading } = useConfig();

    const filterProducts = (categoriname: string | null) => {
        setActiveCategory(categoriname);
    }

    useEffect(() => {
        let filtered = originalProductos;

        if (activeCategory) {
            filtered = filtered.filter((p) => p.category === activeCategory);
        }

        const query = inputFilter.trim().toLowerCase();
        if (query.length > 0) {
            filtered = filtered.filter((p) =>
                p.name.toLowerCase().includes(query) ||
                p.descripcion.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query)
            );
        }

        SetProductosList(filtered);
    }, [inputFilter, activeCategory, originalProductos]);

    useEffect(() => {
        const request_productos = async () => {
            const data = await get_all_productos();
            setOriginalProductos(data);
        }

        const request_categorias = async () => {
            const data = await get_all_category();
            SetCategoryList(data);
        }

        request_productos();
        request_categorias();
    }, [])

    if (isConfigLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">Cargando tienda...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
            {/* Header Component */}
            <Header 
                inputFilter={inputFilter}
                setInputFilter={SetInputFilter}
                totalItems={totalItems}
                onCartClick={() => setIsCartModalOpen(true)}
            />

            {/* Hero Section Component */}
            {fase === 'select' && (
                <HeroSection 
                    title={
                        <>
                            {config?.hero_title.split(' ').slice(0, -2).join(' ')} <span className="block text-blue-200" style={{ color: config?.primary_color }}>{config?.hero_title.split(' ').slice(-2).join(' ')}</span>
                        </>
                    }
                    subtitle={config?.hero_subtitle || "Explora nuestro catálogo con los mejores precios"}
                    images={[
                        config?.hero_image_1 || "https://images.unsplash.com/photo-1486262715619-670810a07153?q=80&w=800&auto=format&fit=crop",
                        config?.hero_image_2 || "https://images.unsplash.com/photo-1620023594191-443b782987eb?q=80&w=800&auto=format&fit=crop",
                        config?.hero_image_3 || "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=800&auto=format&fit=crop"
                    ].filter(Boolean)}
                />
            )}

            {fase === 'select' ? (
                <>
                    {/* Category filter chips */}
                    <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-6">
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            <button
                                onClick={() => filterProducts(null)}
                                style={activeCategory === null ? { backgroundColor: config?.primary_color, color: 'white' } : {}}
                                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm ${activeCategory === null
                                    ? 'shadow-blue-500/30'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                    }`}
                            >
                                Todos
                            </button>
                            {categoryList.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={(e) => { e.preventDefault(); filterProducts(cat.name) }}
                                    style={activeCategory === cat.name ? { backgroundColor: config?.primary_color, color: 'white' } : {}}
                                    className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm ${activeCategory === cat.name
                                        ? 'shadow-blue-500/30'
                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                        }`}
                                >
                                    {cat.name}
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
                                {productosList.length} productos
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {productosList.length === 0 ? (
                                <p className="text-slate-500 dark:text-slate-400 col-span-full text-center py-8">No hay productos disponibles.</p>
                            ) : (
                                productosList.map((producto) => (
                                    <CardCatalogo
                                        key={producto.id}
                                        producto={producto}
                                    />
                                ))
                            )}
                        </div>
                    </main>
                </>
            ) : <PayPage />}

            {/* Footer Component */}
            <Footer />

            {/* Modal del carrito */}
            <Modal
                title="Tu Carrito"
                id="ModalCarrito"
                isOpen={isCartModalOpen}
                onClose={() => setIsCartModalOpen(false)}
                maxWidth="max-w-lg"
            >
                <CartModalContent fase={setFase} />
            </Modal>
        </div>
    );
}

const Page = () => {
    return (
        <ConfigProvider>
            <CartContextProvider>
                <PageContent />
            </CartContextProvider>
        </ConfigProvider>
    );
}

export default Page;
