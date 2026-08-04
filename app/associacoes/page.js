'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AssociacoesPage() {
  const [associations, setAssociations] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAssociations()
  }, [])

  async function loadAssociations() {
    setLoading(true)

    const { data, error } = await supabase
      .from('associations')
      .select('*')
      .order('name')

    if (error) {
      console.error(error)
      alert('Erro ao carregar associações: ' + error.message)
    } else {
      setAssociations(data || [])
    }

    setLoading(false)
  }

  const filtered = associations.filter(a => {
    const q = search.toLowerCase()

    return (
      a.name?.toLowerCase().includes(q) ||
      a.short_name?.toLowerCase().includes(q) ||
      a.region?.toLowerCase().includes(q)
    )
  })

  return (
    <div style={{ marginTop: 16 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16
        }}
      >
        <h2>Associações</h2>

        <a href="/associacoes/nova" className="btn">
          + Nova
        </a>
      </div>

      <input
        className="search"
        type="search"
        placeholder="Pesquisar por nome, sigla ou região..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="empty">A carregar...</p>
      ) : filtered.length === 0 ? (
        <p className="empty">
          {search
            ? 'Nenhuma associação encontrada.'
            : 'Ainda não existem associações.'}
        </p>
      ) : (
        <div className="card">
          {filtered.map(association => (
            <a
              key={association.id}
              href={`/associacoes/${association.id}`}
              className="list-item"
            >
              <div>
                <strong>{association.name}</strong>

                {association.short_name && (
                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: '#94a3b8'
                    }}
                  >
                    {association.short_name}
                  </div>
                )}

                {association.region && (
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: '#94a3b8'
                    }}
                  >
                    📍 {association.region}
                  </div>
                )}
              </div>

              <span style={{ color: '#94a3b8' }}>→</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
