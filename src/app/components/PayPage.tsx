import React, { useState } from 'react';
import { useCart } from '@/app/context/CartContext';
import { insert_cart_order, whats_app_confirmation } from '@/app/services/CartService';
import type { Cart } from '@/app/types/cart.type';

const PayPage = () => {
    const { items, totalPrice, totalItems, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderResult, setOrderResult] = useState<Cart | null>(null);
    const [whatsappUrl, setWhatsappUrl] = useState<string>("");

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        const formData = new FormData(e.target as HTMLFormElement);
        
        try {
            const result = await insert_cart_order({
                client_id: null,
                guest_client_fname: formData.get("guest_client_fname") as string,
                guest_client_lname: formData.get("guest_client_lname") as string,
                guest_client_phone: formData.get("guest_client_phone") as string,
                subtotal: totalPrice,
                total: totalPrice,
                items: items
            });

            const url = await whats_app_confirmation(result);
            setWhatsappUrl(url);

            setOrderResult(result);
            setIsSuccess(true);
            clearCart();
        } catch (error) {
            console.error("Error al procesar el pago:", error);
            alert("Hubo un error al procesar el pedido.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isSuccess && orderResult) {
        return (
            <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col items-center justify-center animate-fade-in-up">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 text-center">
                    ¡Pedido registrado con éxito!
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 text-center mb-8 max-w-md">
                    Tu pedido (ID: {orderResult.id}) ha sido guardado. Confírmalo por WhatsApp para proceder con el pago y envío.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all duration-200 shadow-md shadow-green-500/30 cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.441-1.273.6-1.446c.153-.166.331-.208.441-.208.11 0 .221 0 .314.004.112.006.223-.005.319.231.122.3.415 1.017.452 1.09.037.073.061.157.018.248-.043.091-.067.147-.135.227-.068.081-.144.177-.202.241-.067.074-.138.155-.06.289.078.134.346.571.742.926.51.458.939.601 1.073.667.134.067.214.055.294-.037.079-.092.345-.4.437-.538.092-.138.184-.114.306-.067.122.046.772.364.906.431.134.067.226.1.257.155.031.054.031.316-.113.721z" />
                            <path d="M12.031 2C6.5 2 2 6.5 2 12.034c0 1.767.466 3.486 1.354 5.006l-1.354 4.96 5.086-1.334C8.591 21.523 10.282 22 12.031 22c5.529 0 10.031-4.501 10.031-10.034 0-5.528-4.502-10.031-10.031-10.031zm0 18.232c-1.463 0-2.898-.382-4.156-1.106l-.298-.172-3.088.809.822-3.011-.189-.3A8.204 8.204 0 013.784 12.034c0-4.545 3.7-8.244 8.247-8.244 4.546 0 8.245 3.699 8.245 8.244 0 4.546-3.699 8.245-8.245 8.244z" />
                        </svg>
                        Confirmar por WhatsApp
                    </a>
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 shadow-sm cursor-pointer"
                    >
                        Volver al catálogo
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
            <div className="mb-8 flex items-center gap-4">
                <button 
                    onClick={() => window.location.reload()}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    aria-label="Volver"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Finalizar Compra
                </h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Formulario de pago */}
                <div className="flex-[2] bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-6 md:p-8">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Información de Pago</h2>
                        <form onSubmit={handlePayment} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="fname" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        id="fname"
                                        name="guest_client_fname"
                                        required
                                        placeholder="Ej. Juan"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lname" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Apellido
                                    </label>
                                    <input
                                        type="text"
                                        id="lname"
                                        name="guest_client_lname"
                                        required
                                        placeholder="Ej. Pérez"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="guest_client_phone"
                                        required
                                        placeholder="Ej. 809-555-5555"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                            
                            <button
                                type="submit"
                                disabled={isProcessing || totalItems === 0}
                                className="w-full py-4 px-6 text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-bold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Procesando pago...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Pagar ${totalPrice.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Resumen de orden */}
                <div className="flex-1">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 sticky top-24">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Resumen del pedido</h3>
                        
                        {items.length === 0 ? (
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Tu carrito está vacío.</p>
                        ) : (
                            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 mb-6">
                                {items.map((item) => (
                                    <div key={item.product.id} className="flex items-center gap-3">
                                        <img 
                                            src={item.product.imageurl} 
                                            alt={item.product.name} 
                                            className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-600"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                                {item.product.name}
                                            </h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Cant: {item.cantidad}
                                            </p>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                                            ${(item.product.price * item.cantidad).toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-3">
                            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                <span>Subtotal ({totalItems} items)</span>
                                <span>${totalPrice.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                <span>Envío</span>
                                <span className="text-green-600 dark:text-green-400 font-medium">Gratis</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                                <span>Total</span>
                                <span className="text-blue-600 dark:text-blue-400">
                                    ${totalPrice.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PayPage;
