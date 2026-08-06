'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function JornadasPage() {

  const { seasonId } = useParams()

  const [season, setSeason] = useState(null)
  const [competition, setCompetition] = useState(null)
  const [rounds, setRounds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {

    const { data: seasonData, error } = await supabase
      .from('seasons')
      .select('*')
      .eq('id', seasonId)
      .single()

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    const { data: competitionData } = await supabase
      .from('competitions')
      .select('*')
      .eq('id', seasonData.competition_id)
      .single()

    const { data: roundsData } = await supabase
      .from('rounds')
      .select('*')
      .eq('season_id', seasonId)
      .order('number')

    setSeason(seasonData)
    setCompetition(competitionData)
    setRounds(roundsData || [])

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
        maxWidth: 900,
        margin: '30px auto',
        padding: 30
      }}
    >

      <h1>📅 Jornadas</h1>

      <p
        style={{
          color: '#64748b',
          marginBottom: 30
        }}
      >

        <strong>{competition?.name}</strong>

        <br />

        {season?.name}

      </p>
      {rounds.length === 0 ? (

        <div>

          <p
            style={{
              color: '#64748b',
              marginBottom: 20
            }}
          >
            Ainda não existem jornadas para esta época.
          </p>

          <Link
            href={`/jornadas/nova/${seasonId}`}
            className="btn"
          >
            ➕ Criar Jornadas
          </Link>

        </div>

      ) : (

        <div
          style={{
            display: 'grid',
            gap: 16
          }}
        >

          {rounds.map(round => (

            <div
              key={round.id}
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
                  📅 Jornada {round.number}
                </h3>

                <p
                  style={{
                    marginTop: 8,
                    color: '#64748b'
                  }}
                >
                  {round.date || 'Sem data'}
                </p>

              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 10
                }}
              >

                <Link
                  href={`/jornadas/jornada/${round.id}`}
                  className="btn"
                >
                  ⚽ Jogos
                </Link>
                <Link
                  href={`/jornadas/${round.id}/editar`}
                  className="btn btn-secondary"
                >
                  ✏️ Editar
                </Link>

              </div>

            </div>

          ))}

        </div>

      )}

      <div
        style={{
          marginTop: 30,
          display: 'flex',
          gap: 12
        }}
      >

        <Link
          href={`/epocas/${seasonId}`}
          className="btn btn-secondary"
        >
          ← Voltar à Época
        </Link>

      </div>

    </div>

  )

}
