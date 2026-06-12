import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fgrayxflwesidtmnggrn.supabase.co';
const supabaseKey = 'sb_publishable_i_o2SQEq72ELeZ8oaQd1hw_J_QAey_r';

export const supabase = createClient(supabaseUrl, supabaseKey);
