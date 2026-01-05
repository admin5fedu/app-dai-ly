import { Skeleton } from './ui/skeleton'
import { Card, CardContent, CardHeader } from './ui/card'

export function LoadingFallback() {
  return (
    <div className="min-h-screen px-4 py-6 pb-20 safe-area-inset-bottom">
      <div className="mx-auto max-w-md space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-3/4" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

