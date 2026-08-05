'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function EquipasPage() {
  const [teams, setTeams] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTeams()
  }, [])

  async function loadTeams() {
    setLoading(true)

    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name')

    if (error) {
      console.error(error)
      alert(
        'Erro ao carregar equipas: ' +
        error.message
      )
    } else {
      setTeams(data || [])
    }

    setLoading(false)
  }


  const filteredTeams = teams.filter(team => {
    const query = search.toLowerCase()

    return (
      team.name
        ?.toLowerCase()
        .includes(query) ||
      team.region
        ?.toLowerCase()
        .includes(query) ||
      team.location
        ?.toLowerCase()
        .includes(query)
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
            gap: 20,
            flexWrap: 'wrap'
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
              🛡️ Equipas
            </h1>

            <p
              style={{
                marginTop: 8,
                color: '#64748b'
              }}
            >
              Base de dados das equipas registadas.
            </p>

          </div>


          <Link
            href="/equipas/nova"
            className="btn"
          >
            ➕ Nova Equipa
          </Link>

        </div>


        <div
          style={{
            marginTop: 28
          }}
        >

          <input
            className="search"
            type="search"
            placeholder="🔍 Pesquisar por nome, região ou local..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              fontSize: '1rem'
            }}
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
          A carregar equipas...
        </div>


      ) : filteredTeams.length === 0 ? (

        <div
          className="card"
          style={{
            padding: 30,
            textAlign: 'center',
            color: '#64748b'
          }}
        >

          {search
            ? 'Nenhuma equipa encontrada.'
            : 'Ainda não existem equipas registadas.'}

        </div>


      ) : (

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill,minmax(280px,1fr))',
            gap: 18
          }}
        >

          {filteredTeams.map(team => (

            <Link
              key={team.id}
              href={`/equipas/${team.id}`}
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
                    🛡️
                  </div>


                  <div>

                    <h3
                      style={{
                        margin: 0,
                        color: '#0f172a'
                      }}
                    >
                      {team.name}
                    </h3>


                    {team.region && (

                      <div
                        style={{
                          marginTop: 5,
                          color: '#64748b'
                        }}
                      >
                        🏛️ {team.region}
                      </div>

                    )}

                  </div>

                </div>


                {team.location && (

                  <div
                    style={{
                      marginTop: 20,
                      color: '#64748b',
                      fontSize: '.9rem'
                    }}
                  >
                    📍 {team.location}
                  </div>

                )}


                <div
                  style={{
                    marginTop: 22,
                    color: '#2563eb',
                    fontWeight: 600
                  }}
                >
                  Ver equipa →
                </div>


              </div>

            </Link>

          ))}

        </div>

      )}

    </div>
      <div
        style={{
          marginTop: 0
        }}
      >

        <Link
          href="/"
          className="btn btn-secondary"
        >
          ← Voltar ao início
        </Link>

      </div>

    </div>
  )
}
