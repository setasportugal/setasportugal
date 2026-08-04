import { supabase } from '../supabase'

export async function getDashboardStats() {
  const [
    players,
    teams,
    associations,
    teamPlayers,
  ] = await Promise.all([
    supabase.from('players').select('*', { count: 'exact', head: true }),
    supabase.from('teams').select('*', { count: 'exact', head: true }),
    supabase.from('associations').select('*', { count: 'exact', head: true }),
    supabase.from('team_players').select('*', { count: 'exact', head: true }),
  ])

  return {
    players: players.count ?? 0,
    teams: teams.count ?? 0,
    associations: associations.count ?? 0,
    teamPlayers: teamPlayers.count ?? 0,
  }
}
