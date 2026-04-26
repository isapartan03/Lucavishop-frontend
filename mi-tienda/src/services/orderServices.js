import axios from 'axios'

const API_URL = process.env.REACT_APP_BACKEND_URL + '/orders'

export const createOrderService = async (orderData) => {
    try {
        const response = await axios.post(`${API_URL}/create`, orderData, {
            withCredentials: true,
        })
        return response.data
    } catch (error) {
        console.error('Error al crear orden:', error)
        throw error
    }
}

export const confirmPaymentService = async (orderId, paymentReference) => {
    try {
        const response = await axios.post(
            `${API_URL}/${orderId}/confirm-payment`,
            {
                paymentReference,
            },
            {
                withCredentials: true,
            },
        )
        return response.data
    } catch (error) {
        console.error('Error al confirmar pago:', error)
        throw error
    }
}

export const getUserOrdersService = async () => {
    try {
        const response = await axios.get(`${API_URL}/user`, {
            withCredentials: true,
        })
        return response.data
    } catch (error) {
        console.error('Error al obtener órdenes:', error)
        throw error
    }
}

export const getOrderByIdService = async (orderId) => {
    try {
        const response = await axios.get(`${API_URL}/${orderId}`, {
            withCredentials: true,
        })
        return response.data
    } catch (error) {
        console.error('Error al obtener orden:', error)
        throw error
    }
}
export const getAllOrdersService = async () => {
    const response = await axios.get(`${API_URL}/admin/all`, {
        withCredentials: true,
    })
    return response.data
}

export const updateOrderStatusService = async (orderId, data) => {
    const response = await axios.put(
        `${API_URL}/admin/${orderId}/status`,
        data,
        {
            withCredentials: true,
        },
    )
    return response.data
}

export const cancelOrderService = async (orderId) => {
    const response = await axios.put(
        `${API_URL}/${orderId}/cancel`,
        {},
        {
            withCredentials: true,
        },
    )
    return response.data
}

export const sendInvoiceEmail = async (orderId) => {
    const response = await axios.post(
        `${API_URL}/${orderId}/send-invoice`,
        {},
        { withCredentials: true },
    )
    return response.data
}

export const getPendingOrdersCount = async () => {
    const response = await axios.get(`${API_URL}/admin/pending-count`, {
        withCredentials: true,
    })
    return response.data
}

export const getSalesStats = async () => {
    const response = await axios.get(`${API_URL}/sales-stats`, {
        withCredentials: true,
    })
    return response.data
}

export const getTopProducts = async (limit = 10) => {
    const response = await axios.get(`${API_URL}/top-products?limit=${limit}`, {
        withCredentials: true,
    })
    return response.data
}
