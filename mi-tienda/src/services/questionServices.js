import axios from 'axios'

const API_URL = process.env.REACT_APP_BACKEND_URL + '/questions'

export const getQuestionsByProduct = async (productId) => {
    const response = await axios.get(
        `${API_URL}/product/${productId}/questions`,
    )
    return response.data
}

export const createQuestion = async (productId, question) => {
    const response = await axios.post(
        `${API_URL}/product/${productId}/questions`,
        { question },
        {
            withCredentials: true,
        },
    )
    return response.data
}

export const createAnswer = async (questionId, answer) => {
    const response = await axios.post(
        `${API_URL}/questions/${questionId}/answer`,
        { answer },
        {
            withCredentials: true,
        },
    )
    return response.data
}

export const deleteQuestion = async (questionId) => {
    const response = await axios.delete(`${API_URL}/questions/${questionId}`, {
        withCredentials: true,
    })
    return response.data
}

export const deleteAnswer = async (answerId) => {
    const response = await axios.delete(`${API_URL}/answers/${answerId}`, {
        withCredentials: true,
    })
    return response.data
}

export const getUserNewAnswers = async (lastCheck) => {
    const url = lastCheck
        ? `${API_URL}/user/new-answers?lastCheck=${lastCheck}`
        : `${API_URL}/user/new-answers`
    const response = await axios.get(url, { withCredentials: true })
    return response.data
}
