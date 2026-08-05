'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function CompeticaoDetalhePage() {
  const { id } = useParams()
  const router = useRouter()

  const [competition, setCompetition] = useState(null)
  const [seasons, setSeasons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadData()
    }
  }, [id])

  async function loadData() {
    setLoading(true)

    const { data: competitionData } = await supabase
      .from('competitions')
      .select(`
        *,
        associations(name)
      `)
      .eq('id', id)
      .single()

    const { data: seasonsData } = await supabase
      .from('seasons')
      .select('*')
      .eq('competition_id', id)
      .order('year', { ascending: false })

    setCompetition(competitionData)
    setSeasons(seasonsData || [])

    setLoading(false)
  }

  async function deleteCompetition() {
    if (!confirm('Apagar esta competição permanentemente?')) {
      return
    }

    const { error } = await supabase
      .from('competitions')
      .delete()
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    router.push('/competicoes')
  }

  if (loading) {
    return <p className="empty">A carregar competição...</p>
  }

  if (!competition) {
    return <p className="empty">Competição não encontrada.</p>
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
              🏆 {competition.name}
            </h1>

            {competition.type && (

              <p
                style={{
                  marginTop: 10,
                  color: '#64748b',
                  fontSize: '1.1rem'
                }}
              >
                {competition.type}
              </p>

            )}

            {competition.associations?.name && (

              <p
                style={{
                  marginTop: 8,
                  color: '#475569'
                }}
              >
                🏛️ {competition.associations.name}
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
              href={`/competicoes/${id}/editar`}
              className="btn"
            >
              ✏️ Editar
            </Link>

            <button
              onClick={deleteCompetition}
              className="btn btn-danger"
            >
              🗑️ Apagar
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

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16
          }}
        >

          <h2>📅 Épocas</h2>

<Link
  href="/epocas/nova"
  className="btn"
>
  ➕ Nova Época
</Link>

        </div>
        {seasons.length === 0 ? (

          <p
            style={{
              marginTop: 20,
              color: '#94a3b8'
            }}
          >
            Ainda não existem épocas para esta competição.
          </p>

        ) : (

          <div
            style={{
              display: 'grid',
              gap: 14,
              marginTop: 24
            }}
          >

            {seasons.map(season => (

              <Link
                key={season.id}
                href={`/epocas/${season.id}`}
                style={{
                  textDecoration: 'none'
                }}
              >

                <div
                  style={{
                    padding: 18,
                    border: '1px solid #e2e8f0',
                    borderRadius: 14
                  }}
                >

                  <strong
                    style={{
                      color: '#2563eb',
                      fontSize: '1.1rem'
                    }}
                  >
                    📅 {season.name}
                  </strong>

                  {season.year && (

                    <div
                      style={{
                        marginTop: 8,
                        color: '#64748b'
                      }}
                    >
                      Ano: {season.year}
                    </div>

                  )}

                </div>

              </Link>

            ))}

          </div>

        )}

      </div>


      <div
        className="card"
        style={{
          padding: 28
        }}
      >

        <h2>📊 Informação</h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(180px,1fr))',
            gap: 16,
            marginTop: 24
          }}
        >

          <div
            style={{
              padding: 18,
              background: '#f8fafc',
              borderRadius: 14
            }}
          >

            <strong>Épocas</strong>

            <div
              style={{
                marginTop: 8,
                fontSize: '1.8rem',
                fontWeight: 800
              }}
            >
              {seasons.length}
            </div>

          </div>
          <div
            style={{
              padding: 18,
              background: '#f8fafc',
              borderRadius: 14
            }}
          >

            <strong>Estado</strong>

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

      <div>

        <Link
          href="/competicoes"
          className="btn btn-secondary"
        >
          ← Voltar às competições
        </Link>

      </div>

    </div>
  )
}
