import type { User } from "../../../../types";
import type { UnitProps } from "../../units/core/type";

export interface PropertyProps {
    id:string;
    row_number:number;
    name:string;
    address:string;
    city:string;
    formatted_date:string;
    landlord:User;
    units:UnitProps[];
    occupied_count:number;
    vacant_count:number;
    under_maintenance_count:number;
    units_count:number;
    is_active:boolean;
    description?:string;
    photos:string[]
};