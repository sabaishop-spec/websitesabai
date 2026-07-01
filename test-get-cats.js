const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function run() {
  const { data, error } = await supabase.from('blogPosts').select('category, status');
  const catCounts = {};
  data.forEach(p => {
    const c = p.category;
    if (!catCounts[c]) catCounts[c] = { published: 0, other: 0 };
    if (p.status === 'published' || !p.status) catCounts[c].published++;
    else catCounts[c].other++;
  });
  console.log(catCounts);
}
run();
