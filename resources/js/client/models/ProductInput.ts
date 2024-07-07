export type ProductInput = {
    name: string;
    description: string;
    manufacture_date: string;
    expiry_date: string;
    purchase_price: number|undefined;
    sale_price: number|undefined;
    quantity: number|undefined;
    category_id: number|undefined;
    product_type_id: number|undefined;
};
