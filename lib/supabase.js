import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Variáveis de ambiente do Supabase em falta')
}

// A URL e uma chave de substituição evitam que o Next falhe durante a
// compilação sem as variáveis locais. A aplicação continua a exigir as
// credenciais reais para ler ou escrever dados.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
)
