import { useState, useEffect } from 'react'
import { getUserFavorites } from '../services/favoriteServices'
import CardProduct from '../components/CardProduct/cardProduct'

const Favorites = () => {
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const data = await getUserFavorites()
                console.log('Datos recibidos:', data)
                const products = data.map((fav) => fav.product)
                setFavorites(products)
            } catch (error) {
                console.error('Error al cargar favoritos:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchFavorites()
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        )
    }

    return (
        <div>
            <h1 className="text-4xl font-bold text-center mt-7 mb-2 text-purple-700 uppercase">
                Mis favoritos
            </h1>
            <p className="text-center mb-4">
                {favorites.length} producto(s) guardado(s)
            </p>

            {favorites.length === 0 ? (
                <p className="text-center text-gray-500 py-12">
                    No tienes productos favoritos aún.
                </p>
            ) : (
                <div className="flex flex-wrap justify-center gap-6 px-4">
                    {favorites.map((product) => (
                        <CardProduct key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Favorites
