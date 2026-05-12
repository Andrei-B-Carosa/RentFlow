import type { LeaseProps } from "../pages/landlord/leases/core/types";
import type { MaintenanceRequestProps } from "../pages/landlord/maintenance/core/type";

export interface User {
    row_number?:number;
    id:string;
    name:string;
    role:string;
    email:string;
    status?:string;
    formatted_date?:string;
    leases:LeaseProps[]
    maintenance_requests:MaintenanceRequestProps[]
}

export interface AuthContextType {
    user: User|null;
    login: (user:User, token:string) => void;
    logout: () => void;
}