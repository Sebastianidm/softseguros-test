export interface Product {
    id: number;
    name: string;
    price: number;
    image_url: string;
}

export interface CartItem {
    product_id: number;
    product_name: string;
    price: number;
    quantity: number;
    image_url?: string;
}

export interface CartState {
    items: CartItem[];
}