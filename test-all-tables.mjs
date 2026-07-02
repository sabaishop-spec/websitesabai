import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const tables = ['product', 'products', 'category', 'categories', 'testimonial', 'testimonials'];
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*').limit(1);
    console.log(`Table ${t}:`, data ? `Exists, has ${data.length} rows (limited to 1)` : error?.message);
  }
}
check();
