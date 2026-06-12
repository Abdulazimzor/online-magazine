import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Product } from '../data/products';
import { supabase } from '../lib/supabase';

interface WishlistState {
  items: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  getWishlistCount: () => number;
  syncToSupabase: () => Promise<void>;
}

async function saveWishlistToSupabase(items: Product[]) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return; // Login qilinmagan bo'lsa o'tkazib yuboramiz

    // Avval eski wishlist'ni o'chiramiz
    await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', user.id);

    if (items.length === 0) return;

    // Yangi wishlist'ni yozamiz
    const rows = items.map(product => ({
      user_id: user.id,
      product_id: product.id,
    }));

    await supabase.from('wishlist_items').insert(rows);
  } catch (err) {
    console.error('Wishlist sync xatosi:', err);
  }
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleWishlist: (product) => {
        set((state) => {
          const items = state.items;
          const exists = items.some(i => i.id === product.id);
          let newItems: Product[];
          if (exists) {
            newItems = items.filter(i => i.id !== product.id);
          } else {
            newItems = [...items, product];
          }
          saveWishlistToSupabase(newItems);
          return { items: newItems };
        });
      },
      isInWishlist: (productId) => get().items.some(i => i.id === productId),
      getWishlistCount: () => get().items.length,
      syncToSupabase: async () => {
        await saveWishlistToSupabase(get().items);
      },
    }),
    {
      name: 'autoparts-wishlist',
    }
  )
);
