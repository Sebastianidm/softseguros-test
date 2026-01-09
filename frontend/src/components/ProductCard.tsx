import { Plus } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
            <div className="h-48 overflow-hidden bg-gray-100 relative">
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800 text-lg">{product.name}</h3>
                    <span className="font-mono text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-md">
                        {formatPrice(product.price)}
                    </span>
                </div>

                <button
                    onClick={() => addToCart(product)}
                    className="w-full mt-3 bg-slate-900 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors active:scale-95"
                >
                    <Plus size={18} />
                    Agregar
                </button>
            </div>
        </div>
    );
}