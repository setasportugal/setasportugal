'use client'

import Link from 'next/link'

export default function JogosPage() {
  return (
    <div className="card" style={{ maxWidth: 900, margin: '30px auto', padding: 30 }}>
      <h1>🎯 Jogos</h1>

      <p style={{ color: '#64748b', marginBottom: 30 }}>
        Escolha uma jornada para consultar os jogos.
      </p>

      <Link href="/competicoes" className="btn">
        ← Competições
      </Link>
    </div>
  )
}
