import { useState, useEffect } from 'react'
import RatingStars from './RatingStars'
import { rateProduct, getUserRating } from '../../services/ratingServices'
import toast from 'react-hot-toast'

const RatingForm = ({ productId, onRatingChange }) => {
    const [userRating, setUserRating] = useState(0)
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [hasRated, setHasRated] = useState(false)

    // Cargar calificación existente del usuario
    useEffect(() => {
        const loadUserRating = async () => {
            try {
                setLoading(true)
                const rating = await getUserRating(productId)
                if (rating) {
                    setUserRating(rating)
                    setHasRated(true)
                }
            } catch (error) {
                console.error('Error al cargar calificación:', error)
            } finally {
                setLoading(false)
            }
        }
        loadUserRating()
    }, [productId])

    const handleRate = async (ratingValue) => {
        if (hasRated) {
            toast.error('Ya calificaste este producto')
            return
        }

        setUserRating(ratingValue)

        // Si el rating es 5 estrellas, preguntar por comentario
        if (ratingValue === 5) {
            // Solo mostrar el textarea, no enviar aún
            return
        }

        // Para ratings menores a 5, enviar directamente sin comentario
        await submitRating(ratingValue, '')
    }

    const submitRating = async (ratingValue, commentText) => {
        setSubmitting(true)
        try {
            await rateProduct(productId, ratingValue, commentText)
            setHasRated(true)
            toast.success('¡Gracias por tu calificación!')
            if (onRatingChange) onRatingChange()
        } catch (error) {
            toast.error('Error al guardar calificación')
            console.error(error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleSubmitWithComment = async () => {
        if (!comment.trim()) {
            toast.error('Por favor, escribe un comentario')
            return
        }
        await submitRating(userRating, comment)
    }

    if (loading) {
        return (
            <div className="text-center py-2">Cargando tu calificación...</div>
        )
    }

    if (hasRated) {
        return (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-green-700 font-medium">
                    ✅ Ya calificaste este producto
                </p>
                <div className="mt-2">
                    <RatingStars rating={userRating} size="text-sm" />
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-3">
                ¿Qué te pareció este producto?
            </h3>

            <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-600">Tu calificación:</span>
                <RatingStars
                    rating={userRating}
                    interactive={true}
                    onRate={handleRate}
                    size="text-2xl"
                />
            </div>

            {/* Mostrar textarea solo si se seleccionó 5 estrellas */}
            {userRating === 5 && (
                <div className="mt-3">
                    <textarea
                        className="textarea textarea-bordered w-full"
                        rows="3"
                        placeholder="¡Cuéntanos qué te gustó del producto! (opcional)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                        onClick={handleSubmitWithComment}
                        disabled={submitting}
                        className="btn btn-primary btn-sm mt-2"
                    >
                        {submitting ? 'Enviando...' : 'Enviar calificación'}
                    </button>
                </div>
            )}

            {userRating > 0 && userRating < 5 && (
                <p className="text-sm text-gray-500 mt-2">
                    Gracias por tu calificación de {userRating} estrellas.
                </p>
            )}
        </div>
    )
}

export default RatingForm
