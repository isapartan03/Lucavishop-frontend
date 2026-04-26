import { useContext, createContext, useState, useEffect } from 'react'
import { getProfileServices } from '../services/authServices'

export const UserContext = createContext({})

export const UserContextProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({})
    const [loading, setLoading] = useState(true)

    //Función para verificar la sesión de un usuario

    const checkSession = async () => {
        try {
            setLoading(true)
            const userData = await getProfileServices()
            setUserInfo(userData)
        } catch (error) {
            console.log('No hay sesión activa: ', error)
            setUserInfo({})
        } finally {
            setLoading(false)
        }
    }

    //función para obtener el id del usuario identificado
    const getUserId = () => {
        return userInfo?.id || null
    }

    //verificar si el usuario está autenticado o no
    const isAuthenticated = () => {
        return !!userInfo?.id
    }

    useEffect(() => {
        checkSession()
    }, [])

    return (
        <UserContext.Provider
            value={{
                userInfo,
                setUserInfo,
                loading,
                checkSession,
                getUserId,
                isAuthenticated,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)
