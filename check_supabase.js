import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data, error } = await supabase
    .from('services')
    .select('title, slug, content, seo_title')
    .eq('slug', 'ai-automation')
    .single();

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('DB TITLE:', data.title);
    console.log('DB SEO TITLE:', data.seo_title);
    console.log('DB CONTENT START:', data.content.substring(0, 100));
  }
}

run();
