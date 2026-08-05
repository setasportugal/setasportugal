'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function JornadasPage() {

  const { seasonId } = useParams()
  const router = useRouter()

  const [season, setSeason] = useState(null)
  const [rounds, setRounds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {

    const { data: seasonData, error } = await supabase
      .from('seasons')
      .select(`
        *,
        competitions(*)
      `)
      .eq('id', seasonId)
      .single()

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    const { data: roundsData } = await supabase
      .from('rounds')
      .select('*')
      .eq('season_id', seasonId)
      .order('number')

    setSeason(seasonData)
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

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 30,
          flexWrap: 'wrap',
          gap: 20
        }}
      >

        <div>

          <h1>📅 Jornadas</h1>

          <p
            style={{
              color: '#64748b'
            }}
          >

            <strong>{season.competitions.name}</strong>

            <br />

            {season.name}

          </p>

        </div>
        {rounds.length === 0 ? (

          <div>

            <p
              style={{
                color: '#64748b',
                marginTop: 20
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
              gap: 14
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

                    {round.date
                      ? round.date
                      : 'Sem data definida'}

                  </p>

                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: 10
                  }}
                >

                  <Link
                    href={`/jornadas/${round.id}`}
                    className="btn"
                  >
                    Abrir
                  </Link>
                  <Link
                    href={`/jornadas/${round.id}/editar`}
                    className="btn btn-secondary"
                  >
                    Editar
                  </Link>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      <div
        style={{
          marginTop: 30,
          display: 'flex',
          gap: 12
        }}
      >

        <button
          className="btn btn-secondary"
          onClick={() => router.push(`/epocas/${seasonId}`)}
        >
          ← Voltar à Época
        </button>

      </div>

    </div>

  )

}
