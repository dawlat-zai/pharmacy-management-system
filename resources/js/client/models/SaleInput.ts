import { SaleItemInput } from "./SaleItemInput";

export type SaleInput = {
    discount: number;
    discount_type: string;
    items: SaleItemInput[]
};
