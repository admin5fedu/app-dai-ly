import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { PasswordStrengthIndicator } from '@/components/ui/password-strength'
import { useAuth } from '@/lib/auth-context'
import { changePassword } from '@/api/auth'
import { cn } from '@/lib/utils'
import { Lock, Eye, EyeOff, Loader2, KeyRound, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useCustomBack } from '@/hooks/use-custom-back'

export default function ChangePassword() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { handleBack } = useCustomBack('/profile')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự')
      return
    }

    if (!user?.ten_dang_nhap) {
      toast.error('Không tìm thấy thông tin người dùng')
      return
    }

    setIsLoading(true)
    try {
      await changePassword(user.ten_dang_nhap, currentPassword, newPassword)
      toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.')
      
      // Đăng xuất và chuyển đến trang login sau 1.5 giây
      setTimeout(() => {
        logout()
        navigate('/login', { replace: true })
      }, 1500)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Đã xảy ra lỗi. Vui lòng thử lại.')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-md px-4 py-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg">
                <KeyRound className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl font-bold">Đổi mật khẩu</CardTitle>
                <CardDescription className="text-sm mt-1">
                  Cập nhật mật khẩu tài khoản của bạn
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2.5">
                <Label htmlFor="currentPassword" className="text-sm font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Mật khẩu hiện tại
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu hiện tại"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={isLoading}
                    className="touch-manipulation pr-11 h-11 text-base border-2"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-accent"
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="newPassword" className="text-sm font-semibold flex items-center gap-2">
                  <KeyRound className="h-4 w-4" />
                  Mật khẩu mới
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading}
                    className="touch-manipulation pr-11 h-11 text-base border-2"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-accent"
                    tabIndex={-1}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {newPassword && (
                  <PasswordStrengthIndicator password={newPassword} />
                )}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Xác nhận mật khẩu mới
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    className={cn(
                      "touch-manipulation pr-11 h-11 text-base border-2",
                      confirmPassword && newPassword !== confirmPassword && "border-destructive"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-accent"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-destructive">Mật khẩu không khớp</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full touch-manipulation min-h-[48px] text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <KeyRound className="mr-2 h-5 w-5" />
                    Đổi mật khẩu
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
