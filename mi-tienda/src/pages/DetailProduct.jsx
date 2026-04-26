import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useProduct } from '../context/productContext'
import { useCart } from '../context/cartContex'
import { addToCartService } from '../services/cartServices'
import ProductQuestions from '../components/ProductQuestions/ProductQuestions'
import RatingStars from '../components/Rating/RatingStars'
import RatingForm from '../components/Rating/RatingForm'

const DetailProduct = () => {
    const { id } = useParams()
    const { getProductById, product, productLoading } = useProduct()
    const { addToCart, openModal } = useCart()
    const [refresh, setRefresh] = useState(0)

    useEffect(() => {
        getProductById(id)
    }, [id, getProductById, refresh])

    const handleAddToCart = async () => {
        await addToCart(product)
        openModal()
    }

    const handleRatingChange = () => {
        // Recargar el producto para actualizar el rating promedio
        setRefresh((prev) => prev + 1)
    }

    if (productLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mt-6 md:flex md:gap-8">
                {/* Imagen */}
                <div className="md:w-1/2">
                    <img
                        className="w-full rounded-lg shadow-lg object-cover"
                        src={product.imageUrl}
                        alt={product.name}
                    />
                </div>

                {/* Información del producto */}
                <div className="flex flex-col gap-5 pt-6 md:pt-0 md:w-1/2">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        {product.name}
                    </h1>
                    <p className="text-xl badge badge-warning p-4 font-bold">
                        ${product.price?.toLocaleString()}
                    </p>
                    <p className="text-lg text-gray-700">
                        {product.description}
                    </p>

                    {/* Rating promedio */}
                    {product.avgRating > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold">
                                {product.avgRating}
                            </span>
                            <RatingStars
                                rating={parseFloat(product.avgRating)}
                                size="text-md"
                            />
                            <span className="text-gray-500">
                                ({product.totalRatings || 0} calificaciones)
                            </span>
                        </div>
                    )}

                    <button
                        onClick={handleAddToCart}
                        className="btn btn-success mt-2 md:mt-auto md:btn-lg"
                    >
                        Agregar al carrito
                    </button>
                </div>
            </div>

            {/* Sección de calificaciones */}
            <div className="mt-10 border-t pt-6">
                <h2 className="text-2xl font-bold mb-4">Calificaciones</h2>

                {/* Mostrar promedio grande */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="text-4xl font-bold text-primary">
                        {product.avgRating || 0}
                    </div>
                    <div>
                        <RatingStars
                            rating={parseFloat(product.avgRating || 0)}
                            size="text-2xl"
                        />
                        <p className="text-gray-500 mt-1">
                            {product.totalRatings || 0} calificación(es)
                        </p>
                    </div>
                </div>

                {/* Formulario para calificar */}
                <RatingForm
                    productId={id}
                    onRatingChange={handleRatingChange}
                />
            </div>

            {/* Sección de preguntas */}
            <div className="mt-10 border-t pt-6">
                <h2 className="text-2xl font-bold mb-4">
                    Preguntas y respuestas
                </h2>
                <ProductQuestions productId={product.id} />
            </div>
        </div>
    )
}

export default DetailProduct
