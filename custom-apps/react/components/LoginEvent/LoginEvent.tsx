import React, { useEffect } from 'react'
import { useRenderSession } from 'vtex.session-client'

declare global {
  interface Window {
    Insider?: {
      track: (eventName: string, data: any[]) => void
    }
  }
}

export function LoginEvent() {
  const { session } = useRenderSession()
  const userEmail: string = session?.namespaces?.profile?.email?.value
  const hasSentEvent = window?.localStorage?.getItem('insiderLoginEvent')
  const isAuthenticated = session?.namespaces?.profile?.isAuthenticated?.value

  useEffect(() => {
    const isoDate = new Date().toISOString().split('.')[0] + 'Z'

    if (!userEmail || hasSentEvent) return

    window?.Insider?.track('events', [
      {
        event_name: 'login',
        timestamp: isoDate,
      },
    ])

    window?.localStorage?.setItem('insiderLoginEvent', 'true')
  }, [userEmail])

  useEffect(() => {
    if (isAuthenticated === 'false') {
      window?.localStorage?.removeItem('insiderLoginEvent')
    }
  }, [isAuthenticated])

  return <></>
}
