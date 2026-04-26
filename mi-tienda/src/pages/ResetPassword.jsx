import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { resetPassword } from '../services/authServices'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom' //

const ResetPassword = () => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const navigate = useNavigate()
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!token) {
            toast.error('Enlace inválido')
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error('Las contraseñas no coinciden')
            return
        }

        if (newPassword.length < 8) {
            toast.error('La contraseña debe tener al menos 8 caracteres')
            return
        }

        setLoading(true)
        try {
            await resetPassword(token, newPassword)
            toast.success(
                'Contraseña actualizada. Ahora puedes iniciar sesión.',
            )
            navigate('/login')
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    'Error al restablecer la contraseña',
            )
        } finally {
            setLoading(false)
        }
    }

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        ❌ Enlace inválido
                    </h2>
                    <p className="text-gray-600 mb-4">
                        El enlace de recuperación no es válido o ya fue usado.
                    </p>
                    <Link
                        to="/forgot-password"
                        className="text-blue-500 hover:underline"
                    >
                        Solicitar nuevo enlace
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md w-96"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Nueva contraseña
                </h2>
                <input
                    type="password"
                    placeholder="Nueva contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full p-2 border rounded mb-4"
                />
                <input
                    type="password"
                    placeholder="Confirmar contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full p-2 border rounded mb-4"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {loading ? 'Actualizando...' : 'Actualizar contraseña'}
                </button>
            </form>
        </div>
    )
}

export default ResetPassword
