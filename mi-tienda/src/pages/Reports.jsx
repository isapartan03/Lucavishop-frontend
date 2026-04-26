import { useState } from 'react'
import { getSalesStats } from '../services/orderServices'
import { getTopProducts } from '../services/orderServices'
import { useProduct } from '../context/productContext'
import { exportToCSV } from '../utils/exportUtils'
import toast from 'react-hot-toast'
import { exportToPDF } from '../utils/exportToPDF'

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
const Reports = () => {
    const { getLowStockProducts } = useProduct()
    const [salesData, setSalesData] = useState(null)
    const [topProducts, setTopProducts] = useState([])
    const [lowStock, setLowStock] = useState([])
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('sales')

    const loadSales = async () => {
        setLoading(true)
        try {
            const res = await getSalesStats()
            if (res.success) setSalesData(res)
        } catch (error) {
            toast.error('Error al cargar reporte de ventas')
        } finally {
            setLoading(false)
        }
    }

    const loadTopProducts = async () => {
        setLoading(true)
        try {
            const res = await getTopProducts(10)
            if (res.success) setTopProducts(res.topProducts)
        } catch (error) {
            toast.error('Error al cargar productos más vendidos')
        } finally {
            setLoading(false)
        }
    }

    const loadLowStock = async () => {
        setLoading(true)
        try {
            const res = await getLowStockProducts(5)
            if (res.success) setLowStock(res.products)
        } catch (error) {
            toast.error('Error al cargar productos con bajo stock')
        } finally {
            setLoading(false)
        }
    }

    const handleTabChange = (tab) => {
        setActiveTab(tab)
        if (tab === 'sales' && !salesData) loadSales()
        if (tab === 'top' && !topProducts.length) loadTopProducts()
        if (tab === 'lowstock' && !lowStock.length) loadLowStock()
    }

    const exportSalesToCSV = () => {
        if (!salesData) {
            toast.error('No hay datos para exportar')
            return
        }
        const daily = salesData.dailySales.map((d) => ({
            Fecha: d.date,
            Ventas: d.total,
        }))
        exportToCSV(daily, 'ventas_diarias.csv')
    }

    const exportTopProductsToCSV = () => {
        if (!topProducts.length) {
            toast.error('No hay datos para exportar')
            return
        }
        const exportData = topProducts.map((p) => ({
            Producto: p.product?.name || 'N/A',
            'Cantidad vendida': p.totalSold,
            'Ingresos ($)': parseFloat(p.totalRevenue).toFixed(2),
        }))
        exportToCSV(exportData, 'top_productos.csv')
    }

    const exportLowStockToCSV = () => {
        if (!lowStock.length) {
            toast.error('No hay productos con bajo stock')
            return
        }
        const exportData = lowStock.map((p) => ({
            Producto: p.name,
            Stock: p.stock,
            Precio: p.price,
        }))
        exportToCSV(exportData, 'productos_bajo_stock.csv')
    }

    const verifiContent = (elementId, filename = 'reporte.pdf') => {
        const contenido = document.getElementById(elementId)
        if (!contenido.length || contenido.children.length === 0) {
            toast.error('No hay datos para exportar')
            return
        }
        console.log('Contenido del elenemto en la funcio=> ', contenido.length)
        exportToPDF(contenido, filename)
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Reportes</h1>
            <div className="tabs tabs-boxed mb-6">
                <button
                    className={`tab ${activeTab === 'sales' ? 'tab-active' : ''}`}
                    onClick={() => handleTabChange('sales')}
                >
                    Ventas
                </button>
                <button
                    className={`tab ${activeTab === 'top' ? 'tab-active' : ''}`}
                    onClick={() => handleTabChange('top')}
                >
                    Top productos
                </button>
                <button
                    className={`tab ${activeTab === 'lowstock' ? 'tab-active' : ''}`}
                    onClick={() => handleTabChange('lowstock')}
                >
                    Bajo stock
                </button>
            </div>
            {loading && (
                <div className="flex justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            )}
            {activeTab === 'sales' && salesData && (
                <div>
                    <div className="flex justify-end gap-2 mb-4">
                        <button
                            onClick={exportSalesToCSV}
                            className="btn btn-sm btn-outline"
                        >
                            Exportar CSV
                        </button>
                        <button
                            onClick={() =>
                                exportToPDF(
                                    'sales-table-only',
                                    'reporte_ventas_tabla.pdf',
                                )
                            }
                            className="btn btn-sm btn-outline btn-primary"
                        >
                            Exportar PDF
                        </button>
                    </div>

                    {/* Contenedor solo para la tabla (sin gráficos) */}
                    <div
                        id="sales-table-only"
                        className="bg-pink-50 p-4 rounded shadow"
                    >
                        <h2 className="text-xl font-bold mb-4 text-center">
                            Reporte de Ventas
                        </h2>
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">
                                Ventas diarias (últimos 30 días)
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="table table-zebra w-full">
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Ventas ($)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {salesData.dailySales
                                            .slice(0, 30)
                                            .map((s) => (
                                                <tr key={s.date}>
                                                    <td>{s.date}</td>
                                                    <td>
                                                        $
                                                        {parseFloat(
                                                            s.total,
                                                        ).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Nuevo: contenedor solo para los dos gráficos */}
                    <div className="mt-8">
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={() =>
                                    verifiContent(
                                        'charts-only',
                                        'graficos_ventas.pdf',
                                    )
                                }
                                className="btn btn-sm btn-outline btn-primary"
                            >
                                Exportar solo gráficos PDF
                            </button>
                        </div>
                        <div
                            id="charts-only"
                            className="bg-pink-50 p-4 rounded shadow space-y-8"
                        >
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Ventas diarias (últimos 30 días)
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={salesData.dailySales}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip
                                            formatter={(value) => `$${value}`}
                                        />
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
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Ventas semanales (últimas 12 semanas)
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={salesData.weeklySales}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="week" />
                                        <YAxis />
                                        <Tooltip
                                            formatter={(value) => `$${value}`}
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey="total"
                                            fill="#82ca9d"
                                            name="Ventas ($)"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {activeTab === 'top' && (
                <div>
                    <div className="flex justify-end gap-2 mb-4">
                        <button
                            onClick={exportTopProductsToCSV}
                            className="btn btn-sm btn-outline"
                        >
                            Exportar CSV
                        </button>
                        <button
                            onClick={() =>
                                exportToPDF(
                                    'reporte_productos_top',
                                    'reporte_productos_top.pdf',
                                )
                            }
                            className="btn btn-sm btn-outline btn-primary"
                        >
                            Exportar PDF
                        </button>
                    </div>
                    {topProducts.length === 0 ? (
                        <p className="text-center text-gray-500">
                            No hay productos vendidos aún.
                        </p>
                    ) : (
                        <div
                            id="reporte_productos_top"
                            className="bg-slate-950 p-4 rounded shadow"
                        >
                            <h2 className="text-xl font-bold mb-4 text-center">
                                Lista de productos mas vendidos
                            </h2>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">
                                    Top Productos
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra w-full">
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Cantidad vendida</th>
                                                <th>Ingresos</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topProducts.map((p) => (
                                                <tr key={p.productId}>
                                                    <td>
                                                        {p.product?.name ||
                                                            'N/A'}
                                                    </td>
                                                    <td>{p.totalSold}</td>
                                                    <td>
                                                        $
                                                        {parseFloat(
                                                            p.totalRevenue,
                                                        ).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'lowstock' && (
                <div>
                    <div className="flex justify-end gap-2 mb-4">
                        <button
                            onClick={exportLowStockToCSV}
                            className="btn btn-sm btn-outline"
                        >
                            Exportar CSV
                        </button>
                        <button
                            onClick={() =>
                                verifiContent(
                                    'lowstock-table',
                                    'reporte_productos_stock_bajo.pdf',
                                )
                            }
                            className="btn btn-sm btn-outline btn-primary"
                        >
                            Exportar PDF
                        </button>
                    </div>
                    {lowStock.length === 0 ? (
                        <p
                            className="text-center text-gray-500"
                            id="lowstock-table"
                        >
                            No hay productos con bajo stock.
                        </p>
                    ) : (
                        <div
                            id="lowstock-table"
                            className="overflow-x-auto bg-slate-950 p-4 rounded shadow"
                        >
                            <h2 className="text-xl font-bold mb-4 text-center">
                                Productos con bajo stock (&lt;5)
                            </h2>
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Stock</th>
                                        <th>Precio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lowStock.map((p) => (
                                        <tr key={p.id}>
                                            <td>{p.name}</td>
                                            <td className="text-error font-bold">
                                                {p.stock}
                                            </td>
                                            <td>${p.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Reports
