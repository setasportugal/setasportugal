import Link from 'next/link'

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

      <div className="grid-2">

        <Link href="/jogadores" className="card-ui">

          <h2>👤 Jogadores</h2>

          <p>
            Consulta, cria e gere todos os jogadores.
          </p>

        </Link>

        <Link href="/equipas" className="card-ui">

          <h2>🛡️ Equipas</h2>

          <p>
            Gere equipas, clubes, cafés e associações recreativas.
          </p>

        </Link>

        <Link href="/associacoes" className="card-ui">

          <h2>🏛️ Associações</h2>

          <p>
            Organizações responsáveis pelas competições oficiais.
          </p>

        </Link>

        <Link href="/competicoes" className="card-ui">

          <h2>🏆 Competições</h2>

          <p>
            Campeonatos, Taças, Opens e restantes provas.
          </p>

        </Link>

      </div>

      <div
        className="card-ui"
        style={{
          marginTop:24
        }}
      >

        <h2>Ações rápidas</h2>

        <div
          style={{
            display:'grid',
            gap:12,
            marginTop:18
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

          <Link href="/competicoes/nova">
            ➕ Nova Competição
          </Link>

        </div>

      </div>

    </div>
  )
}
