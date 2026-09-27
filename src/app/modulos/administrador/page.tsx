"use client"
import React, { useContext, useEffect, useState } from 'react';
import LoginForm from '@/app/components/LoginForm';
import { AuthProvider, AuthContext } from '@/app/context/AuthContext';
import { menuOptions } from './menuOptions';
import HomePedidos from '@/app/modulos/administrador/HomePedidos';
import HomeConfiguracion from '@/app/modulos/administrador/HomeConfiguracion';


const AdministradorContent = () => {
    const [module, setModule] = useState<string>('')
    const authCont = useContext(AuthContext);

    return (
        <>
            {authCont?.login_obj?.isLogin === true ? (
                <>
                    {module === '' ? (
                        <div className="grid grid-cols-2 mt-6 gap-4 p-6">
                            {menuOptions.map((obj, i) => (
                                <React.Fragment key={i}>
                                    <a onClick={(e) => { e.preventDefault(); setModule(obj.name) }}>
                                        <div className='p-4 text-center border-2 border-cyan-700 rounded-xl cursor-pointer hover:bg-cyan-900/30 transition-colors'>
                                            <b>
                                                <span className='text-center'> {obj.name} </span>
                                            </b>
                                        </div>
                                    </a>
                                </React.Fragment>
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* Botón de atrás */}
                            <div className="px-6 pt-4">
                                <button
                                    onClick={() => setModule('')}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-sky-200 bg-sky-900/50 hover:bg-sky-800/70 rounded-lg transition-colors duration-200 border border-sky-700/50"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Volver al menú
                                </button>
                            </div>
                            {module === 'pedidos' && <HomePedidos />}
                            {module === 'configuracion' && <HomeConfiguracion />}
                        </>
                    )}
                </>
            ) : (
                <LoginForm />
            )
            }
        </>
    );
};

const Page = () => {
    return (
        <>
            <AuthProvider>
                <AdminHeader />
                {/*seccion de contenido*/}
                <AdministradorContent />
            </AuthProvider>
        </>
    );
}

const AdminHeader = () => {
    const authCont = useContext(AuthContext);

    return (
        <header className='flex justify-between items-center w-full bg-sky-700 shadow'>
            <span className='p-3 font-semibold'>
                Administrador
            </span>
            {authCont?.login_obj?.isLogin && (
                <button
                    onClick={() => authCont.logout()}
                    className="mr-4 px-3 py-1.5 text-sm text-sky-100 bg-sky-800/60 hover:bg-red-600/80 rounded-lg transition-colors duration-200 border border-sky-600/50 hover:border-red-500/50"
                >
                    Cerrar sesión
                </button>
            )}
        </header>
    );
};

export default Page;

