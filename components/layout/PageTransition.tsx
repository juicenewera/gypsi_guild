'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const firstRender = useRef(true)
  const [stage, setStage] = useState<'in' | 'out'>('in')
  const [renderedKey, setRenderedKey] = useState(pathname)
  const [renderedChildren, setRenderedChildren] = useState(children)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    setStage('out')
    const t = setTimeout(() => {
      setRenderedKey(pathname)
      setRenderedChildren(children)
      setStage('in')
    }, 180)
    return () => clearTimeout(t)
  }, [pathname, children])

  return (
    <div
      key={renderedKey}
      className="transition-all duration-300 ease-out"
      style={{
        opacity:   stage === 'in' ? 1 : 0,
        transform: stage === 'in' ? 'translateY(0)' : 'translateY(6px)',
      }}
    >
      {renderedChildren}
    </div>
  )
}
