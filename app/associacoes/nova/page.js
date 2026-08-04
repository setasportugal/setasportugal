'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function NovaAssociacaoPage() {
  const router = useRouter()

  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    name: '',
    short_name: '',
    region: '',
    founded_year: '',
    website: '',
    facebook: '',
    instagram: '',
    notes: ''
  })

  function update(field, value) {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.name.trim()) {
      alert('O nome da associação é obrigatório.')
      return
    }

    setSaving(true)

    const { error } = await supabase
      .from('associations')
      .insert({
        name: form.name.trim(),
        short_name: form.short_name || null,
        region: form.region || null,
        founded_year: form.founded_year
          ? Number(form.founded_year)
          : null,
        website: form.website || null,
        facebook: form.facebook || null,
        instagram: form.instagram || null,
        notes: form.notes || null
      })

    setSaving(false)

    if (error) {
      alert(error.message)
      return
    }

    router.push('/associacoes')
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: '32px auto'
      }}
    >
      <div
        style={{
          marginBottom: 28
        }}
      >
        <h1
          style={{
            marginBottom: 8,
            fontSize: '2rem'
          }}
        >
          🏛️ Nova Associação
        </h1>

        <p
          style={{
            color: '#64748b',
            lineHeight: 1.6,
            maxWidth: 700
          }}
        >
          Regista uma associação regional responsável pela organização
          de competições oficiais de setas em Portugal.
        </p>
      </div>

      <form onSubmit={handleSubmit}>

        <div
          className="card"
          style={{
            padding: 24,
            marginBottom: 20
          }}
        >
          <h3
            style={{
              marginBottom: 20
            }}
          >
            Identificação
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: 20
            }}
          >

            <div>
              <label>
                Nome da Associação *
              </label>

              <input
                className="search"
                type="text"
                placeholder="Ex.: Associação Portuguesa de Setas"
                value={form.name}
                onChange={e => update('name', e.target.value)}
              />
            </div>

            <div>
              <label>
                Sigla
              </label>

              <input
                className="search"
                type="text"
                placeholder="APA"
                value={form.short_name}
                onChange={e => update('short_name', e.target.value)}
              />
            </div>

          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 20,
              marginTop: 20
            }}
          >

            <div>
              <label>
                Região
              </label>

              <input
                className="search"
                type="text"
                placeholder="Ex.: Lisboa, Centro, Norte..."
                value={form.region}
                onChange={e => update('region', e.target.value)}
              />
            </div>

            <div>
              <label>
                Ano de fundação
              </label>

              <input
                className="search"
                type="number"
                placeholder="1998"
                value={form.founded_year}
                onChange={e => update('founded_year', e.target.value)}
              />
            </div>

          </div>

        </div>

        <div
          className="card"
          style={{
            padding: 24,
            marginBottom: 20
          }}
        >
          <h3
            style={{
              marginBottom: 20
            }}
          >
            🌐 Presença Online
          </h3>

          <div
            style={{
              display: 'grid',
              gap: 18
            }}
          >

            <div>
              <label>Website</label>

              <input
                className="search"
                placeholder="https://..."
                value={form.website}
                onChange={e => update('website', e.target.value)}
              />
            </div>

            <div>
              <label>Facebook</label>

              <input
                className="search"
                placeholder="https://facebook.com/..."
                value={form.facebook}
                onChange={e => update('facebook', e.target.value)}
              />
            </div>

            <div>
              <label>Instagram</label>

              <input
                className="search"
                placeholder="https://instagram.com/..."
                value={form.instagram}
                onChange={e => update('instagram', e.target.value)}
              />
            </div>

          </div>

        </div>

        <div
          className="card"
          style={{
            padding: 24,
            marginBottom: 24
          }}
        >
          <h3
            style={{
              marginBottom: 18
            }}
          >
            📝 Observações
          </h3>

          <textarea
            rows={8}
            style={{
              width: '100%',
              padding: 14,
              border: '1px solid #cbd5e1',
              borderRadius: 10,
              resize: 'vertical',
              fontSize: '0.95rem'
            }}
            placeholder="Informação adicional sobre a associação..."
            value={form.notes}
            onChange={e => update('notes', e.target.value)}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            marginTop: 28,
            flexWrap: 'wrap'
          }}
        >
          <div
            style={{
              color: '#64748b',
              fontSize: '0.9rem'
            }}
          >
            Os campos assinalados com <strong>*</strong> são obrigatórios.
          </div>

          <div
            style={{
              display: 'flex',
              gap: 12
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => router.push('/associacoes')}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn"
              disabled={saving}
            >
              {saving
                ? 'A guardar...'
                : '💾 Guardar Associação'}
            </button>
          </div>
        </div>

      </form>
    </div>
  )
}
