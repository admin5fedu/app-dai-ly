import { Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth-context'
import { AuthLoading } from './AuthLoading'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <AuthLoading />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

