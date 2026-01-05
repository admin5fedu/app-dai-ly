import { checkPasswordStrength, getPasswordStrengthColor, getPasswordStrengthLabel } from '@/lib/utils/password-strength'
import { cn } from '@/lib/utils'

interface PasswordStrengthIndicatorProps {
  password: string
  className?: string
}

export function PasswordStrengthIndicator({ password, className }: PasswordStrengthIndicatorProps) {
  if (!password) return null

  const { strength, score, feedback } = checkPasswordStrength(password)

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Độ mạnh mật khẩu
        </span>
        <span className={cn(
          'text-xs font-semibold',
          strength === 'weak' && 'text-red-600 dark:text-red-400',
          strength === 'fair' && 'text-orange-600 dark:text-orange-400',
          strength === 'good' && 'text-yellow-600 dark:text-yellow-400',
          strength === 'strong' && 'text-green-600 dark:text-green-400',
        )}>
          {getPasswordStrengthLabel(strength)}
        </span>
      </div>
      
      {/* Strength bar */}
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              index < score
                ? getPasswordStrengthColor(strength)
                : 'bg-muted'
            )}
          />
        ))}
      </div>

      {/* Feedback */}
      {feedback.length > 0 && (
        <div className="text-xs text-muted-foreground space-y-0.5">
          {feedback.map((item, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <span className="text-destructive">•</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

