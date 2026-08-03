'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function JogadorDetalhePage() {
  const { id } = useParams()
  const router = useRouter()
  const [player, setPlayer] = useState(null)
  const [teams, setTeams] = useState([])
  const [allTeams, setAllTeams] = useState([])
  const [selectedTeam, setSelectedTeam] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) loadData()
  }, [id])

  async function loadData() {
    setLoading(true)

    const { data: playerData } = await supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .single()

    const { data: links } = await supabase
      .from('team_players')
      .select('*, teams(*)')
      .eq('player_id', id)
      .order('joined_at', { ascending: false })

    const { data: teamsData } = await supabase
      .from('teams')
      .select('*')
      .order('name')

    setPlayer(playerData)
    setTeams(links || [])
    setAllTeams(teamsData || [])
    setLoading(false)
  }

  async function addToTeam() {
    if (!selectedTeam) return

    const { error } = await supabase.from('team_players').insert({
      player_id: id,
      team_id: selectedTeam,
      joined_at: new Date().toISOString().slice(0, 10),
      is_active: true
    })

    if (error) {
      alert('Erro: ' + error.message)
    } else {
      setSelectedTeam('')
      loadData()
    }
  }

  async function removeFromTeam(linkId) {
    if (!confirm('Remover esta associação?')) return

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

  async function deletePlayer() {
    if (!confirm('Apagar este jogador permanentemente?')) return

    const { error } = await supabase.from('players').delete().eq('id', id)
    if (error) {
      alert('Erro: ' + error.message)
    } else {
      router.push('/jogadores')
    }
  }

  if (loading) return <p className="empty">A carregar...</p>
  if (!player) return <p className="empty">Jogador não encontrado.</p>

  return (
    <div style={{ marginTop: 16 }}>
      <div className="card">
        <h2>{player.name}</h2>
        {player.nickname && (
          <p style={{ color: '#64748b' }}>“{player.nickname}”</p>
        )}
        {player.city && (
          <p style={{ marginTop: 4, fontSize: '0.9rem' }}>📍 {player.city}</p>
        )}
        {player.notes && (
          <p style={{ marginTop: 12, color: '#475569', whiteSpace: 'pre-wrap' }}>
            {player.notes}
          </p>
        )}

        <div className="actions">
          <a href={`/jogadores/${id}/editar`} className="btn">Editar</a>
          <button onClick={deletePlayer} className="btn btn-danger">Apagar</button>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Equipas</h3>

        {teams.length === 0 ? (
          <p style={{ color: '#94a3b8', marginTop: 8 }}>Ainda não está associado a nenhuma equipa.</p>
        ) : (
          <div style={{ marginTop: 8 }}>
            {teams.map(link => (
              <div key={link.id} className="list-item">
                <div>
                  <a href={`/equipas/${link.team_id}`}>
                    <strong>{link.teams?.name}</strong>
                  </a>
                  {link.is_active && (
                    <span className="badge badge-active" style={{ marginLeft: 8 }}>
                      Ativo
                    </span>
                  )}
                  {link.joined_at && (
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      Desde {link.joined_at}
                      {link.left_at ? ` até ${link.left_at}` : ''}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeFromTeam(link.id)}
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
            value={selectedTeam}
            onChange={e => setSelectedTeam(e.target.value)}
            style={{ flex: 1, minWidth: 160, padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}
          >
            <option value="">Escolher equipa...</option>
            {allTeams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <button onClick={addToTeam} className="btn" disabled={!selectedTeam}>
            Associar
          </button>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <a href="/jogadores">← Voltar aos jogadores</a>
      </div>
    </div>
  )
    }
