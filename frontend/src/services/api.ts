import axios from 'axios';
import type { Product, CartItem } from '../types';


const API_URL = 'http://127.0.0.1:8000';

export const api = {
    getProducts: async () => {
        const response = await axios.get<Product[]>(`${API_URL}/products`);
        return response.data;
    },

    saveCart: async (items: CartItem[]) => {
        const payload = { items };
        const response = await axios.post(`${API_URL}/cart`, payload);
        return response.data;
    }
};