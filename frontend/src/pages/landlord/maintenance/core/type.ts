import type { User } from "../../../../types";
import type { UnitProps } from "../../units/core/type";

export interface MaintenanceRequestProps {
    row_number?:number;
    id:string;
    title:string;
    description:string;
    photos:string[];
    priority:string;
    status:string;
    landlord_notes:string;
    resolved_at:string;
    formatted_date:string;
    formatted_resolved_at:string;
    unit:UnitProps;
    tenant:User;
}