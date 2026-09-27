"use client"
import React, { useEffect, useState } from 'react';
import { get_site_config, update_site_config } from '@/app/services/ConfigService';
import type { SiteConfig } from '@/app/types/config.type';

const HomeConfiguracion = () => {
    const [config, setConfig] = useState<SiteConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const data = await get_site_config();
                setConfig(data);
            } catch (error) {
                console.error("Error fetching config:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!config) return;
        setConfig({
            ...config,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!config) return;
        setSaving(true);
        try {
            await update_site_config(config as unknown as Record<string, string>);
            alert('Configuración guardada exitosamente');
        } catch (error) {
            console.error("Error saving config:", error);
            alert('Hubo un error al guardar la configuración');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center h-48">
                <div className="text-sky-200 animate-pulse text-lg font-medium">Cargando configuración...</div>
            </div>
        );
    }

    if (!config) {
        return <div className="p-6 text-red-400">Error al cargar la configuración</div>;
    }

    return (
        <div className="p-6 animate-in fade-in zoom-in duration-300">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-sky-100 tracking-tight">Configuración del Sitio</h2>
                <p className="text-sky-300/80 mt-1">Actualiza la información y el contenido principal de la web.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-sky-950/40 p-6 sm:p-8 rounded-2xl border border-sky-800/50 shadow-lg space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Campos de Texto y Configuración General */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sky-200 font-semibold text-sm ml-1">Título del Sitio</label>
                        <input 
                            name="site_title" 
                            value={config.site_title || ''} 
                            onChange={handleChange} 
                            className="p-3 rounded-xl bg-sky-900/50 text-sky-100 border border-sky-700/60 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all placeholder:text-sky-700" 
                            placeholder="Ej. Mi Catálogo Web"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sky-200 font-semibold text-sm ml-1">Descripción del Sitio</label>
                        <input 
                            name="site_description" 
                            value={config.site_description || ''} 
                            onChange={handleChange} 
                            className="p-3 rounded-xl bg-sky-900/50 text-sky-100 border border-sky-700/60 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all" 
                            placeholder="Breve descripción para SEO"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sky-200 font-semibold text-sm ml-1">Número de WhatsApp</label>
                        <input 
                            name="whatsapp_number" 
                            value={config.whatsapp_number || ''} 
                            onChange={handleChange} 
                            className="p-3 rounded-xl bg-sky-900/50 text-sky-100 border border-sky-700/60 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all" 
                            placeholder="Ej. 584141234567"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sky-200 font-semibold text-sm ml-1">Color Principal (Hex)</label>
                        <input 
                            name="primary_color" 
                            value={config.primary_color || ''} 
                            onChange={handleChange} 
                            className="p-3 rounded-xl bg-sky-900/50 text-sky-100 border border-sky-700/60 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all" 
                            placeholder="Ej. #2563eb"
                        />
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2 mt-4">
                        <h3 className="text-xl font-bold text-sky-100/90 border-b border-sky-800/50 pb-2">Sección Hero (Banner)</h3>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sky-200 font-semibold text-sm ml-1">Título del Banner</label>
                        <input 
                            name="hero_title" 
                            value={config.hero_title || ''} 
                            onChange={handleChange} 
                            className="p-3 rounded-xl bg-sky-900/50 text-sky-100 border border-sky-700/60 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all" 
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sky-200 font-semibold text-sm ml-1">Subtítulo del Banner</label>
                        <input 
                            name="hero_subtitle" 
                            value={config.hero_subtitle || ''} 
                            onChange={handleChange} 
                            className="p-3 rounded-xl bg-sky-900/50 text-sky-100 border border-sky-700/60 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all" 
                        />
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-sky-200 font-semibold text-sm ml-1">URL Imagen Hero 1</label>
                        <input 
                            name="hero_image_1" 
                            value={config.hero_image_1 || ''} 
                            onChange={handleChange} 
                            className="p-3 rounded-xl bg-sky-900/50 text-sky-100 border border-sky-700/60 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all" 
                        />
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-sky-200 font-semibold text-sm ml-1">URL Imagen Hero 2</label>
                        <input 
                            name="hero_image_2" 
                            value={config.hero_image_2 || ''} 
                            onChange={handleChange} 
                            className="p-3 rounded-xl bg-sky-900/50 text-sky-100 border border-sky-700/60 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all" 
                        />
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-sky-200 font-semibold text-sm ml-1">URL Imagen Hero 3</label>
                        <input 
                            name="hero_image_3" 
                            value={config.hero_image_3 || ''} 
                            onChange={handleChange} 
                            className="p-3 rounded-xl bg-sky-900/50 text-sky-100 border border-sky-700/60 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all" 
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-6 mt-6 border-t border-sky-800/50">
                    <button 
                        type="submit" 
                        disabled={saving} 
                        className="bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Guardando...
                            </>
                        ) : 'Guardar Configuración'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default HomeConfiguracion;
