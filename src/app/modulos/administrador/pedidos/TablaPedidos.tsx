import React, { useState } from 'react';
import type { Cart } from '@/app/types/cart.type';
import PedidoDetalleModal from './PedidoDetalleModal';

interface TablaPedidosProps {
    pedidos: Cart[];
    onStatusUpdate?: (pedidoId: number, newStatus: string) => void;
}

const TablaPedidos: React.FC<TablaPedidosProps> = ({ pedidos, onStatusUpdate }) => {
    const [selectedPedido, setSelectedPedido] = useState<Cart | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Filters state
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');

    const handleViewDetails = (pedido: Cart) => {
        setSelectedPedido(pedido);
        setIsModalOpen(true);
    };

    const handleStatusUpdate = (pedidoId: number, newStatus: string) => {
        if (onStatusUpdate) {
            onStatusUpdate(pedidoId, newStatus);
        }
    };

    const filteredPedidos = pedidos.filter(pedido => {
        const matchesStatus = statusFilter === 'Todos' || (pedido.status || 'Pendiente') === statusFilter;
        
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
            pedido.id.toString().includes(searchLower) ||
            (pedido.guest_client_fname || '').toLowerCase().includes(searchLower) ||
            (pedido.guest_client_lname || '').toLowerCase().includes(searchLower) ||
            (pedido.guest_client_phone || '').includes(searchLower);
            
        return matchesStatus && matchesSearch;
    });

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-center bg-sky-900/20 p-4 rounded-xl border border-sky-800/40">
                <div className="w-full sm:w-1/2 relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-sky-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input 
                        type="text" 
                        className="bg-sky-950 border border-sky-700 text-sky-100 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full pl-10 p-2.5 placeholder-sky-500" 
                        placeholder="Buscar por ID, nombre o teléfono..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="w-full sm:w-auto">
                    <select 
                        className="bg-sky-950 border border-sky-700 text-sky-100 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="Todos">Todos los estatus</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Completado">Completado</option>
                        <option value="Cancelado">Cancelado</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-sky-800/50 shadow-inner max-h-[500px]">
                <table className="w-full text-sm text-left text-sky-200">
                    <thead className="text-xs uppercase bg-sky-900/80 text-sky-300 sticky top-0 z-10 shadow-md">
                        <tr>
                            <th scope="col" className="px-6 py-4 font-semibold tracking-wider">ID Pedido</th>
                            <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Cliente</th>
                            <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Teléfono</th>
                            <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Total</th>
                            <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Estatus</th>
                            <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-800/50 bg-sky-950/50">
                        {filteredPedidos.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-sky-400/60 font-medium italic">
                                    {pedidos.length === 0 ? "No hay pedidos registrados" : "No se encontraron pedidos con esos filtros"}
                                </td>
                            </tr>
                        ) : (
                            filteredPedidos.map((pedido) => (
                                <tr key={pedido.id} className="hover:bg-sky-800/40 transition-colors duration-150">
                                    <td className="px-6 py-4 font-medium text-slate-200 whitespace-nowrap">
                                        #{pedido.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        {pedido.guest_client_fname} {pedido.guest_client_lname}
                                    </td>
                                    <td className="px-6 py-4">
                                        {pedido.guest_client_phone}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-emerald-400">
                                        ${pedido.total.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold
                                            ${pedido.status === 'Completado' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                                            pedido.status === 'Cancelado' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                                            'bg-amber-500/20 text-amber-400 border border-amber-500/30'}
                                        `}>
                                            {pedido.status || 'Pendiente'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => handleViewDetails(pedido)}
                                            className="px-3 py-1.5 bg-sky-700/60 hover:bg-sky-600 text-sky-100 text-xs font-medium rounded border border-sky-500/50 transition-colors shadow-sm"
                                        >
                                            Ver Detalles
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <PedidoDetalleModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                pedido={selectedPedido}
                onStatusUpdate={handleStatusUpdate}
            />
        </>
    );
}

export default TablaPedidos;
