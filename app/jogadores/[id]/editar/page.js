'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../../lib/supabase'

export default function EditarJogadorPage() {
  const { id } = useParams()
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    nickname: '',
    city: '',
    notes: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id) loadPlayer()
  }, [id])

  async function loadPlayer() {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      alert('Jogador não encontrado')
      router.push('/jogadores')
      return
    }

    setForm({
      name: data.name || '',
      nickname: data.nickname || '',
      city: data.city || '',
      notes: data.notes || ''
    })
    setLoading(false)
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
    const { error } = await supabase
      .from('players')
      .update({
        name: form.name.trim(),
        nickname: form.nickname.trim() || null,
        city: form.city.trim() || null,
        notes: form.notes.trim() || null
      })
      .eq('id', id)

    setSaving(false)

    if (error) {
      alert('Erro ao guardar: ' + error.message)
    } else {
      router.push(`/jogadores/${id}`)
    }
  }

  if (loading) return <p className="empty">A carregar...</p>

  return (
    <div style={{ marginTop: 16 }}>
      <h2 style={{ marginBottom: 16 }}>Editar Jogador</h2>

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label>Nome *</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Alcunha</label>
          <input name="nickname" value={form.nickname} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Cidade / Zona</label>
          <input name="city" value={form.city} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Notas</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} />
        </div>

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
