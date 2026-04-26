// src/pages/DashboardHome.jsx
import DashboardStats from '../components/AdminDashboard/DashboardStats/DashboardStats'
import SalesCharts from '../components/AdminDashboard/SalesCharts/SalesCharts'
import BaseAnalytics from '../components/AdminDashboard/BaseAnalytics/BaseAnalytics'
import PeopleStats from '../components/AdminDashboard/PeopleStats/PeopleStats'

const DashboardHome = () => {
    return (
        <div className="p-6 space-y-8">
            {/* Título General Analytics */}
            <div>
                <h1 className="text-3xl font-bold">Datos generales</h1>
            </div>

            {/* Tarjetas de métricas (ya existentes) */}
            <DashboardStats />

            {/* Dos columnas: Base Analytics y People */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BaseAnalytics />
                <PeopleStats />
            </div>

            {/* Sección Statistics: aquí van tus gráficos actuales */}
            <div className="bg-base-100 p-4 rounded-box shadow">
                <h2 className="text-xl font-semibold mb-2">Statistics</h2>
                <p className="text-sm text-gray-500 mb-4">Grafico de ventas</p>
                <SalesCharts /> {/* ← tus gráficos de ventas originales */}
            </div>
        </div>
    )
}

export default DashboardHome
