import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Product } from '../data/products';
import { supabase } from '../lib/supabase';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
  syncToSupabase: () => Promise<void>;
}

// Supabase'ga yozuvchi yordamchi funksiya
async function saveCartToSupabase(items: CartItem[]) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return; // Login qilinmagan bo'lsa o'tkazib yuboramiz

    // Avval eski cart'ni o'chiramiz
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    if (items.length === 0) return;

    // Yangi cart'ni yozamiz
    const rows = items.map(item => ({
      user_id: user.id,
      product_id: item.product.id,
      product_name: item.product.name,
      product_image: item.product.image,
      sale_price: item.product.salePrice,
      quantity: item.quantity,
    }));

    await supabase.from('cart_items').insert(rows);
  } catch (err) {
    console.error('Cart sync xatosi:', err);
  }
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.product.id === product.id);
          let newItems: CartItem[];
          if (existingItem) {
            newItems = state.items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            newItems = [...state.items, { product, quantity }];
          }
          // Supabase'ga sinxron saqlash
          saveCartToSupabase(newItems);
          return { items: newItems };
        });
      },

      removeFromCart: (productId) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.product.id !== productId);
          saveCartToSupabase(newItems);
          return { items: newItems };
        });
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          const newItems = state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          );
          saveCartToSupabase(newItems);
          return { items: newItems };
        });
      },

      clearCart: () => {
        set({ items: [] });
        saveCartToSupabase([]);
      },

      getCartCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getCartTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.salePrice * item.quantity,
          0
        );
      },

      syncToSupabase: async () => {
        await saveCartToSupabase(get().items);
      },
    }),
    {
      name: 'autoparts-cart',
    }
  )
);
