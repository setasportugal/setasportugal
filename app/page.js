import Link from 'next/link'
import StatCard from '../components/ui/StatCard'
import { getDashboardStats } from '../lib/db/dashboard'
import { getLatestPlayers } from '../lib/db/players'

export default async function Home() {
  const stats = await getDashboardStats()

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>🎯 Setas Portugal</h1>

          <p>
            Plataforma nacional para gestão, consulta e estatísticas das setas
            em Portugal.
          </p>
        </div>
      </div>

      <div className="grid-4">
        <StatCard
          icon="👤"
          title="Jogadores"
          value={stats.players}
          subtitle="Registados"
          href="/jogadores"
        />

        <StatCard
          icon="🛡️"
          title="Equipas"
          value={stats.teams}
          subtitle="Registadas"
          href="/equipas"
        />

        <StatCard
          icon="🏛️"
          title="Associações"
          value={stats.associations}
          subtitle="Oficiais"
          href="/associacoes"
        />

        <StatCard
          icon="🤝"
          title="Ligações"
          value={stats.teamPlayers}
          subtitle="Jogador ⇄ Equipa"
        />
      </div>

      <div
        className="card-ui"
        style={{
          marginTop: 30,
        }}
      >
        <h2>Ações rápidas</h2>

        <div
          style={{
            display: 'grid',
            gap: 12,
            marginTop: 20,
          }}
        >
          <Link href="/jogadores/novo">
            ➕ Novo Jogador
          </Link>

          <Link href="/equipas/nova">
            ➕ Nova Equipa
          </Link>

          <Link href="/associacoes/nova">
            ➕ Nova Associação
          </Link>
        </div>
      </div>
    </div>
  )
}
