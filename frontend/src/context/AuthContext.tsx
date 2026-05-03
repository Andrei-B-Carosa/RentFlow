import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User, AuthContextType } from '../types';
import { getUser, setUser, removeUser, setToken, removeToken } from '../utils/storage';

interface AuthProviderProps{
    children:ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUserState] = useState<User | null>(getUser());

    const login = (userData: User, token: string) => {
        setToken(token);
        setUser(userData);
        setUserState(userData);
    };

    const logout = () => {
        removeToken();
        removeUser();
        setUserState(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};