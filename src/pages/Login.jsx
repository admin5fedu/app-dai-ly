import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { Loader2, Eye, EyeOff, LogIn, Store } from 'lucide-react'
import { toast } from 'sonner'

const loginSchema = z.object({
  ten_dang_nhap: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
  mat_khau: z.string().min(1, 'Vui lòng nhập mật khẩu'),
})

export default function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const success = await login(data.ten_dang_nhap.trim(), data.mat_khau)
      if (success) {
        toast.success('Đăng nhập thành công!')
        navigate('/', { replace: true })
      } else {
        toast.error('Tên đăng nhập hoặc mật khẩu không đúng')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Đã xảy ra lỗi. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-md">
        {/* Logo/Brand section */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
            <Store className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Duraval</h1>
            <p className="text-sm text-muted-foreground mt-1">Hệ thống quản lý đại lý</p>
          </div>
        </div>

        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-2 text-center pb-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
              <LogIn className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Đăng nhập</CardTitle>
            <CardDescription className="text-base">
              Nhập thông tin đăng nhập để tiếp tục
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="ten_dang_nhap" className="text-sm font-medium">
                  Tên đăng nhập
                </Label>
                <Input
                  id="ten_dang_nhap"
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  {...register('ten_dang_nhap')}
                  disabled={isLoading}
                  autoComplete="username"
                  className="touch-manipulation h-11 text-base"
                />
                {errors.ten_dang_nhap && (
                  <p className="text-sm text-destructive">{errors.ten_dang_nhap.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mat_khau" className="text-sm font-medium">
                  Mật khẩu
                </Label>
                <div className="relative">
                  <Input
                    id="mat_khau"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu"
                    {...register('mat_khau')}
                    disabled={isLoading}
                    autoComplete="current-password"
                    className="touch-manipulation pr-11 h-11 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.mat_khau && (
                  <p className="text-sm text-destructive">{errors.mat_khau.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full touch-manipulation min-h-[48px] text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Đăng nhập
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
