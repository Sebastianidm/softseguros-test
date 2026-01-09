import { ShoppingCart, Store } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';

export default function Navbar() {
    const { items, total } = useCart();
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <Store className="text-blue-400" />
                    <span>SoftShop</span>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:block text-sm text-slate-400">
                        Total: <span className="text-white font-medium">{formatPrice(total)}</span>
                    </div>
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm cursor-pointer hover:bg-blue-600 transition">
                        S
                    </div>

                    <a href="#cart" className="relative p-2 hover:bg-slate-800 rounded-full transition">
                        <ShoppingCart className="w-6 h-6" />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-blue-500 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                                {itemCount}
                            </span>
                        )}
                    </a>
                </div>
            </div>
        </nav>
    );
}