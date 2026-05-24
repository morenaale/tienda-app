import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  session: { access_token: string } | null;
  loading: boolean;
  initialized: boolean;

  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();

        set({
          session: { access_token: data.session.access_token },
          user: profile
            ? {
                id: data.session.user.id,
                email: data.session.user.email || '',
                name: profile.name || '',
                phone: profile.phone,
                avatar: profile.avatar_url,
                role: profile.role || 'customer',
                createdAt: profile.created_at,
              }
            : null,
          initialized: true,
        });
      } else {
        set({ initialized: true });
      }
    } catch {
      set({ initialized: true });
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        set({ user: null, session: null });
      } else if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        set({
          session: { access_token: session.access_token },
          user: profile
            ? {
                id: session.user.id,
                email: session.user.email || '',
                name: profile.name || '',
                phone: profile.phone,
                avatar: profile.avatar_url,
                role: profile.role || 'customer',
                createdAt: profile.created_at,
              }
            : null,
        });
      }
    });
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email: string, password: string, name: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          name,
          email,
          role: 'customer',
        });
      }
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },

  updateProfile: async (data: Partial<User>) => {
    const { user } = get();
    if (!user) return;

    await supabase.from('profiles').update(data).eq('id', user.id);
    set({ user: { ...user, ...data } });
  },
}));
