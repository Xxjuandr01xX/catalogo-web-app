"use server"
import { GoogleSheetServiceConnect } from "./GoogleSheetServiceConnect";
import type { SiteConfig } from "../types/config.type";

export const get_site_config = async (): Promise<SiteConfig> => {
    const sheetConfig = "configuracion";
    const connection = await GoogleSheetServiceConnect();
    const sheet = connection.doc.sheetsByTitle[sheetConfig];
    
    if (!sheet) {
        throw new Error(`La hoja "${sheetConfig}" no existe.`);
    }

    // Leemos las celdas directamente en lugar de usar getRows 
    // por si el usuario olvidó poner los encabezados en la fila 1
    await sheet.loadCells('A1:B50');
    
    const config: Record<string, string> = {};
    
    for (let i = 0; i < 50; i++) {
        const keyCell = sheet.getCell(i, 0);
        const valCell = sheet.getCell(i, 1);
        
        if (keyCell.value && typeof keyCell.value === 'string') {
            config[keyCell.value.trim()] = valCell.value ? String(valCell.value) : '';
        }
    }

    return {
        site_title: config['site_title'] || 'Catálogo Web',
        site_description: config['site_description'] || 'Catálogo de productos',
        hero_title: config['hero_title'] || 'Encuentra los mejores repuestos',
        hero_subtitle: config['hero_subtitle'] || 'Explora nuestro catálogo',
        hero_image_1: config['hero_image_1'] || 'https://images.unsplash.com/photo-1486262715619-670810a07153',
        hero_image_2: config['hero_image_2'] || 'https://images.unsplash.com/photo-1620023594191-443b782987eb',
        hero_image_3: config['hero_image_3'] || 'https://images.unsplash.com/photo-1542282088-fe8426682b8f',
        whatsapp_number: config['whatsapp_number'] || '584146801859',
        primary_color: config['primary_color'] || '#2563eb',
        ...config
    };
};

export const update_site_config = async (newConfig: Record<string, string>): Promise<boolean> => {
    const sheetConfig = "configuracion";
    const connection = await GoogleSheetServiceConnect();
    const sheet = connection.doc.sheetsByTitle[sheetConfig];
    
    if (!sheet) {
        throw new Error(`La hoja "${sheetConfig}" no existe.`);
    }

    await sheet.loadCells('A1:B50');
    
    const keyMap: Record<string, number> = {};
    let emptyRowIndex = -1;

    for (let i = 0; i < 50; i++) {
        const keyCell = sheet.getCell(i, 0);
        if (keyCell.value && typeof keyCell.value === 'string') {
            keyMap[keyCell.value.trim()] = i;
        } else if (emptyRowIndex === -1 && (!keyCell.value || String(keyCell.value).trim() === '')) {
            emptyRowIndex = i;
        }
    }

    for (const [key, value] of Object.entries(newConfig)) {
        if (keyMap.hasOwnProperty(key)) {
            const rowIdx = keyMap[key];
            const valCell = sheet.getCell(rowIdx, 1);
            valCell.value = value;
        } else {
            if (emptyRowIndex !== -1 && emptyRowIndex < 50) {
                const keyCell = sheet.getCell(emptyRowIndex, 0);
                const valCell = sheet.getCell(emptyRowIndex, 1);
                keyCell.value = key;
                valCell.value = value;
                emptyRowIndex++;
            }
        }
    }

    await sheet.saveUpdatedCells();
    return true;
};
