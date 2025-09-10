import { useState, type ReactNode, useMemo } from 'react';
import { AuthContext } from "./AuthContext.ts";


export function AuthProvider({ children }: { children: ReactNode}) {
    const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));

    const login = (newToken: string) => {
        setToken(newToken);
        localStorage.setItem('authToken', newToken);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('authToken');
    }

    const value = useMemo(() => ({ token, login, logout }), [token]);

    return <AuthContext value={value}>{children}</AuthContext>
}