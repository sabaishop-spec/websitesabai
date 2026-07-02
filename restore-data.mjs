import { createClient } from '@supabase/supabase-js';
import { categories } from './temp_data/products.js';
import { testimonials } from './temp_data/testimonials.js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function restore() {
  console.log("Restoring products (categories)...");
  for (const cat of categories) {
    const { id, ...rest } = cat;
    // Supabase needs 'id'
    const payload = { id, ...rest };
    const { data, error } = await supabase.from('products').upsert(payload).select();
    if (error) {
      console.error(`Error upserting category ${id}:`, error.message);
    } else {
      console.log(`Upserted category: ${id}`);
    }
  }

  console.log("Restoring testimonials...");
  for (const t of testimonials) {
    const payload = { ...t, id: String(t.id) }; // Make sure id is string if needed
    const { data, error } = await supabase.from('testimonials').upsert(payload).select();
    if (error) {
      console.error(`Error upserting testimonial ${t.id}:`, error.message);
    } else {
      console.log(`Upserted testimonial: ${t.id}`);
    }
  }
}

restore();
