'use client'

import { useEffect, useState } from 'react'

const SESSION_KEY = 'guild_splash_seen'
const VISIBLE_MS  = 2400
const FADE_MS     = 600

export function SplashScreen() {
  const [show, setShow]       = useState(false)
  const [fading, setFading]   = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem(SESSION_KEY)) return

    setShow(true)
    sessionStorage.setItem(SESSION_KEY, '1')

    const fadeTimer = setTimeout(() => setFading(true), VISIBLE_MS)
    const hideTimer = setTimeout(() => setShow(false), VISIBLE_MS + FADE_MS)
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer) }
  }, [])

  if (!show) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-primary transition-opacity duration-[600ms]"
      style={{ opacity: fading ? 0 : 1, pointerEvents: fading ? 'none' : 'auto' }}
      aria-hidden={fading}
    >
      <div className="text-center animate-fade-in">
        <h1 className="font-[family-name:var(--font-heading)] text-5xl text-text-primary mb-5 tracking-tight">
          Guild
        </h1>
        <div className="flex items-center gap-2 justify-center">
          <span className="w-2.5 h-2.5 rounded-full bg-mago-500 animate-pulse" />
          <span
            className="w-2.5 h-2.5 rounded-full bg-guerr-500 animate-pulse"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full bg-xp-500 animate-pulse"
            style={{ animationDelay: '300ms' }}
          />
        </div>
        <p className="text-xs uppercase tracking-[0.25em] text-text-muted mt-4">
          Preparando sua jornada
        </p>
      </div>
    </div>
  )
}
