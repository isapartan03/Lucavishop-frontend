import { useState } from 'react'
import { useUser } from '../context/UserContext'
import { updateAvatarService } from '../services/authServices'
import toast from 'react-hot-toast'
import { getImageUrl } from '../utils/ulrHelpers'

const Profile = () => {
    const { userInfo, setUserInfo } = useUser()
    const [selectedFile, setSelectedFile] = useState(null)
    const [preview, setPreview] = useState(userInfo?.avatar || null)
    const [loading, setLoading] = useState(false)

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('La imagen no debe superar los 2 MB')
                e.target.value = '' // Limpiar input
                setSelectedFile(null)
                setPreview(null)
                return
            }

            setSelectedFile(file)
            setPreview(URL.createObjectURL(file))
        }
    }

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error('Selecciona una imagen primero')
            return
        }

        setLoading(true)
        const formData = new FormData()
        formData.append('avatar', selectedFile)

        try {
            const response = await updateAvatarService(formData)
            // Actualizar el contexto con la nueva URL del avatar
            setUserInfo({ ...userInfo, avatar: response.avatar })
            toast.success('Avatar actualizado correctamente')
        } catch (error) {
            console.error(error)
            toast.error('Error al subir la imagen')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Mi perfil</h1>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="flex flex-col items-center gap-4">
                        {/* Avatar actual */}
                        <div className="avatar">
                            <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img
                                    src={
                                        getImageUrl(userInfo?.avatar) ||
                                        'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
                                    }
                                    alt="Avatar"
                                />
                            </div>
                        </div>

                        {/* Formulario de subida */}
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">
                                    Cambiar foto de perfil
                                </span>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="file-input file-input-bordered w-full"
                            />
                        </div>

                        <button
                            onClick={handleUpload}
                            disabled={!selectedFile || loading}
                            className="btn btn-primary"
                        >
                            {loading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                'Subir imagen'
                            )}
                        </button>
                    </div>

                    <div className="divider"></div>

                    {/* Información del usuario */}
                    <div className="space-y-2">
                        <div>
                            <label className="label-text font-semibold">
                                Nombre de usuario
                            </label>
                            <p className="text-lg">
                                {userInfo?.username || 'Sin nombre'}
                            </p>
                        </div>
                        <div>
                            <label className="label-text font-semibold">
                                Email
                            </label>
                            <p className="text-lg">{userInfo?.email}</p>
                        </div>
                        <div>
                            <label className="label-text font-semibold">
                                Rol
                            </label>
                            <p className="text-lg">
                                {userInfo?.isAdmin
                                    ? 'Administrador'
                                    : 'Cliente'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
