import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useUser } from './UserContext'
import { getUserNewAnswers } from '../services/questionServices'
import toast from 'react-hot-toast'

const NotificationContext = createContext({})

export const useNotifications = () => useContext(NotificationContext)

export const NotificationProvider = ({ children }) => {
    const { userInfo, isAuthenticated } = useUser()
    const [lastCheck, setLastCheck] = useState(() => {
        const saved = localStorage.getItem('notification_last_check')
        return saved ? parseInt(saved) : Date.now()
    })
    const pollingRef = useRef(null)
    const isPollingRef = useRef(false)

    const checkNewAnswers = async () => {
        if (!isAuthenticated()) return
        if (isPollingRef.current) return
        isPollingRef.current = true
        try {
            const response = await getUserNewAnswers(lastCheck)
            if (response.success && response.newAnswers.length > 0) {
                response.newAnswers.forEach((q) => {
                    toast.success(
                        `📝 Tu pregunta "${q.question.substring(0, 50)}..." ha sido respondida por ${q.answer.user?.username || 'el administrador'}`,
                    )
                })
                // Actualizar lastCheck a la hora actual después de mostrar notificaciones
                const newCheck = Date.now()
                setLastCheck(newCheck)
                localStorage.setItem('notification_last_check', newCheck)
            }
        } catch (error) {
            console.error('Error al verificar nuevas respuestas:', error)
        } finally {
            isPollingRef.current = false
        }
    }

    useEffect(() => {
        if (!isAuthenticated()) {
            if (pollingRef.current) clearInterval(pollingRef.current)
            pollingRef.current = null
            return
        }

        // Iniciar polling cada 30 segundos
        checkNewAnswers() // primera vez inmediatamente
        pollingRef.current = setInterval(checkNewAnswers, 30000)

        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current)
        }
    }, [isAuthenticated, lastCheck])

    // Pausar/reanudar cuando la pestaña está oculta (opcional)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (pollingRef.current) clearInterval(pollingRef.current)
                pollingRef.current = null
            } else {
                if (isAuthenticated()) {
                    pollingRef.current = setInterval(checkNewAnswers, 30000)
                    checkNewAnswers() // consulta inmediata al volver
                }
            }
        }
        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => {
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            )
        }
    }, [isAuthenticated])

    return (
        <NotificationContext.Provider value={{}}>
            {children}
        </NotificationContext.Provider>
    )
}
