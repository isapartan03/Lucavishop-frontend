import { useState, useEffect, useRef } from 'react'
import { FaBell } from 'react-icons/fa'
import axios from 'axios'
import { useUser } from '../../context/UserContext'

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)
    const { userInfo } = useUser()

    const API_URL = process.env.REACT_APP_BACKEND_URL + '/notifications'

    const fetchNotifications = async () => {
        if (!userInfo?.id) return
        try {
            const response = await axios.get(API_URL, { withCredentials: true })
            setNotifications(response.data.notifications)
            setUnreadCount(response.data.unreadCount)
        } catch (error) {
            console.error('Error al cargar notificaciones:', error)
        }
    }

    const markAsRead = async (id) => {
        try {
            await axios.put(
                `${API_URL}/${id}/read`,
                {},
                { withCredentials: true },
            )
            fetchNotifications()
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const markAllAsRead = async () => {
        try {
            await axios.put(
                `${API_URL}/read-all`,
                {},
                { withCredentials: true },
            )
            fetchNotifications()
        } catch (error) {
            console.error('Error:', error)
        }
    }

    useEffect(() => {
        fetchNotifications()
        // Polling cada 30 segundos
        const interval = setInterval(fetchNotifications, 30000)
        return () => clearInterval(interval)
    }, [userInfo?.id])

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    if (!userInfo?.id) return null

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-base-200 transition-colors"
            >
                <FaBell className="text-xl" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border">
                    <div className="flex justify-between items-center p-3 border-b">
                        <h3 className="font-semibold">Notificaciones</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-blue-500 hover:text-blue-700"
                            >
                                Marcar todas como leídas
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">
                                No hay notificaciones
                            </p>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${!notif.read ? 'bg-blue-50' : ''}`}
                                    onClick={() => {
                                        if (!notif.read) markAsRead(notif.id)
                                        if (notif.link)
                                            window.location.href = notif.link
                                    }}
                                >
                                    <p className="font-medium text-sm">
                                        {notif.title}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {notif.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(
                                            notif.createdAt,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default NotificationBell
