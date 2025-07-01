import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gnvbihjdfpguputahzyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdudmJpaGpkZnBndXB1dGFoenl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3OTg0OTYsImV4cCI6MjA2MjM3NDQ5Nn0.92MpN58SwSFHZlwWf66ZcAZ-_TWkJEJGj06zwj5Pt5M';  // from Supabase → Project Settings → API

export const supabase = createClient(supabaseUrl, supabaseKey);

