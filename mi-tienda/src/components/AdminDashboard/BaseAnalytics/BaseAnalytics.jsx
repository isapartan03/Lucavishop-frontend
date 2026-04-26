import { useEffect, useState } from 'react'
import { getUsersRegisteredToday } from '../../../services/userServices'

const BaseAnalytics = () => {
    const [todayUsers, setTodayUsers] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getUsersRegisteredToday()
                if (response.success) {
                    setTodayUsers(response.count)
                }
            } catch (error) {
                console.error(
                    'Error al cargar usuarios registrados hoy:',
                    error,
                )
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center p-4">
                <span className="loading loading-spinner loading-md"></span>
            </div>
        )
    }

    return (
        <div className="bg-base-100 p-6 rounded-box shadow h-full">
            <h3 className="text-lg font-semibold mb-2">
                Usuarios registrados hoy
            </h3>
            <div className="text-center">
                <div
                    className="radial-progress text-primary"
                    style={{
                        '--value': Math.min(
                            100,
                            Math.round((todayUsers / 10) * 100),
                        ),
                    }}
                    role="progressbar"
                >
                    {todayUsers}
                </div>
                <p className="mt-4 text-sm">
                    {todayUsers} nuevo(s) usuario(s) hoy
                </p>
            </div>
        </div>
    )
}

export default BaseAnalytics
