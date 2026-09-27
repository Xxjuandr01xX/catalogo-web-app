import React, { useState, useEffect } from 'react';
import type { Cart } from '@/app/types/cart.type';
import { get_all_orders } from '@/app/services/CartService';

import TablaPedidos from './pedidos/TablaPedidos';

const HomePedidos = () => {
    const [pedidos, setPedidos] = useState<Cart[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const listarPedidos = async () => {
            try {
                const data = await get_all_orders();
                setPedidos(data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setIsLoading(false);
            }
        }
        listarPedidos();
    }, []);

    const handleStatusUpdate = (pedidoId: number, newStatus: string) => {
        setPedidos(prevPedidos => 
            prevPedidos.map(p => 
                p.id === pedidoId ? { ...p, status: newStatus } : p
            )
        );
    };

    return (
        <>
            <section className='ml-6 p-5 m-5 w-1/2'>
                <p>
                    <b>Administrador</b> / <b>Pedidos</b>
                </p>
            </section>

            <div className='flex justify-center'>
                <section className='p-5 m-5 w-3/4 grid grid-cols-2 gap-3 bg-sky-950 border-sky-500 rounded-xl'>
                    <div className="col bg-amber-200 p-6 m-4 text-slate-800 rounded-xl shadow text-center">
                        <b>{pedidos.length || 0} Pedidos Totales</b>
                    </div>
                    <div className="col bg-emerald-200 p-6 m-4 text-slate-800 rounded-xl shadow text-center">
                        <b>${pedidos.reduce((sum, p) => sum + p.total, 0).toLocaleString('es-DO', { minimumFractionDigits: 2 })} Recaudado</b>
                    </div>
                </section>
            </div>

            <div className='flex justify-center'>
                <section className='p-6 m-5 w-3/4 bg-sky-950 rounded-2xl shadow-2xl border border-sky-800/50 overflow-hidden'>
                    <div className="mb-6 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-slate-100">Listado de Pedidos</h2>
                    </div>
                    {isLoading ? (
                        <div className="text-center text-sky-200">Cargando pedidos...</div>
                    ) : (
                        <TablaPedidos pedidos={pedidos} onStatusUpdate={handleStatusUpdate} />
                    )}
                </section>
            </div>
        </>
    );
}

export default HomePedidos;
