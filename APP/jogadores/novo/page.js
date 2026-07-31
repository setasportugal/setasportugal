'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function NovoJogadorPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    nickname: '',
    city: '',
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
    const { error } = await supabase.from('players').insert({
      name: form.name.trim(),
      nickname: form.nickname.trim() || null,
      city: form.city.trim() || null,
      notes: form.notes.trim() || null
    })

    setSaving(false)

    if (error) {
      alert('Erro ao guardar: ' + error.message)
    } else {
      router.push('/jogadores')
    }
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
