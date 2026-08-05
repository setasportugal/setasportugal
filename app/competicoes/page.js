'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function CompeticoesPage() {
  const [competitions, setCompetitions] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCompetitions()
  }, [])

  async function loadCompetitions() {
    setLoading(true)

    const { data, error } = await supabase
      .from('competitions')
      .select(`
        *,
        associations(name)
      `)
      .order('name')

    if (error) {
      console.error(error)
      alert('Erro ao carregar competições: ' + error.message)
    } else {
      setCompetitions(data || [])
    }

    setLoading(false)
  }

  const filtered = competitions.filter(c => {
    const q = search.toLowerCase()

    return (
      c.name?.toLowerCase().includes(q) ||
      c.type?.toLowerCase().includes(q) ||
      c.associations?.name?.toLowerCase().includes(q)
    )
  })

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
          padding: 28
        }}
      >

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 20
          }}
        >

          <div>

            <h1
              style={{
                margin: 0,
                fontSize: '2.4rem',
                fontWeight: 800
              }}
            >
              🏆 Competições
            </h1>

            <p
              style={{
                marginTop: 8,
                color: '#64748b'
              }}
            >
              Campeonatos, taças e torneios.
            </p>

          </div>

          <Link
            href="/competicoes/nova"
            className="btn"
          >
            ➕ Nova Competição
          </Link>

        </div>

        <div
          style={{
            marginTop: 24
          }}
        >

          <input
            className="search"
            type="search"
            placeholder="Pesquisar competição..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

        </div>

      </div>
      {loading ? (

        <div
          className="card"
          style={{
            padding: 30,
            textAlign: 'center'
          }}
        >
          A carregar competições...
        </div>

      ) : filtered.length === 0 ? (

        <div
          className="card"
          style={{
            padding: 30,
            textAlign: 'center',
            color: '#64748b'
          }}
        >
          {search
            ? 'Nenhuma competição encontrada.'
            : 'Ainda não existem competições registadas.'}
        </div>

      ) : (

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill,minmax(300px,1fr))',
            gap: 18
          }}
        >

          {filtered.map(competition => (

            <Link
              key={competition.id}
              href={`/competicoes/${competition.id}`}
              style={{
                textDecoration: 'none'
              }}
            >

              <div
                className="card"
                style={{
                  padding: 24,
                  height: '100%'
                }}
              >

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16
                  }}
                >

                  <div
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: 14,
                      background: '#e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem'
                    }}
                  >
                    🏆
                  </div>

                  <div>

                    <h3
                      style={{
                        margin: 0,
                        color: '#0f172a'
                      }}
                    >
                      {competition.name}
                    </h3>

                    {competition.type && (

                      <div
                        style={{
                          marginTop: 6,
                          color: '#64748b'
                        }}
                      >
                        {competition.type}
                      </div>

                    )}

                  </div>

                </div>

                {competition.associations?.name && (

                  <div
                    style={{
                      marginTop: 18,
                      color: '#64748b'
                    }}
                  >
                    🏛️ {competition.associations.name}
                  </div>

                )}

                <div
                  style={{
                    marginTop: 20,
                    color: '#2563eb',
                    fontWeight: 600
                  }}
                >
                  Ver competição →
                </div>

              </div>

            </Link>

          ))}

        </div>

      )}
    </div>
  )
}
