import { Button } from '@/components/ui/button'
import { Package, Search, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function EmptyState({ 
  icon: Icon = Package,
  title = 'Không có dữ liệu',
  description = 'Chưa có dữ liệu để hiển thị',
  actionLabel,
  onAction,
  className 
}) {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          {description}
        </p>
        {actionLabel && onAction && (
          <Button onClick={onAction} variant="default">
            {actionLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

