'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function NovaAssociacaoPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [shortName, setShortName] = useState('')
  const [region, setRegion] = useState('')
  const [website, setWebsite] = useState('')
  const [facebook, setFacebook] = useState('')
  const [instagram, setInstagram] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  async function saveAssociation(e) {
    e.preventDefault()

    if (!name.trim()) {
      alert('O nome é obrigatório.')
      return
    }

    setSaving(true)

    const { error } = await supabase
      .from('associations')
      .insert({
        name,
        short_name: shortName || null,
        region: region || null,
        website: website || null,
        facebook: facebook || null,
        instagram: instagram || null,
        notes: notes || null
      })

    setSaving(false)

    if (error) {
      alert(error.message)
      return
    }

    router.push('/associacoes')
  }

  return (
    <div style={{ marginTop: 16 }}>
      <h2>Nova Associação</h2>

      <form onSubmit={saveAssociation} className="card">

        <label>Nome</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <label>Sigla</label>
        <input
          value={shortName}
          onChange={e => setShortName(e.target.value)}
        />

        <label>Região</label>
        <input
          value={region}
          onChange={e => setRegion(e.target.value)}
        />

        <label>Website</label>
        <input
          value={website}
          onChange={e => setWebsite(e.target.value)}
        />

        <label>Facebook</label>
        <input
          value={facebook}
          onChange={e => setFacebook(e.target.value)}
        />

        <label>Instagram</label>
        <input
          value={instagram}
          onChange={e => setInstagram(e.target.value)}
        />

        <label>Notas</label>
        <textarea
          rows="5"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />

        <div className="actions">
          <button
            className="btn"
            disabled={saving}
          >
            {saving ? 'A guardar...' : 'Guardar'}
          </button>

          <a
            href="/associacoes"
            className="btn btn-secondary"
          >
            Cancelar
          </a>
        </div>

      </form>
    </div>
  )
}
