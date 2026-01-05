import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ProductCardSkeleton() {
  return (
    <Card className="min-h-[100px]"> {/* Chiều cao tối thiểu giống ProductCard */}
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* Image skeleton */}
          <Skeleton className="w-20 h-20 rounded-lg shrink-0" />
          
          {/* Content skeleton */}
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-1.5">
                <Skeleton className="h-5 w-12 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

