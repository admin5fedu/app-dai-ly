import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'
import type { User } from '@/api/auth'

interface AuthContextType {
  user: User | null
  login: (ten_dang_nhap: string, mat_khau: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        toast.error('Lỗi khi tải thông tin người dùng')
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (ten_dang_nhap: string, mat_khau: string): Promise<boolean> => {
    try {
      const { login: loginAPI } = await import('@/api/auth')
      const userData = await loginAPI(ten_dang_nhap, mat_khau)
      
      if (userData) {
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        return true
      }
      return false
    } catch (error) {
      // Error sẽ được xử lý ở component, chỉ log ở đây
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
