import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appConfig from '../config/app.config';

const supabaseUrl = appConfig.supabase.url || 'https://placeholder.supabase.co';
const supabaseAnonKey = appConfig.supabase.anonKey || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
