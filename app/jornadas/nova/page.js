'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function NovaJornadaPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const seasonId = searchParams.get('season')

  const [season, setSeason] = useState(null)
  const [totalRounds, setTotalRounds] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (seasonId) {
      loadSeason()
    }
  }, [seasonId])

  async function loadSeason() {
    const { data, error } = await supabase
      .from('seasons')
      .select(`
        *,
        competitions(*)
      `)
      .eq('id', seasonId)
      .single()

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    setSeason(data)
    setLoading(false)
  }

  async function createRounds() {
    if (!totalRounds || Number(totalRounds) < 1) {
      alert('Indique o número de jornadas.')
      return
    }

    setSaving(true)

    // Verifica se já existem jornadas
    const { data: existing } = await supabase
      .from('rounds')
      .select('id')
      .eq('season_id', seasonId)

    if (existing && existing.length > 0) {
      alert('Esta época já possui jornadas.')
      setSaving(false)
      return
    }

    const rows = []

    for (let i = 1; i <= Number(totalRounds); i++) {
      rows.push({
        season_id: seasonId,
        number: i
      })
    }

    const { error } = await supabase
      .from('rounds')
      .insert(rows)

    setSaving(false)

    if (error) {
      alert(error.message)
      return
    }

    alert('Jornadas criadas com sucesso.')

    router.push(`/epocas/${seasonId}`)
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
        maxWidth: 700,
        margin: '30px auto',
        padding: 30
      }}
    >
      <h1>📅 Criar Jornadas</h1>

      <p
        style={{
          color: '#64748b'
        }}
      >
        <strong>{season?.competitions?.name}</strong>
        <br />
        {season?.name}
      </p>

      <div
        style={{
          marginTop: 30
        }}
      >
        <label>Número de jornadas</label>

        <input
          type="number"
          className="search"
          value={totalRounds}
          onChange={e => setTotalRounds(e.target.value)}
          min="1"
          placeholder="Ex.: 22"
        />
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
          onClick={createRounds}
          disabled={saving}
        >
          {saving
            ? 'A criar...'
            : '📅 Criar Jornadas'}
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => router.back()}
        >
          Cancelar
        </button>
      </div>

      <div
        style={{
          marginTop: 30,
          padding: 20,
          background: '#0f172a',
          borderRadius: 10
        }}
      >
        <strong>Pré-visualização</strong>

        <div
          style={{
            marginTop: 12,
            color: '#94a3b8'
          }}
        >
          {totalRounds
            ? `Serão criadas ${totalRounds} jornadas numeradas de 1 a ${totalRounds}.`
            : 'Introduza o número de jornadas para visualizar a pré-visualização.'}
        </div>
      </div>
    </div>
  )
}
