'use client'

import Link from 'next/link'

const items = [
  { href: '/', icon: '🏠', label: 'Dashboard' },
  { href: '/jogadores', icon: '👤', label: 'Jogadores' },
  { href: '/equipas', icon: '🛡️', label: 'Equipas' },
  { href: '/associacoes', icon: '🏛️', label: 'Associações' },
  { href: '/competicoes', icon: '🏆', label: 'Competições' },
  { href: '/epocas', icon: '📅', label: 'Épocas' },
  { href: '/jogos', icon: '🎯', label: 'Jogos' },
  { href: '/rankings', icon: '📊', label: 'Rankings' },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div style={{ padding: 24, borderBottom: '1px solid var(--border)' }}>
        <h2>🎯 Setas Portugal</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: 6 }}>
          Base de dados nacional
        </p>
      </div>

      <nav style={{ padding: 16 }}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              gap: 12,
              padding: '12px',
              borderRadius: 10,
              marginBottom: 4,
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
