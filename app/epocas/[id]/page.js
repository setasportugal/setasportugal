'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function EpocaPage() {

  const { id } = useParams()

  const [season, setSeason] = useState(null)
  const [competition, setCompetition] = useState(null)

  useEffect(() => {
    loadSeason()
  }, [])

  async function loadSeason() {

    const { data, error } = await supabase
      .from('seasons')
      .select(`
        *,
        competitions(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      alert(error.message)
      return
    }

    setSeason(data)
    setCompetition(data.competitions)

  }

  if (!season) {

    return (
      <div className="card">
        A carregar...
      </div>
    )

  }

  return (

    <div
      style={{
        display: 'grid',
        gap: 24
      }}
    >

      <div
        className="card"
        style={{
          padding: 30
        }}
      >

        <h1>

          🏆 {competition.name}

        </h1>

        <p
          style={{
            color: '#64748b'
          }}
        >

          {season.name}

        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(250px,1fr))',
            gap: 18,
            marginTop: 30
          }}
        >

          <Link
            href={`/epocas/${id}/participantes`}
            style={{
              textDecoration: 'none'
            }}
          >

            <div
              className="card"
              style={{
                padding: 20
              }}
            >

              <h3>👥 Participantes</h3>

              <p
                style={{
                  color: '#64748b'
                }}
              >
                Gerir jogadores ou equipas da época.
              </p>

            </div>

          </Link>

          <Link
            href={`/jornadas/${id}`}
            style={{
              textDecoration: 'none'
            }}
          >

            <div
              className="card"
              style={{
                padding: 20
              }}
            >

              <h3>📅 Jornadas</h3>

              <p
                style={{
                  color: '#64748b'
                }}
              >
                Criar e gerir jornadas.
              </p>

            </div>

          </Link>
          <Link
            href={`/classificacoes/${id}`}
            style={{
              textDecoration: 'none'
            }}
          >

            <div
              className="card"
              style={{
                padding: 20
              }}
            >

              <h3>🏆 Classificação</h3>

              <p
                style={{
                  color: '#64748b'
                }}
              >
                Consultar classificação da época.
              </p>

            </div>

          </Link>

          <Link
            href={`/estatisticas/${id}`}
            style={{
              textDecoration: 'none'
            }}
          >

            <div
              className="card"
              style={{
                padding: 20
              }}
            >

              <h3>📊 Estatísticas</h3>

              <p
                style={{
                  color: '#64748b'
                }}
              >
                Ver estatísticas da competição.
              </p>

            </div>

          </Link>

        </div>

      </div>
    </div>

  )

}
