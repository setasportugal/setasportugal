'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function EquipasPage() {
  const [teams, setTeams] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTeams()
  }, [])

  async function loadTeams() {
    setLoading(true)
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name')

    if (error) {
      console.error(error)
      alert('Erro ao carregar equipas: ' + error.message)
    } else {
      setTeams(data || [])
    }
    setLoading(false)
  }

  const filtered = teams.filter(t => {
    const q = search.toLowerCase()
    return (
      t.name?.toLowerCase().includes(q) ||
      t.region?.toLowerCase().includes(q) ||
      t.location?.toLowerCase().includes(q)
    )
  })

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Equipas</h2>
        <a href="/equipas/nova" className="btn">+ Nova</a>
      </div>

      <input
        className="search"
        type="search"
        placeholder="Pesquisar por nome, região ou local..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="empty">A carregar...</p>
      ) : filtered.length === 0 ? (
        <p className="empty">
          {search ? 'Nenhuma equipa encontrada.' : 'Ainda não há equipas. Cria a primeira!'}
        </p>
      ) : (
        <div className="card">
          {filtered.map(team => (
            <a key={team.id} href={`/equipas/${team.id}`} className="list-item">
              <div>
                <strong>{team.name}</strong>
                {team.region && (
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    {team.region}
                  </div>
                )}
                {team.location && (
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    📍 {team.location}
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
