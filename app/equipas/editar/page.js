'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../../lib/supabase'

export default function EditarEquipaPage() {
  const { id } = useParams()
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    region: '',
    location: '',
    notes: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id) loadTeam()
  }, [id])

  async function loadTeam() {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      alert('Equipa não encontrada')
      router.push('/equipas')
      return
    }

    setForm({
      name: data.name || '',
      region: data.region || '',
      location: data.location || '',
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
      .from('teams')
      .update({
        name: form.name.trim(),
        region: form.region.trim() || null,
        location: form.location.trim() || null,
        notes: form.notes.trim() || null
      })
      .eq('id', id)

    setSaving(false)

    if (error) {
      alert('Erro ao guardar: ' + error.message)
    } else {
      router.push(`/equipas/${id}`)
    }
  }

  if (loading) return <p className="empty">A carregar...</p>

  return (
    <div style={{ marginTop: 16 }}>
      <h2 style={{ marginBottom: 16 }}>Editar Equipa</h2>

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label>Nome *</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Região / Associação</label>
          <input name="region" value={form.region} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Local</label>
          <input name="location" value={form.location} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Notas</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} />
        </div>

        <div className="actions">
          <button type="submit" className="btn" disabled={saving}>
            {saving ? 'A guardar...' : 'Guardar'}
          </button>
          <a href={`/equipas/${id}`} className="btn btn-secondary">Cancelar</a>
        </div>
      </form>
    </div>
  )
        }
