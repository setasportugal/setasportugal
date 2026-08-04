import { supabase } from '../supabase'

export async function getPlayersCount() {
  const { count } = await supabase
    .from('players')
    .select('*', { count: 'exact', head: true })

  return count ?? 0
}

export async function getLatestPlayers(limit = 5) {
  const { data, error } = await supabase
    .from('players')
    .select(`
      id,
      name,
      nickname,
      city,
      created_at
    `)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error(error)
    return []
  }

  return data
}
