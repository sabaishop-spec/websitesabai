import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// We need the service role key to alter table, or maybe we can't alter table via REST?
// Actually, we can't run ALTER TABLE via supabase-js unless we use a rpc function.
