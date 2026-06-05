import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PRODUCTS, type Product } from '../data/products';

interface ProductState {
  products: Product[];
  updateProductPrice: (id: number, newPrice: number) => void;
  updateProductDiscount: (id: number, newDiscount: number) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: number) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: PRODUCTS, // Initial state
      
      updateProductPrice: (id, newPrice) => set((state) => ({
        products: state.products.map(p => 
          p.id === id ? { ...p, salePrice: newPrice } : p
        )
      })),

      updateProductDiscount: (id, newDiscount) => set((state) => ({
        products: state.products.map(p => {
          if (p.id === id) {
            // Recalculate sale price based on discount if desired, 
            // or just set the discount badge. For now, just set discount.
            const discountAmount = p.originalPrice * (newDiscount / 100);
            const newSalePrice = newDiscount > 0 ? p.originalPrice - discountAmount : p.originalPrice;
            return { 
              ...p, 
              discount: newDiscount,
              salePrice: Number(newSalePrice.toFixed(2))
            };
          }
          return p;
        })
      })),

      addProduct: (product) => set((state) => {
        const nextId = Math.max(...state.products.map(p => p.id), 0) + 1;
        return {
          products: [...state.products, { ...product, id: nextId }]
        };
      }),

      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),
    }),
    {
      name: 'autoparts-products', // name of the item in the storage (must be unique)
    }
  )
);
