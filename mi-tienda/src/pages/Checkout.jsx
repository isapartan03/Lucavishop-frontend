import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/cartContex'
import { useUser } from '../context/UserContext'
import { createOrderService } from '../services/orderServices' // Necesitarás crear este servicio
import toast from 'react-hot-toast'

const Checkout = () => {
    const navigate = useNavigate()
    const { cart, total, cleanCart } = useCart()
    const { userInfo } = useUser()
    const [loading, setLoading] = useState(false)
    const [shippingInfo, setShippingInfo] = useState({
        firstName: '',
        lastName: '',
        email: userInfo?.email || '',
        phone: '',
        address: {
            street: '',
            number: '',
            city: '',
            state: '',
            zipCode: '',
        },
    })
    const [paymentMethod, setPaymentMethod] = useState('pago_movil') // o 'transferencia'

    // Si el carrito está vacío, redirigir
    useEffect(() => {
        if (cart.length === 0) {
            navigate('/')
            toast.error('Tu carrito está vacío')
        }
    }, [cart, navigate])

    const handleInputChange = (e) => {
        const { name, value } = e.target

        // Para campos anidados (address)
        if (name.includes('.')) {
            const [parent, child] = name.split('.')
            setShippingInfo((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }))
        } else {
            setShippingInfo((prev) => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Preparar datos para la orden
            const orderData = {
                items: cart.map((item) => ({
                    id: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    name: item.name,
                    imageUrl: item.imageUrl,
                })),
                shippingInfo,
                paymentMethod,
                totalAmount: total,
            }

            // Enviar orden al backend
            const response = await createOrderService(orderData)

            if (response.success) {
                // Vaciar carrito local
                cleanCart()

                // Mostrar instrucciones de pago
                toast.success('Orden creada exitosamente')
                navigate('/order-confirmation', {
                    state: {
                        order: response.order,
                        paymentInstructions: response.paymentInstructions,
                    },
                })
            }
        } catch (error) {
            console.error('Error al crear orden:', error)
            toast.error('Error al procesar el pedido')
        } finally {
            setLoading(false)
        }
    }

    // Resumen de productos
    const renderProductSummary = () => (
        <div className="bg-base-200 p-4 rounded-lg mb-4">
            <h3 className="font-bold text-lg mb-3">Resumen del pedido</h3>
            {cart.map((item) => (
                <div
                    key={item.id}
                    className="flex justify-between items-center mb-2"
                >
                    <div className="flex items-center gap-2">
                        <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">
                                Cantidad: {item.quantity}
                            </p>
                        </div>
                    </div>
                    <p className="font-semibold">
                        ${item.price * item.quantity}
                    </p>
                </div>
            ))}
            <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${total}</span>
                </div>
            </div>
        </div>
    )

    // Formulario de información de envío
    const renderShippingForm = () => (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    name="firstName"
                    placeholder="Nombre"
                    value={shippingInfo.firstName}
                    onChange={handleInputChange}
                    required
                    className="input input-bordered w-full"
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Apellido"
                    value={shippingInfo.lastName}
                    onChange={handleInputChange}
                    required
                    className="input input-bordered w-full"
                />
            </div>

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={shippingInfo.email}
                onChange={handleInputChange}
                required
                className="input input-bordered w-full"
            />

            <input
                type="tel"
                name="phone"
                placeholder="Teléfono"
                value={shippingInfo.phone}
                onChange={handleInputChange}
                required
                className="input input-bordered w-full"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <input
                    type="text"
                    name="address.street"
                    placeholder="Calle"
                    value={shippingInfo.address.street}
                    onChange={handleInputChange}
                    required
                    className="input input-bordered col-span-2"
                />
                <input
                    type="text"
                    name="address.number"
                    placeholder="Número"
                    value={shippingInfo.address.number}
                    onChange={handleInputChange}
                    required
                    className="input input-bordered"
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <input
                    type="text"
                    name="address.city"
                    placeholder="Ciudad"
                    value={shippingInfo.address.city}
                    onChange={handleInputChange}
                    required
                    className="input input-bordered"
                />
                <input
                    type="text"
                    name="address.state"
                    placeholder="Estado"
                    value={shippingInfo.address.state}
                    onChange={handleInputChange}
                    required
                    className="input input-bordered"
                />
                <input
                    type="text"
                    name="address.zipCode"
                    placeholder="Código Postal"
                    value={shippingInfo.address.zipCode}
                    onChange={handleInputChange}
                    required
                    className="input input-bordered"
                />
            </div>

            {/* Método de pago */}
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Método de pago</span>
                </label>
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="select select-bordered w-full"
                >
                    <option value="pago_movil">Pago Móvil</option>
                    <option value="transferencia">
                        Transferencia Bancaria
                    </option>
                </select>
            </div>

            {/* Instrucciones de pago según el método */}
            {paymentMethod === 'pago_movil' && (
                <div className="alert alert-info">
                    <p className="text-sm">
                        <strong>Instrucciones para Pago Móvil:</strong>
                        <br />
                        Banco: [Banco de la tienda]
                        <br />
                        Teléfono: 0412-1234567
                        <br />
                        Cédula/RIF: V-12345678
                        <br />
                        Referencia: Colocar el número de orden
                    </p>
                </div>
            )}

            {paymentMethod === 'transferencia' && (
                <div className="alert alert-info">
                    <p className="text-sm">
                        <strong>Instrucciones para Transferencia:</strong>
                        <br />
                        Banco: [Banco de la tienda]
                        <br />
                        Cuenta: 0102-1234-56-12345678
                        <br />
                        Titular: Mi Tienda C.A.
                        <br />
                        RIF: J-12345678-9
                        <br />
                        Referencia: Colocar el número de orden
                    </p>
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
            >
                {loading ? 'Procesando...' : 'Confirmar pedido'}
            </button>
        </form>
    )

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">Finalizar compra</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Columna izquierda: Formulario (2/3 del ancho) */}
                <div className="md:col-span-2">{renderShippingForm()}</div>

                {/* Columna derecha: Resumen (1/3 del ancho) */}
                <div className="md:col-span-1">{renderProductSummary()}</div>
            </div>
        </div>
    )
}

export default Checkout
