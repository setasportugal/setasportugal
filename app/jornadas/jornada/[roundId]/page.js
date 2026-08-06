'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase } from '../../../../lib/supabase'

export default function JornadaPage() {

  const { roundId } = useParams()

  const [round, setRound] = useState(null)
  const [season, setSeason] = useState(null)
  const [competition, setCompetition] = useState(null)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {

    const { data: roundData, error: roundError } = await supabase
      .from('rounds')
      .select('*')
      .eq('id', roundId)
      .single()

    if (roundError) {
      console.log(roundError)
      alert('ERRO ROUNDS: ' + roundError.message)
      setLoading(false)
      return
    }

    const { data: seasonData, error: seasonError } = await supabase
      .from('seasons')
      .select('*')
      .eq('id', roundData.season_id)
      .single()

    if (seasonError) {
      console.log(seasonError)
      alert('ERRO SEASON: ' + seasonError.message)
      setLoading(false)
      return
    }

    const { data: competitionData, error: competitionError } = await supabase
      .from('competitions')
      .select('*')
      .eq('id', seasonData.competition_id)
      .single()

    if (competitionError) {
      console.log(competitionError)
      alert('ERRO COMPETITION: ' + competitionError.message)
      setLoading(false)
      return
    }

    const { data: matchesData } = await supabase
      .from('matches')
      .select('*')
      .eq('round_id', roundId)

    setRound(roundData)
    setSeason(seasonData)
    setCompetition(competitionData)
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

        <strong>{competition.name}</strong>

        <br />

        {season.name}

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
                  Jogo
                </h3>

                <p
                  style={{
                    marginTop: 8,
                    color: '#64748b'
                  }}
                >
                  Resultado:

                  {' '}

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
          href={`/jornadas/${season.id}`}
          className="btn btn-secondary"
        >
          ← Voltar às Jornadas
        </Link>

      </div>

    </div>

  )

}
