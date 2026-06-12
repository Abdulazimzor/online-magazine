import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { PRODUCTS, type Product } from '../data/products';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  isSyncing: boolean;

  // Fetch all products from Supabase
  fetchProducts: () => Promise<void>;

  // CRUD operations — all write to Supabase first, then update local state
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: number, updates: Partial<Product>) => Promise<void>;
  updateProductPrice: (id: number, newPrice: number) => Promise<void>;
  updateProductDiscount: (id: number, newDiscount: number) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;

  // Seed Supabase with fallback data if the table is empty
  seedProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  isLoading: true,
  error: null,
  isSyncing: false,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Map Supabase snake_case to camelCase
        const mapped: Product[] = data.map((row: any) => ({
          id: row.id,
          name: row.name,
          image: row.image,
          rating: row.rating ?? 0,
          reviews: row.reviews ?? 0,
          originalPrice: row.original_price ?? row.originalPrice ?? 0,
          salePrice: row.sale_price ?? row.salePrice ?? 0,
          discount: row.discount ?? 0,
          badge: row.badge ?? undefined,
          colors: row.colors ?? ['#fff'],
          inStock: row.in_stock ?? row.inStock ?? true,
          description: row.description ?? '',
          date: row.date ?? undefined,
          category: row.category ?? '',
        }));
        set({ products: mapped, isLoading: false });
      } else {
        // Table is empty — seed it with fallback data
        await get().seedProducts();
      }
    } catch (err: any) {
      console.error('Failed to fetch products from Supabase:', err);
      // Fall back to local data
      set({ products: PRODUCTS, isLoading: false, error: err.message });
    }
  },

  seedProducts: async () => {
    try {
      const rows = PRODUCTS.map(p => ({
        name: p.name,
        image: p.image,
        rating: p.rating,
        reviews: p.reviews,
        original_price: p.originalPrice,
        sale_price: p.salePrice,
        discount: p.discount,
        badge: p.badge ?? null,
        colors: p.colors,
        in_stock: p.inStock,
        description: p.description ?? null,
        date: p.date ?? null,
        category: p.category ?? null,
      }));

      const { data, error } = await supabase
        .from('products')
        .insert(rows)
        .select();

      if (error) throw error;

      if (data) {
        const mapped: Product[] = data.map((row: any) => ({
          id: row.id,
          name: row.name,
          image: row.image,
          rating: row.rating ?? 0,
          reviews: row.reviews ?? 0,
          originalPrice: row.original_price,
          salePrice: row.sale_price,
          discount: row.discount ?? 0,
          badge: row.badge ?? undefined,
          colors: row.colors ?? ['#fff'],
          inStock: row.in_stock ?? true,
          description: row.description ?? '',
          date: row.date ?? undefined,
          category: row.category ?? '',
        }));
        set({ products: mapped, isLoading: false });
      }
    } catch (err: any) {
      console.error('Failed to seed products:', err);
      set({ products: PRODUCTS, isLoading: false, error: err.message });
    }
  },

  addProduct: async (product) => {
    set({ isSyncing: true, error: null });
    try {
      const row = {
        name: product.name,
        image: product.image,
        rating: product.rating,
        reviews: product.reviews,
        original_price: product.originalPrice,
        sale_price: product.salePrice,
        discount: product.discount,
        badge: product.badge ?? null,
        colors: product.colors,
        in_stock: product.inStock,
        description: product.description ?? null,
        date: product.date ?? null,
        category: product.category ?? null,
      };

      const { data, error } = await supabase
        .from('products')
        .insert([row])
        .select()
        .single();

      if (error) throw error;

      const newProduct: Product = {
        id: data.id,
        name: data.name,
        image: data.image,
        rating: data.rating ?? 0,
        reviews: data.reviews ?? 0,
        originalPrice: data.original_price,
        salePrice: data.sale_price,
        discount: data.discount ?? 0,
        badge: data.badge ?? undefined,
        colors: data.colors ?? ['#fff'],
        inStock: data.in_stock ?? true,
        description: data.description ?? '',
        date: data.date ?? undefined,
        category: data.category ?? '',
      };

      set((state) => ({
        products: [...state.products, newProduct],
        isSyncing: false,
      }));
    } catch (err: any) {
      console.error('Failed to add product:', err);
      // Fallback: Add product to local state
      const localId = Math.max(0, ...get().products.map(p => p.id)) + 1;
      const newProduct: Product = {
        id: localId,
        ...product,
      };
      set((state) => ({
        products: [...state.products, newProduct],
        isSyncing: false,
        error: err.message,
      }));
    }
  },

  updateProduct: async (id, updates) => {
    set({ isSyncing: true, error: null });
    try {
      // Convert camelCase to snake_case for Supabase
      const row: any = {};
      if (updates.name !== undefined) row.name = updates.name;
      if (updates.image !== undefined) row.image = updates.image;
      if (updates.rating !== undefined) row.rating = updates.rating;
      if (updates.reviews !== undefined) row.reviews = updates.reviews;
      if (updates.originalPrice !== undefined) row.original_price = updates.originalPrice;
      if (updates.salePrice !== undefined) row.sale_price = updates.salePrice;
      if (updates.discount !== undefined) row.discount = updates.discount;
      if (updates.badge !== undefined) row.badge = updates.badge;
      if (updates.colors !== undefined) row.colors = updates.colors;
      if (updates.inStock !== undefined) row.in_stock = updates.inStock;
      if (updates.description !== undefined) row.description = updates.description;
      if (updates.date !== undefined) row.date = updates.date;
      if (updates.category !== undefined) row.category = updates.category;

      const { error } = await supabase
        .from('products')
        .update(row)
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        products: state.products.map(p =>
          p.id === id ? { ...p, ...updates } : p
        ),
        isSyncing: false,
      }));
    } catch (err: any) {
      console.error('Failed to update product:', err);
      // Fallback: Update product in local state
      set((state) => ({
        products: state.products.map(p =>
          p.id === id ? { ...p, ...updates } : p
        ),
        isSyncing: false,
        error: err.message,
      }));
    }
  },

  updateProductPrice: async (id, newPrice) => {
    await get().updateProduct(id, { salePrice: newPrice });
  },

  updateProductDiscount: async (id, newDiscount) => {
    const product = get().products.find(p => p.id === id);
    if (!product) return;

    const discountAmount = product.originalPrice * (newDiscount / 100);
    const newSalePrice = newDiscount > 0
      ? Number((product.originalPrice - discountAmount).toFixed(2))
      : product.originalPrice;

    await get().updateProduct(id, {
      discount: newDiscount,
      salePrice: newSalePrice,
    });
  },

  deleteProduct: async (id) => {
    set({ isSyncing: true, error: null });
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        products: state.products.filter(p => p.id !== id),
        isSyncing: false,
      }));
    } catch (err: any) {
      console.error('Failed to delete product:', err);
      // Fallback: Delete product from local state
      set((state) => ({
        products: state.products.filter(p => p.id !== id),
        isSyncing: false,
        error: err.message,
      }));
    }
  },
}));
