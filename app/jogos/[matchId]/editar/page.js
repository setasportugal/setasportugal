'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import MatchForm from '../../../../components/matches/MatchForm'
import { supabase } from '../../../../lib/supabase'

export default function EditarJogoPage() {
  const { matchId } = useParams()
  const router = useRouter()

  const [context, setContext] = useState(null)
  const [participants, setParticipants] = useState([])
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: matchData, error: matchError } = await supabase
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
      .eq('id', matchData.round_id)
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

    const mode = competition.competition_mode
    const { data: seasonParticipants, error: participantsError } = await supabase
      .from('season_participants')
      .select('player_id, team_id')
      .eq('season_id', season.id)

    if (participantsError) {
      alert('Erro ao carregar os participantes: ' + participantsError.message)
      setLoading(false)
      return
    }

    const participantIds = (seasonParticipants || [])
      .map(item => mode === 'equipas' ? item.team_id : item.player_id)
      .filter(Boolean)

    let options = []

    if (participantIds.length > 0) {
      const table = mode === 'equipas' ? 'teams' : 'players'
      const columns = mode === 'equipas' ? 'id, name' : 'id, name, nickname'
      const { data: entities, error: entitiesError } = await supabase
        .from(table)
        .select(columns)
        .in('id', participantIds)
        .order('name')

      if (entitiesError) {
        alert('Erro ao carregar os participantes: ' + entitiesError.message)
        setLoading(false)
        return
      }

      options = (entities || []).map(entity => ({
        id: entity.id,
        label: entity.nickname ? `${entity.name} (${entity.nickname})` : entity.name,
      }))
    }

    setContext({ round, season, competition })
    setParticipants(options)
    setMatch(matchData)
    setLoading(false)
  }

  async function updateMatch(values) {
    if (!context || !match) return

    setSaving(true)

    const isTeams = context.competition.competition_mode === 'equipas'
    const { error } = await supabase
      .from('matches')
      .update({
        player1_id: isTeams ? null : values.participant1Id,
        player2_id: isTeams ? null : values.participant2Id,
        team1_id: isTeams ? values.participant1Id : null,
        team2_id: isTeams ? values.participant2Id : null,
        player1_score: values.status === 'completed' ? values.player1Score : 0,
        player2_score: values.status === 'completed' ? values.player2Score : 0,
        status: values.status,
        played_at: values.status === 'completed'
          ? (match.played_at || new Date().toISOString())
          : null,
      })
      .eq('id', match.id)

    setSaving(false)

    if (error) {
      alert('Erro ao guardar o jogo: ' + error.message)
      return
    }

    router.push(`/jogos/${match.id}`)
  }

  if (loading) {
    return <div className="card">A carregar...</div>
  }

  if (!context || !match) {
    return <div className="card">Jogo nÃ£o encontrado.</div>
  }

  const mode = context.competition.competition_mode
  const initialMatch = {
    participant1Id: mode === 'equipas' ? match.team1_id : match.player1_id,
    participant2Id: mode === 'equipas' ? match.team2_id : match.player2_id,
    player1Score: match.player1_score,
    player2Score: match.player2_score,
    status: match.status,
  }

  return (
    <div className="card" style={{ maxWidth: 720, margin: '30px auto', padding: 30 }}>
      <h1>âœï¸ Editar Jogo</h1>
      <p style={{ color: '#64748b' }}>
        {context.competition.name} Â· {context.season.name} Â· Jornada {context.round.number}
      </p>

      <MatchForm
        mode={mode}
        participants={participants}
        initialMatch={initialMatch}
        saving={saving}
        onSubmit={updateMatch}
        submitLabel="Guardar alteraÃ§Ãµes"
      />

      <div style={{ marginTop: 24 }}>
        <Link href={`/jogos/${match.id}`} className="btn btn-secondary">â† Cancelar</Link>
      </div>
    </div>
  )
}

