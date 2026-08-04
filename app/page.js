import Link from 'next/link'
import StatCard from '@/components/ui/StatCard'

export default function Home() {
  return (
    <div>

      <div className="page-header">
        <div>
          <h1>🎯 Setas Portugal</h1>

          <p>
            Plataforma nacional para gestão, consulta e estatísticas das setas em Portugal.
          </p>
        </div>
      </div>

      <div className="grid-4">

        <StatCard
          icon="👤"
          title="Jogadores"
          value="0"
          subtitle="Registados"
          href="/jogadores"
        />

        <StatCard
          icon="🛡️"
          title="Equipas"
          value="0"
          subtitle="Registadas"
          href="/equipas"
        />

        <StatCard
          icon="🏛️"
          title="Associações"
          value="0"
          subtitle="Oficiais"
          href="/associacoes"
        />

        <StatCard
          icon="🤝"
          title="Ligações"
          value="0"
          subtitle="Jogador ⇄ Equipa"
        />

      </div>

      <div
        className="card-ui"
        style={{
          marginTop: 30
        }}
      >

        <h2>Ações rápidas</h2>

        <div
          style={{
            display: 'grid',
            gap: 12,
            marginTop: 20
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

      <div
        className="card-ui"
        style={{
          marginTop: 30
        }}
      >

        <h2>Estado da Base de Dados</h2>

        <p
          style={{
            marginTop: 15,
            color: 'var(--text-muted)'
          }}
        >
          Esta plataforma está atualmente preparada para gerir jogadores,
          equipas e associações. Nas próximas versões serão adicionadas
          competições, épocas, jornadas, jogos, estatísticas e rankings.
        </p>

      </div>

    </div>
  )
}
