'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import MatchForm from '../../../../components/matches/MatchForm'
import { supabase } from '../../../../lib/supabase'

export default function NovoJogoPage() {
  const { roundId } = useParams()
  const router = useRouter()

  const [context, setContext] = useState(null)
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: round, error: roundError } = await supabase
      .from('rounds')
      .select('*')
      .eq('id', roundId)
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
    setLoading(false)
  }

  async function createMatch(values) {
    if (!context) return

    setSaving(true)

    const isTeams = context.competition.competition_mode === 'equipas'
    const { data, error } = await supabase
      .from('matches')
      .insert({
        round_id: context.round.id,
        player1_id: isTeams ? null : values.participant1Id,
        player2_id: isTeams ? null : values.participant2Id,
        team1_id: isTeams ? values.participant1Id : null,
        team2_id: isTeams ? values.participant2Id : null,
        player1_score: values.status === 'completed' ? values.player1Score : 0,
        player2_score: values.status === 'completed' ? values.player2Score : 0,
        status: values.status,
        played_at: values.status === 'completed' ? new Date().toISOString() : null,
      })
      .select('id')
      .single()

    setSaving(false)

    if (error) {
      alert('Erro ao guardar o jogo: ' + error.message)
      return
    }

    router.push(`/jogos/${data.id}`)
  }

  if (loading) {
    return <div className="card">A carregar...</div>
  }

  const mode = context.competition.competition_mode
  return (
    <div className="card" style={{ maxWidth: 720, margin: '30px auto', padding: 30 }}>
      <h1>âš½ Novo Jogo</h1>
      <p style={{ color: '#64748b' }}>
        <strong>{context.competition.name}</strong>
        <br />
        {context.season.name} Â· Jornada {context.round.number}
      </p>

      {participants.length < 2 ? (
        <div style={{ marginTop: 24 }}>
          <p style={{ color: '#64748b' }}>
            SÃ£o necessÃ¡rios pelo menos dois participantes registados nesta Ã©poca.
          </p>
          <Link href={`/epocas/${context.season.id}/participantes`} className="btn">
            Gerir participantes
          </Link>
        </div>
      ) : (
        <MatchForm
          mode={mode}
          participants={participants}
          saving={saving}
          onSubmit={createMatch}
          submitLabel="Guardar jogo"
        />
      )}

      <div style={{ marginTop: 24 }}>
        <Link href={`/jornadas/jornada/${context.round.id}`} className="btn btn-secondary">
          â† Voltar Ã  jornada
        </Link>
      </div>
    </div>
  )
}

