
import { createContext, useState, useEffect } from "react";
import type { Auth } from "../types/auth.type";

interface AuthContextType {
    login_obj: Auth | null;
    setLogin_obj: React.Dispatch<React.SetStateAction<Auth | null>>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [login_obj, setLogin_obj] = useState<Auth | null>(null);

    // Recuperar sesión de localStorage al montar
    useEffect(() => {
        try {
            const saved = localStorage.getItem('session');
            if (saved) {
                const parsed: Auth = JSON.parse(saved);
                if (parsed.isLogin) {
                    setLogin_obj(parsed);
                }
            }
        } catch {
            localStorage.removeItem('session');
        }
    }, []);

    const logout = () => {
        setLogin_obj(null);
        localStorage.removeItem('session');
    };

    return (
        <AuthContext.Provider value={{ login_obj, setLogin_obj, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
