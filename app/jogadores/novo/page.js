'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function NovoJogadorPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    nickname: '',
    city: '',
    notes: '',
    team_id: ''
  })
  const [teams, setTeams] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadTeams()
  }, [])

  async function loadTeams() {
    const { data } = await supabase
      .from('teams')
      .select('*')
      .order('name')
    setTeams(data || [])
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      alert('O nome é obrigatório')
      return
    }

    setSaving(true)

    // 1. Criar o jogador
    const { data: player, error } = await supabase
      .from('players')
      .insert({
        name: form.name.trim(),
        nickname: form.nickname.trim() || null,
        city: form.city.trim() || null,
        notes: form.notes.trim() || null
      })
      .select()
      .single()

    if (error) {
      setSaving(false)
      alert('Erro ao guardar jogador: ' + error.message)
      return
    }

    // 2. Se escolheu equipa, associar
    if (form.team_id && player) {
      const { error: linkError } = await supabase.from('team_players').insert({
        player_id: player.id,
        team_id: form.team_id,
        joined_at: new Date().toISOString().slice(0, 10),
        is_active: true
      })

      if (linkError) {
        alert('Jogador criado, mas erro ao associar equipa: ' + linkError.message)
      }
    }

    setSaving(false)
    router.push(`/jogadores/${player.id}`)
  }

  return (
    <div style={{ marginTop: 16 }}>
      <h2 style={{ marginBottom: 16 }}>Novo Jogador</h2>

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label>Nome *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Nome completo"
          />
        </div>

        <div className="form-group">
          <label>Alcunha</label>
          <input
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            placeholder="Como é conhecido"
          />
        </div>

        <div className="form-group">
          <label>Cidade / Zona</label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Ex: Lisboa, Porto, Leiria..."
          />
        </div>

        <div className="form-group">
          <label>Equipa (opcional)</label>
          <select
            name="team_id"
            value={form.team_id}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '1rem' }}
          >
            <option value="">Sem equipa</option>
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Notas</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Observações livres..."
          />
        </div>

        <div className="actions">
          <button type="submit" className="btn" disabled={saving}>
            {saving ? 'A guardar...' : 'Guardar'}
          </button>
          <a href="/jogadores" className="btn btn-secondary">Cancelar</a>
        </div>
      </form>
    </div>
  )
}
