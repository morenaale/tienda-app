import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Order, Address, ShippingOption } from '../types';

interface OrdersState {
  orders: Order[];
  addresses: Address[];
  shippingOptions: ShippingOption[];
  loading: boolean;

  fetchOrders: () => Promise<void>;
  fetchAddresses: () => Promise<void>;
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Order>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  getShippingOptions: () => ShippingOption[];
}

const defaultShippingOptions: ShippingOption[] = [
  {
    id: 'standard',
    name: 'Envío estándar',
    description: 'Entrega en 5-7 días hábiles',
    price: 2500,
    estimatedDays: '5-7 días hábiles',
    carrier: 'Correo Argentino',
  },
  {
    id: 'express',
    name: 'Envío express',
    description: 'Entrega en 2-3 días hábiles',
    price: 4500,
    estimatedDays: '2-3 días hábiles',
    carrier: 'OCA',
  },
  {
    id: 'pickup',
    name: 'Retiro en punto de venta',
    description: 'Retirá tu pedido gratis',
    price: 0,
    estimatedDays: '1-2 días hábiles',
    carrier: 'Retiro',
  },
];

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  addresses: [],
  shippingOptions: defaultShippingOptions,
  loading: false,

  fetchOrders: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const orders: Order[] = (data || []).map((o) => ({
        id: o.id,
        userId: o.user_id,
        items: o.items,
        subtotal: o.subtotal,
        shippingCost: o.shipping_cost,
        total: o.total,
        status: o.status,
        shippingAddress: o.shipping_address,
        paymentMethod: o.payment_method,
        paymentId: o.payment_id,
        trackingCode: o.tracking_code,
        notes: o.notes,
        createdAt: o.created_at,
        updatedAt: o.updated_at,
      }));

      set({ orders, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchAddresses: async () => {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .order('is_default', { ascending: false });

      if (error) throw error;

      const addresses: Address[] = (data || []).map((a) => ({
        id: a.id,
        userId: a.user_id,
        name: a.name,
        street: a.street,
        number: a.number,
        floor: a.floor,
        apartment: a.apartment,
        city: a.city,
        state: a.state,
        zipCode: a.zip_code,
        country: a.country || 'Argentina',
        isDefault: a.is_default,
      }));

      set({ addresses });
    } catch {
      // silently fail
    }
  },

  createOrder: async (order) => {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: order.userId,
        items: order.items,
        subtotal: order.subtotal,
        shipping_cost: order.shippingCost,
        total: order.total,
        status: order.status,
        shipping_address: order.shippingAddress,
        payment_method: order.paymentMethod,
        payment_id: order.paymentId,
        notes: order.notes,
      })
      .select()
      .single();

    if (error) throw error;

    const newOrder: Order = {
      id: data.id,
      ...order,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    set((state) => ({ orders: [newOrder, ...state.orders] }));
    return newOrder;
  },

  addAddress: async (address) => {
    const { data, error } = await supabase
      .from('addresses')
      .insert({
        user_id: address.userId,
        name: address.name,
        street: address.street,
        number: address.number,
        floor: address.floor,
        apartment: address.apartment,
        city: address.city,
        state: address.state,
        zip_code: address.zipCode,
        country: address.country,
        is_default: address.isDefault,
      })
      .select()
      .single();

    if (error) throw error;

    const newAddress: Address = { ...address, id: data.id };
    set((state) => ({ addresses: [...state.addresses, newAddress] }));
  },

  updateOrderStatus: async (orderId: string, status: Order['status']) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) throw error;

    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status } : o,
      ),
    }));
  },

  getShippingOptions: () => get().shippingOptions,
}));
