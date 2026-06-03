import type { User } from "../../../../types";
import type { PaymentProps } from "../../payments/core/types";
import type { UnitProps } from "../../units/core/type";

export interface LeaseProps {
    id:string;
    unit_id:string;
    tenant_id:string;
    row_number?:number;
    start_date:string;
    end_date:string;
    monthly_rent:number;
    deposit_amount:number;
    tenant:User;
    status:string;
    payments:PaymentProps[];
    unit:UnitProps;
    formatted_start_date:string;
    formatted_end_date?:string|null;
    document_path:string|null;
    landlord_notes:string|null;
}