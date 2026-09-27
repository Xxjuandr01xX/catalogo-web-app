"use server"
import type { Cart } from "../types/cart.type";
import { GoogleSheetServiceConnect, gssc_get_all, gssc_insert_record, gssc_update_record } from "./GoogleSheetServiceConnect";
import type { SheetRecord } from "./GoogleSheetServiceConnect";
import { get_all_productos } from "./ProductosServices";

import type { CartItem } from "../types/cart.type";

export type OrderPayload = {
    client_id: number | null;
    guest_client_fname: string;
    guest_client_lname: string;
    guest_client_phone: string;
    subtotal: number;
    total: number;
    items: CartItem[];
};

export const insert_cart_order = async (orderData: OrderPayload): Promise<Cart> => {
    const sheetCarrito = "carrito";
    const sheetDetalle = "carrito_detalle";
    const connection = await GoogleSheetServiceConnect();

    // 1. Encontrar el último ID para la tabla principal 'carrito'
    const recordsCarrito = await gssc_get_all(connection, sheetCarrito);
    let newCarritoId = 1;
    if (recordsCarrito.length > 0) {
        const ids = recordsCarrito.map(record => Number(record.id) || 0);
        newCarritoId = Math.max(...ids) + 1;
    }

    // 2. Insertar el registro principal en 'carrito'
    const newRecordCarrito: SheetRecord = {
        id: newCarritoId,
        client_id: orderData.client_id || "",
        guest_client_fname: orderData.guest_client_fname || "",
        guest_client_lname: orderData.guest_client_lname || "",
        guest_client_phone: orderData.guest_client_phone || "",
        subtotal: orderData.subtotal,
        total: orderData.total,
        status: "Pendiente"
    };
    await gssc_insert_record(connection, sheetCarrito, newRecordCarrito);

    // 3. Encontrar el último ID para la tabla detalle 'carrito_detalle'
    const recordsDetalle = await gssc_get_all(connection, sheetDetalle);
    let newDetalleId = 1;
    if (recordsDetalle.length > 0) {
        const idsDetalle = recordsDetalle.map(record => Number(record.id) || 0);
        newDetalleId = Math.max(...idsDetalle) + 1;
    }

    // 4. Insertar cada producto como un registro en 'carrito_detalle'
    for (const item of orderData.items) {
        const newRecordDetalle: SheetRecord = {
            id: newDetalleId,
            product_id: item.product.id,
            cantidad: item.cantidad,
            carrito_id: newCarritoId
        };
        await gssc_insert_record(connection, sheetDetalle, newRecordDetalle);
        newDetalleId++; // Incrementar para el siguiente item
    }

    // Retornamos un objeto tipo Cart para compatibilidad con whats_app_confirmation
    return {
        id: newCarritoId,
        product_id: orderData.items.map(i => i.product),
        cantidad: orderData.items.reduce((sum, i) => sum + i.cantidad, 0),
        client_id: orderData.client_id,
        guest_client_fname: orderData.guest_client_fname,
        guest_client_lname: orderData.guest_client_lname,
        guest_client_phone: orderData.guest_client_phone,
        subtotal: orderData.subtotal,
        total: orderData.total,
        status: "Pendiente"
    };
};


import { get_site_config } from "./ConfigService";

export const whats_app_confirmation = async (orderData: Cart): Promise<string> => {
    let phoneNumber = '584146801859';
    try {
        const config = await get_site_config();
        if (config.whatsapp_number) {
            phoneNumber = config.whatsapp_number;
        }
    } catch (e) {
        console.error("No se pudo obtener el número de WhatsApp", e);
    }

    let msg = `¡Hola! Vengo del catálogo web y quiero confirmar mi pedido.\n\n`;
    msg += `*Cliente:* ${orderData.guest_client_fname} ${orderData.guest_client_lname}\n`;
    msg += `*Teléfono:* ${orderData.guest_client_phone}\n\n`;

    msg += `*Detalles del Pedido:*\n`;
    orderData.product_id.forEach((product, index) => {
        msg += `${index + 1}. ${product.name} - $${product.price.toLocaleString('es-DO', { minimumFractionDigits: 2 })}\n`;
    });

    msg += `\n*Total a pagar:* $${orderData.total.toLocaleString('es-DO', { minimumFractionDigits: 2 })}`;

    const urlmsg = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
    return urlmsg;
}

export const get_all_orders = async (): Promise<Cart[]> => {
    const sheetCarrito = "carrito";
    const connection = await GoogleSheetServiceConnect();
    const records = await gssc_get_all(connection, sheetCarrito);

    return records.map(record => ({
        id: Number(record.id),
        client_id: record.client_id ? Number(record.client_id) : null,
        guest_client_fname: record.guest_client_fname as string,
        guest_client_lname: record.guest_client_lname as string,
        guest_client_phone: record.guest_client_phone as string,
        subtotal: Number(record.subtotal),
        total: Number(record.total),
        status: record.status as string || "Pendiente",
        product_id: [],
        cantidad: 0
    }));
};

export const get_order_details = async (orderId: number): Promise<CartItem[]> => {
    const sheetDetalle = "carrito_detalle";
    const connection = await GoogleSheetServiceConnect();
    
    // Obtenemos todos los detalles y filtramos
    const allDetails = await gssc_get_all(connection, sheetDetalle);
    const orderDetails = allDetails.filter(d => Number(d.carrito_id) === orderId);
    
    // Obtenemos los productos para armar el CartItem
    const allProducts = await get_all_productos();
    
    const items: CartItem[] = [];
    for (const d of orderDetails) {
        const prod = allProducts.find(p => p.id === Number(d.product_id));
        if (prod) {
            items.push({
                product: prod,
                cantidad: Number(d.cantidad)
            });
        }
    }
    
    return items;
};

export const update_order_status = async (orderId: number, status: string): Promise<boolean> => {
    const sheetCarrito = "carrito";
    const connection = await GoogleSheetServiceConnect();
    
    await gssc_update_record(connection, sheetCarrito, {
        id: orderId,
        status: status
    });
    
    return true;
};
