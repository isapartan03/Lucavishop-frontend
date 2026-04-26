import axios from 'axios'
const API_URL = process.env.REACT_APP_BACKEND_URL + '/users'

export const getUserCount = async () => {
    const response = await axios.get(`${API_URL}/count`, {
        withCredentials: true,
    })
    return response.data
}
export const getUsersRegisteredToday = async () => {
    const response = await axios.get(`${API_URL}/today-count`, {
        withCredentials: true,
    })
    return response.data
}
