import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function ErrorState({ 
  title = 'Đã xảy ra lỗi', 
  message = 'Không thể tải dữ liệu. Vui lòng thử lại.', 
  onRetry,
  className 
}) {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          {message}
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            Thử lại
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

