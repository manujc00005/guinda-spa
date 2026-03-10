'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export function useAdminAuth() {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    async function check() {
      try {
        const res = await fetch('/api/auth/check')
        if (!cancelled) {
          if (res.ok) {
            setStatus('authenticated')
          } else {
            setStatus('unauthenticated')
            router.push('/admin/login')
          }
        }
      } catch {
        if (!cancelled) {
          setStatus('unauthenticated')
          router.push('/admin/login')
        }
      }
    }

    check()
    return () => { cancelled = true }
  }, [router])

  return status
}
