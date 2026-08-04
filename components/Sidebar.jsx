'use client'

import Link from 'next/link'
import {
  Home,
  Users,
  Shield,
  Trophy,
  CalendarDays,
  Swords,
  BarChart3,
  Settings,
} from 'lucide-react'

const items = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/jogadores', label: 'Jogadores', icon: Users },
  { href: '/equipas', label: 'Equipas', icon: Shield },
  { href: '/associacoes', label: 'Associações', icon: Trophy },
  { href: '/competicoes', label: 'Competições', icon: Trophy },
  { href: '/epocas', label: 'Épocas', icon: CalendarDays },
  { href: '/jogos', label: 'Jogos', icon: Swords },
  { href: '/rankings', label: 'Rankings', icon: BarChart3 },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div style={{padding:24,borderBottom:'1px solid var(--border)'}}>
        <h2 style={{fontSize:'1.4rem'}}>🎯 Setas Portugal</h2>
        <p style={{marginTop:6,color:'var(--text-muted)',fontSize:14}}>
          Base de dados nacional
        </p>
      </div>

      <nav style={{padding:16}}>
        {items.map(({href,label,icon:Icon})=>(
          <Link
            key={href}
            href={href}
            style={{
              display:'flex',
              alignItems:'center',
              gap:12,
              padding:'12px 14px',
              borderRadius:10,
              marginBottom:6
            }}
          >
            <Icon size={18}/>
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div style={{marginTop:'auto',padding:16}}>
        <Link
          href="/definicoes"
          style={{
            display:'flex',
            alignItems:'center',
            gap:12,
            padding:'12px 14px',
            borderRadius:10
          }}
        >
          <Settings size={18}/>
          <span>Definições</span>
        </Link>
      </div>
    </aside>
  )
}
