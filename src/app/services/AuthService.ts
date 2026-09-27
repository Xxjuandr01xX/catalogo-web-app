"use server"

import type { Auth } from "../types/auth.type";

import {
    GoogleSheetServiceConnect,
    gssc_get_like_column
} from '@/app/services/GoogleSheetServiceConnect'

export const auth_pin_session = async (authpin: string): Promise<Auth> => {
    const connection = await GoogleSheetServiceConnect();
    const res = await gssc_get_like_column(connection, 'usuarios', 'pin', authpin);

    if (res.length > 0) {
        return {
            pin: authpin,
            isLogin: true,
            sessionObj: res[0],
            loginDate: new Date().toLocaleDateString(),
            loginTime: new Date().toLocaleTimeString(),
        };
    }

    return {
        pin: authpin,
        isLogin: false,
        sessionObj: {},
        loginDate: "",
        loginTime: "",
    };
};