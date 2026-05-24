import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Product, Category } from '../types';

interface ProductsState {
  products: Product[];
  categories: Category[];
  featured: Product[];
  loading: boolean;
  searchQuery: string;
  selectedCategory: string | null;

  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchFeatured: () => Promise<void>;
  searchProducts: (query: string) => void;
  selectCategory: (categoryId: string | null) => void;
  getFilteredProducts: () => Product[];
  getProductById: (id: string) => Product | undefined;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  categories: [],
  featured: [],
  loading: false,
  searchQuery: '',
  selectedCategory: null,

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const products: Product[] = (data || []).map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compare_at_price,
        images: p.images || [],
        category: p.category_name || '',
        categoryId: p.category_id,
        stock: p.stock,
        sku: p.sku || '',
        tags: p.tags || [],
        featured: p.featured,
        active: p.active,
        variants: p.variants,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      }));

      set({ products, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('active', true)
        .order('order', { ascending: true });

      if (error) throw error;

      const categories: Category[] = (data || []).map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        image: c.image,
        description: c.description,
        parentId: c.parent_id,
        order: c.order,
        active: c.active,
      }));

      set({ categories });
    } catch {
      // silently fail
    }
  },

  fetchFeatured: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .eq('featured', true)
        .limit(10);

      if (error) throw error;

      const featured: Product[] = (data || []).map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compare_at_price,
        images: p.images || [],
        category: p.category_name || '',
        categoryId: p.category_id,
        stock: p.stock,
        sku: p.sku || '',
        tags: p.tags || [],
        featured: true,
        active: true,
        variants: p.variants,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      }));

      set({ featured });
    } catch {
      // silently fail
    }
  },

  searchProducts: (query: string) => {
    set({ searchQuery: query });
  },

  selectCategory: (categoryId: string | null) => {
    set({ selectedCategory: categoryId });
  },

  getFilteredProducts: () => {
    const { products, searchQuery, selectedCategory } = get();
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.categoryId === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query)),
      );
    }

    return filtered;
  },

  getProductById: (id: string) => {
    return get().products.find((p) => p.id === id);
  },
}));
