import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseRoleKey) {
  throw new Error("As variáveis de ambiente do Supabase Admin (URL e Role Key) não foram encontradas.")
}

export const supabase = createClient(supabaseUrl, supabaseRoleKey)