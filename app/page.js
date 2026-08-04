import Link from 'next/link'
import StatCard from '../components/ui/StatCard'
import { getDashboardStats } from '../lib/db/dashboard'
import { getLatestPlayers } from '../lib/db/players'

export default async function Home() {
  const stats = await getDashboardStats()
  const latestPlayers = await getLatestPlayers()

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
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 24,
          marginTop: 30,
        }}
      >
        {/* Últimos jogadores */}

        <div className="card-ui">
          <h2>Últimos jogadores</h2>

          {latestPlayers.length === 0 ? (
            <p
              style={{
                marginTop: 20,
                color: 'var(--text-muted)',
              }}
            >
              Ainda não existem jogadores registados.
            </p>
          ) : (
            <div
              style={{
                display: 'grid',
                gap: 12,
                marginTop: 20,
              }}
            >
              {latestPlayers.map((player) => (
                <Link
                  key={player.id}
                  href={`/jogadores/${player.id}`}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    padding: 14,
                  }}
                >
                  <strong>{player.name}</strong>

                  {player.nickname && (
                    <div
                      style={{
                        color: 'var(--text-muted)',
                        fontSize: 14,
                        marginTop: 4,
                      }}
                    >
                      {player.nickname}
                    </div>
                  )}

                  {player.city && (
                    <div
                      style={{
                        color: 'var(--text-muted)',
                        fontSize: 13,
                        marginTop: 2,
                      }}
                    >
                      📍 {player.city}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Ações rápidas */}

        <div className="card-ui">
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
          <div>🏆 Competições</div>
          <div>📅 Épocas</div>
          <div>🎯 Jogos</div>
          <div>🤝 Transferências</div>
          <div>📈 Rankings</div>
          <div>📊 Estatísticas</div>
        </div>
      </div>
    </div>
  )
}
