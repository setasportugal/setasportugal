'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../../lib/supabase'

export default function TransferirJogadorPage() {
  const { id } = useParams()
  const router = useRouter()
  const [player, setPlayer] = useState(null)
  const [currentLink, setCurrentLink] = useState(null)
  const [teams, setTeams] = useState([])
  const [form, setForm] = useState({
    team_id: '',
    date: new Date().toISOString().slice(0, 10)
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id) loadData()
  }, [id])

  async function loadData() {
    setLoading(true)

    const { data: playerData } = await supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .single()

    const { data: links } = await supabase
      .from('team_players')
      .select('*, teams(*)')
      .eq('player_id', id)
      .eq('is_active', true)
      .limit(1)

    const { data: teamsData } = await supabase
      .from('teams')
      .select('*')
      .order('name')

    setPlayer(playerData)
    setCurrentLink(links && links.length > 0 ? links[0] : null)
    setTeams(teamsData || [])
    setLoading(false)
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.date) {
      alert('A data é obrigatória')
      return
    }

    // Se escolheu a mesma equipa em que já está, não faz nada
    if (currentLink && form.team_id === currentLink.team_id) {
      alert('O jogador já está nesta equipa')
      return
    }

    setSaving(true)

    // 1. Se tem equipa ativa, fechar essa associação
    if (currentLink) {
      const { error } = await supabase
        .from('team_players')
        .update({
          left_at: form.date,
          is_active: false
        })
        .eq('id', currentLink.id)

      if (error) {
        setSaving(false)
        alert('Erro ao fechar associação anterior: ' + error.message)
        return
      }
    }

    // 2. Se escolheu uma nova equipa, criar associação
    if (form.team_id) {
      const { error } = await supabase.from('team_players').insert({
        player_id: id,
        team_id: form.team_id,
        joined_at: form.date,
        is_active: true
      })

      if (error) {
        setSaving(false)
        alert('Erro ao associar à nova equipa: ' + error.message)
        return
      }
    }

    setSaving(false)
    router.push(`/jogadores/${id}`)
  }

  if (loading) return <p className="empty">A carregar...</p>
  if (!player) return <p className="empty">Jogador não encontrado.</p>

  return (
    <div style={{ marginTop: 16 }}>
      <h2 style={{ marginBottom: 8 }}>Transferência</h2>
      <p style={{ color: '#64748b', marginBottom: 16 }}>
        {player.name}
        {player.nickname ? ` (“${player.nickname}”)` : ''}
      </p>

      <div className="card" style={{ marginBottom: 16 }}>
        <p style={{ fontSize: '0.9rem', color: '#475569' }}>
          <strong>Equipa atual:</strong>{' '}
          {currentLink ? currentLink.teams?.name : 'Sem equipa (livre)'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label>Nova equipa</label>
          <select
            name="team_id"
            value={form.team_id}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '1rem' }}
          >
            <option value="">Sem equipa (livre)</option>
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Data da transferência *</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="actions">
          <button type="submit" className="btn" disabled={saving}>
            {saving ? 'A guardar...' : 'Confirmar transferência'}
          </button>
          <a href={`/jogadores/${id}`} className="btn btn-secondary">Cancelar</a>
        </div>
      </form>
    </div>
  )
      }
