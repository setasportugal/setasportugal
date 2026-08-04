'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../../../../lib/supabase'

export default function EditarHistoricoPage() {
  const { id, linkId } = useParams()
  const router = useRouter()
  const [link, setLink] = useState(null)
  const [form, setForm] = useState({
    joined_at: '',
    left_at: '',
    is_active: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (linkId) loadLink()
  }, [linkId])

  async function loadLink() {
    const { data, error } = await supabase
      .from('team_players')
      .select('*, teams(*)')
      .eq('id', linkId)
      .single()

    if (error || !data) {
      alert('Registo não encontrado')
      router.push(`/jogadores/${id}`)
      return
    }

    setLink(data)
    setForm({
      joined_at: data.joined_at || '',
      left_at: data.left_at || '',
      is_active: data.is_active || false
    })
    setLoading(false)
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    const payload = {
      joined_at: form.joined_at || null,
      left_at: form.is_active ? null : (form.left_at || null),
      is_active: form.is_active
    }

    // Se está a marcar como ativo, a data de saída deve ficar vazia
    if (form.is_active) {
      payload.left_at = null
    }

    const { error } = await supabase
      .from('team_players')
      .update(payload)
      .eq('id', linkId)

    setSaving(false)

    if (error) {
      // Erro comum: já existe outra associação ativa
      if (error.message.includes('team_players_one_active_per_player')) {
        alert('Este jogador já tem outra equipa ativa. Fecha primeiro a outra associação.')
      } else {
        alert('Erro ao guardar: ' + error.message)
      }
    } else {
      router.push(`/jogadores/${id}`)
    }
  }

  if (loading) return <p className="empty">A carregar...</p>
  if (!link) return <p className="empty">Registo não encontrado.</p>

  return (
    <div style={{ marginTop: 16 }}>
      <h2 style={{ marginBottom: 8 }}>Editar histórico</h2>
      <p style={{ color: '#64748b', marginBottom: 16 }}>
        Equipa: <strong>{link.teams?.name}</strong>
      </p>

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label>Data de entrada</label>
          <input
            type="date"
            name="joined_at"
            value={form.joined_at}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            Associação ativa (equipa atual)
          </label>
        </div>

        {!form.is_active && (
          <div className="form-group">
            <label>Data de saída</label>
            <input
              type="date"
              name="left_at"
              value={form.left_at}
              onChange={handleChange}
            />
          </div>
        )}

        <div className="actions">
          <button type="submit" className="btn" disabled={saving}>
            {saving ? 'A guardar...' : 'Guardar'}
          </button>
          <a href={`/jogadores/${id}`} className="btn btn-secondary">Cancelar</a>
        </div>
      </form>
    </div>
  )
}
