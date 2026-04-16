import { cn } from '@/lib/utils'

interface SectionLightProps {
  children: React.ReactNode
  id?: string
  className?: string
}

export default function SectionLight({ children, id, className }: SectionLightProps) {
  return (
    <section
      id={id}
      className={cn('section-light bg-white text-gipsy-dark py-24 px-6', className)}
    >
      {children}
    </section>
  )
}
