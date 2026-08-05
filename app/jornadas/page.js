'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function JornadasPage() {

  const searchParams = useSearchParams()

  const seasonId = searchParams.get('season')

  const [season, setSeason] = useState(null)
  const [rounds, setRounds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (seasonId) {
      loadData()
    }
  }, [seasonId])

  async function loadData() {

    const { data: seasonData } = await supabase
      .from('seasons')
      .select(`
        *,
        competitions(name)
      `)
      .eq('id', seasonId)
      .single()

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
    return <p className="empty">A carregar...</p>
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
          marginBottom: 25
        }}
      >

        <div>

          <h1>📅 Jornadas</h1>

          <p
            style={{
              color: '#64748b'
            }}
          >
            <strong>{season?.competitions?.name}</strong>

            <br />

            {season?.name}
          </p>

        </div>

        <Link
          href={`/jornadas/nova/${seasonId}`}
          className="btn"
        >
          ➕ Criar Jornadas
        </Link>

      </div>

      {rounds.length === 0 ? (

        <p className="empty">
          Ainda não existem jornadas.
        </p>

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
                padding: 18,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>

                <strong>
                  Jornada {round.number}
                </strong>

                {round.date && (

                  <div
                    style={{
                      color: '#64748b',
                      marginTop: 6
                    }}
                  >
                    {round.date}
                  </div>

                )}

              </div>

              <Link
                href={`/jornadas/${round.id}`}
                className="btn"
              >
                Abrir
              </Link>

            </div>

          ))}

        </div>

      )}

    </div>

  )

}
