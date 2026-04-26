import { useEffect, useState } from 'react'
import { getUserCount } from '../../../services/userServices'
import { getPendingOrdersCount } from '../../../services/orderServices'
import { useProduct } from '../../../context/productContext'
const DashboardStats = () => {
    const { getLowStockProducts } = useProduct()
    const [totalUsers, setTotalUsers] = useState(0)
    const [pendingOrders, setPendingOrders] = useState(0)
    const [lowStockCount, setLowStockCount] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersRes, ordersRes, stockRes] = await Promise.all([
                    getUserCount(),
                    getPendingOrdersCount(),
                    getLowStockProducts(10),
                ])
                if (usersRes.success) setTotalUsers(usersRes.count)
                if (ordersRes.success) setPendingOrders(ordersRes.count)
                if (stockRes.success) setLowStockCount(stockRes.products.length)
            } catch (error) {
                console.error('Error al cargar estadísticas:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [getLowStockProducts])

    if (loading)
        return (
            <div className="flex justify-center p-8">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            <div className="stat bg-base-100 shadow rounded-box">
                <div className="stat-figure text-primary">👥</div>
                <div className="stat-title">Total Usuarios</div>
                <div className="stat-value text-primary">{totalUsers}</div>
            </div>
            <div className="stat bg-base-100 shadow rounded-box">
                <div className="stat-figure text-warning">📦</div>
                <div className="stat-title">Pedidos Pendientes</div>
                <div className="stat-value text-warning">{pendingOrders}</div>
            </div>
            <div className="stat bg-base-100 shadow rounded-box">
                <div className="stat-figure text-error">⚠️</div>
                <div className="stat-title">Productos bajo stock (&lt;10)</div>
                <div className="stat-value text-error">{lowStockCount}</div>
            </div>
        </div>
    )
}

export default DashboardStats
