'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function JogadoresPage() {
  const [players, setPlayers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPlayers()
  }, [])

  async function loadPlayers() {
    setLoading(true)

    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('name')

    if (error) {
      console.error(error)
      alert(
        'Erro ao carregar jogadores: ' +
        error.message
      )
    } else {
      setPlayers(data || [])
    }

    setLoading(false)
  }


  const filteredPlayers = players.filter(player => {
    const query = search.toLowerCase()

    return (
      player.name
        ?.toLowerCase()
        .includes(query) ||
      player.nickname
        ?.toLowerCase()
        .includes(query) ||
      player.city
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
              👤 Jogadores
            </h1>

            <p
              style={{
                marginTop: 8,
                color: '#64748b'
              }}
            >
              Base de dados dos jogadores registados.
            </p>

          </div>


          <Link
            href="/jogadores/novo"
            className="btn"
          >
            ➕ Novo Jogador
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
            placeholder="🔍 Pesquisar por nome, nickname ou cidade..."
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
          A carregar jogadores...
        </div>


      ) : filteredPlayers.length === 0 ? (

        <div
          className="card"
          style={{
            padding: 30,
            textAlign: 'center',
            color: '#64748b'
          }}
        >

          {search
            ? 'Nenhum jogador encontrado.'
            : 'Ainda não existem jogadores registados.'}

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

          {filteredPlayers.map(player => (

  <Link
    key={player.id}
    href={`/jogadores/${player.id}`}
    style={{
      textDecoration: 'none'
    }}
  >

    <div
      className="card"
      style={{
        padding: 22,
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
            width: 54,
            height: 54,
            borderRadius: '50%',
            background: '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}
        >
          👤
        </div>

        <div>

          <h3
            style={{
              margin: 0,
              color: '#0f172a'
            }}
          >
            {player.name}
          </h3>

          {player.nickname && (
            <div
              style={{
                marginTop: 4,
                color: '#64748b'
              }}
            >
              🏷️ {player.nickname}
            </div>
          )}

        </div>

      </div>


      {player.city && (
        <div
          style={{
            marginTop: 20,
            color: '#64748b'
          }}
        >
          📍 {player.city}
        </div>
      )}


      <div
        style={{
          marginTop: 20,
          color: '#2563eb',
          fontWeight: 600
        }}
      >
        Ver perfil →
      </div>


    </div>

            </Link>

        ))}

      </div>

    )}

  </div>

)
}
