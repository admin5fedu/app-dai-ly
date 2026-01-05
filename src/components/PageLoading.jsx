import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function PageLoading({ className, skeletonCount = 3 }) {
  return (
    <div className={cn("space-y-4", className)}>
      {[...Array(skeletonCount)].map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-lg" />
      ))}
    </div>
  )
}

