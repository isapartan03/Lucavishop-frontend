import { useState, useEffect } from 'react'
import {
    getAllOrdersService,
    updateOrderStatusService,
    sendInvoiceEmail,
} from '../../../services/orderServices'
import toast from 'react-hot-toast'
import OrderDetailModal from './OdersDeatilMoadal' // Ajusta el nombre si es diferente

const OrdersAdmin = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        loadOrders()
    }, [])

    const loadOrders = async () => {
        try {
            const response = await getAllOrdersService()
            if (response.success) {
                setOrders(response.orders)
            } else {
                toast.error('Error al cargar pedidos')
            }
        } catch (error) {
            console.error(error)
            toast.error('Error al cargar pedidos')
        } finally {
            setLoading(false)
        }
    }

    // Función unificada para aprobar orden (cambia status y paymentStatus a approved)
    const handleApproveOrder = async (orderId) => {
        const confirmMessage = '¿Estás seguro de aprobar esta orden?'
        if (!window.confirm(confirmMessage)) return

        try {
            const response = await updateOrderStatusService(orderId, {
                status: 'approved',
                paymentStatus: 'approved',
            })
            if (response.success) {
                toast.success('Orden aprobada')
                await loadOrders()
                closeModal()
            } else {
                toast.error(response.message || 'Error al aprobar')
            }
        } catch (error) {
            console.error(error)
            toast.error('Error al aprobar la orden')
        }
    }

    // Función unificada para cancelar orden (status rejected, paymentStatus rejected)
    const handleCancelOrder = async (orderId) => {
        const confirmMessage = '¿Estás seguro de cancelar esta orden?'
        if (!window.confirm(confirmMessage)) return

        try {
            const response = await updateOrderStatusService(orderId, {
                status: 'rejected',
                paymentStatus: 'rejected',
            })
            if (response.success) {
                toast.success('Orden cancelada')
                await loadOrders()
                closeModal()
            } else {
                toast.error(response.message || 'Error al cancelar')
            }
        } catch (error) {
            console.error(error)
            toast.error('Error al cancelar la orden')
        }
    }

    const senFactura = async (orderId) => {
        try {
            const response = await sendInvoiceEmail(orderId)
            if (response.success) {
                toast.success(response.message || 'Factura Enviada!!')
            } else {
                toast.error(response.message || 'Error al enviar la factura')
            }
        } catch (error) {
            console.error(error)
            toast.error('Algo ha fallado')
        }
    }

    const openModal = (order) => {
        setSelectedOrder(order)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedOrder(null)
    }

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'badge-warning',
            in_process: 'badge-info',
            approved: 'badge-success',
            rejected: 'badge-error',
            cancelled: 'badge-ghost',
        }
        const texts = {
            pending: 'Pendiente',
            in_process: 'En revisión',
            approved: 'Aprobado',
            rejected: 'Rechazado',
            cancelled: 'Cancelado',
        }
        return (
            <span
                className={`badge ${badges[status] || 'badge-ghost'} badge-sm`}
            >
                {texts[status] || status}
            </span>
        )
    }

    const getPaymentBadge = (status) => {
        const badges = {
            pending: 'badge-warning',
            pending_review: 'badge-info',
            approved: 'badge-success',
            rejected: 'badge-error',
        }
        const texts = {
            pending: 'Pendiente',
            pending_review: 'Pendiente',
            approved: 'Aprobado',
            rejected: 'Rechazado',
        }
        return (
            <span
                className={`badge ${badges[status] || 'badge-ghost'} badge-sm`}
            >
                {texts[status] || status}
            </span>
        )
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    // Determinar si una orden puede ser aprobada o cancelada (solo si no está ya aprobada/cancelada)
    const isActionable = (order) => {
        return (
            order.status !== 'approved' &&
            order.status !== 'rejected' &&
            order.status !== 'cancelled'
        )
    }

    return (
        <div className="overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4">Todos los pedidos</h2>
            <table className="table table-zebra w-full">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Estado pedido</th>
                        <th>Estado pago</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>#{order.id}</td>
                            <td>
                                {order.user?.username || 'Usuario eliminado'}
                                <br />
                                <span className="text-xs text-gray-500">
                                    {order.user?.email}
                                </span>
                            </td>
                            <td>
                                {new Date(order.createdAt).toLocaleDateString(
                                    'es-ES',
                                    {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    },
                                )}
                            </td>
                            <td>${order.totalAmount}</td>
                            <td>{getStatusBadge(order.status)}</td>
                            <td>{getPaymentBadge(order.paymentStatus)}</td>
                            <td>
                                {isActionable(order) && (
                                    <>
                                        <button
                                            onClick={() => {
                                                handleApproveOrder(order.id)
                                                senFactura(order.id)
                                            }}
                                            className="btn btn-xs btn-success mr-1"
                                        >
                                            Aprobar orden
                                        </button>
                                        <br />
                                        <button
                                            onClick={() =>
                                                handleCancelOrder(order.id)
                                            }
                                            className="btn btn-xs btn-error mr-1"
                                        >
                                            Cancelar orden
                                        </button>
                                    </>
                                )}
                                <button
                                    className="btn btn-xs btn-info"
                                    onClick={() => openModal(order)}
                                >
                                    Ver detalles
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <OrderDetailModal
                order={selectedOrder}
                isOpen={isModalOpen}
                onClose={closeModal}
                onApproveOrder={handleApproveOrder}
                onCancelOrder={handleCancelOrder}
            />
        </div>
    )
}

export default OrdersAdmin
