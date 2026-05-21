import type { LeaseProps } from "../../leases/core/types";

export interface PaymentProps {
    id:string;
    lease_id:string;
    row_number?:number;
    amount:number;
    late_fee:string;
    due_date?:string;
    paid_at?:string|null;
    status:string;
    breakdown:string;
    notes:string;
    formatted_date:string;
    formatted_paid_at:string;
    formatted_due_date:string|null;
    lease:LeaseProps;
    type:string;
    remaining_balance:number;
    total_paid:number;
    transactions:{
        status:string;
        type:string;
        amount_paid:number;
        landlord_notes:string;
        paid_at:string;
        formatted_paid_at:string;
    }[]
}