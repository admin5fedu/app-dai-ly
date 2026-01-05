/**
 * React Query Hooks cho Authentication API
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { changePassword } from './auth'

/**
 * Hook để đổi mật khẩu
 */
export function useChangePassword() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ten_dang_nhap, currentPassword, newPassword }: {
      ten_dang_nhap: string
      currentPassword: string
      newPassword: string
    }) => changePassword(ten_dang_nhap, currentPassword, newPassword),
    onSuccess: () => {
      // Invalidate user queries if needed
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

