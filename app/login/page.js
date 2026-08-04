'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function login(e) {
    e.preventDefault()

    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div
      style={{
        maxWidth: 420,
        margin: '60px auto',
        background: '#fff',
        padding: 24,
        borderRadius: 12,
      }}
    >
      <h2>Entrar</h2>

      <form onSubmit={login}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          style={{width:'100%',padding:10,marginTop:16}}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          style={{width:'100%',padding:10,marginTop:12}}
        />

        {error && (
          <p style={{color:'red',marginTop:12}}>
            {error}
          </p>
        )}

        <button
          className="btn"
          style={{marginTop:16,width:'100%'}}
          disabled={loading}
        >
          {loading ? 'A entrar...' : 'Entrar'}
        </button>

      </form>
    </div>
  )
                 }
