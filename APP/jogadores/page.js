'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function JogadoresPage() {
  const [players, setPlayers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPlayers()
  }, [])

  async function loadPlayers() {
    setLoading(true)
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('name')

    if (error) {
      console.error(error)
      alert('Erro ao carregar jogadores: ' + error.message)
    } else {
      setPlayers(data || [])
    }
    setLoading(false)
  }

  const filtered = players.filter(p => {
    const q = search.toLowerCase()
    return (
      p.name?.toLowerCase().includes(q) ||
      p.nickname?.toLowerCase().includes(q) ||
      p.city?.toLowerCase().includes(q)
    )
  })

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Jogadores</h2>
        <a href="/jogadores/novo" className="btn">+ Novo</a>
      </div>

      <input
        className="search"
        type="search"
        placeholder="Pesquisar por nome, alcunha ou cidade..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="empty">A carregar...</p>
      ) : filtered.length === 0 ? (
        <p className="empty">
          {search ? 'Nenhum jogador encontrado.' : 'Ainda não há jogadores. Cria o primeiro!'}
        </p>
      ) : (
        <div className="card">
          {filtered.map(player => (
            <a key={player.id} href={`/jogadores/${player.id}`} className="list-item">
              <div>
                <strong>{player.name}</strong>
                {player.nickname && (
                  <span style={{ color: '#64748b', marginLeft: 8 }}>
                    “{player.nickname}”
                  </span>
                )}
                {player.city && (
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    {player.city}
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
