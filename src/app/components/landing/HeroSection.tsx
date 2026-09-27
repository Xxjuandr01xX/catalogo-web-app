import React, { useState, useEffect } from 'react';

type HeroSectionProps = {
    title: React.ReactNode;
    subtitle: string;
    images?: string[];
    gradientFrom?: string;
    gradientVia?: string;
    gradientTo?: string;
};

const HeroSection: React.FC<HeroSectionProps> = ({ 
    title, 
    subtitle, 
    images = [],
    gradientFrom = 'from-blue-600',
    gradientVia = 'via-blue-700',
    gradientTo = 'to-indigo-800'
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance carousel
    useEffect(() => {
        if (images.length <= 1) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 5000); // 5 seconds per slide
        
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <section className={`relative w-full bg-gradient-to-br ${gradientFrom} ${gradientVia} ${gradientTo} text-white py-12 px-4 overflow-hidden`}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                {/* Text Content */}
                <div className="text-center md:text-left flex-1">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3 leading-tight">
                        {title}
                    </h1>
                    <p className="text-blue-100/90 text-lg max-w-xl mx-auto md:mx-0">
                        {subtitle}
                    </p>
                </div>

                {/* Carousel (Only shows if images are provided) */}
                {images.length > 0 && (
                    <div className="flex-1 w-full max-w-lg relative group">
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-white/20 bg-slate-900">
                            {images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`Hero Slide ${index + 1}`}
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                                        index === currentIndex ? 'opacity-100' : 'opacity-0'
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Pagination Dots */}
                        {images.length > 1 && (
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                            index === currentIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/70'
                                        }`}
                                        aria-label={`Ir a slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-900/20 blur-3xl pointer-events-none"></div>
        </section>
    );
};

export default HeroSection;
