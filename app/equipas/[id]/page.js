'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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
    if (id) {
      loadData()
    }
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
      .select(`
        *,
        players(*)
      `)
      .eq('team_id', id)
      .order('joined_at', {
        ascending: false
      })

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

    const { error } = await supabase
      .from('team_players')
      .insert({
        team_id: id,
        player_id: selectedPlayer,
        joined_at: new Date()
          .toISOString()
          .slice(0, 10),
        is_active: true
      })

    if (error) {
      alert('Erro: ' + error.message)
      return
    }

    setSelectedPlayer('')
    loadData()
  }

  async function removePlayer(linkId) {
    if (!confirm('Remover este jogador da equipa?')) {
      return
    }

    const { error } = await supabase
      .from('team_players')
      .delete()
      .eq('id', linkId)

    if (error) {
      alert('Erro: ' + error.message)
      return
    }

    loadData()
  }

  async function deleteTeam() {
    if (!confirm('Apagar esta equipa permanentemente?')) {
      return
    }

    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Erro: ' + error.message)
      return
    }

    router.push('/equipas')
  }

  if (loading) {
    return (
      <p className="empty">
        A carregar equipa...
      </p>
    )
  }

  if (!team) {
    return (
      <p className="empty">
        Equipa não encontrada.
      </p>
    )
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
            gap: 20,
            flexWrap: 'wrap'
          }}
        >

          <div>

            <h1
              style={{
                margin: 0,
                fontSize: '2.5rem',
                fontWeight: 800,
                color: '#0f172a'
              }}
            >
              🛡️ {team.name}
            </h1>

            {team.region && (
              <p
                style={{
                  marginTop: 10,
                  color: '#64748b',
                  fontSize: '1.1rem'
                }}
              >
                🏛️ {team.region}
              </p>
            )}

            {team.location && (
              <p
                style={{
                  marginTop: 8,
                  color: '#475569'
                }}
              >
                📍 {team.location}
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
              href={`/equipas/${id}/editar`}
              className="btn"
            >
              ✏️ Editar
            </Link>

            <button
              onClick={deleteTeam}
              className="btn btn-danger"
            >
              🗑️ Apagar
            </button>

          </div>

        </div>


        {team.notes && (

          <div
            style={{
              marginTop: 24,
              padding: 16,
              background: '#f8fafc',
              borderRadius: 12,
              color: '#475569',
              whiteSpace: 'pre-wrap'
            }}
          >
            {team.notes}
          </div>

        )}

      </div>


      <div
        className="card"
        style={{
          padding: 28
        }}
      >

        <h2>
          👥 Plantel Atual
        </h2>

        {players.length === 0 ? (

          <p
            style={{
              marginTop: 20,
              color: '#94a3b8'
            }}
          >
            Ainda não existem jogadores associados.
          </p>

        ) : (

          <div
            style={{
              marginTop: 24,
              display: 'grid',
              gap: 14
            }}
          >

            {players.map(link => (

              <div
                key={link.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 14,
                  padding: 18,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 20,
                  flexWrap: 'wrap'
                }}
              >

                <div>

                  <Link
                    href={`/jogadores/${link.player_id}`}
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      color: '#2563eb'
                    }}
                  >
                    👤 {link.players?.name}
                  </Link>

                  {link.players?.nickname && (

                    <span
                      style={{
                        marginLeft: 8,
                        color: '#64748b'
                      }}
                    >
                      "{link.players.nickname}"
                    </span>

                  )}

                  {link.is_active && (

                    <div
                      style={{
                        marginTop: 8
                      }}
                    >
                      <span className="badge badge-active">
                        Ativo
                      </span>
                    </div>

                  )}

                </div>
                <button
                  onClick={() => removePlayer(link.id)}
                  className="btn btn-danger"
                  style={{
                    padding: '8px 14px'
                  }}
                >
                  Remover
                </button>

              </div>

            ))}

          </div>

        )}


        <div
          style={{
            marginTop: 28,
            paddingTop: 24,
            borderTop: '1px solid #e2e8f0'
          }}
        >

          <h3>
            ➕ Associar jogador
          </h3>


          <div
            style={{
              display: 'flex',
              gap: 12,
              marginTop: 16,
              flexWrap: 'wrap'
            }}
          >

            <select
              value={selectedPlayer}
              onChange={e => setSelectedPlayer(e.target.value)}
              style={{
                flex: 1,
                minWidth: 240,
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                background: 'white'
              }}
            >

              <option value="">
                Escolher jogador...
              </option>

              {allPlayers.map(player => (

                <option
                  key={player.id}
                  value={player.id}
                >
                  {player.name}
                  {player.nickname
                    ? ` ("${player.nickname}")`
                    : ''}
                </option>

              ))}

            </select>


            <button
              onClick={addPlayer}
              className="btn"
              disabled={!selectedPlayer}
            >
              Associar
            </button>


          </div>

        </div>


      </div>


      <div
        className="card"
        style={{
          padding: 28
        }}
      >

        <h2>
          📊 Informação da Equipa
        </h2>


        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
            gap: 16,
            marginTop: 24
          }}
        >

          <div
            style={{
              padding: 18,
              borderRadius: 14,
              background: '#f8fafc'
            }}
          >
            <strong>
              Jogadores
            </strong>

            <div
              style={{
                marginTop: 8,
                fontSize: '1.8rem',
                fontWeight: 800
              }}
            >
              {players.length}
            </div>
          </div>


          <div
            style={{
              padding: 18,
              borderRadius: 14,
              background: '#f8fafc'
            }}
          >
            <strong>
              Estado
            </strong>

            <div
              style={{
                marginTop: 8,
                color: '#16a34a',
                fontWeight: 700
              }}
            >
              Ativa
            </div>
          </div>

        </div>

      </div>
      <div
        style={{
          marginTop: 0
        }}
      >

        <Link
          href="/equipas"
          className="btn btn-secondary"
        >
          ← Voltar às Equipas
        </Link>

      </div>

    </div>
  )
}
