import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rrbxquwfvcpodhhkjocj.supabase.co';
const supabaseKey = 'sb_publishable_tuC54Z9KdGArIiIYMNai7Q_UthaZu55';

export const supabase = createClient(supabaseUrl, supabaseKey);
