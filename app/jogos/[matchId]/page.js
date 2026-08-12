'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import { supabase } from '../../../lib/supabase'

const statusLabels = {
  scheduled: 'Agendado',
  completed: 'ConcluÃ­do',
  cancelled: 'Cancelado',
}

export default function JogoPage() {
  const { matchId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single()

    if (matchError) {
      alert('Erro ao carregar o jogo: ' + matchError.message)
      setLoading(false)
      return
    }

    const { data: round, error: roundError } = await supabase
      .from('rounds')
      .select('*')
      .eq('id', match.round_id)
      .single()

    if (roundError) {
      alert('Erro ao carregar a jornada: ' + roundError.message)
      setLoading(false)
      return
    }

    const { data: season, error: seasonError } = await supabase
      .from('seasons')
      .select('*')
      .eq('id', round.season_id)
      .single()

    if (seasonError) {
      alert('Erro ao carregar a Ã©poca: ' + seasonError.message)
      setLoading(false)
      return
    }

    const { data: competition, error: competitionError } = await supabase
      .from('competitions')
      .select('*')
      .eq('id', season.competition_id)
      .single()

    if (competitionError) {
      alert('Erro ao carregar a competiÃ§Ã£o: ' + competitionError.message)
      setLoading(false)
      return
    }

    const isTeams = competition.competition_mode === 'equipas'
    const ids = isTeams ? [match.team1_id, match.team2_id] : [match.player1_id, match.player2_id]
    const table = isTeams ? 'teams' : 'players'
    const columns = isTeams ? 'id, name' : 'id, name, nickname'

    const { data: entities, error: entitiesError } = await supabase
      .from(table)
      .select(columns)
      .in('id', ids.filter(Boolean))

    if (entitiesError) {
      alert('Erro ao carregar os participantes: ' + entitiesError.message)
      setLoading(false)
      return
    }

    const names = new Map((entities || []).map(entity => [
      entity.id,
      entity.nickname ? `${entity.name} (${entity.nickname})` : entity.name,
    ]))

    setData({
      match,
      round,
      season,
      competition,
      participant1: names.get(ids[0]) || 'Participante indisponÃ­vel',
      participant2: names.get(ids[1]) || 'Participante indisponÃ­vel',
    })
    setLoading(false)
  }

  if (loading) {
    return <div className="card">A carregar...</div>
  }

  if (!data) {
    return <div className="card">Jogo nÃ£o encontrado.</div>
  }

  const { match, round, season, competition, participant1, participant2 } = data

  return (
    <div className="card" style={{ maxWidth: 760, margin: '30px auto', padding: 30 }}>
      <p style={{ color: '#64748b', marginTop: 0 }}>
        {competition.name} Â· {season.name} Â· Jornada {round.number}
      </p>
      <h1 style={{ textAlign: 'center' }}>
        {participant1} <span style={{ color: '#64748b' }}>vs</span> {participant2}
      </h1>

      <div style={{ textAlign: 'center', marginTop: 28 }}>
        <div style={{ fontSize: '3rem', fontWeight: 800 }}>
          {match.player1_score} - {match.player2_score}
        </div>
        <div style={{ color: '#64748b', marginTop: 10 }}>
          {statusLabels[match.status] || match.status}
          {match.played_at && ` Â· ${new Date(match.played_at).toLocaleDateString('pt-PT')}`}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
        <Link href={`/jogos/${match.id}/editar`} className="btn">âœï¸ Editar jogo</Link>
        <Link href={`/jornadas/jornada/${round.id}`} className="btn btn-secondary">â† Voltar Ã  jornada</Link>
      </div>
    </div>
  )
}

