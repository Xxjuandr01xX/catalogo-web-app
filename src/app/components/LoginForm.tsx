"use client"
import { useState, useEffect, useContext, useRef } from 'react'
import type { Auth } from '../types/auth.type';
import { auth_pin_session } from '@/app/services/AuthService'
import { AuthContext } from '../context/AuthContext';


const LoginForm = () => {

    const [pin, setPin] = useState<Record<string, string>>({});
    const [authResult, setAuthResult] = useState<Auth | null>(null);
    const authCont = useContext(AuthContext);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return;
        
        const char = value.slice(-1);
        setPin({ ...pin, [`${index + 1}st`]: char });

        if (char && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !pin[`${index + 1}st`] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleEnviar = async () => {
        const pinCompleto = `${pin['1st'] || ''}${pin['2st'] || ''}${pin['3st'] || ''}${pin['4st'] || ''}${pin['5st'] || ''}${pin['6st'] || ''}`;
        if (pinCompleto.length !== 6) {
            alert('Por favor, ingresa los 6 dígitos del PIN completos');
            return;
        }

        const result = await auth_pin_session(pinCompleto);
        setAuthResult(result);
        authCont?.setLogin_obj(result);
        localStorage.setItem('session', JSON.stringify(result));

        if (result.isLogin) {
            alert('Inicio de sesión exitoso!');
            console.log("Sesión:", result);

        } else {
            alert('El PIN ingresado es incorrecto');
        }
    }

    useEffect(() => {

    }, [])

    return (
        <section className="w-full min-h-[80vh] flex items-center justify-center p-4">
            <div className="bg-sky-950 text-slate-50 p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold mb-2">Iniciar Sesión</h2>
                    <p className="text-sky-200">Ingresa tu PIN de 6 dígitos</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleEnviar() }}>

                    <div className="flex justify-center gap-2 sm:gap-3 w-full mb-8">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                            <input
                                key={index}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                value={pin[`${index + 1}st`] || ''}
                                onChange={(e) => handleChange(index, e)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold bg-white/10 border border-sky-600 rounded-xl text-white focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        ))}
                    </div>

                    <button className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.98]">
                        Ingresar
                    </button>
                </form>
            </div>
        </section>
    );
}

export default LoginForm;
