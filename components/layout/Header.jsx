'use client'

export default function Header() {
  return (
    <header className="header">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          maxWidth: 500,
        }}
      >
        <input
          type="search"
          placeholder="Pesquisar jogadores, equipas, competições..."
          style={{
            width: '100%',
            padding: '10px 14px',
            border: '1px solid var(--border)',
            borderRadius: 10,
            outline: 'none',
            background: 'var(--surface)',
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div style={{ fontSize: 22 }}>🔔</div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div style={{ fontSize: 30 }}>👤</div>

          <div>
            <strong>Administrador</strong>

            <div
              style={{
                fontSize: 12,
                color: 'var(--text-muted)',
              }}
            >
              Setas Portugal
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
