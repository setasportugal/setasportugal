'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function NovaEquipaPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    region: '',
    location: '',
    notes: ''
  })
  const [saving, setSaving] = useState(false)

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
    const { error } = await supabase.from('teams').insert({
      name: form.name.trim(),
      region: form.region.trim() || null,
      location: form.location.trim() || null,
      notes: form.notes.trim() || null
    })

    setSaving(false)

    if (error) {
      alert('Erro ao guardar: ' + error.message)
    } else {
      router.push('/equipas')
    }
  }

  return (
    <div style={{ marginTop: 16 }}>
      <h2 style={{ marginBottom: 16 }}>Nova Equipa</h2>

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label>Nome *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Nome da equipa"
          />
        </div>

        <div className="form-group">
          <label>Região / Associação</label>
          <input
            name="region"
            value={form.region}
            onChange={handleChange}
            placeholder="Ex: Lisboa, Porto, Zona Oeste..."
          />
        </div>

        <div className="form-group">
          <label>Local</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Pub, clube, sala..."
          />
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
          <a href="/equipas" className="btn btn-secondary">Cancelar</a>
        </div>
      </form>
    </div>
  )
}
