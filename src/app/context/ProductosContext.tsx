import type { Productos } from "../types/productos.type";

import {
    createContext,
    useState,
    useEffect,
    Dispatch,
    SetStateAction
} from 'react';

type productosContextType = {
    obj_productos: Productos[];
    setObj_productos: Dispatch<SetStateAction<Productos[]>>;
}

export const ProductosContext = createContext<productosContextType | null>(null);

export const ProductosProvider = ({ children }: { children: React.ReactNode }) => {
    const [obj_productos, setObj_productos] = useState<Productos[]>([]);

    return (
        <ProductosContext.Provider value={{ obj_productos, setObj_productos }}>
            {children}
        </ProductosContext.Provider>
    )
}


