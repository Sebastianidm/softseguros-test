import { useEffect, useState } from 'react';
import type { Product } from "./types";
import { api } from './services/api';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import { useCart } from './context/CartContext';
import { formatPrice } from './utils/formatters';

import { Trash2, Save, Minus, Plus } from 'lucide-react';

function AppContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const { items, removeFromCart, updateQuantity, saveCartToBackend, total, isLoading } = useCart();

  useEffect(() => {
    api.getProducts().then(setProducts).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <main className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">

        <section className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-blue-500 pl-3">
            Productos Disponibles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        <aside className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              Tu Carrito
              <span className="text-sm font-normal text-gray-400">({items.length} items)</span>
            </h2>

            {items.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <p>El carrito está vacío 🛒</p>
                <p className="text-sm mt-2">¡Agrega productos para comenzar!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <div key={item.product_id} className="flex gap-4 p-3 bg-gray-50 rounded-xl group hover:bg-blue-50 transition-colors">
                    {/* Imagen pequeña */}
                    {item.image_url && (
                      <img src={item.image_url} alt="" className="w-16 h-16 rounded-lg object-cover bg-white" />
                    )}

                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-semibold text-gray-800 text-sm">{item.product_name}</h4>
                        <button onClick={() => removeFromCart(item.product_id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-gray-200">
                          <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="p-1 hover:bg-gray-100 rounded">
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="p-1 hover:bg-gray-100 rounded">
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="font-bold text-slate-900">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* RESUMEN Y ACCIONES */}
            <div className="mt-8 pt-6 border-t border-dashed border-gray-200">
              <div className="flex justify-between items-end mb-6">
                <span className="text-gray-500">Total a pagar</span>
                <span className="text-3xl font-bold text-slate-900">{formatPrice(total)}</span>
              </div>

              <button
                onClick={saveCartToBackend}
                disabled={items.length === 0 || isLoading}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200
                  ${items.length === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-1'
                  }`}
              >
                {isLoading ? (
                  'Guardando...'
                ) : (
                  <>
                    <Save size={20} /> Guardar Pedido
                  </>
                )}
              </button>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}

import { CartProvider } from './context/CartContext';

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}