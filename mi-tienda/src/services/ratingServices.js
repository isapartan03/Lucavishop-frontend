import axios from 'axios'

const API_URL = process.env.REACT_APP_BACKEND_URL + '/ratings'

export const getProductRating = async (productId) => {
    const response = await axios.get(`${API_URL}/product/${productId}`)
    return response.data
}

export const getUserRating = async (productId) => {
    const response = await axios.get(`${API_URL}/product/${productId}/my`, {
        withCredentials: true,
    })
    return response.data.rating
}

export const rateProduct = async (productId, rating, comment) => {
    const response = await axios.post(
        `${API_URL}/product/${productId}`,
        { rating, comment },
        { withCredentials: true },
    )
    return response.data
}

export const deleteRating = async (productId) => {
    const response = await axios.delete(`${API_URL}/product/${productId}`, {
        withCredentials: true,
    })
    return response.data
}
