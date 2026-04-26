// src/layout/DashboardLayout.jsx
import { Outlet } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { getPendingOrdersCount } from '../services/orderServices'
import DashboardSidebar from '../components/AdminDashboard/DashboardSidebar/DashboardSidebar'
const DashboardLayout = () => {
    const [pendingCount, setPendingCount] = useState(0)
    const pollingRef = useRef(null)

    const fetchPendingCount = async () => {
        try {
            const response = await getPendingOrdersCount()
            if (response.success) {
                setPendingCount(response.count)
            }
        } catch (error) {
            console.error('Error al obtener pedidos pendientes:', error)
        }
    }

    useEffect(() => {
        fetchPendingCount()
        pollingRef.current = setInterval(fetchPendingCount, 30000)
        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current)
        }
    }, [])

    // Pausar/reanudar según visibilidad de la pestaña
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (pollingRef.current) clearInterval(pollingRef.current)
                pollingRef.current = null
            } else {
                pollingRef.current = setInterval(fetchPendingCount, 30000)
                fetchPendingCount()
            }
        }
        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => {
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            )
        }
    }, [])

    return (
        <div className="flex h-screen bg-base-200 overflow-hidden m-0 p-0">
            {/* ← agregar m-0 p-0 */}
            <DashboardSidebar pendingOrdersCount={pendingCount} />
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <Outlet />
            </main>
        </div>
    )
}

export default DashboardLayout
