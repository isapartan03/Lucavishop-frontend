import { useState, useEffect } from 'react'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { getSalesStats } from '../../../services/orderServices'

const SalesCharts = () => {
    const [dailyData, setDailyData] = useState([])
    const [weeklyData, setWeeklyData] = useState([])
    const [monthlyData, setMonthlyData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getSalesStats()
                if (response.success) {
                    setDailyData(response.dailySales)
                    setWeeklyData(response.weeklySales)
                    setMonthlyData(response.monthlySales)
                }
            } catch (error) {
                console.error('Error al cargar ventas:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading)
        return (
            <div className="flex justify-center p-8">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )

    return (
        /* CAMBIO: Usamos grid. 
           grid-cols-1: 1 columna en móvil.
           lg:grid-cols-2: 2 columnas en pantallas grandes.
           Si quieres 3 columnas siempre, usa grid-cols-3 directamente. */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico 1 */}
            <div className="bg-base-100 p-4 rounded-box shadow">
                <h3 className="text-lg font-semibold mb-4">
                    Ventas diarias (últimos 30 días)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => `$${value}`} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="total"
                            stroke="#8884d8"
                            name="Ventas ($)"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Gráfico 2 */}
            <div className="bg-base-100 p-4 rounded-box shadow">
                <h3 className="text-lg font-semibold mb-4">
                    Ventas semanales (últimas 12 semanas)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip formatter={(value) => `$${value}`} />
                        <Legend />
                        <Bar dataKey="total" fill="#82ca9d" name="Ventas ($)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-base-100 p-4 rounded-box shadow lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4">
                    Ventas mensuales (últimos 12 meses)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `$${value}`} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="total"
                            stroke="#ff7300"
                            name="Ventas ($)"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default SalesCharts
