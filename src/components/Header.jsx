import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from '@/lib/theme-context'
import { User, Lock, LogOut, Moon, Sun, Monitor, Package } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Header() {
  const { user, logout } = useAuth()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const navigate = useNavigate()
  const [logoError, setLogoError] = useState(false)

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const handleProfile = () => {
    navigate('/profile')
  }

  const handleChangePassword = () => {
    navigate('/change-password')
  }

  return (
    <div className="container mx-auto flex h-16 max-w-md items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 overflow-hidden shrink-0">
            {!logoError ? (
              <img 
                src="https://yt3.googleusercontent.com/MIjDJsljA04Do87rWVObKwHhqPNHaI30O0H5aILtFT-aJOJtByRSsKoJQdxFzogiz2c8YfDhig=s160-c-k-c0x00ffffff-no-rj" 
                alt="Duraval" 
                className="w-full h-full object-cover"
                onError={() => setLogoError(true)}
              />
            ) : (
              <Package className="h-5 w-5 text-primary" />
            )}
          </div>
          <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Duraval
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg p-2 hover:bg-accent transition-colors">
                {resolvedTheme === 'dark' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle theme</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Sáng</span>
                {theme === 'light' && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Tối</span>
                {theme === 'dark' && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Monitor className="mr-2 h-4 w-4" />
                <span>Theo hệ thống</span>
                {theme === 'system' && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full transition-transform active:scale-95">
                <Avatar className="h-10 w-10 ring-2 ring-border/50 ring-offset-2 ring-offset-background transition-all hover:ring-primary/50">
                  <AvatarImage src={null} alt={user?.ten_nguoi_dung || ''} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm font-bold shadow-sm">
                    {user?.ten_nguoi_dung ? getInitials(user.ten_nguoi_dung) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none">
                    {user?.ten_nguoi_dung || 'Người dùng'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground font-normal">
                    {user?.ten_dang_nhap || ''}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleProfile}
                className="cursor-pointer touch-manipulation focus:bg-accent"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Xem hồ sơ</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleChangePassword}
                className="cursor-pointer touch-manipulation focus:bg-accent"
              >
                <Lock className="mr-2 h-4 w-4" />
                <span>Đổi mật khẩu</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer touch-manipulation text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
  )
}
