import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

// ---------------------------------------------------------------------------
// Tipos internos
// ---------------------------------------------------------------------------

/** Objeto de conexión que encapsula el documento ya autenticado. */
export interface GSSConnection { doc: GoogleSpreadsheet; }

/** Registro genérico: clave → valor (las claves son los encabezados de la hoja). */
export type SheetRecord = Record<string, string | number | boolean>;

// ---------------------------------------------------------------------------
// Conexión / autenticación
// ---------------------------------------------------------------------------

/**
 * Crea una conexión autenticada con Google Sheets usando una Service Account.
 *
 * Retorna un objeto `GSSConnection` que las demás funciones usan como
 * primer argumento para operar sobre la hoja de cálculo.
 */
export const GoogleSheetServiceConnect = async (): Promise<GSSConnection> => {
    const service_account = "motorocks@portal-cautivo-469517.iam.gserviceaccount.com";
    const file_id = "1KZPFmaZnPWkNGniCQmSNu-B8hBz16D82YIFBW2wsVXU";
    const secret_api_key = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC1bSpJYfQ1p92u\n9jgEI1luezmbO7JY1aU/7Gc6xJ9OZ8DHSh/ghOZWj6/O7uKaWM6qXHI5iaxsm5DM\n6P92x6uji0p2TuETYOkl6olnpL5wrYpfykrOEuJHqfov+ZK0uj4LansscwijuJT2\nGJFMSx0CxydUpAjdNECcUIcfPZp7HUUIPEbTali83+OBxu27lRRt03f82lJxSq/c\nnQlSwiNv/5UjUQFnLZYssT4SJlcPWXt3dCTeXhtUaHEEUmx1oPvEFQwTtQ76EAQ2\n91c3uieoHZ84yZPxG2eC8ca3ezTrn1MAoxldQA6dq/p00xZOe1vr/4kpA0sl8tlD\nW9cWDnwtAgMBAAECggEAJMTyYkt8LUivfNdxbGNGq4XFW9D6ORdZpa4xkL9LQx5z\ne2BqO/xrW2VFHhUbr2jqv6u7Sa59l8hijSj2p3nZryxag8ZCRwVn0zOos+z3XMpL\nJlVPGltI6XnJVyJHaaHqU7F5s70/pcDRzduWTQZXI5o9viF9m2lM4/FNJVd8oNEq\n3r7eMxGqmDPTE2dPqJAhE9gTYg06w40plZVHAL++MJSUmZiVLkSDzFFDUeEghR1q\ntkAgMk5lOBIDitOGCQxulF+BAyItYZtD/YjcLPE662NIkYa0n5KlQHCymWjZ3X+a\nT3tgreRNfuB9SmcXGfnyNknbBzB0GqWEw/LiOfgNqQKBgQDrASSmrfIjWjzdSUN1\nKstizfBLjHTyn+p6GA709ZTBWDwXDXUZf9qH8eP0sHZxxtFGG2pBkyn6KH68buRo\nzNH2OrCDxNcSQH6NjEkMrGMBn5KUaut8PPAMMfy4RQSK06anqma5EPqsQS9k+p6e\nVQTxGz+QC4dwL0jvqMA6Aviw5QKBgQDFop9vWKE3Hh6vSpSEeXOKuIfnGpAFbr5M\nKMWiflyyYuDUIoctc4rt30TtJ0xKVNgtz4LnjzWpTuP0bm//UkeGJ6Ecwx+Q8Kjf\n5Cw6LMteIKuJ6zidN8y5u3mhfDZVKpXwGXdzw56tYtU2IH4JbZTsknImG+2EZKSJ\nbFt+6fCRqQKBgGvqX3lHIY1Ib/CyJw8T8sfRiAo5Wq7b7qHYkG2+pGvQ5+8yF9b4\n1lJdKu//ZLTEtu85waaRPNKKbAB979eMTtKCivJHnvfbtAGuLRFrzB8/tuD+5Fpt\n5VHEVqgL0ZUqsjoGTxunB2W4nVoCmHpe0mEhwSOVl8FVhWnAlV1OZgNdAoGBAKyb\nyY+f4r2Wysnh4zCIOkdPvzIyWtLD0+QEQAgZQLBz91SPC2zA2vfB5hsSFWleDKiF\n8hh3VTCXvDPBOIPPwrQCbI4IRMt7xKI2UAJHGR8OfYMpMvrsvxsAB8zoBTQAy481\nTsSGd1GLXhe17R4i3Mx5YsSx45GbrLBxOL/xZbBxAoGBAI2+eX44OWWwYAwE0UCS\n90MYk6tmV1btEANwPqHUpciuzgsn30p68OtE+9KJ1T+agE5QYUF5KvLwV7kBqbOW\ngH/H6AZNQ7POt4JZfyd7otrId/m6NgdzReZRDCNsogDuhuMPx2bHHC3GsGmgUpmJ\nVIugI5K3/uus8V0IVKrThzS8\n-----END PRIVATE KEY-----\n";

    // Crear el JWT con los scopes necesarios para leer/escribir hojas
    const auth = new JWT({
        email: service_account,
        key: secret_api_key,
        scopes: [
            "https://www.googleapis.com/auth/spreadsheets",
            "https://www.googleapis.com/auth/drive.file",
        ],
    });

    const doc = new GoogleSpreadsheet(file_id, auth);
    await doc.loadInfo(); // carga metadata del spreadsheet (hojas, títulos, etc.)

    return { doc };
};

// ---------------------------------------------------------------------------
// Utilidad interna: obtener hoja por nombre
// ---------------------------------------------------------------------------

