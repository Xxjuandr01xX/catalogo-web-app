"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SiteConfig } from '../types/config.type';
import { get_site_config } from '../services/ConfigService';

interface ConfigContextType {
    config: SiteConfig | null;
    isLoading: boolean;
}

const ConfigContext = createContext<ConfigContextType>({
    config: null,
    isLoading: true
});

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
    const [config, setConfig] = useState<SiteConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const data = await get_site_config();
                setConfig(data);
                
                // Aplicar color primario al root
                if (data.primary_color) {
                    document.documentElement.style.setProperty('--color-primary', data.primary_color);
                }
                
                // Actualizar título y descripción dinámicamente en el cliente (opcional, ya que layout lo hará en el server)
                document.title = data.site_title || 'Catálogo Web';
            } catch (error) {
                console.error("Error fetching site config:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchConfig();
    }, []);

    return (
        <ConfigContext.Provider value={{ config, isLoading }}>
            {children}
        </ConfigContext.Provider>
    );
};
