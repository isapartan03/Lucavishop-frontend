// src/pages/Orders.jsx
import { useState, useEffect, useRef } from 'react'
import {
    getUserOrdersService,
    cancelOrderService,
    confirmPaymentService,
} from '../services/orderServices'
import { useCart } from '../context/cartContex'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const Orders = () => {
    const { addToCart } = useCart()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [reordering, setReordering] = useState(null)
    // Modal reporte
    const [reportModalOpen, setReportModalOpen] = useState(false)
    const [selectedOrderId, setSelectedOrderId] = useState(null)
    const [paymentReference, setPaymentReference] = useState('')
    const [reporting, setReporting] = useState(false)
    // Polling
    const [previousOrders, setPreviousOrders] = useState([])
    const pollingRef = useRef(null)
    const isPollingRef = useRef(false)

    useEffect(() => {
        const init = async () => {
            await loadOrders()
            startPolling()
        }
        init()

        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current)
        }
    }, [])

    const loadOrders = async () => {
        try {
            const response = await getUserOrdersService()
            if (response.success) {
                setOrders(response.orders)
                setPreviousOrders(response.orders)
            }
        } catch (error) {
            console.error('Error al cargar órdenes:', error)
            toast.error('Error al cargar tus pedidos')
        } finally {
            setLoading(false)
        }
    }

    const checkForUpdates = async () => {
        if (isPollingRef.current) return
        isPollingRef.current = true
        try {
            const response = await getUserOrdersService()
            if (response.success) {
                const newOrders = response.orders
                if (previousOrders.length > 0) {
                    newOrders.forEach((newOrder) => {
                        const oldOrder = previousOrders.find(
                            (o) => o.id === newOrder.id,
                        )
                        if (oldOrder) {
                            if (oldOrder.status !== newOrder.status) {
                                toast.success(
                                    `🔄 Orden #${newOrder.id}: estado cambió a "${newOrder.status}"`,
                                )
                            }
                            if (
                                oldOrder.paymentStatus !==
                                newOrder.paymentStatus
                            ) {
                                toast.success(
                                    `💰 Orden #${newOrder.id}: pago cambió a "${newOrder.paymentStatus}"`,
                                )
                            }
                        }
                    })
                }
                setOrders(newOrders)
                setPreviousOrders(newOrders)
            }
        } catch (error) {
            console.error('Error en polling:', error)
        } finally {
            isPollingRef.current = false
        }
    }

    const startPolling = () => {
        if (pollingRef.current) clearInterval(pollingRef.current)
        pollingRef.current = setInterval(() => {
            if (!document.hidden && !loading) {
                checkForUpdates()
            }
        }, 30000)
    }

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (pollingRef.current) clearInterval(pollingRef.current)
                pollingRef.current = null
            } else {
                startPolling()
                checkForUpdates()
            }
        }
        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => {
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            )
        }
    }, [loading])

    // --- Funciones auxiliares (iguales a las anteriores) ---
    const handleCancel = async (orderId) => {
        if (!window.confirm('¿Estás seguro de cancelar este pedido?')) return
        try {
            const response = await cancelOrderService(orderId)
            if (response.success) {
                toast.success('Pedido cancelado')
                loadOrders()
            } else {
                toast.error(response.message || 'Error al cancelar')
            }
        } catch (error) {
            console.error(error)
            toast.error('Error al cancelar pedido')
        }
    }

    const handleReorder = async (order) => {
        setReordering(order.id)
        try {
            for (const item of order.products) {
                const product = item.product
                if (product) {
                    await addToCart(product, item.quantity)
                }
            }
            toast.success('Productos agregados al carrito')
        } catch (error) {
            console.error(error)
            toast.error('Error al agregar productos al carrito')
        } finally {
            setReordering(null)
        }
    }

    const openReportModal = (orderId) => {
        setSelectedOrderId(orderId)
        setPaymentReference('')
        setReportModalOpen(true)
    }

    const handleReportPayment = async () => {
        if (!paymentReference.trim()) {
            toast.error('Por favor ingresa la referencia de pago')
            return
        }
        setReporting(true)
        try {
            const response = await confirmPaymentService(
                selectedOrderId,
                paymentReference,
            )
            if (response.success) {
                toast.success('Pago reportado correctamente')
                setReportModalOpen(false)
                loadOrders()
            } else {
                toast.error(response.message || 'Error al reportar pago')
            }
        } catch (error) {
            console.error(error)
            toast.error('Error al reportar pago')
        } finally {
            setReporting(false)
        }
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
        const tooltips = {
            pending: 'Esperando confirmación de pago',
            in_process: 'Pago reportado, en revisión',
            approved: 'Pedido aprobado',
            rejected: 'Pedido rechazado',
            cancelled: 'Cancelado',
        }
        return (
            <div className="tooltip" data-tip={tooltips[status] || ''}>
                <span
                    className={`badge ${badges[status] || 'badge-ghost'} badge-sm`}
                >
                    {texts[status] || status}
                </span>
            </div>
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
            pending_review: 'Pendiente revisión',
            approved: 'Aprobado',
            rejected: 'Rechazado',
        }
        const tooltips = {
            pending: 'Aún no se ha reportado el pago',
            pending_review: 'Pago reportado, pendiente de revisión',
            approved: 'Pago aprobado',
            rejected: 'Pago rechazado',
        }
        return (
            <div className="tooltip" data-tip={tooltips[status] || ''}>
                <span
                    className={`badge ${badges[status] || 'badge-ghost'} badge-sm`}
                >
                    {texts[status] || status}
                </span>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Mis Pedidos</h1>

            {/* Leyenda de estados */}
            <div className="bg-base-200 p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">Estados de pedido:</h3>
                <div className="flex flex-wrap gap-4 text-sm">
                    <div
                        className="tooltip"
                        data-tip="Esperando confirmación de pago"
                    >
                        <span className="badge badge-warning badge-sm">
                            Pendiente
                        </span>
                    </div>
                    <div
                        className="tooltip"
                        data-tip="Pago reportado, en revisión"
                    >
                        <span className="badge badge-info badge-sm">
                            En revisión
                        </span>
                    </div>
                    <div className="tooltip" data-tip="Pedido aprobado">
                        <span className="badge badge-success badge-sm">
                            Aprobado
                        </span>
                    </div>
                    <div className="tooltip" data-tip="Pedido rechazado">
                        <span className="badge badge-error badge-sm">
                            Rechazado
                        </span>
                    </div>
                    <div className="tooltip" data-tip="Cancelado">
                        <span className="badge badge-ghost badge-sm">
                            Cancelado
                        </span>
                    </div>
                </div>
                <h3 className="font-semibold mt-3 mb-2">Estados de pago:</h3>
                <div className="flex flex-wrap gap-4 text-sm">
                    <div
                        className="tooltip"
                        data-tip="Aún no se ha reportado el pago"
                    >
                        <span className="badge badge-warning badge-sm">
                            Pendiente
                        </span>
                    </div>
                    <div
                        className="tooltip"
                        data-tip="Pago reportado, pendiente de revisión"
                    >
                        <span className="badge badge-info badge-sm">
                            Pendiente revisión
                        </span>
                    </div>
                    <div className="tooltip" data-tip="Pago aprobado">
                        <span className="badge badge-success badge-sm">
                            Aprobado
                        </span>
                    </div>
                    <div className="tooltip" data-tip="Pago rechazado">
                        <span className="badge badge-error badge-sm">
                            Rechazado
                        </span>
                    </div>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No tienes pedidos aún</p>
                    <Link to="/" className="btn btn-primary">
                        Ir a comprar
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="card bg-base-100 shadow-lg"
                        >
                            <div className="card-body">
                                <div className="flex justify-between items-start flex-wrap gap-2">
                                    <div>
                                        <h2 className="card-title">
                                            Orden #{order.id}
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            {new Date(
                                                order.createdAt,
                                            ).toLocaleDateString('es-ES', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getStatusBadge(order.status)}
                                        {getPaymentBadge(order.paymentStatus)}
                                    </div>
                                </div>

                                <div className="divider"></div>

                                <div className="space-y-2">
                                    {order.products?.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between items-center"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={
                                                        item.product
                                                            ?.imageUrl ||
                                                        '/placeholder.jpg'
                                                    }
                                                    alt={item.product?.name}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                                <div>
                                                    <p className="font-medium">
                                                        {item.product?.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Cantidad:{' '}
                                                        {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="font-semibold">
                                                ${item.price * item.quantity}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="divider"></div>

                                <div className="flex justify-between items-center flex-wrap gap-2">
                                    <div>
                                        <p className="text-sm">
                                            <strong>Método de pago:</strong>{' '}
                                            {order.paymentMethod ===
                                            'pago_movil'
                                                ? 'Pago Móvil'
                                                : 'Transferencia'}
                                        </p>
                                        {order.paymentReference && (
                                            <p className="text-sm">
                                                <strong>Referencia:</strong>{' '}
                                                {order.paymentReference}
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-xl font-bold">
                                        Total: ${order.totalAmount}
                                    </p>
                                </div>

                                {/* Botones de acción */}
                                <div className="flex justify-end gap-2 mt-4">
                                    {order.status === 'pending' ||
                                    order.status === 'in_process' ? (
                                        <button
                                            onClick={() =>
                                                handleCancel(order.id)
                                            }
                                            className="btn btn-sm btn-outline btn-error"
                                        >
                                            Cancelar pedido
                                        </button>
                                    ) : null}

                                    <button
                                        onClick={() => handleReorder(order)}
                                        disabled={reordering === order.id}
                                        className="btn btn-sm btn-primary"
                                    >
                                        {reordering === order.id ? (
                                            <>
                                                <span className="loading loading-spinner loading-xs"></span>
                                                Agregando...
                                            </>
                                        ) : (
                                            'Volver a comprar'
                                        )}
                                    </button>

                                    {order.paymentStatus === 'pending' && (
                                        <button
                                            onClick={() =>
                                                openReportModal(order.id)
                                            }
                                            className="btn btn-sm btn-info"
                                        >
                                            Reportar pago
                                        </button>
                                    )}
                                </div>

                                {order.paymentStatus === 'pending_review' && (
                                    <div className="alert alert-info mt-4">
                                        <span>
                                            ⏳ Tu pago está siendo revisado. Te
                                            notificaremos cuando sea aprobado.
                                        </span>
                                    </div>
                                )}

                                {order.paymentStatus === 'approved' && (
                                    <div className="alert alert-success mt-4">
                                        <span>
                                            ✅ Pago aprobado. ¡Gracias por tu
                                            compra!
                                        </span>
                                    </div>
                                )}

                                {order.paymentStatus === 'rejected' && (
                                    <div className="alert alert-error mt-4">
                                        <span>
                                            ❌ Pago rechazado. Por favor
                                            contacta con soporte.
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal para reportar pago */}
            <dialog
                id="report_payment_modal"
                className={`modal ${reportModalOpen ? 'modal-open' : ''}`}
            >
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Reportar pago</h3>
                    <p className="py-2">
                        Ingresa la referencia de tu transferencia o pago móvil
                        para la orden <strong>#{selectedOrderId}</strong>.
                    </p>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">
                                Referencia de pago
                            </span>
                        </label>
                        <input
                            type="text"
                            value={paymentReference}
                            onChange={(e) =>
                                setPaymentReference(e.target.value)
                            }
                            placeholder="Ej: 12345678"
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="modal-action">
                        <button
                            className="btn btn-ghost"
                            onClick={() => setReportModalOpen(false)}
                        >
                            Cancelar
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleReportPayment}
                            disabled={reporting}
                        >
                            {reporting ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                'Enviar'
                            )}
                        </button>
                    </div>
                </div>
                <div
                    className="modal-backdrop"
                    onClick={() => setReportModalOpen(false)}
                ></div>
            </dialog>
        </div>
    )
}

export default Orders
