import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable(table: string) {
  const { error } = await supabase.from(table).select('id').limit(1);
  if (error) {
    console.log(`Table ${table} error:`, error.message);
  } else {
    console.log(`Table ${table} exists.`);
  }
}

async function run() {
  await checkTable('products');
  await checkTable('faqs');
  await checkTable('blogPosts');
  await checkTable('blogCategories');
  await checkTable('testimonials');
  await checkTable('settings');
  await checkTable('admins');
}
run();
