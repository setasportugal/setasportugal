'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function AssociacaoDetalhePage() {
  const { id } = useParams()
  const router = useRouter()

  const [association, setAssociation] = useState(null)
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadData()
    }
  }, [id])


  async function loadData() {
    setLoading(true)

    const { data: associationData } = await supabase
      .from('associations')
      .select('*')
      .eq('id', id)
      .single()


    const { data: teamsData } = await supabase
      .from('teams')
      .select('*')
      .eq('association_id', id)
      .order('name')


    setAssociation(associationData)
    setTeams(teamsData || [])

    setLoading(false)
  }


  async function deleteAssociation() {

    if (!confirm('Apagar esta associação permanentemente?')) {
      return
    }


    const { error } = await supabase
      .from('associations')
      .delete()
      .eq('id', id)


    if (error) {
      alert('Erro: ' + error.message)
      return
    }


    router.push('/associacoes')
  }


  if (loading) {
    return (
      <p className="empty">
        A carregar associação...
      </p>
    )
  }


  if (!association) {
    return (
      <p className="empty">
        Associação não encontrada.
      </p>
    )
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
              🏛️ {association.name}
            </h1>


            {association.short_name && (

              <p
                style={{
                  marginTop: 10,
                  color: '#64748b',
                  fontSize: '1.1rem'
                }}
              >
                {association.short_name}
              </p>

            )}


            {association.region && (

              <p
                style={{
                  marginTop: 8,
                  color: '#475569'
                }}
              >
                📍 {association.region}
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
              href={`/associacoes/${id}/editar`}
              className="btn"
            >
              ✏️ Editar
            </Link>


            <button
              onClick={deleteAssociation}
              className="btn btn-danger"
            >
              🗑️ Apagar
            </button>


          </div>

        </div>


        {association.notes && (

          <div
            style={{
              marginTop: 24,
              padding: 16,
              background: '#f8fafc',
              borderRadius: 12,
              color: '#475569',
              whiteSpace: 'pre-wrap'
            }}
          >
            {association.notes}
          </div>

        )}

      </div>


      <div
        className="card"
        style={{
          padding: 28
        }}
      >

        <h2>
          🛡️ Equipas associadas
        </h2>


        {teams.length === 0 ? (

          <p
            style={{
              marginTop: 20,
              color: '#94a3b8'
            }}
          >
            Ainda não existem equipas associadas.
          </p>

        ) : (

          <div
            style={{
              display: 'grid',
              gap: 14,
              marginTop: 24
            }}
          >

            {teams.map(team => (

              <Link
                key={team.id}
                href={`/equipas/${team.id}`}
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
                    🛡️ {team.name}
                  </strong>


                  {team.location && (

                    <div
                      style={{
                        marginTop: 8,
                        color: '#64748b'
                      }}
                    >
                      📍 {team.location}
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

        <h2>
          📊 Informação
        </h2>


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

            <strong>
              Equipas
            </strong>

            <div
              style={{
                marginTop: 8,
                fontSize: '1.8rem',
                fontWeight: 800
              }}
            >
              {teams.length}
            </div>

          </div>


          <div
            style={{
              padding: 18,
              background: '#f8fafc',
              borderRadius: 14
            }}
          >

            <strong>
              Estado
            </strong>

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
          href="/associacoes"
          className="btn btn-secondary"
        >
          ← Voltar às associações
        </Link>

      </div>


    </div>
  )
}
