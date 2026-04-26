// src/components/AdminDashboard/DashboardSidebar.jsx
import { NavLink } from 'react-router-dom'
import { useUser } from '../../../context/UserContext'
import { logoutServices } from '../../../services/authServices'
import toast from 'react-hot-toast'

const DashboardSidebar = ({ pendingOrdersCount }) => {
    const { setUserInfo } = useUser()

    const handleLogout = async () => {
        await logoutServices()
        setUserInfo({})
        toast.success('Sesión cerrada')
    }

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
            isActive
                ? 'bg-primary text-primary-content shadow-md'
                : 'hover:bg-base-200'
        }`

    return (
        <aside className="w-64 bg-base-100 shadow-xl min-h-screen p-4 flex flex-col items-start justify-start">
            {/* Header del Sidebar */}
            <div className="mb-8 w-full text-left">
                <h2 className="text-2xl font-bold text-primary">
                    Panel de control
                </h2>
                <p className="text-xs text-gray-500 mt-1">Desktop</p>
            </div>

            <nav className="w-full space-y-6">
                {/* Sección Analytics */}
                <div className="w-full text-left">
                    <p className="text-xs uppercase font-semibold text-gray-400 mb-2">
                        Metricas
                    </p>
                    <div className="flex flex-col space-y-1">
                        <NavLink
                            to="/admin/dashboard"
                            end
                            className={linkClass} // ASEGÚRATE QUE linkClass TENGA: "flex justify-start items-center w-full"
                        >
                            📊 Dashboard
                        </NavLink>
                        <NavLink
                            to="/admin/dashboard/reports"
                            className={linkClass}
                        >
                            📈 Reportes
                        </NavLink>
                    </div>
                </div>

                {/* Sección Plugins */}
                <div className="w-full text-left">
                    <p className="text-xs uppercase font-semibold text-gray-400 mb-2">
                        Plugins
                    </p>
                    <div className="flex flex-col space-y-1">
                        <NavLink
                            to="/admin/dashboard/products"
                            className={linkClass}
                        >
                            📦 Productos
                        </NavLink>
                        <NavLink
                            to="/admin/dashboard/products/createProduct"
                            className={linkClass}
                        >
                            ➕ Crear Producto
                        </NavLink>
                        <NavLink
                            to="/admin/dashboard/orders"
                            className={linkClass}
                        >
                            <div className="flex justify-between w-full items-center">
                                <span>🧾 Pedidos</span>
                                {pendingOrdersCount > 0 && (
                                    <span className="badge badge-error badge-sm">
                                        {pendingOrdersCount}
                                    </span>
                                )}
                            </div>
                        </NavLink>
                    </div>
                </div>

                {/* Botón de Cerrar Sesión */}
                <div className="pt-6 border-t w-full">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-start gap-3 px-4 py-2 rounded-lg text-error hover:bg-error/10 transition-colors"
                    >
                        🚪 Cerrar sesión
                    </button>
                </div>
            </nav>
        </aside>
    )
}

export default DashboardSidebar
