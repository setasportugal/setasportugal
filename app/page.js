'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import StatCard from '../components/ui/StatCard'
import LatestPlayers from '../components/dashboard/LatestPlayers'

import { getDashboardStats } from '../lib/db/dashboard'
import { getLatestPlayers } from '../lib/db/players'

const emptyStats = {
  players: 0,
  teams: 0,
  associations: 0,
  teamPlayers: 0,
}

export default function Home() {
  const [stats, setStats] = useState(emptyStats)
  const [latestPlayers, setLatestPlayers] = useState([])

  useEffect(() => {
    async function loadDashboard() {
      const [dashboardStats, players] = await Promise.all([
        getDashboardStats(),
        getLatestPlayers(),
      ])

      setStats(dashboardStats)
      setLatestPlayers(players)
    }

    loadDashboard()
  }, [])

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>ðŸŽ¯ Setas Portugal</h1>

          <p>
            Plataforma nacional para gestÃ£o, consulta e estatÃ­sticas das setas
            em Portugal.
          </p>
        </div>
      </div>

      <div className="grid-4">
        <StatCard
          icon="ðŸ‘¤"
          title="Jogadores"
          value={stats.players}
          subtitle="Registados"
          href="/jogadores"
        />

        <StatCard
          icon="ðŸ›¡ï¸"
          title="Equipas"
          value={stats.teams}
          subtitle="Registadas"
          href="/equipas"
        />

        <StatCard
          icon="ðŸ›ï¸"
          title="AssociaÃ§Ãµes"
          value={stats.associations}
          subtitle="Oficiais"
          href="/associacoes"
        />

        <StatCard
          icon="ðŸ¤"
          title="LigaÃ§Ãµes"
          value={stats.teamPlayers}
          subtitle="Jogador â‡„ Equipa"
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 24,
          marginTop: 30,
        }}
      >
        <LatestPlayers players={latestPlayers} />

        <div className="card-ui">
          <h2>AÃ§Ãµes rÃ¡pidas</h2>

          <div
            style={{
              display: 'grid',
              gap: 12,
              marginTop: 20,
            }}
          >
            <Link href="/jogadores/novo">
              âž• Novo Jogador
            </Link>

            <Link href="/equipas/nova">
              âž• Nova Equipa
            </Link>

            <Link href="/associacoes/nova">
              âž• Nova AssociaÃ§Ã£o
            </Link>
          </div>
        </div>
      </div>

      <div
        className="card-ui"
        style={{
          marginTop: 30,
        }}
      >
        <h2>Em desenvolvimento</h2>

        <div
          style={{
            display: 'grid',
            gap: 10,
            marginTop: 20,
          }}
        >
          <div>ðŸ† CompetiÃ§Ãµes</div>
          <div>ðŸ“… Ã‰pocas</div>
          <div>ðŸŽ¯ Jogos</div>
          <div>ðŸ¤ TransferÃªncias</div>
          <div>ðŸ“ˆ Rankings</div>
          <div>ðŸ“Š EstatÃ­sticas</div>
        </div>
      </div>
    </div>
  )
}

