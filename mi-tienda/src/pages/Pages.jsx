import { useState } from 'react'
import { getSalesStats } from '../services/orderServices'
import { getTopProducts } from '../services/orderServices'
import { getLowStockProducts } from '../context/productContext' // o desde servicio
import { useProduct } from '../context/productContext'
import { exportToCSV } from '../utils/exportUtils'
import toast from 'react-hot-toast'

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
        if (!salesData) return
        const daily = salesData.dailySales.map((d) => ({
            Fecha: d.date,
            Ventas: d.total,
        }))
        exportToCSV(daily, 'ventas_diarias.csv')
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Reportes</h1>
            <div className="tabs tabs-boxed mb-6">
                <a
                    className={`tab ${activeTab === 'sales' ? 'tab-active' : ''}`}
                    onClick={() => handleTabChange('sales')}
                >
                    Ventas
                </a>
                <a
                    className={`tab ${activeTab === 'top' ? 'tab-active' : ''}`}
                    onClick={() => handleTabChange('top')}
                >
                    Top productos
                </a>
                <a
                    className={`tab ${activeTab === 'lowstock' ? 'tab-active' : ''}`}
                    onClick={() => handleTabChange('lowstock')}
                >
                    Bajo stock
                </a>
            </div>

            {loading && (
                <div className="flex justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            )}

            {activeTab === 'sales' && salesData && (
                <div>
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={exportSalesToCSV}
                            className="btn btn-sm btn-outline"
                        >
                            Exportar CSV
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th>Período</th>
                                    <th>Ventas ($)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salesData.dailySales.slice(0, 30).map((s) => (
                                    <tr key={s.date}>
                                        <td>{s.date}</td>
                                        <td>${s.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'top' && topProducts.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
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
                                    <td>{p.product?.name || 'N/A'}</td>
                                    <td>{p.totalSold}</td>
                                    <td>
                                        ${parseFloat(p.totalRevenue).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'lowstock' && lowStock.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
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
    )
}

export default Reports
