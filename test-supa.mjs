import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: t, error: e1 } = await supabase.from('testimonials').select('*');
  console.log("testimonials:", t, e1);
  const { data: p, error: e2 } = await supabase.from('products').select('*');
  console.log("products:", p, e2);
}
check();
