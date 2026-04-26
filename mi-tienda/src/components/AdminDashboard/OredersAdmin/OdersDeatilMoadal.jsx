// src/components/AdminDashboard/OrdersAdmin/OrderDetailModal.jsx
const OrderDetailModal = ({
    order,
    isOpen,
    onClose,
    onApproveOrder,
    onCancelOrder,
}) => {
    if (!order) return null

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const isActionable =
        order.status !== 'approved' &&
        order.status !== 'rejected' &&
        order.status !== 'cancelled'

    return (
        <dialog
            id="order_modal"
            className={`modal ${isOpen ? 'modal-open' : ''}`}
        >
            <div className="modal-box max-w-4xl">
                <h3 className="font-bold text-lg mb-4">
                    Detalles de la orden #{order.id}
                </h3>

                {/* Información general (igual que antes) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold">Información general</h4>
                        <p>
                            <strong>Fecha:</strong>{' '}
                            {formatDate(order.createdAt)}
                        </p>
                        <p>
                            <strong>Total:</strong> ${order.totalAmount}
                        </p>
                        <p>
                            <strong>Estado pedido:</strong> {order.status}
                        </p>
                        <p>
                            <strong>Estado pago:</strong> {order.paymentStatus}
                        </p>
                        <p>
                            <strong>Método pago:</strong>{' '}
                            {order.paymentMethod === 'pago_movil'
                                ? 'Pago Móvil'
                                : 'Transferencia'}
                        </p>
                        {order.paymentReference && (
                            <p>
                                <strong>Referencia pago:</strong>{' '}
                                {order.paymentReference}
                            </p>
                        )}
                    </div>

                    <div>
                        <h4 className="font-semibold">Cliente</h4>
                        <p>
                            <strong>Usuario:</strong>{' '}
                            {order.user?.username || 'Usuario eliminado'}
                        </p>
                        <p>
                            <strong>Email:</strong>{' '}
                            {order.user?.email || order.shippingEmail}
                        </p>
                    </div>

                    <div className="col-span-full">
                        <h4 className="font-semibold">Dirección de envío</h4>
                        <p>
                            {order.shippingFirstName} {order.shippingLastName}
                            <br />
                            {order.shippingStreet} {order.shippingNumber}
                            <br />
                            {order.shippingCity}, {order.shippingState}{' '}
                            {order.shippingZipCode}
                            <br />
                            Tel: {order.shippingPhone}
                            <br />
                            Email: {order.shippingEmail}
                        </p>
                    </div>

                    {/* Productos */}
                    <div className="col-span-full">
                        <h4 className="font-semibold mb-2">Productos</h4>
                        <div className="overflow-x-auto">
                            <table className="table table-xs">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio unit.</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.products?.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                {item.product?.name ||
                                                    item.name}
                                            </td>
                                            <td>{item.quantity}</td>
                                            <td>${item.price}</td>
                                            <td>
                                                ${item.price * item.quantity}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-wrap gap-2 mt-6 justify-end">
                    {isActionable && (
                        <>
                            <button
                                onClick={() => onApproveOrder(order.id)}
                                className="btn btn-success btn-sm"
                            >
                                Aprobar orden
                            </button>
                            <button
                                onClick={() => onCancelOrder(order.id)}
                                className="btn btn-error btn-sm"
                            >
                                Cancelar orden
                            </button>
                        </>
                    )}
                    <button className="btn btn-sm" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </dialog>
    )
}

export default OrderDetailModal
