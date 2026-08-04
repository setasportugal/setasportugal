'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function JogadorDetalhePage() {
  const { id } = useParams()
  const router = useRouter()

  const [player, setPlayer] = useState(null)
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadData()
    }
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
      .select(`
        *,
        teams(*)
      `)
      .eq('player_id', id)
      .order('joined_at', { ascending: false })

    setPlayer(playerData)
    setLinks(linksData || [])
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

  async function deleteLink(linkId) {
    if (!confirm('Apagar este registo do histórico?')) return

    const { error } = await supabase
      .from('team_players')
      .delete()
      .eq('id', linkId)

    if (error) {
      alert(error.message)
      return
    }

    loadData()
  }

  const activeLink = links.find(link => link.is_active)

  if (loading) {
    return <p className="empty">A carregar...</p>
  }

  if (!player) {
    return <p className="empty">Jogador não encontrado.</p>
  }

  return (
    <div
  style={{
    marginTop: 24,
    display: 'grid',
    gap: 24
  }}
>

      <div
        className="card"
        style={{
          padding: 24,
          borderRadius: 18
        }}
      >

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 20,
            flexWrap: 'wrap'
          }}
        >

          <div>

            <h1
              style={{
                margin: 0,
                fontSize: '2.2rem',
                fontWeight: 700,
                lineHeight: 1.1
              }}
            >
              👤 {player.name}
            </h1>

            {player.nickname && (
              <p
                style={{
                  marginTop: 16,
                  color: '#475569',
                  fontSize: '.95rem'
                }}
              >
                "{player.nickname}"
              </p>
            )}

            {player.city && (
              <p
                style={{
                  marginTop: 10
                }}
              >
                📍 {player.city}
              </p>
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
              Editar
            </Link>

            <Link
              href={`/jogadores/${id}/transferir`}
              className="btn btn-secondary"
            >
              Transferir
            </Link>

            <button
              onClick={deletePlayer}
              className="btn btn-danger"
            >
              Apagar
            </button>

          </div>

        </div>
        <div
  style={{
    display: 'grid',
    gridTemplateColumns: 'minmax(0,2fr) minmax(320px,1fr)',
    gap: 24,
    marginTop: 30,
    alignItems: 'start'
  }}
>

          <div
  className="card"
  style={{
    padding: 28
  }}
>

  <h2
    style={{
      marginBottom: 24
    }}
  >
    Informação do Jogador
  </h2>

            <div
              style={{
                display: 'grid',
                gap: 16,
                marginTop: 20
              }}
            >

              <div>
                <strong>Nome</strong>
                <div>{player.name}</div>
              </div>

              {player.nickname && (
                <div>
                  <strong>Nickname</strong>
                  <div>{player.nickname}</div>
                </div>
              )}

              {player.city && (
                <div>
                  <strong>Cidade</strong>
                  <div>{player.city}</div>
                </div>
              )}

              {player.notes && (
                <div>
                  <strong>Notas</strong>

                  <div
                    style={{
                      marginTop: 8,
                      whiteSpace: 'pre-wrap',
                      color: '#475569'
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

  <h2
    style={{
      marginBottom: 24
    }}
  >
    Equipa Atual
  </h2>
            <div
              style={{
                marginTop: 20
              }}
            >

              {activeLink ? (

                <>

                  <Link
                    href={`/equipas/${activeLink.team_id}`}
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    🛡️ {activeLink.teams?.name}
                  </Link>

                  <div
                    style={{
                      marginTop: 12,
                      color: '#64748b'
                    }}
                  >
                    Desde{' '}
                    {activeLink.joined_at || '-'}
                  </div>

                  <div
                    style={{
                      marginTop: 12
                    }}
                  >
                    <span className="badge badge-active">
                      Jogador Ativo
                    </span>
                  </div>

                </>

              ) : (

                <div
                  style={{
                    color: '#94a3b8'
                  }}
                >
                  Jogador sem equipa.
                </div>

              )}

            </div>

          </div>

        </div>
        </div>
        <div
          className="card"
          style={{
            marginTop: 24
          }}
        >
          <h2
  style={{
    marginBottom: 24
  }}
>
  Histórico de Equipas
</h2>

          {links.length === 0 ? (

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
    marginTop: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  }}
>

              {links.map(link => (

                <div
                  key={link.id}
                  style={{
  border: '1px solid #e2e8f0',
  borderLeft: '5px solid #2563eb',
  background: '#ffffff',
  borderRadius: 14,
  padding: 20,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 20,
  transition: '.2s'
}}
                >

                  <div>

                    <Link
                      href={`/equipas/${link.team_id}`}
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      🛡️ {link.teams?.name || 'Sem equipa'}
                    </Link>

                    <div
                      style={{
                        marginTop: 8,
                        color: '#64748b',
                        fontSize: '.9rem'
                      }}
                    >
                      <strong>Entrada:</strong> {link.joined_at || '-'}

                      <br />

<strong>Saída:</strong>{' '}

{link.left_at
  ? link.left_at
  : 'Atual'}
                    </div>

                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: 8
                    }}
                  >

                    <Link
                      href={`/jogadores/${id}/historico/${link.id}/editar`}
                      className="btn btn-secondary"
                    >
                      Editar
                    </Link>

                    <button
                      onClick={() => deleteLink(link.id)}
                      className="btn btn-danger"
                    >
                      Apagar
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>
      <div
        style={{
          marginTop: 24,
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
          ID do Jogador: {player.id}
        </div>

      </div>

    </div>
  )
}
