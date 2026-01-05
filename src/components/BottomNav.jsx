import { NavLink } from 'react-router-dom'
import { Home, QrCode, User, Package, BarChart3 } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

const navItems = [
  {
    to: '/',
    icon: Home,
    label: 'Trang chủ',
  },
  {
    to: '/products',
    icon: Package,
    label: 'Sản phẩm',
  },
]

const centerItem = {
  to: '/scan',
  icon: QrCode,
  label: 'Quét mã',
}

const rightItems = [
  {
    to: '/reports',
    icon: BarChart3,
    label: 'Báo cáo',
  },
  {
    to: '/profile',
    icon: User,
    label: 'Tài khoản',
  },
]

export default function BottomNav() {
  return (
    <nav className="w-full border-t border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 safe-area-inset-bottom">
      {/* Top shadow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      
      <div className="mx-auto flex h-20 max-w-md items-center justify-around px-2 pb-safe">
        {/* Left items */}
        <div className="flex flex-1 items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 transition-all duration-200 touch-manipulation',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground active:text-foreground active:bg-accent/40'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={cn(
                      'relative transition-transform duration-200',
                      isActive && 'scale-110'
                    )}>
                      <Icon className="h-5 w-5" />
                      {isActive && (
                        <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary animate-pulse" />
                      )}
                    </div>
                    <span className="text-[10px] font-semibold leading-tight">
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            )
          })}
        </div>

        {/* Center button - Scan */}
        <div className="flex items-center justify-center px-1">
          <NavLink
            to={centerItem.to}
            className="touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full"
          >
            {({ isActive }) => {
              const Icon = centerItem.icon
              return (
                <Button
                  variant="default"
                  size="icon"
                  className={cn(
                    'h-14 w-14 rounded-full shadow-xl shadow-primary/30 transition-all duration-200',
                    'hover:shadow-2xl hover:shadow-primary/40 hover:scale-105',
                    'active:scale-95 active:shadow-lg',
                    isActive && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                  )}
                >
                  <Icon className="h-6 w-6" />
                  <span className="sr-only">{centerItem.label}</span>
                </Button>
              )
            }}
          </NavLink>
        </div>

        {/* Right items */}
        <div className="flex flex-1 items-center justify-around">
          {rightItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 transition-all duration-200 touch-manipulation',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground active:text-foreground active:bg-accent/40'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={cn(
                      'relative transition-transform duration-200',
                      isActive && 'scale-110'
                    )}>
                      <Icon className="h-5 w-5" />
                      {isActive && (
                        <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary animate-pulse" />
                      )}
                    </div>
                    <span className="text-[10px] font-semibold leading-tight">
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
