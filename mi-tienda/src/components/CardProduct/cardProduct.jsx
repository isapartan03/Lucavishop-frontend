import { Link } from 'react-router'
import { useUser } from '../../context/UserContext'
import { useCart } from '../../context/cartContex'
import { FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa'
import RatingStars from '../Rating/RatingStars'
import { useState, useEffect } from 'react'
import {
    checkFavorite,
    addFavorite,
    removeFavorite,
} from '../../services/favoriteServices'
import toast from 'react-hot-toast'

const CardProduct = ({
    product: {
        id,
        name,
        price,
        imageUrl,
        description,
        stock,
        avgRating,
        totalRatings,
    },
}) => {
    const { isAuthenticated, userInfo } = useUser()
    const { addToCart, loading, openModal } = useCart()
    // Estado para favoritos
    const [isFavorite, setIsFavorite] = useState(false)
    const [loadingFavorite, setLoadingFavorite] = useState(false)

    useEffect(() => {
        if (userInfo?.id) {
            checkFavorite(id).then(setIsFavorite).catch(console.error)
        }
    }, [id, userInfo])

    const handleAddToCart = async () => {
        await addToCart({
            id,
            name,
            price,
            imageUrl,
            description,
            stock,
            avgRating,
            totalRatings,
        })
        openModal() //abrir el modal del carrito después de agregar el producto
    }

    const toggleFavorite = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!userInfo?.id) {
            toast.error('Inicia sesión para guardar favoritos')
            return
        }

        setLoadingFavorite(true)
        try {
            if (isFavorite) {
                await removeFavorite(id)
                setIsFavorite(false)
                toast.success('Eliminado de favoritos')
            } else {
                await addFavorite(id)
                setIsFavorite(true)
                toast.success('Agregado a favoritos')
            }
        } catch (error) {
            toast.error('Error al guardar favorito')
        } finally {
            setLoadingFavorite(false)
        }
    }

    return (
        <div className="card bg-base-100 w-80 lg:w-[30%] shadow-lg relative">
            <button
                onClick={toggleFavorite}
                disabled={loadingFavorite}
                className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white shadow-md hover:scale-110 transition-transform"
            >
                {isFavorite ? (
                    <FaHeart className="text-red-500 text-xl" />
                ) : (
                    <FaRegHeart className="text-gray-500 text-xl" />
                )}
            </button>

            <figure>
                <img
                    className="aspect-[9/9] object-cover"
                    src={imageUrl}
                    alt={name}
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{name}</h2>
                <div className="badge badge-warning">
                    ${price?.toLocaleString()}
                </div>
                <div className="mt-1">
                    <RatingStars
                        rating={avgRating || 0}
                        total={totalRatings || 0}
                        size="text-xs"
                    />
                </div>
                <p>{description?.substring(0, 60)}...</p>
                <div className="card-actions justify-between mt-4">
                    <Link
                        to={`/detailProduct/${id}`}
                        className="btn btn-info btn-sm md:btn-md"
                    >
                        Ver detalles
                    </Link>
                    <button
                        onClick={handleAddToCart}
                        disabled={loading || stock === 0}
                        className="btn btn-success btn-sm md:btn-md"
                    >
                        <FaShoppingCart size={16} />
                        {stock === 0 ? 'Sin stock' : 'Agregar'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CardProduct
