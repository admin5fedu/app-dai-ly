import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { User, UserCircle, Shield, Calendar, KeyRound } from 'lucide-react'

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const infoFields = [
    {
      label: 'Tên đăng nhập',
      value: user?.ten_dang_nhap || '-',
      icon: UserCircle,
    },
    {
      label: 'Tên người dùng',
      value: user?.ten_nguoi_dung || '-',
      icon: User,
    },
    {
      label: 'Phân quyền',
      value: user?.phan_quyen || '-',
      icon: Shield,
    },
  ]

  const handleChangePassword = () => {
    navigate('/change-password', {
      state: { from: '/profile' }
    })
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-md px-4 py-6 page-enter">
        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg">
                <User className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl font-bold">Hồ sơ người dùng</CardTitle>
                <CardDescription className="text-sm mt-1">
                  Thông tin tài khoản của bạn
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {infoFields.map((field, index) => {
              const Icon = field.icon
              return (
                <div key={index} className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Icon className="h-4 w-4" />
                    {field.label}
                  </label>
                  <div className="rounded-lg border-2 bg-muted/30 px-4 py-3 text-sm font-medium backdrop-blur-sm">
                    {field.value}
                  </div>
                </div>
              )
            })}

            {user?.tg_tao && (
              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Ngày tạo
                </label>
                <div className="rounded-lg border-2 bg-muted/30 px-4 py-3 text-sm font-medium backdrop-blur-sm">
                  {user.tg_tao}
                </div>
              </div>
            )}

            {user?.tg_cap_nhat && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Cập nhật lần cuối
                </label>
                <div className="rounded-lg border-2 bg-muted/30 px-4 py-3 text-sm font-medium backdrop-blur-sm">
                  {user.tg_cap_nhat}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-4">
            <Button
              onClick={handleChangePassword}
              className="w-full touch-manipulation min-h-[48px] text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              <KeyRound className="mr-2 h-5 w-5" />
              Đổi mật khẩu
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
