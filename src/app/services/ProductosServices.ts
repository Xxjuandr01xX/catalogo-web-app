import type { Productos } from "../types/productos.type";
import type { category } from "../types/category.type";
import { GoogleSheetServiceConnect, gssc_get_all } from "./GoogleSheetServiceConnect";


export const get_all_productos = async (): Promise<Productos[]> => {
    const connection = await GoogleSheetServiceConnect();
    const records = await gssc_get_all(connection, "productos");
    return records as unknown as Productos[];
}