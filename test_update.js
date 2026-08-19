import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Testing Supabase update...");
  const { data, error, status, statusText } = await supabase
    .from('services')
    .update({ title: 'Test Title AI Automation' })
    .eq('slug', 'ai-automation')
    .select();
    
  console.log('Status:', status, statusText);
  console.log('Error:', error);
  console.log('Data:', data);
}

run();