/**
 * Busca una hoja (worksheet/tab) dentro del documento por su título.
 * Lanza un error descriptivo si no la encuentra.
 */
const getSheet = (connection: GSSConnection, sheetname: string): GoogleSpreadsheetWorksheet => {
    const sheet = connection.doc.sheetsByTitle[sheetname];
    if (!sheet) {
        throw new Error(
            `La hoja "${sheetname}" no existe en el documento. ` +
            `Hojas disponibles: ${Object.keys(connection.doc.sheetsByTitle).join(", ")}`
        );
    }
    return sheet;
};

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

/**
 * Obtiene **todas** las filas de una hoja.
 *
 * Retorna un arreglo de objetos donde las claves son los encabezados
 * de la hoja y los valores son los de cada celda, añadiendo además
 * `_rowNumber` para referencia interna.
 */
export const gssc_get_all = async (connection: GSSConnection, sheetname: string): Promise<SheetRecord[]> => {
    const sheet = getSheet(connection, sheetname);
    try {
        const rows = await sheet.getRows();
        return rows.map((row) => {
            const record: SheetRecord = { _rowNumber: row.rowNumber };
            for (const header of sheet.headerValues) {
                record[header] = row.get(header) ?? "";
            }
            return record;
        });
    } catch (error: unknown) {
        if (error instanceof Error && error.message && error.message.includes("No values in the header row")) {
            console.warn(`[Aviso] La hoja "${sheetname}" está vacía o no tiene encabezados en la primera fila.`);
            return [];
        }
        throw error;
    }
};

/**
 * Obtiene una fila cuyo valor en `column` coincida con `id`.
 *
 * Busca la primera coincidencia exacta (comparación numérica si es posible).
 * Retorna `null` si no se encuentra.
 */
export const gssc_get_by_id = async (connection: GSSConnection, sheetname: string, column: string, id: number): Promise<SheetRecord | null> => {
    const sheet = getSheet(connection, sheetname);
    const rows = await sheet.getRows();

    const found = rows.find((row) => {
        const cellValue = row.get(column);
        return Number(cellValue) === id;
    });

    if (!found) return null;

    const record: SheetRecord = { _rowNumber: found.rowNumber };
    for (const header of sheet.headerValues) {
        record[header] = found.get(header) ?? "";
    }
    return record;
};

/**
 * Obtiene todas las filas donde el valor de `column` contenga parcialmente
 * el texto proporcionado en `search` (búsqueda tipo LIKE, case-insensitive).
 */
export const gssc_get_like_column = async (connection: GSSConnection, sheetname: string, column: string, search: string): Promise<SheetRecord[]> => {
    const sheet = getSheet(connection, sheetname);
    const rows = await sheet.getRows();
    const needle = search.toLowerCase();
    return rows
        .filter((row) => {
            const cellValue = String(row.get(column) ?? "").toLowerCase();
            return cellValue.includes(needle);
        })
        .map((row) => {
            const record: SheetRecord = { _rowNumber: row.rowNumber };
            for (const header of sheet.headerValues) {
                record[header] = row.get(header) ?? "";
            }
            return record;
        });
};

/**
 * Inserta un nuevo registro (fila) al final de la hoja.
 *
 * `body` debe ser un objeto cuyas claves coincidan con los encabezados
 * de la hoja. Retorna el registro insertado con su `_rowNumber`.
 */
export const gssc_insert_record = async (connection: GSSConnection, sheetname: string, body: SheetRecord): Promise<SheetRecord> => {
    const sheet = getSheet(connection, sheetname);
    const newRow = await sheet.addRow(body as Record<string, string | number | boolean>);
    const record: SheetRecord = { _rowNumber: newRow.rowNumber };
    for (const header of sheet.headerValues) {
        record[header] = newRow.get(header) ?? "";
    }
    return record;
};

/**
 * Actualiza un registro existente.
 *
 * `body` **debe** contener una clave `id` (numérica) que se usará para
 * localizar la fila buscando en la columna "id" de la hoja. Las demás
 * claves del objeto se actualizan en la fila correspondiente.
 */
export const gssc_update_record = async (connection: GSSConnection, sheetname: string, body: SheetRecord): Promise<SheetRecord> => {
    if (body.id === undefined) {
        throw new Error("El body debe contener una propiedad 'id' para identificar la fila a actualizar.");
    }
    const sheet = getSheet(connection, sheetname);
    const rows = await sheet.getRows();
    const targetRow = rows.find((row) => Number(row.get("id")) === Number(body.id));
    if (!targetRow) {
        throw new Error(`No se encontró una fila con id=${body.id} en la hoja "${sheetname}".`);
    }

    // Actualizar solo las claves proporcionadas (excepto 'id' y '_rowNumber')
    for (const [key, value] of Object.entries(body)) {
        if (key === "_rowNumber") continue;
        targetRow.set(key, value);
    }

    await targetRow.save();

    const record: SheetRecord = { _rowNumber: targetRow.rowNumber };
    for (const header of sheet.headerValues) {
        record[header] = targetRow.get(header) ?? "";
    }
    return record;
};

/**
 * Elimina un registro de la hoja buscándolo por su `id` en la columna "id".
 *
 * Retorna `true` si se eliminó correctamente.
 * Lanza un error si no encuentra la fila.
 */
export const gssc_delete_record = async (connection: GSSConnection, sheetname: string, id: number): Promise<boolean> => {
    const sheet = getSheet(connection, sheetname);
    const rows = await sheet.getRows();

    const targetRow = rows.find((row) => Number(row.get("id")) === id);

    if (!targetRow) {
        throw new Error(`No se encontró una fila con id=${id} en la hoja "${sheetname}".`);
    }

    await targetRow.delete();
    return true;
};