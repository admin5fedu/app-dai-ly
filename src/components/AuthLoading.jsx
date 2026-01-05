import { Skeleton } from '@/components/ui/skeleton'

export function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4 space-y-4">
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 rounded-full bg-primary/10 animate-pulse" />
        </div>
        <Skeleton className="h-4 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
      </div>
    </div>
  )
}

