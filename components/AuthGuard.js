'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function AuthGuard({ children }) {
  const router = useRouter()
  const pathname = usePathname()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getSession()

      if (!data.session && pathname !== '/login') {
        router.replace('/login')
        return
      }

      if (data.session && pathname === '/login') {
        router.replace('/')
        return
      }

      setLoading(false)
    }

    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkUser()
    })

    return () => subscription.unsubscribe()
  }, [pathname, router])

  if (loading) {
    return <p style={{ padding: 20 }}>A carregar...</p>
  }

  return children
}
