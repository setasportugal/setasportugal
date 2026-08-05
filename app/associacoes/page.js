'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function AssociacoesPage() {
  const [associations, setAssociations] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAssociations()
  }, [])


  async function loadAssociations() {
    setLoading(true)

    const { data, error } = await supabase
      .from('associations')
      .select('*')
      .order('name')


    if (error) {
      console.error(error)

      alert(
        'Erro ao carregar associações: ' +
        error.message
      )

    } else {

      setAssociations(data || [])

    }


    setLoading(false)
  }


  const filteredAssociations = associations.filter(
    association => {

      const query = search.toLowerCase()

      return (
        association.name
          ?.toLowerCase()
          .includes(query) ||
        association.short_name
          ?.toLowerCase()
          .includes(query) ||
        association.region
          ?.toLowerCase()
          .includes(query)
      )

    }
  )


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
              🏛️ Associações
            </h1>


            <p
              style={{
                marginTop: 8,
                color: '#64748b'
              }}
            >
              Entidades oficiais registadas na plataforma.
            </p>

          </div>


          <Link
            href="/associacoes/nova"
            className="btn"
          >
            ➕ Nova Associação
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
            placeholder="🔍 Pesquisar por nome, sigla ou região..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%'
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
          A carregar associações...
        </div>


      ) : filteredAssociations.length === 0 ? (

        <div
          className="card"
          style={{
            padding: 30,
            textAlign: 'center',
            color: '#64748b'
          }}
        >

          {search
            ? 'Nenhuma associação encontrada.'
            : 'Ainda não existem associações registadas.'}

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

          {filteredAssociations.map(association => (

            <Link
              key={association.id}
              href={`/associacoes/${association.id}`}
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
                    🏛️
                  </div>


                  <div>

                    <h3
                      style={{
                        margin: 0,
                        color: '#0f172a'
                      }}
                    >
                      {association.name}
                    </h3>


                    {association.short_name && (

                      <div
                        style={{
                          marginTop: 5,
                          color: '#64748b'
                        }}
                      >
                        {association.short_name}
                      </div>

                    )}

                  </div>

                </div>


                {association.region && (

                  <div
                    style={{
                      marginTop: 20,
                      color: '#64748b',
                      fontSize: '.9rem'
                    }}
                  >
                    📍 {association.region}
                  </div>

                )}


                <div
                  style={{
                    marginTop: 22,
                    color: '#2563eb',
                    fontWeight: 600
                  }}
                >
                  Ver associação →
                </div>


              </div>

            </Link>

          ))}

        </div>

      )}

    </div>
  )
}
