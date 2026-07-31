export default function Home() {
  return (
    <div>
      <div className="card" style={{ marginTop: 16 }}>
        <h2>Base de dados pessoal de Setas</h2>
        <p style={{ marginTop: 8, color: '#475569' }}>
          Começa por criar jogadores e equipas. Depois associa-os entre si.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
        <a href="/jogadores" className="card" style={{ display: 'block' }}>
          <h3>👤 Jogadores</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 4 }}>
            Ver, adicionar e editar jogadores
          </p>
        </a>

        <a href="/equipas" className="card" style={{ display: 'block' }}>
          <h3>🛡️ Equipas</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 4 }}>
            Ver, adicionar e editar equipas
          </p>
        </a>

        <a href="/jogadores/novo" className="btn btn-block">
          + Novo Jogador
        </a>

        <a href="/equipas/nova" className="btn btn-secondary btn-block">
          + Nova Equipa
        </a>
      </div>
    </div>
  )
}
