import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://supabase.com/dashboard/project/rmqpfqtcbzmylxmppehi';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtcXBmcXRjYnpteWx4bXBwZWhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MDAzNDcsImV4cCI6MjA2OTA3NjM0N30.LfYwttVguSZIu4ypj5U_UP8vNo6FbbcElXmUy_b0IXU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);