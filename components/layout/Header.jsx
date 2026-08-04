'use client'

import { Search, Bell, UserCircle } from 'lucide-react'

export default function Header() {
  return (
    <header className="header">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flex: 1,
          maxWidth: 500,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '10px 14px',
          }}
        >
          <Search size={18} />
          <input
            type="text"
            placeholder="Pesquisar jogadores, equipas, competições..."
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              background: 'transparent',
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <Bell size={20} />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <UserCircle size={34} />
          <div>
            <strong>Administrador</strong>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Setas Portugal
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
