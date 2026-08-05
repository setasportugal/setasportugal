'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function NovaEpocaPage() {
  const router = useRouter()

  const [competitions, setCompetitions] = useState([])

  const [competitionId, setCompetitionId] = useState('')
  const [name, setName] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadCompetitions()
  }, [])

  async function loadCompetitions() {
    const { data } = await supabase
      .from('competitions')
      .select('*')
      .order('name')

    setCompetitions(data || [])
  }

  async function saveSeason(e) {
    e.preventDefault()

    if (!competitionId) {
      alert('Seleciona uma competição.')
      return
    }

    if (!name.trim()) {
      alert('Indica o nome da época.')
      return
    }

    setSaving(true)

    const { error } = await supabase
      .from('seasons')
      .insert({
        competition_id: competitionId,
        name,
        year
      })

    setSaving(false)

    if (error) {
      alert(error.message)
      return
    }

    router.push('/competicoes/' + competitionId)
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

      <h1>📅 Nova Época</h1>

      <p
        style={{
          color: '#64748b'
        }}
      >
        Criar uma nova época para uma competição.
      </p>

      <form
        onSubmit={saveSeason}
        style={{
          display: 'grid',
          gap: 18,
          marginTop: 24
        }}
      >
        <div>

          <label>Competição</label>

          <select
            value={competitionId}
            onChange={e => setCompetitionId(e.target.value)}
            className="search"
          >

            <option value="">
              Seleciona uma competição
            </option>

            {competitions.map(competition => (

              <option
                key={competition.id}
                value={competition.id}
              >
                {competition.name}
              </option>

            ))}

          </select>

        </div>


        <div>

          <label>Nome da época</label>

          <input
            type="text"
            className="search"
            placeholder="Ex.: Época 2026/2027"
            value={name}
            onChange={e => setName(e.target.value)}
          />

        </div>


        <div>

          <label>Ano</label>

          <input
            type="number"
            className="search"
            value={year}
            onChange={e => setYear(Number(e.target.value))}
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
            onClick={() => router.push('/competicoes')}
          >
            Cancelar
          </button>

        </div>
      </form>

    </div>
  )
}
