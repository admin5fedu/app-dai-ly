import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { WifiOff, Wifi } from 'lucide-react'

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      if (wasOffline) {
        toast.success('Đã kết nối lại internet', {
          duration: 3000,
        })
        setWasOffline(false)
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
      setWasOffline(true)
      toast.error('Mất kết nối internet. Một số tính năng có thể không hoạt động.', {
        duration: 5000,
      })
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [wasOffline])

  if (isOnline) return null

  return (
    <div className="fixed top-16 left-0 right-0 z-50 bg-destructive/90 text-destructive-foreground px-4 py-2 text-center text-sm">
      <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
        <WifiOff className="h-4 w-4" />
        <span>Không có kết nối internet</span>
      </div>
    </div>
  )
}

