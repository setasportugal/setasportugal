'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../../lib/supabase'

export default function ParticipantesEpocaPage() {
  const { id } = useParams()
  const router = useRouter()

  const [season, setSeason] = useState(null)
  const [competition, setCompetition] = useState(null)

  const [items, setItems] = useState([])
  const [selected, setSelected] = useState([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)

    const { data: seasonData, error: seasonError } = await supabase
      .from('seasons')
      .select(`
        *,
        competitions(*)
      `)
      .eq('id', id)
      .single()

    if (seasonError) {
      alert(seasonError.message)
      return
    }

    setSeason(seasonData)
    setCompetition(seasonData.competitions)

    const { data: participants } = await supabase
      .from('season_participants')
      .select('*')
      .eq('season_id', id)

    if (seasonData.competitions.competition_mode === 'individual') {

      const { data: players } = await supabase
        .from('players')
        .select('*')
        .order('name')

      setItems(players || [])

      setSelected(
        (participants || []).map(p => p.player_id)
      )

    } else {

      const { data: teams } = await supabase
        .from('teams')
        .select('*')
        .order('name')

      setItems(teams || [])

      setSelected(
        (participants || []).map(p => p.team_id)
      )

    }

    setLoading(false)
  }

  function toggle(id) {

    if (selected.includes(id)) {

      setSelected(
        selected.filter(x => x !== id)
      )

    } else {

      setSelected([
        ...selected,
        id
      ])

    }

         }
    async function saveParticipants() {

    setSaving(true)

    await supabase
      .from('season_participants')
      .delete()
      .eq('season_id', id)

    const rows = selected.map(itemId => ({

      season_id: id,

      player_id:
        competition.competition_mode === 'individual'
          ? itemId
          : null,

      team_id:
        competition.competition_mode === 'equipas'
          ? itemId
          : null

    }))

    if (rows.length > 0) {

      const { error } = await supabase
        .from('season_participants')
        .insert(rows)

      if (error) {
        alert(error.message)
        setSaving(false)
        return
      }

    }

    setSaving(false)

    alert('Participantes guardados com sucesso.')

    router.back()

  }

  if (loading) {

    return (

      <div className="card">

        A carregar...

      </div>

    )

  }

  return (

    <div
      className="card"
      style={{
        maxWidth: 900,
        margin: '30px auto',
        padding: 30
      }}
    >

      <h1>

        👥 Participantes

      </h1>

      <p
        style={{
          color: '#64748b'
        }}
      >

        {competition.name}

        <br />

        {season.name}

      </p>

      <div
        style={{
          display: 'grid',
          gap: 12,
          marginTop: 30
        }}
      >
        {items.map(item => (

          <label
            key={item.id}
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: 18,
              cursor: 'pointer'
            }}
          >

            <input
              type="checkbox"
              checked={selected.includes(item.id)}
              onChange={() => toggle(item.id)}
            />

            <div
              style={{
                flex: 1
              }}
            >

              <strong>

                {item.name}

              </strong>

              {competition.competition_mode === 'individual' &&
                item.nickname && (

                <div
                  style={{
                    color: '#64748b',
                    fontSize: '.9rem'
                  }}
                >

                  🏷️ {item.nickname}

                </div>

              )}

              {competition.competition_mode === 'equipas' &&
                item.region && (

                <div
                  style={{
                    color: '#64748b',
                    fontSize: '.9rem'
                  }}
                >

                  📍 {item.region}

                </div>

              )}

            </div>

          </label>

        ))}

      </div>

      <div
        style={{
          display: 'flex',
          gap: 12,
          marginTop: 30
        }}
      >
        <button
          className="btn"
          onClick={saveParticipants}
          disabled={saving}
        >

          {saving
            ? 'A guardar...'
            : '💾 Guardar Participantes'}

        </button>

        <button
          className="btn btn-secondary"
          onClick={() => router.back()}
        >

          Cancelar

        </button>

      </div>

    </div>

  )

}
