import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { QrCode, Package, User, ArrowRight, Sparkles, Sunrise, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'

export default function Home() {
  const { user } = useAuth()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Chào buổi sáng'
    if (hour < 18) return 'Chào buổi chiều'
    return 'Chào buổi tối'
  }

  const getGreetingIcon = () => {
    const hour = new Date().getHours()
    if (hour < 12) return Sunrise
    if (hour < 18) return Sun
    return Moon
  }

  const cards = [
    {
      title: 'Quét mã',
      description: 'Quét mã QR để tìm kiếm và quản lý sản phẩm',
      icon: QrCode,
      link: '/scan',
      gradient: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      borderGradient: 'from-blue-500/20 to-cyan-500/20',
      hoverGlow: 'hover:shadow-blue-500/20',
    },
    {
      title: 'Sản phẩm',
      description: 'Xem và quản lý danh sách sản phẩm của bạn',
      icon: Package,
      link: '/products',
      gradient: 'from-emerald-500 to-teal-500',
      iconBg: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      borderGradient: 'from-emerald-500/20 to-teal-500/20',
      hoverGlow: 'hover:shadow-emerald-500/20',
    },
    {
      title: 'Hồ sơ',
      description: 'Quản lý thông tin tài khoản và cài đặt',
      icon: User,
      link: '/profile',
      gradient: 'from-violet-500 to-purple-500',
      iconBg: 'bg-gradient-to-br from-violet-500/20 to-purple-500/20',
      iconColor: 'text-violet-600 dark:text-violet-400',
      borderGradient: 'from-violet-500/20 to-purple-500/20',
      hoverGlow: 'hover:shadow-violet-500/20',
    },
  ]

  return (
    <div className="flex-1 bg-gradient-to-b from-background to-muted/20 px-4 py-6">
      <div className="mx-auto max-w-md page-enter">
        {/* Welcome section - Enhanced */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center gap-2">
            {(() => {
              const GreetingIcon = getGreetingIcon()
              return (
                <GreetingIcon className="h-5 w-5 text-primary" strokeWidth={2.5} />
              )
            })()}
            <p className="text-sm font-medium text-muted-foreground">
              {getGreeting()}
            </p>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {user?.ten_nguoi_dung?.split(' ')[0] || 'Người dùng'}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              {new Date().toLocaleDateString('vi-VN', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* 3 Cards chính - Enhanced design */}
        <div className="space-y-3.5">
          {cards.map((card, index) => {
            const Icon = card.icon
            return (
              <Link
                key={card.link}
                to={card.link}
                className="block touch-manipulation group"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <Card
                  className={cn(
                    'relative overflow-hidden transition-all duration-300',
                    'border-2 border-border/50',
                    'bg-card/50 backdrop-blur-sm',
                    'hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10',
                    'active:scale-[0.98] active:shadow-md',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                  )}
                >
                  <CardContent className="relative flex items-center gap-4 p-5">
                    <div
                      className={cn(
                        'rounded-2xl p-4 shrink-0 transition-all duration-300',
                        card.iconBg,
                        'group-hover:scale-110 group-hover:shadow-lg'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-6 w-6 transition-transform duration-300',
                          card.iconColor,
                          'group-hover:scale-110'
                        )}
                        strokeWidth={2.5}
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <h2 className="text-lg font-semibold tracking-tight leading-tight transition-colors group-hover:text-primary">
                        {card.title}
                      </h2>
                      <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                        {card.description}
                      </p>
                    </div>
                    <ArrowRight
                      className={cn(
                        'h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300',
                        'group-hover:text-primary group-hover:translate-x-1'
                      )}
                    />
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
