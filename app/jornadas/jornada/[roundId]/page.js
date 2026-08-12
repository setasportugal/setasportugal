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
      alert('Erro ao carregar a jornada: ' + roundError.message)
      setLoading(false)
      return
    }

    const { data: seasonData, error: seasonError } = await supabase
      .from('seasons')
      .select('*')
      .eq('id', roundData.season_id)
      .single()

    if (seasonError) {
      alert('Erro ao carregar a Ã©poca: ' + seasonError.message)
      setLoading(false)
      return
    }

    const { data: competitionData, error: competitionError } = await supabase
      .from('competitions')
      .select('*')
      .eq('id', seasonData.competition_id)
      .single()

    if (competitionError) {
      alert('Erro ao carregar a competiÃ§Ã£o: ' + competitionError.message)
      setLoading(false)
      return
    }

    const { data: matchesData, error: matchesError } = await supabase
      .from('matches')
      .select(`
        *,
        player1:players!matches_player1_id_fkey(name, nickname),
        player2:players!matches_player2_id_fkey(name, nickname),
        team1:teams!matches_team1_id_fkey(name),
        team2:teams!matches_team2_id_fkey(name)
      `)
      .eq('round_id', roundId)

    if (matchesError) {
      alert('Erro ao carregar os jogos: ' + matchesError.message)
      setLoading(false)
      return
    }

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
        ðŸ“… Jornada {round?.number}
      </h1>

      <p
        style={{
          color: '#64748b',
          marginBottom: 30
        }}
      >

<strong>{competition?.name || 'Sem competiÃ§Ã£o'}</strong>

<br />

{season?.name || 'Sem Ã©poca'}

      </p>
      {matches.length === 0 ? (

        <div>

          <p
            style={{
              color: '#64748b',
              marginBottom: 20
            }}
          >
            Ainda nÃ£o existem jogos nesta jornada.
          </p>

          <Link
            href={`/jogos/novo/${roundId}`}
            className="btn"
          >
            âž• Novo Jogo
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
                  {match.player1?.name || match.team1?.name || 'Participante'}

                  {' vs '}

                  {match.player2?.name || match.team2?.name || 'Participante'}
                </h3>

                <p
                  style={{
                    marginTop: 8,
                    color: '#64748b'
                  }}
                >
                  {match.status === 'completed'
                    ? `Resultado: ${match.player1_score} - ${match.player2_score}`
                    : match.status === 'cancelled'
                      ? 'Jogo cancelado'
                      : 'Jogo agendado'}
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
                  âœï¸ Editar
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
              âž• Novo Jogo
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
          â† Voltar Ã s Jornadas
        </Link>

      </div>

    </div>

  )

}

