import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../services/authServices'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await forgotPassword(email)
            setSent(true)
            toast.success('Revisa tu correo para restablecer tu contraseña')
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Error al enviar el correo',
            )
        } finally {
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        📧 Revisa tu correo
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Hemos enviado un enlace de recuperación a{' '}
                        <strong>{email}</strong>
                    </p>
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Volver al inicio de sesión
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
                    Recuperar contraseña
                </h2>
                <p className="text-gray-500 text-sm text-center mb-4">
                    Te enviaremos un enlace a tu correo para restablecer tu
                    contraseña.
                </p>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 border rounded mb-4"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {loading ? 'Enviando...' : 'Enviar enlace'}
                </button>
                <Link
                    to="/login"
                    className="block text-center text-sm text-gray-500 mt-4 hover:underline"
                >
                    Volver al inicio de sesión
                </Link>
            </form>
        </div>
    )
}

export default ForgotPassword
