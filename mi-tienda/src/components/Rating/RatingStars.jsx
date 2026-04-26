import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

const RatingStars = ({
    rating,
    total = 0,
    size = 'text-sm',
    interactive = false,
    onRate = null,
}) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    const handleClick = (value) => {
        if (interactive && onRate) {
            onRate(value)
        }
    }

    if (!interactive) {
        return (
            <div className="flex items-center gap-1">
                <div className="flex">
                    {[...Array(fullStars)].map((_, i) => (
                        <FaStar
                            key={`full-${i}`}
                            className={`${size} text-yellow-400`}
                        />
                    ))}
                    {hasHalfStar && (
                        <FaStarHalfAlt className={`${size} text-yellow-400`} />
                    )}
                    {[...Array(emptyStars)].map((_, i) => (
                        <FaRegStar
                            key={`empty-${i}`}
                            className={`${size} text-yellow-400`}
                        />
                    ))}
                </div>
                {total > 0 && (
                    <span className="text-xs text-gray-500 ml-1">
                        ({total})
                    </span>
                )}
            </div>
        )
    }

    // Modo interactivo (para calificar)
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    onClick={() => handleClick(star)}
                    className="focus:outline-none"
                >
                    {star <= rating ? (
                        <FaStar
                            className={`${size} text-yellow-400 hover:scale-110 transition-transform`}
                        />
                    ) : (
                        <FaRegStar
                            className={`${size} text-yellow-400 hover:scale-110 transition-transform`}
                        />
                    )}
                </button>
            ))}
        </div>
    )
}

export default RatingStars
