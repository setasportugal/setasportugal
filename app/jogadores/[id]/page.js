'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function JogadorDetalhePage() {
  const { id } = useParams()
  const router = useRouter()
  const [player, setPlayer] = useState(null)
  const [links, setLinks] = useState([])
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

    const { data: linksData } = await supabase
      .from('team_players')
      .select('*, teams(*)')
      .eq('player_id', id)
      .order('joined_at', { ascending: false })

    setPlayer(playerData)
    setLinks(linksData || [])
    setLoading(false)
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

  async function deleteLink(linkId) {
    if (!confirm('Apagar este registo do histórico?')) return

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

  const activeLink = links.find(l => l.is_active)

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

        <div style={{ marginTop: 12, padding: '10px 12px', background: '#f1f5f9', borderRadius: 8 }}>
          <strong style={{ fontSize: '0.85rem', color: '#475569' }}>Equipa atual:</strong>
          <div style={{ marginTop: 4 }}>
            {activeLink ? (
              <a href={`/equipas/${activeLink.team_id}`}>
                <strong>{activeLink.teams?.name}</strong>
              </a>
            ) : (
              <span style={{ color: '#94a3b8' }}>Sem equipa (livre)</span>
            )}
          </div>
        </div>

        <div className="actions">
          <a href={`/jogadores/${id}/editar`} className="btn">Editar</a>
          <a href={`/jogadores/${id}/transferir`} className="btn btn-secondary">
            Transferir
          </a>
          <button onClick={deletePlayer} className="btn btn-danger">Apagar</button>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Histórico de equipas</h3>

        {links.length === 0 ? (
          <p style={{ color: '#94a3b8', marginTop: 8 }}>
            Ainda sem histórico de equipas.
          </p>
        ) : (
          <div style={{ marginTop: 8 }}>
            {links.map(link => (
              <div key={link.id} className="list-item" style={{ alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <a href={`/equipas/${link.team_id}`}>
                    <strong>{link.teams?.name}</strong>
                  </a>
                  {link.is_active && (
                    <span className="badge badge-active" style={{ marginLeft: 8 }}>
                      Atual
                    </span>
                  )}
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 2 }}>
                    {link.joined_at ? `Desde ${link.joined_at}` : ''}
                    {link.left_at ? ` até ${link.left_at}` : link.is_active ? ' → presente' : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <a
                    href={`/jogadores/\( {id}/historico/ \){link.id}/editar`}
                    className="btn btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                  >
                    Editar
                  </a>
                  <button
                    onClick={() => deleteLink(link.id)}
                    className="btn btn-danger"
                    style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                  >
                    Apagar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <a href="/jogadores">← Voltar aos jogadores</a>
      </div>
    </div>
  )
              }
