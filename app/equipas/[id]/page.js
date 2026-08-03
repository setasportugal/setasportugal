'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function EquipaDetalhePage() {
  const { id } = useParams()
  const router = useRouter()
  const [team, setTeam] = useState(null)
  const [players, setPlayers] = useState([])
  const [allPlayers, setAllPlayers] = useState([])
  const [selectedPlayer, setSelectedPlayer] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) loadData()
  }, [id])

  async function loadData() {
    setLoading(true)

    const { data: teamData } = await supabase
      .from('teams')
      .select('*')
      .eq('id', id)
      .single()

    const { data: links } = await supabase
      .from('team_players')
      .select('*, players(*)')
      .eq('team_id', id)
      .order('joined_at', { ascending: false })

    const { data: playersData } = await supabase
      .from('players')
      .select('*')
      .order('name')

    setTeam(teamData)
    setPlayers(links || [])
    setAllPlayers(playersData || [])
    setLoading(false)
  }

  async function addPlayer() {
    if (!selectedPlayer) return

    const { error } = await supabase.from('team_players').insert({
      team_id: id,
      player_id: selectedPlayer,
      joined_at: new Date().toISOString().slice(0, 10),
      is_active: true
    })

    if (error) {
      alert('Erro: ' + error.message)
    } else {
      setSelectedPlayer('')
      loadData()
    }
  }

  async function removePlayer(linkId) {
    if (!confirm('Remover este jogador da equipa?')) return

    const { error } = await supabase
      .from('team_players')
      .delete()
      .eq('id', linkId)

    if (error) {
      alert('Erro: ' + error.message)
    } else {
      loadData()
    }
  }

  async function deleteTeam() {
    if (!confirm('Apagar esta equipa permanentemente?')) return

    const { error } = await supabase.from('teams').delete().eq('id', id)
    if (error) {
      alert('Erro: ' + error.message)
    } else {
      router.push('/equipas')
    }
  }

  if (loading) return <p className="empty">A carregar...</p>
  if (!team) return <p className="empty">Equipa não encontrada.</p>

  return (
    <div style={{ marginTop: 16 }}>
      <div className="card">
        <h2>{team.name}</h2>
        {team.region && (
          <p style={{ color: '#64748b' }}>{team.region}</p>
        )}
        {team.location && (
          <p style={{ marginTop: 4, fontSize: '0.9rem' }}>📍 {team.location}</p>
        )}
        {team.notes && (
          <p style={{ marginTop: 12, color: '#475569', whiteSpace: 'pre-wrap' }}>
            {team.notes}
          </p>
        )}

        <div className="actions">
          <a href={`/equipas/${id}/editar`} className="btn">Editar</a>
          <button onClick={deleteTeam} className="btn btn-danger">Apagar</button>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Jogadores</h3>

        {players.length === 0 ? (
          <p style={{ color: '#94a3b8', marginTop: 8 }}>Ainda não tem jogadores associados.</p>
        ) : (
          <div style={{ marginTop: 8 }}>
            {players.map(link => (
              <div key={link.id} className="list-item">
                <div>
                  <a href={`/jogadores/${link.player_id}`}>
                    <strong>{link.players?.name}</strong>
                  </a>
                  {link.players?.nickname && (
                    <span style={{ color: '#64748b', marginLeft: 6 }}>
                      “{link.players.nickname}”
                    </span>
                  )}
                  {link.is_active && (
                    <span className="badge badge-active" style={{ marginLeft: 8 }}>
                      Ativo
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removePlayer(link.id)}
                  className="btn btn-danger"
                  style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select
            value={selectedPlayer}
            onChange={e => setSelectedPlayer(e.target.value)}
            style={{ flex: 1, minWidth: 160, padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}
          >
            <option value="">Escolher jogador...</option>
            {allPlayers.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}{p.nickname ? ` (“${p.nickname}”)` : ''}
              </option>
            ))}
          </select>
          <button onClick={addPlayer} className="btn" disabled={!selectedPlayer}>
            Associar
          </button>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <a href="/equipas">← Voltar às equipas</a>
      </div>
    </div>
  )
  }
