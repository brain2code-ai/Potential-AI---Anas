
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qlljtcrrgjylnzqlahke.supabase.co';
const supabaseKey = 'sb_publishable_LWgUXqJTh3bfy_pl5Q8Kpg_oYA7xjwk';

export const supabase = createClient(supabaseUrl, supabaseKey);
