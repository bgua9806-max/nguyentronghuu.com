import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Vui lòng kiểm tra file .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Optimize Supabase Storage image URL with automatic resizing & format conversion.
 * Converts /storage/v1/object/public/ → /storage/v1/render/image/public/ with params.
 */
export function optimizeImageUrl(url: string, width: number = 800, quality: number = 75): string {
  if (!url || !url.includes('supabase.co/storage/v1/object/public/')) return url;
  return url.replace(
    '/storage/v1/object/public/',
    '/storage/v1/render/image/public/'
  ) + `?width=${width}&quality=${quality}`;
}
