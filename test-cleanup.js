const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function run() {
  await supabase.from('blogPosts').delete().in('id', ['test', 'test2', 'n', 'n-2', 'l', 'l-3']);
  console.log("Cleanup done");
}
run();
