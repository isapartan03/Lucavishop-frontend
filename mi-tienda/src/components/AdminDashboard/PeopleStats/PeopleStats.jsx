// src/components/AdminDashboard/PeopleStats/PeopleStats.jsx
import { useEffect, useState } from 'react'
import { getAllOrdersService } from '../../../services/orderServices'
import { getUserCount } from '../../../services/userServices'

const PeopleStats = () => {
    const [totalUsers, setTotalUsers] = useState(0)
    const [totalOrders, setTotalOrders] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, ordersRes] = await Promise.all([
                    getUserCount(),
                    getAllOrdersService(),
                ])
                if (usersRes.success) setTotalUsers(usersRes.count)
                if (ordersRes.success) setTotalOrders(ordersRes.orders.length)
            } catch (error) {
                console.error('Error al cargar people stats:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading)
        return (
            <div className="flex justify-center p-4">
                <span className="loading loading-spinner loading-md"></span>
            </div>
        )

    return (
        <div className="bg-base-100 p-6 rounded-box shadow h-full">
            <h3 className="text-lg font-semibold mb-2">Promedio de pedidos</h3>

            <div className="stats shadow w-full">
                <div className="stat">
                    <div className="stat-title">Usuarios</div>
                    <div className="stat-value">{totalUsers}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Pedidos</div>
                    <div className="stat-value">{totalOrders}</div>
                </div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-500">
                Promedio de pedidos por usuario:{' '}
                {(totalOrders / totalUsers).toFixed(1) || 0}
            </div>
        </div>
    )
}

export default PeopleStats
