import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function PublicRoute({ children }) {
  const token = useAuthStore((s) => s.token)
  if (token) return <Navigate to="/home" replace />
  return children
}
