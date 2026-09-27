import type { Productos } from "./productos.type";

export type Cart = {
    id: number;
    product_id: Productos[];
    cantidad: number;
    client_id: number | null;
    guest_client_fname: string | null;
    guest_client_lname: string | null;
    guest_client_phone: string | null;
    subtotal: number;
    total: number;
    status?: string;
}

export type CartItem = {
    product: Productos;
    cantidad: number;
};