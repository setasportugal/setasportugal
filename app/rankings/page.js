'use client'

import Link from 'next/link'

export default function RankingsPage() {
  return (
    <div className="card" style={{ maxWidth: 900, margin: '30px auto', padding: 30 }}>
      <h1>🏅 Rankings</h1>

      <p style={{ color: '#64748b', marginBottom: 30 }}>
        Os rankings serão apresentados brevemente.
      </p>

      <Link href="/competicoes" className="btn">
        ← Competições
      </Link>
    </div>
  )
}
