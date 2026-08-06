'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function JornadaPage() {

  const { roundId } = useParams()

  const [round, setRound] = useState(null)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {

    const { data: roundData, error } = await supabase
      .from('rounds')
      .select(`
        *,
        seasons(
          *,
          competitions(*)
        )
      `)
      .eq('id', roundId)
      .single()

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    const { data: matchesData } = await supabase
      .from('matches')
      .select(`
        *,
        player1:players!matches_player1_id_fkey(name),
        player2:players!matches_player2_id_fkey(name)
      `)
      .eq('round_id', roundId)

    setRound(roundData)
    setMatches(matchesData || [])

    setLoading(false)

  }

  if (loading) {

    return (
      <div className="card">
        A carregar...
      </div>
    )

  }

  return (

    <div
      className="card"
      style={{
        maxWidth: 1000,
        margin: '30px auto',
        padding: 30
      }}
    >

      <h1>

        📅 Jornada {round.number}

      </h1>

      <p
        style={{
          color: '#64748b',
          marginBottom: 30
        }}
      >

        <strong>

          {round.seasons.competitions.name}

        </strong>

        <br />

        {round.seasons.name}

      </p>
      {matches.length === 0 ? (

        <div>

          <p
            style={{
              color: '#64748b',
              marginBottom: 20
            }}
          >
            Ainda não existem jogos nesta jornada.
          </p>

          <Link
            href={`/jogos/novo/${roundId}`}
            className="btn"
          >
            ➕ Novo Jogo
          </Link>

        </div>

      ) : (

        <div
          style={{
            display: 'grid',
            gap: 16
          }}
        >

          {matches.map(match => (

            <div
              key={match.id}
              className="card"
              style={{
                padding: 20,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >

              <div>

                <h3
                  style={{
                    margin: 0
                  }}
                >
                  {match.player1?.name || '---'}

                  {'  vs  '}

                  {match.player2?.name || '---'}
                </h3>

                <p
                  style={{
                    marginTop: 8,
                    color: '#64748b'
                  }}
                >
                  {match.player1_score}

                  {' - '}

                  {match.player2_score}
                </p>

              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 10
                }}
              >

                <Link
                  href={`/jogos/${match.id}`}
                  className="btn"
                >
                  Abrir
                </Link>
                <Link
                  href={`/jogos/${match.id}/editar`}
                  className="btn btn-secondary"
                >
                  ✏️ Editar
                </Link>

              </div>

            </div>

          ))}

          <div
            style={{
              marginTop: 20
            }}
          >

            <Link
              href={`/jogos/novo/${roundId}`}
              className="btn"
            >
              ➕ Novo Jogo
            </Link>

          </div>

        </div>

      )}

      <div
        style={{
          marginTop: 30
        }}
      >

        <Link
          href={`/jornadas/${round.season_id}`}
          className="btn btn-secondary"
        >
          ← Voltar às Jornadas
        </Link>

      </div>

    </div>

  )

}
