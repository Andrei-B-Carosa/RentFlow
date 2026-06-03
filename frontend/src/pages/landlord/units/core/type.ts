import type { LeaseProps } from "../../leases/core/types";
import type { PropertyProps } from "../../properties/core/types";

export interface UnitProps {
    id:string;
    unit_number:string;
    rent_price:number;
    status:string;
    bedrooms:string[],
    bathrooms:string[],
    floor_area:number;
    created_at:string;
    leases:LeaseProps[]
    property:PropertyProps
}
