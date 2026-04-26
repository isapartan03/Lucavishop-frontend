import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { loginServices } from '../../services/authServices'
import { useUser } from '../../context/UserContext'
import toast from 'react-hot-toast'
import { Navigate } from 'react-router'
import { Link } from 'react-router-dom'

const LoginForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        mode: 'onChange', //validación en tiempo real
    })

    const { setUserInfo, userInfo } = useUser()
    const [showPassword, setShowPassword] = useState(false)
    const [redirect, setRedirect] = useState(null)

    const onSubmit = async (data) => {
        //loguear al usuario
        const result = await loginServices(
            data,
            reset,
            setRedirect,
            setUserInfo,
        )

        if (result.succes) {
            toast.success(result.message)
        } else {
            toast.error(result.message)
        }
    }

    if (redirect && userInfo.isAdmin) {
        return <Navigate to={'/admin/dashboard'} />
    }

    if (redirect && !userInfo.isAdmin) {
        return <Navigate to="/" />
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 flex flex-col gap-4 lg:gap-6 max-w-[500px] mx-auto"
        >
            <div>
                <input
                    {...register('email', {
                        required: 'El correo es requerido',
                        pattern: {
                            value: /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9-]*\.)+[a-z]{2,}$/,
                            message: 'Correo electrónico inválido',
                        },
                        minLength: {
                            value: 6,
                            message: 'Mínimo 6 caracteres',
                        },
                        maxLength: {
                            value: 254,
                            message: 'Máximo 254 caracteres',
                        },
                    })}
                    className={`p-2 outline-2 rounded border focus:outline-primary w-full ${
                        errors.email
                            ? 'border-red-500 outline-red-500 focus:outline-red-500'
                            : ''
                    }`}
                    autoComplete="email"
                    name="email"
                    placeholder="Correo electrónico"
                    type="email"
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-2 ml-1">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div className="relative">
                <input
                    {...register('password', {
                        required:
                            'Es reuquerida una contraseña (8-50 caracteres)',
                        minLength: {
                            value: 8,
                            message: 'Mínimo 8 caracteres',
                        },
                        maxLength: {
                            value: 50,
                            message: 'Máximo 50 caracteres',
                        },
                    })}
                    className={`p-2 outline-2 rounded border focus:outline-primary w-full ${
                        errors.password
                            ? 'border-red-500 outline-red-500 focus:outline-red-500'
                            : ''
                    }`}
                    autoComplete="current-password"
                    placeholder="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                />
                <button
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                        showPassword
                            ? 'Ocultar contraseña'
                            : 'Mostrar contraseña'
                    }
                    type="button"
                    className="cursor-pointer absolute right-4 top-[20px] transform -translate-y-1/2 text-gray-500"
                >
                    {showPassword ? (
                        <FaEyeSlash size={23} />
                    ) : (
                        <FaEye size={23} />
                    )}
                </button>
                {errors.password && (
                    <p className="text-red-500 text-sm mt-2 ml-1">
                        {errors.password.message}
                    </p>
                )}
            </div>
            <Link
                to="/forgot-password"
                className="text-sm text-blue-500 hover:underline mt-2 block text-center"
            >
                ¿Olvidaste tu contraseña?
            </Link>
            <button className="btn btn-primary" type="submit">
                Iniciar Sesión
            </button>
        </form>
    )
}

export default LoginForm
