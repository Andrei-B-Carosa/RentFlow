import type { User } from "../types";

export const getToken = (): string | null => localStorage.getItem('token');
export const setToken = (token: string): void => localStorage.setItem('token', token);
export const removeToken = (): void => localStorage.removeItem('token');

export const setUser = (user: User): void => localStorage.setItem('user', JSON.stringify(user));
export const removeUser = (): void => localStorage.removeItem('user');

export const getUser = (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};