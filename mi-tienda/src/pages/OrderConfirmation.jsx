import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { confirmPaymentService } from '../services/orderServices'
import toast from 'react-hot-toast'

const OrderConfirmation = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { order, paymentInstructions } = location.state || {}
    const [reference, setReference] = useState('')
    const [loading, setLoading] = useState(false)

    if (!order) {
        navigate('/')
        return null
    }

    const handleConfirmPayment = async () => {
        if (!reference.trim()) {
            toast.error('Por favor ingresa la referencia de pago')
            return
        }
        setLoading(true)
        try {
            const response = await confirmPaymentService(order.id, reference)
            if (response.success) {
                toast.success('Pago reportado. Espera confirmación.')
                navigate('/orders') // o a donde quieras
            }
        } catch (error) {
            toast.error('Error al reportar pago')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-2xl font-bold mb-4">¡Gracias por tu compra!</h1>
            <div className="bg-base-200 p-4 rounded-lg mb-4">
                <p>
                    <strong>Número de orden:</strong> {order.id}
                </p>
                <p>
                    <strong>Total:</strong> ${order.totalAmount}
                </p>
                <p>
                    <strong>Método de pago:</strong>{' '}
                    {order.paymentMethod === 'pago_movil'
                        ? 'Pago Móvil'
                        : 'Transferencia'}
                </p>
            </div>

            {paymentInstructions && (
                <div className="alert alert-info mb-4">
                    <h2 className="font-bold text-lg">Instrucciones de pago</h2>
                    <ul className="list-disc list-inside mt-2">
                        {paymentInstructions.steps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="form-control">
                <label className="label">
                    <span className="label-text">
                        Referencia de pago (número de comprobante)
                    </span>
                </label>
                <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Ej: 12345678"
                    className="input input-bordered"
                />
            </div>

            <button
                onClick={handleConfirmPayment}
                disabled={loading}
                className="btn btn-primary mt-4"
            >
                {loading ? 'Procesando...' : 'Ya realicé el pago'}
            </button>
        </div>
    )
}

export default OrderConfirmation
