import { Category } from "./Category";
import { ProductType } from "./ProductType";

export type Product = {
    id: number;
    name: string;
    description: string;
    manufacture_date: string;
    expiry_date: string;
    purchase_price: number;
    sale_price: number;
    quantity: number;
    category?: Category;
    product_type?: ProductType;
    created_at: string;
    updated_at: string;
};
