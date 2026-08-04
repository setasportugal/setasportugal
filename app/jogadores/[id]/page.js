'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function JogadorDetalhePage() {
  const { id } = useParams()
  const router = useRouter()

  const [player, setPlayer] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadPlayer()
    }
  }, [id])

  async function loadPlayer() {
    setLoading(true)

    const { data: playerData } = await supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .single()

    const { data: historyData } = await supabase
      .from('team_players')
      .select(`
        *,
        teams(*)
      `)
      .eq('player_id', id)
      .order('joined_at', {
        ascending: false
      })

    setPlayer(playerData)
    setHistory(historyData || [])

    setLoading(false)
  }

  async function deletePlayer() {
    if (!confirm('Apagar este jogador permanentemente?')) return

    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    router.push('/jogadores')
  }

  async function deleteTransfer(transferId) {
    if (!confirm('Apagar este registo do histórico?')) return

    const { error } = await supabase
      .from('team_players')
      .delete()
      .eq('id', transferId)

    if (error) {
      alert(error.message)
      return
    }

    loadPlayer()
  }

  const currentTeam = history.find(item => item.is_active)

  if (loading) {
    return <p className="empty">A carregar jogador...</p>
  }

  if (!player) {
    return <p className="empty">Jogador não encontrado.</p>
  }

  return (
    <div
      style={{
        display: 'grid',
        gap: 24,
        marginTop: 24
      }}
    >

      <div
        className="card"
        style={{
          padding: 30
        }}
      >

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 20
          }}
        >

          <div>

            <h1
              style={{
                margin: 0,
                fontSize: '2.6rem',
                fontWeight: 800,
                color: '#0f172a'
              }}
            >
              👤 {player.name}
            </h1>

            {player.nickname && (

              <div
                style={{
                  marginTop: 10,
                  fontSize: '1.1rem',
                  color: '#64748b'
                }}
              >
                🏷️ {player.nickname}
              </div>

            )}

            {player.city && (

              <div
                style={{
                  marginTop: 8,
                  color: '#475569'
                }}
              >
                📍 {player.city}
              </div>

            )}

          </div>

          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap'
            }}
          >

            <Link
              href={`/jogadores/${id}/editar`}
              className="btn"
            >
              ✏️ Editar
            </Link>
            <Link
              href={`/jogadores/${id}/transferir`}
              className="btn btn-secondary"
            >
              🔄 Transferir
            </Link>

            <button
              onClick={deletePlayer}
              className="btn btn-danger"
            >
              🗑️ Apagar
            </button>

          </div>

        </div>

      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,2fr) minmax(320px,1fr)',
          gap: 24,
          alignItems: 'start'
        }}
      >

        <div
          className="card"
          style={{
            padding: 28
          }}
        >

          <h2>Informação do Jogador</h2>

          <div
            style={{
              display: 'grid',
              gap: 18,
              marginTop: 24
            }}
          >

            <div>

              <strong>Nome</strong>

              <div
                style={{
                  marginTop: 4
                }}
              >
                {player.name}
              </div>

            </div>

            {player.nickname && (

              <div>

                <strong>Nickname</strong>

                <div
                  style={{
                    marginTop: 4
                  }}
                >
                  {player.nickname}
                </div>

              </div>

            )}

            {player.city && (

              <div>

                <strong>Cidade</strong>

                <div
                  style={{
                    marginTop: 4
                  }}
                >
                  {player.city}
                </div>

              </div>

            )}

            {player.notes && (

              <div>

                <strong>Notas</strong>

                <div
                  style={{
                    marginTop: 8,
                    whiteSpace: 'pre-wrap',
                    color: '#475569',
                    lineHeight: 1.6
                  }}
                >
                  {player.notes}
                </div>

              </div>

            )}

          </div>

        </div>

        <div
          className="card"
          style={{
            padding: 28,
            position: 'sticky',
            top: 20
          }}
        >

          <h2>Equipa Atual</h2>

          <div
            style={{
              marginTop: 24
            }}
          >

            {currentTeam ? (
                            <div>

                <Link
                  href={`/equipas/${currentTeam.team_id}`}
                  style={{
                    display: 'inline-block',
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    color: '#2563eb'
                  }}
                >
                  🛡️ {currentTeam.teams?.name}
                </Link>

                <div
                  style={{
                    marginTop: 14,
                    color: '#64748b'
                  }}
                >
                  <strong>Entrada:</strong>{' '}
                  {currentTeam.joined_at || '-'}
                </div>

                <div
                  style={{
                    marginTop: 14
                  }}
                >
                  <span className="badge badge-active">
                    Jogador Ativo
                  </span>
                </div>

              </div>

            ) : (

              <div
                style={{
                  padding: 18,
                  border: '1px dashed #cbd5e1',
                  borderRadius: 12,
                  textAlign: 'center',
                  color: '#64748b'
                }}
              >
                Jogador sem equipa.
              </div>

            )}

          </div>

        </div>

      </div>

      <div
        className="card"
        style={{
          padding: 28
        }}
      >

        <h2>Histórico de Equipas</h2>

        {history.length === 0 ? (

          <p
            style={{
              marginTop: 20,
              color: '#94a3b8'
            }}
          >
            Ainda não existe histórico de equipas.
          </p>

        ) : (

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              marginTop: 24
            }}
          >

            {history.map(item => (

              <div
                key={item.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderLeft: '5px solid #2563eb',
                  borderRadius: 14,
                  padding: 20,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 20,
                  flexWrap: 'wrap'
                }}
              >
                <div
                  style={{
                    flex: 1,
                    minWidth: 250
                  }}
                >

                  <Link
                    href={`/equipas/${item.team_id}`}
                    style={{
                      textDecoration: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: '#2563eb'
                    }}
                  >
                    🛡️ {item.teams?.name || 'Sem equipa'}
                  </Link>

                  <div
                    style={{
                      marginTop: 10,
                      color: '#64748b',
                      lineHeight: 1.6
                    }}
                  >
                    <strong>Entrada:</strong> {item.joined_at || '-'}
                    <br />
                    <strong>Saída:</strong>{' '}
                    {item.left_at || 'Atual'}
                  </div>

                  {item.is_active && (
                    <div
                      style={{
                        marginTop: 10
                      }}
                    >
                      <span className="badge badge-active">
                        Equipa Atual
                      </span>
                    </div>
                  )}

                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: 10,
                    flexWrap: 'wrap'
                  }}
                >

                  <Link
                    href={`/jogadores/${id}/historico/${item.id}/editar`}
                    className="btn btn-secondary"
                  >
                    ✏️ Editar
                  </Link>

                  <button
                    onClick={() => deleteTransfer(item.id)}
                    className="btn btn-danger"
                  >
                    🗑️ Apagar
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12
        }}
      >

        <Link
          href="/jogadores"
          className="btn btn-secondary"
        >
          ← Voltar aos Jogadores
        </Link>

        <div
          style={{
            color: '#94a3b8',
            fontSize: '.85rem'
          }}
        >
          ID: {player.id}
        </div>

      </div>

    </div>
  )
}
