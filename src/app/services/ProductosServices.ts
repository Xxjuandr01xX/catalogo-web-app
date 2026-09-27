"use server"
import type { Productos } from "../types/productos.type";
import type { category } from "../types/category.type";
import { GoogleSheetServiceConnect, gssc_get_all } from "./GoogleSheetServiceConnect";


export const get_all_productos = async (): Promise<Productos[]> => {
    const connection = await GoogleSheetServiceConnect();
    const records = await gssc_get_all(connection, "productos");
    // Filtramos para asegurarnos de que el registro tenga al menos un nombre o un id
    const validRecords = records.filter(record => record.name && String(record.name).trim() !== "");
    // Google Sheets devuelve todo como string; convertimos los campos numéricos
    return validRecords.map(record => ({
        ...record,
        id: Number(record.id) || 0,
        price: parseFloat(String(record.price).replace(/[^0-9.\-]/g, '')) || 0,
        stock: Number(record.stock) || 0,
        min_stock: Number(record.min_stock) || 0,
        isActive: record.isActive === 'true' || record.isActive === true,
    })) as Productos[];
}

export const create_producto = async (producto: Omit<Productos, 'id'>): Promise<Productos> => {
    const connection = await GoogleSheetServiceConnect();
    const records = await get_all_productos();
    const newId = records.length > 0 ? Math.max(...records.map(p => p.id)) + 1 : 1;
    
    const recordToInsert: Record<string, string | number | boolean> = {
        id: newId,
        name: producto.name,
        descripcion: producto.descripcion || "",
        price: producto.price,
        category: producto.category || "",
        stock: producto.stock || 0,
        min_stock: producto.min_stock || 0,
        isActive: producto.isActive,
        imageurl: producto.imageurl || "",
    };

    const { gssc_insert_record } = await import("./GoogleSheetServiceConnect");
    await gssc_insert_record(connection, "productos", recordToInsert);
    
    return { id: newId, ...producto };
}

export const update_producto = async (producto: Productos): Promise<Productos> => {
    const connection = await GoogleSheetServiceConnect();
    const { gssc_update_record } = await import("./GoogleSheetServiceConnect");

    const recordToUpdate: Record<string, string | number | boolean> = {
        id: producto.id,
        name: producto.name,
        descripcion: producto.descripcion || "",
        price: producto.price,
        category: producto.category || "",
        stock: producto.stock || 0,
        min_stock: producto.min_stock || 0,
        isActive: producto.isActive,
        imageurl: producto.imageurl || "",
    };

    await gssc_update_record(connection, "productos", recordToUpdate);
    return producto;
}

export const delete_producto = async (id: number): Promise<boolean> => {
    const connection = await GoogleSheetServiceConnect();
    const { gssc_delete_record } = await import("./GoogleSheetServiceConnect");
    return await gssc_delete_record(connection, "productos", id);
}