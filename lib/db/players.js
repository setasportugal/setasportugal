import { supabase } from '../supabase'

export async function getLatestPlayers(limit = 5) {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error(error)
    return []
  }

  return data
}
