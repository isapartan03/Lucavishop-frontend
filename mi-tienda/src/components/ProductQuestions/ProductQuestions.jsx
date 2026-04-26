import { useState, useEffect } from 'react'
import { useUser } from '../../context/UserContext'
import {
    getQuestionsByProduct,
    createQuestion,
    createAnswer,
    deleteQuestion,
    deleteAnswer,
} from '../../services/questionServices'
import toast from 'react-hot-toast'

const ProductQuestions = ({ productId }) => {
    const { userInfo, isAuthenticated } = useUser()
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [newQuestion, setNewQuestion] = useState('')
    const [sending, setSending] = useState(false)
    const [answering, setAnswering] = useState(null)
    const [answerText, setAnswerText] = useState('')

    useEffect(() => {
        loadQuestions()
    }, [productId])

    const loadQuestions = async () => {
        try {
            const response = await getQuestionsByProduct(productId)
            if (response.success) {
                setQuestions(response.questions)
            }
        } catch (error) {
            console.error('Error al cargar preguntas:', error)
            toast.error('Error al cargar preguntas')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmitQuestion = async (e) => {
        e.preventDefault()
        if (!newQuestion.trim()) {
            toast.error('Escribe una pregunta')
            return
        }
        setSending(true)
        try {
            const response = await createQuestion(productId, newQuestion)
            if (response.success) {
                setQuestions((prev) => [response.question, ...prev])
                setNewQuestion('')
                toast.success('Pregunta publicada')
            } else {
                toast.error(response.message || 'Error al publicar pregunta')
            }
        } catch (error) {
            console.error(error)
            toast.error('Error al publicar pregunta')
        } finally {
            setSending(false)
        }
    }

    const handleAnswer = async (questionId) => {
        if (!answerText.trim()) {
            toast.error('Escribe una respuesta')
            return
        }
        setAnswering(questionId)
        try {
            const response = await createAnswer(questionId, answerText)
            if (response.success) {
                // Actualizar la pregunta localmente con la nueva respuesta
                setQuestions((prev) =>
                    prev.map((q) =>
                        q.id === questionId
                            ? { ...q, answer: response.answer }
                            : q,
                    ),
                )
                setAnswerText('')
                toast.success('Respuesta publicada')
            } else {
                toast.error(response.message || 'Error al responder')
            }
        } catch (error) {
            console.error(error)
            toast.error('Error al responder')
        } finally {
            setAnswering(null)
        }
    }

    const handleDeleteQuestion = async (questionId) => {
        if (!window.confirm('¿Eliminar esta pregunta?')) return
        try {
            const response = await deleteQuestion(questionId)
            if (response.success) {
                setQuestions((prev) => prev.filter((q) => q.id !== questionId))
                toast.success('Pregunta eliminada')
            } else {
                toast.error(response.message || 'Error')
            }
        } catch (error) {
            console.error(error)
            toast.error('Error al eliminar')
        }
    }

    const handleDeleteAnswer = async (answerId, questionId) => {
        if (!window.confirm('¿Eliminar esta respuesta?')) return
        try {
            const response = await deleteAnswer(answerId)
            if (response.success) {
                setQuestions((prev) =>
                    prev.map((q) =>
                        q.id === questionId ? { ...q, answer: null } : q,
                    ),
                )
                toast.success('Respuesta eliminada')
            } else {
                toast.error(response.message || 'Error')
            }
        } catch (error) {
            console.error(error)
            toast.error('Error al eliminar')
        }
    }

    if (loading) {
        return <div className="text-center py-4">Cargando preguntas...</div>
    }

    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Preguntas y respuestas</h3>

            {/* Formulario para preguntar (solo usuarios autenticados) */}
            {isAuthenticated() ? (
                <form onSubmit={handleSubmitQuestion} className="mb-6">
                    <textarea
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Escribe tu pregunta..."
                        className="textarea textarea-bordered w-full"
                        rows="2"
                        disabled={sending}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary btn-sm mt-2"
                        disabled={sending}
                    >
                        {sending ? 'Publicando...' : 'Preguntar'}
                    </button>
                </form>
            ) : (
                <div className="alert alert-info mb-4">
                    <span>Inicia sesión para hacer una pregunta.</span>
                </div>
            )}

            {/* Lista de preguntas */}
            {questions.length === 0 ? (
                <p className="text-gray-500">
                    No hay preguntas aún. Sé el primero en preguntar.
                </p>
            ) : (
                <div className="space-y-4">
                    {questions.map((q) => (
                        <div
                            key={q.id}
                            className="border rounded-lg p-4 bg-base-200"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">
                                        {q.user?.username ||
                                            'Usuario eliminado'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(
                                            q.createdAt,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                {userInfo?.isAdmin && (
                                    <button
                                        onClick={() =>
                                            handleDeleteQuestion(q.id)
                                        }
                                        className="btn btn-xs btn-ghost text-error"
                                    >
                                        Eliminar
                                    </button>
                                )}
                            </div>
                            <p className="mt-2">{q.question}</p>

                            {/* Respuesta */}
                            {q.answer ? (
                                <div className="mt-3 pl-4 border-l-4 border-primary">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-semibold text-primary">
                                            {q.answer.user?.username ||
                                                'Administrador'}{' '}
                                            respondió:
                                        </p>
                                        {userInfo?.isAdmin && (
                                            <button
                                                onClick={() =>
                                                    handleDeleteAnswer(
                                                        q.answer.id,
                                                        q.id,
                                                    )
                                                }
                                                className="btn btn-xs btn-ghost text-error"
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </div>
                                    <p className="mt-1">{q.answer.answer}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(
                                            q.answer.createdAt,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            ) : (
                                // Mostrar formulario para responder si es admin
                                userInfo?.isAdmin && (
                                    <div className="mt-3">
                                        {answering === q.id ? (
                                            <div>
                                                <textarea
                                                    value={answerText}
                                                    onChange={(e) =>
                                                        setAnswerText(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Escribe tu respuesta..."
                                                    className="textarea textarea-bordered w-full"
                                                    rows="2"
                                                />
                                                <div className="flex gap-2 mt-2">
                                                    <button
                                                        onClick={() =>
                                                            handleAnswer(q.id)
                                                        }
                                                        className="btn btn-xs btn-primary"
                                                    >
                                                        Responder
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setAnswering(null)
                                                        }
                                                        className="btn btn-xs btn-ghost"
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    setAnswering(q.id)
                                                }
                                                className="btn btn-xs btn-outline"
                                            >
                                                Responder
                                            </button>
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProductQuestions
