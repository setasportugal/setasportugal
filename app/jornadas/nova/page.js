'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function NovaJornadaPage() {
  const router = useRouter()

  const [seasons, setSeasons] = useState([])

  const [seasonId, setSeasonId] = useState('')
  const [number, setNumber] = useState(1)
  const [date, setDate] = useState('')

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSeasons()
  }, [])

  async function loadSeasons() {
    const { data } = await supabase
      .from('seasons')
      .select(`
        *,
        competitions(name)
      `)
      .order('year', {
        ascending: false
      })

    setSeasons(data || [])
  }

  async function saveRound(e) {
    e.preventDefault()

    if (!seasonId) {
      alert('Seleciona uma época.')
      return
    }

    setSaving(true)

    const { error } = await supabase
      .from('rounds')
      .insert({
        season_id: seasonId,
        number,
        date: date || null
      })

    setSaving(false)

    if (error) {
      alert(error.message)
      return
    }

    router.back()
  }

  return (
    <div
      className="card"
      style={{
        maxWidth: 700,
        margin: '30px auto',
        padding: 30
      }}
    >

      <h1>🗓️ Nova Jornada</h1>

      <p
        style={{
          color: '#64748b'
        }}
      >
        Adicionar uma jornada à época.
      </p>

      <form
        onSubmit={saveRound}
        style={{
          display: 'grid',
          gap: 18,
          marginTop: 24
        }}
      >
        <div>

          <label>Época</label>

          <select
            value={seasonId}
            onChange={e => setSeasonId(e.target.value)}
            className="search"
          >

            <option value="">
              Seleciona uma época
            </option>

            {seasons.map(season => (

              <option
                key={season.id}
                value={season.id}
              >
                {season.competitions?.name} — {season.name}
              </option>

            ))}

          </select>

        </div>


        <div>

          <label>Número da jornada</label>

          <input
            type="number"
            className="search"
            value={number}
            onChange={e => setNumber(Number(e.target.value))}
            min={1}
          />

        </div>


        <div>

          <label>Data da jornada</label>

          <input
            type="date"
            className="search"
            value={date}
            onChange={e => setDate(e.target.value)}
          />

        </div>


        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 10
          }}
        >

          <button
            type="submit"
            className="btn"
            disabled={saving}
          >
            {saving
              ? 'A guardar...'
              : '💾 Guardar'}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => router.back()}
          >
            Cancelar
          </button>

        </div>
      </form>

    </div>
  )
}
