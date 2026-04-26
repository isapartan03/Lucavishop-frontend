import CardProduct from '../components/CardProduct/cardProduct'
import { useProduct } from '../context/productContext'

const Home = () => {
    const { products, productsLoading, error } = useProduct()
    return (
        <div>
            <p className="text-center mb-4">Elige tus productos ⬇</p>
            <div className="flex flex-wrap gap-5 justify-center">
                {productsLoading ? (
                    <div className="loading loading-spinner"></div>
                ) : error ? (
                    <p>Error al cargar los productos</p>
                ) : (
                    products.map((product) => (
                        <CardProduct key={product.id} product={product} />
                    ))
                )}
            </div>
        </div>
    )
}

export default Home
