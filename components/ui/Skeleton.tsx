import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  lines?: number
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('skeleton', className)} />
}

export function PostCardSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-24 rounded-sm" />
          <Skeleton className="h-2 w-16 rounded-sm" />
        </div>
      </div>
      <Skeleton className="h-4 w-3/4 rounded-sm" />
      <Skeleton className="h-3 w-full rounded-sm" />
      <Skeleton className="h-3 w-5/6 rounded-sm" />
      <div className="flex gap-4 pt-2">
        <Skeleton className="h-3 w-12 rounded-sm" />
        <Skeleton className="h-3 w-12 rounded-sm" />
        <Skeleton className="h-3 w-16 rounded-sm" />
      </div>
    </div>
  )
}

export function FeedSkeleton() {
  return (
    <div className="space-y-4 stagger-children">
      {Array.from({ length: 4 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function RankingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="card p-4 animate-pulse flex items-center gap-4">
          <Skeleton className="w-10 h-8 rounded-sm shrink-0" />
          <Skeleton className="w-10 h-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32 rounded-sm" />
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
          <Skeleton className="w-12 h-8 rounded-sm shrink-0" />
        </div>
      ))}
    </div>
  )
}
