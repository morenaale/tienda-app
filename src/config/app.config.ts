export interface AppConfig {
  name: string;
  slug: string;
  description: string;
  currency: string;
  currencySymbol: string;
  locale: string;
  supportEmail: string;
  supportPhone: string;
  mercadoPago: {
    publicKey: string;
  };
  supabase: {
    url: string;
    anonKey: string;
  };
  shipping: {
    freeShippingThreshold: number;
    baseShippingCost: number;
  };
  social: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
  };
}

const appConfig: AppConfig = {
  name: 'Tienda App',
  slug: 'tienda-app',
  description: 'Tu tienda online favorita',
  currency: 'ARS',
  currencySymbol: '$',
  locale: 'es-AR',
  supportEmail: 'soporte@tiendaapp.com',
  supportPhone: '+54 9 11 1234-5678',
  mercadoPago: {
    publicKey: process.env.EXPO_PUBLIC_MP_PUBLIC_KEY || '',
  },
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  shipping: {
    freeShippingThreshold: 50000,
    baseShippingCost: 2500,
  },
  social: {
    instagram: '@tiendaapp',
    whatsapp: '+5491112345678',
  },
};

export default appConfig;
