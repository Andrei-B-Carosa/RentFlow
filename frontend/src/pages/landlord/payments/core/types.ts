import type { LeaseProps } from "../../leases/core/types";

export interface PaymentProps {
    row_number?:number;
    amount:number;
    late_fee:number;
    due_date?:string;
    paid_at?:string|null;
    status:string;
    breakdown:string;
    notes:string;
    formatted_date:string;
    formatted_paid_at:string;
    formatted_due_date:string|null;
    lease:LeaseProps
}