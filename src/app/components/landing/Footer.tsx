import React from 'react';

export type FooterLink = {
    label: string;
    url: string;
};

type FooterProps = {
    brandName?: string;
    developerName?: string;
    year?: number;
    links?: FooterLink[];
};

const Footer: React.FC<FooterProps> = ({ 
    brandName = "Catálogo",
    developerName = "Devjuand",
    year = new Date().getFullYear(),
    links = [
        { label: "Términos", url: "#" },
        { label: "Privacidad", url: "#" },
        { label: "Contacto", url: "#" }
    ]
}) => {
    return (
        <footer className="w-full bg-slate-900 text-slate-400 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <span className="text-white font-semibold">{brandName}</span>
                    </div>

                    <p className="text-sm">
                        Desarrollado con 💙 por <span className="text-white font-medium">{developerName}</span> © {year}
                    </p>

                    <div className="flex items-center gap-4">
                        {links.map((link, i) => (
                            <a key={i} href={link.url} className="hover:text-white transition-colors text-sm">
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
