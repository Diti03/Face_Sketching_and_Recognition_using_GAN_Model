import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "YOUR_SUPABASEURL";
const supabaseKey = "YOUR_SUPABASEKEY";
export const supabase = createClient(supabaseUrl, supabaseKey);

