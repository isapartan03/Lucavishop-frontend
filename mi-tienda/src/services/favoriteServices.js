import axios from 'axios'

const API_URL = process.env.REACT_APP_BACKEND_URL + '/favorites'

export const addFavorite = async (productId) => {
    const response = await axios.post(
        `${API_URL}/${productId}`,
        {},
        { withCredentials: true },
    )
    return response.data
}

export const removeFavorite = async (productId) => {
    const response = await axios.delete(`${API_URL}/${productId}`, {
        withCredentials: true,
    })
    return response.data
}

export const checkFavorite = async (productId) => {
    const response = await axios.get(`${API_URL}/check/${productId}`, {
        withCredentials: true,
    })
    return response.data.isFavorite
}

export const getUserFavorites = async () => {
    const response = await axios.get(API_URL, { withCredentials: true })
    return response.data.favorites
}
