import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type CartItem } from './cartStore';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  customerDetails: {
    name: string;
    email: string;
    address: string;
  };
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
}

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      
      addOrder: (order) => set((state) => ({
        orders: [order, ...state.orders]
      })),

      updateOrderStatus: (id, status) => set((state) => ({
        orders: state.orders.map(o => 
          o.id === id ? { ...o, status } : o
        )
      })),
    }),
    {
      name: 'autoparts-orders',
    }
  )
);
