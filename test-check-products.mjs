import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('products').select('id, title, products');
  console.log("Products rows:", data?.length, error);
  if (data?.length > 0) {
     console.log(data.map(d => ({id: d.id, title: d.title, productsCount: d.products?.length})));
  }
}
check();
