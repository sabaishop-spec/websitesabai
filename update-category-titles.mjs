import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function update() {
  await supabase.from('products').update({ title: 'Chăm sóc khi niềng' }).eq('id', 'khi-nieng');
  await supabase.from('products').update({ title: 'Chăm sóc sau niềng (duy trì)' }).eq('id', 'sau-nieng');
  await supabase.from('products').update({ title: 'Trắng răng & khử mùi' }).eq('id', 'trang-rang-khu-mui');
  console.log("Updated category titles.");
}
update();
