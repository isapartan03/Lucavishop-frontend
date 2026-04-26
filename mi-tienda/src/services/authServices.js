import axios from 'axios'
const API_URL = process.env.REACT_APP_BACKEND_URL + '/auth'

axios.defaults.withCredentials = true

export const getProfileServices = async () => {
    try {
        const response = await axios.get(`${API_URL}/profile`)
        return response.data
    } catch (error) {
        throw new Error('Error al obtener el perfil')
    }
}

export const loginServices = async (data, reset, setRedirect, setUserInfo) => {
    try {
        const response = await axios.post(`${API_URL}/login`, data, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        })

        //si la respuesta es exitosa
        if (response.status === 200) {
            setUserInfo(response.data)
            reset()
            setRedirect(true)
            return {
                succes: true,
                message: 'Inicio de sesión exitoso',
            }
        }
    } catch (error) {
        return {
            succes: false,
            message: 'Error al inicio de sesión',
        }
    }
}

export const registerServices = async (
    data,
    reset,
    setRedirect,
    checkSession,
) => {
    try {
        const response = await axios.post(`${API_URL}/register`, data, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        })
        if (response.status === 201 || response.status === 200) {
            //verificar la sesión real del servidor después del registro
            await checkSession()
            reset()
            setRedirect(true)

            return {
                message: true,
            }
        }
    } catch (error) {
        return {
            message: false,
        }
    }
}

export const logoutServices = async () => {
    try {
        const response = await axios.post(`${API_URL}/logout`)
        return response.data
    } catch (error) {
        throw new Error(
            error.response?.data?.message || 'Error al cerrar la sesión',
        )
    }
}

export const updateAvatarService = async (formData) => {
    const response = await axios.put(`${API_URL}/avatar`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
}

export const forgotPassword = async (email) => {
    const response = await axios.post(`${API_URL}/forgot-password`, { email })
    return response.data
}

export const resetPassword = async (token, newPassword) => {
    const response = await axios.post(`${API_URL}/reset-password`, {
        token,
        newPassword,
    })
    return response.data
}
