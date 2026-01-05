import { Skeleton } from '@/components/ui/skeleton'

export function ProductDetailSkeleton() {
  return (
    <div className="space-y-4">
      {/* Title skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      
      {/* Image skeleton */}
      <Skeleton className="w-full aspect-square rounded-lg" />
      
      {/* Info skeletons */}
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
      
      {/* Price skeleton */}
      <div className="pt-2">
        <Skeleton className="h-6 w-32" />
      </div>
    </div>
  )
}

