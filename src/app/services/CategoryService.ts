"use server"
import { gssc_get_all, GoogleSheetServiceConnect } from "./GoogleSheetServiceConnect";
import type { category } from "../types/category.type";

export const get_all_category = async (): Promise<category[]> => {
    const records = await gssc_get_all(await GoogleSheetServiceConnect(), "categorias");
    return records as unknown as category[];
}