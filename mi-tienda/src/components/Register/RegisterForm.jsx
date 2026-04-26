import { useState } from 'react'
import { useUser } from '../../context/UserContext'
import { useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { registerServices } from '../../services/authServices'
import { Navigate } from 'react-router'
import toast from 'react-hot-toast'

const RegisterForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        mode: 'onChange', //validación en tiempo real
    })

    const { userInfo, checkSession } = useUser()
    const [showPassword, setShowPassword] = useState(false)
    const [redirect, setRedirect] = useState(false)
    const onSubmit = async (data) => {
        //registrar al usuario
        const result = await registerServices(
            data,
            reset,
            setRedirect,
            checkSession,
        )

        if (result.message) {
            toast.success('Registro exitoso')
        } else {
            toast.error('Registro fallido')
        }
    }

    if (redirect && userInfo.isAdmin) {
        //redirigirlo a la ventana de admin
    }

    if (redirect && !userInfo.isAdmin) {
        return <Navigate to={'/'} />
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 flex flex-col gap-4 lg:gap-6 max-w-[500px] mx-auto"
        >
            <div>
                <input
                    {...register('username', {
                        required: 'El nombre de usuario es requerido',
                        minLength: {
                            value: 3,
                            message: 'Minímo 3 caracteres',
                        },
                        maxLength: {
                            value: 20,
                            message: 'Máximo 20 caracteres',
                        },
                    })}
                    className={`p-2 outline-2 rounded border focus:outline-primary w-full ${
                        errors.username
                            ? 'border-red-500 outline-red-500 focus:outline-red-500'
                            : ''
                    }`}
                    autoComplete="usernames"
                    name="username"
                    placeholder="Nombre de usuario"
                    type="text"
                />
                {errors.username && (
                    <p className="text-red-500 text-sm mt-2 ml-1">
                        {errors.username.message}
                    </p>
                )}
            </div>
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
            <button className="btn btn-primary" type="submit">
                Registrarse
            </button>
        </form>
    )
}

export default RegisterForm
