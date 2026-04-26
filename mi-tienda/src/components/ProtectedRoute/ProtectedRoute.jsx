import { useUser } from '../../context/UserContext'
import { Navigate } from 'react-router'

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { userInfo, loading } = useUser()
    console.log(userInfo, loading, 'Protected router')
    if (loading) {
        return <span className="loading loading-spinner"></span>
    }

    if (Object.keys(userInfo).length === 0) {
        return <Navigate to="/login" replace />
    }
    // Si se requiere admin y el usuario no lo es, redirigir al home
    if (requireAdmin && !userInfo.isAdmin) {
        return <Navigate to="/" replace />
    }
    return children
}

export default ProtectedRoute
