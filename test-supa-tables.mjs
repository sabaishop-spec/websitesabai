import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('testimonials').select('*');
  console.log("testimonials count:", data?.length, error);
  const { data: d2, error: e2 } = await supabase.from('products').select('*');
  console.log("products count:", d2?.length, e2);
}
check();
