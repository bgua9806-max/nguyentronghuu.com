import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data, error } = await supabase.from('services').select('*');
  if (error) {
    console.error('Error:', error);
  } else {
    console.log(data.map(d => ({ id: d.id, title: d.title, slug: d.slug })));
  }
}

run();
