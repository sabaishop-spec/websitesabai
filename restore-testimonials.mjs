import { createClient } from '@supabase/supabase-js';
import { testimonials } from './temp_data/testimonials.js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function restore() {
  console.log("Restoring testimonials...");
  for (const t of testimonials) {
    // map 'image' to 'avatar' to match the database schema
    const { image, ...rest } = t;
    const payload = { ...rest, avatar: image, id: String(t.id) }; 
    const { data, error } = await supabase.from('testimonials').upsert(payload).select();
    if (error) {
      console.error(`Error upserting testimonial ${t.id}:`, error.message);
    } else {
      console.log(`Upserted testimonial: ${t.id}`);
    }
  }
}

restore();
