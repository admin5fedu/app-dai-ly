/**
 * Password strength checker utilities
 */

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong'

export interface PasswordStrengthResult {
  strength: PasswordStrength
  score: number // 0-4
  feedback: string[]
}

/**
 * Checks password strength and returns feedback
 */
export function checkPasswordStrength(password: string): PasswordStrengthResult {
  const feedback: string[] = []
  let score = 0

  // Length check
  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('Mật khẩu nên có ít nhất 8 ký tự')
  }

  if (password.length >= 12) {
    score += 1
  }

  // Has lowercase
  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Thêm chữ thường')
  }

  // Has uppercase
  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Thêm chữ hoa')
  }

  // Has numbers
  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push('Thêm số')
  }

  // Has special characters
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1
  } else {
    feedback.push('Thêm ký tự đặc biệt')
  }

  let strength: PasswordStrength
  if (score <= 2) {
    strength = 'weak'
  } else if (score <= 3) {
    strength = 'fair'
  } else if (score <= 4) {
    strength = 'good'
  } else {
    strength = 'strong'
  }

  return {
    strength,
    score: Math.min(score, 4),
    feedback: feedback.slice(0, 3), // Limit feedback to 3 items
  }
}

/**
 * Gets color class for password strength
 */
export function getPasswordStrengthColor(strength: PasswordStrength): string {
  switch (strength) {
    case 'weak':
      return 'bg-red-500'
    case 'fair':
      return 'bg-orange-500'
    case 'good':
      return 'bg-yellow-500'
    case 'strong':
      return 'bg-green-500'
    default:
      return 'bg-gray-500'
  }
}

/**
 * Gets label for password strength
 */
export function getPasswordStrengthLabel(strength: PasswordStrength): string {
  switch (strength) {
    case 'weak':
      return 'Yếu'
    case 'fair':
      return 'Trung bình'
    case 'good':
      return 'Tốt'
    case 'strong':
      return 'Mạnh'
    default:
      return 'Chưa xác định'
  }
}

