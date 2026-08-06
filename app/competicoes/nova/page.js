'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function NovaCompeticaoPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [type, setType] = useState('Campeonato')
  const [competitionMode, setCompetitionMode] = useState('individual')
  const [associationId, setAssociationId] = useState('')

  const [associations, setAssociations] = useState([])

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadAssociations()
  }, [])

  async function loadAssociations() {
    const { data } = await supabase
      .from('associations')
      .select('*')
      .order('name')

    setAssociations(data || [])
  }

  async function saveCompetition(e) {
    e.preventDefault()

    if (!name.trim()) {
      alert('Indica o nome da competição.')
      return
    }

    setSaving(true)

    const { error } = await supabase
      .from('competitions')
      .insert({
        name,
        type,
        competition_mode: competitionMode,
        association_id:
          associationId || null
      })

    setSaving(false)

    if (error) {
      alert(error.message)
      return
    }

    router.push('/competicoes')
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

      <h1>🏆 Nova Competição</h1>

      <p
        style={{
          color: '#64748b'
        }}
      >
        Cria um campeonato, taça ou torneio.
      </p>

      <form
        onSubmit={saveCompetition}
        style={{
          display: 'grid',
          gap: 18,
          marginTop: 24
        }}
      >
        <div>

          <label>Nome da competição</label>

          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ex.: Liga ARCACEN"
            className="search"
          />

        </div>

        <div>

          <label>Formato</label>

          <select
            value={competitionMode}
            onChange={e => setCompetitionMode(e.target.value)}
            className="search"
          >
            <option value="individual">Individual</option>
            <option value="equipas">Por equipas</option>
          </select>

        </div>


        <div>

          <label>Tipo</label>

          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="search"
          >
            <option>Campeonato</option>
            <option>Taça</option>
            <option>Torneio</option>
            <option>Liga</option>
            <option>Open</option>
          </select>

        </div>


        <div>

          <label>Associação</label>

          <select
            value={associationId}
            onChange={e => setAssociationId(e.target.value)}
            className="search"
          >

            <option value="">
              Sem associação
            </option>

            {associations.map(association => (

              <option
                key={association.id}
                value={association.id}
              >
                {association.name}
              </option>

            ))}

          </select>

        </div>


        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 10
          }}
        >

          <button
            type="submit"
            className="btn"
            disabled={saving}
          >
            {saving
              ? 'A guardar...'
              : '💾 Guardar'}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => router.push('/competicoes')}
          >
            Cancelar
          </button>

        </div>
      </form>

    </div>
  )
            }
