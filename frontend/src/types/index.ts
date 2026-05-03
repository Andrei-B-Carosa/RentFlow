export interface User {
    id:string;
    name:string;
    role:string;
    email:string;
}

export interface AuthContextType {
    user: User|null;
    login: (user:User, token:string) => void;
    logout: () => void;
}