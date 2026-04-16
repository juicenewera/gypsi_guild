import { cn } from '@/lib/utils'

interface SectionDarkProps {
  children: React.ReactNode
  id?: string
  className?: string
}

export default function SectionDark({ children, id, className }: SectionDarkProps) {
  return (
    <section
      id={id}
      className={cn('section-dark bg-gipsy-dark text-white py-24 px-6', className)}
    >
      {children}
    </section>
  )
}
