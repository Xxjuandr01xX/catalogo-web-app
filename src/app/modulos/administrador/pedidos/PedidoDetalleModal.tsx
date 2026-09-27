import React, { useEffect, useState } from 'react';
import type { Cart, CartItem } from '@/app/types/cart.type';
import { get_order_details, update_order_status } from '@/app/services/CartService';

interface PedidoDetalleModalProps {
    isOpen: boolean;
    onClose: () => void;
    pedido: Cart | null;
    onStatusUpdate: (pedidoId: number, newStatus: string) => void;
}

const PedidoDetalleModal: React.FC<PedidoDetalleModalProps> = ({ isOpen, onClose, pedido, onStatusUpdate }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [statusUpdating, setStatusUpdating] = useState(false);

    useEffect(() => {
        if (isOpen && pedido) {
            const fetchDetails = async () => {
                setIsLoading(true);
                try {
                    const details = await get_order_details(pedido.id);
                    setItems(details);
                } catch (error) {
                    console.error("Error fetching order details:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchDetails();
        } else {
            setItems([]);
        }
    }, [isOpen, pedido]);

    if (!isOpen || !pedido) return null;

    const handleStatusChange = async (newStatus: string) => {
        setStatusUpdating(true);
        try {
            await update_order_status(pedido.id, newStatus);
            onStatusUpdate(pedido.id, newStatus);
            onClose();
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Hubo un error al actualizar el estatus.");
        } finally {
            setStatusUpdating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="bg-sky-950 w-full max-w-2xl rounded-2xl shadow-2xl border border-sky-800/60 overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-sky-800/60 bg-sky-900/30">
                    <h3 className="text-xl font-bold text-slate-100">
                        Detalles del Pedido #{pedido.id}
                    </h3>
                    <button 
                        onClick={onClose}
                        className="text-sky-300 hover:text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-sky-100">
                        <div>
                            <p className="text-sky-400 font-semibold mb-1">Cliente</p>
                            <p>{pedido.guest_client_fname} {pedido.guest_client_lname}</p>
                            <p>{pedido.guest_client_phone}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sky-400 font-semibold mb-1">Estatus actual</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold
                                ${pedido.status === 'Completado' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                                pedido.status === 'Cancelado' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                                'bg-amber-500/20 text-amber-400 border border-amber-500/30'}
                            `}>
                                {pedido.status || 'Pendiente'}
                            </span>
                        </div>
                    </div>

                    <h4 className="text-lg font-semibold text-sky-200 mb-3 border-b border-sky-800/50 pb-2">Artículos</h4>
                    
                    {isLoading ? (
                        <div className="text-center py-8 text-sky-300">Cargando artículos...</div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-8 text-sky-400/60 italic">No se encontraron artículos.</div>
                    ) : (
                        <ul className="space-y-3 mb-6">
                            {items.map((item, idx) => (
                                <li key={idx} className="flex justify-between items-center bg-sky-900/20 p-3 rounded-lg border border-sky-800/30">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-sky-800 rounded-md flex items-center justify-center overflow-hidden">
                                            {item.product.imageurl ? (
                                                <img src={item.product.imageurl} alt={item.product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xs text-sky-400">Sin img</span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sky-100">{item.product.name}</p>
                                            <p className="text-xs text-sky-400">{item.cantidad} x ${item.product.price.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</p>
                                        </div>
                                    </div>
                                    <div className="font-bold text-emerald-400">
                                        ${(item.cantidad * item.product.price).toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                    
                    <div className="flex justify-end pt-4 border-t border-sky-800/50">
                        <div className="text-right">
                            <p className="text-sm text-sky-300 mb-1">Subtotal: ${pedido.subtotal.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</p>
                            <p className="text-xl font-bold text-emerald-400">Total: ${pedido.total.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</p>
                        </div>
                    </div>
                </div>

                {/* Footer - Actions */}
                <div className="p-6 border-t border-sky-800/60 bg-sky-900/30 flex gap-3 justify-end items-center">
                    <span className="text-sm text-sky-300 mr-2">Cambiar estatus:</span>
                    <button 
                        onClick={() => handleStatusChange('Pendiente')}
                        disabled={statusUpdating || pedido.status === 'Pendiente'}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                        Pendiente
                    </button>
                    <button 
                        onClick={() => handleStatusChange('Completado')}
                        disabled={statusUpdating || pedido.status === 'Completado'}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                        Completado
                    </button>
                    <button 
                        onClick={() => handleStatusChange('Cancelado')}
                        disabled={statusUpdating || pedido.status === 'Cancelado'}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                        Cancelado
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PedidoDetalleModal;
