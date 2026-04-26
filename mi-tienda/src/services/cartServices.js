import axios from 'axios'

//Confioguracion base de axios

const API_URL = process.env.REACT_APP_BACKEND_URL + '/cart'

axios.defaults.withCredentials = true

//Servicio para agregar producto del carrito

export const addToCartService = async (userId, productId, quantity = 1) => {
    try {
        const response = await axios.post(`${API_URL}/add`, {
            userId,
            productId,
            quantity,
        })
        return response.data
    } catch (error) {
        throw new Error('Erros al agregar producto alk acrrito ')
    }
}

// Seervicio para obtener el carrito de usuario

export const getCartService = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/get/${userId}`)
        return response.data
    } catch (error) {
        throw new Error('Error al obtener carrito')
    }
}

//Actualizar la cantidad de un producti en el carrito
export const updateCartService = async (userId, productId, quantity) => {
    try {
        const response = await axios.put(`${API_URL}/update/${userId}`, {
            productId,
            quantity,
        })
        return response.data
    } catch (error) {
        throw new Error('Error al actualizar la cantidad en el carrito')
    }
}

//Servicio para eliminar un producto del carrito
export const removeFromCartService = async (userId, productId) => {
    try {
        const response = await axios.delete(
            `${API_URL}/removeProduct/${userId}`,
            {
                data: { productId },
            },
        )

        return response.data
    } catch (error) {
        throw new Error('Error al eliminar un producto del carrito')
    }
}

//Para limpiar el carrito
export const clearCartService = async (userId) => {
    try {
        const response = await axios.delete(`${API_URL}/clear/${userId}`)
        return response.data
    } catch (error) {
        throw new Error('Error al vaciar el carrito')
    }
}
//Servicio para obtener el total del carrito
export const getCartTotalService = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/total/${userId}`)
        return response.data
    } catch (error) {
        throw new Error('Error al vaciar el carrito')
    }
}
