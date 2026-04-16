'use client'

import { useCallback, useRef, useEffect } from 'react'

type SFXType = 'success' | 'click' | 'xp' | 'level-up' | 'post'

const sfxUrls: Record<SFXType, string> = {
  success: '/sfx/success.mp3',
  click: '/sfx/click.mp3',
  xp: '/sfx/xp.mp3',
  'level-up': '/sfx/level-up.mp3',
  post: '/sfx/post.mp3',
}

export function useSFX() {
  const audioRefs = useRef<Partial<Record<SFXType, HTMLAudioElement>>>({})

  useEffect(() => {
    // Preload audios on client side
    Object.entries(sfxUrls).forEach(([key, url]) => {
      const audio = new Audio(url)
      audio.preload = 'auto'
      audioRefs.current[key as SFXType] = audio
    })
  }, [])

  const play = useCallback((type: SFXType, volume = 0.5) => {
    const audio = audioRefs.current[type]
    if (audio) {
      audio.currentTime = 0
      audio.volume = volume
      audio.play().catch(() => {
        // Autoplay might be blocked by browser until user interacts
      })
    }
  }, [])

  return { play }
}
