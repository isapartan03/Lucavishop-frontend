import {
    useState,
    useEffect,
    useCallback,
    useContext,
    createContext,
} from 'react'
import axios from 'axios'

axios.defaults.withCredentials = true

const API_URL = process.env.REACT_APP_BACKEND_URL + '/products'

export const ProductContext = createContext({})

export const ProductContextProviader = ({ children }) => {
    const [products, setProducts] = useState([])
    const [productsLoading, setProductsLoading] = useState(true)
    const [product, setProduct] = useState({})
    const [productLoading, setProductLoading] = useState(true)
    const [error, setError] = useState(null)

    //Funcion para obtener productos
    const getProducts = useCallback(async () => {
        try {
            const response = await axios.get(API_URL)
            setProducts(response.data)
        } catch (error) {
            setError(error.message || 'Error al obtener los Productos')
        } finally {
            setProductsLoading(false)
        }
    }, [])

    //Funcion para obtener un producto por id
    const getProductById = useCallback(async (id) => {
        setProductLoading(true)
        setProduct({})
        try {
            const response = await axios.get(`${API_URL}/${id}`)
            setProduct(response.data)
        } catch (error) {
            setError(error.message || 'Error al obtener este producto')
        } finally {
            setProductLoading(false)
        }
    }, [])

    //Funcion para actualizar un producto

    const updateProduct = useCallback(async (id, data) => {
        const cleanData = {
            name: data.name,
            description: data.description,
            price: Number(data.price),
            stock: Number(data.stock),
            imageUrl: data.imageUrl,
        }

        try {
            const response = await axios.put(API_URL + `/${id}`, cleanData, {
                withCredentials: true,
            })
            if (response.status === 200) {
                //Actualizar el producto individial
                setProduct(response.data)
                //Actualizar el producto en la lista
                setProducts((prevProducts) =>
                    prevProducts.map((p) => (p.id === id ? response.data : p)),
                )
                return {
                    success: true,
                    message: 'Producto Actualizado Correctamente ',
                }
            }
        } catch (error) {
            setError(error.message || 'Error al actualizar el producto')
            return {
                success: false,
                message: 'Error al actializar el producto',
            }
        } finally {
            setProductsLoading(false)
            setProductLoading(false)
        }
    }, [])

    //Funcio para crear un  producto

    const createProduct = useCallback(async (data) => {
        const cleanData = {
            name: data.name,
            description: data.description,
            price: Number(data.price),
            stock: Number(data.stock),
            imageUrl: data.imageUrl,
        }

        try {
            const response = await axios.post(API_URL, cleanData, {
                withCredentials: true,
            })
            if (response.status === 201) {
                setProducts((prevProducts) => [
                    ...prevProducts,
                    response.data.product,
                ])

                return {
                    success: true,
                    message: response.data.message,
                }
            }
        } catch (error) {
            setError(error.message || 'Error al crear el nuevo producto')

            return {
                success: false,
                message: error.message || 'Error al crear un nuevo producto',
            }
        } finally {
            setProductLoading(false)
        }
    }, [])
    //Funcion para eliminra un producto
    const deleteProduct = useCallback(async (id) => {
        try {
            const response = await axios.delete(API_URL + `/${id}`, {
                withCredentials: true,
            })
            if (response.status === 200) {
                setProducts((prevProducts) =>
                    prevProducts.filter((p) => p.id !== id),
                )
                return {
                    success: true,
                    message: 'Producto eliminado correctamente',
                }
            }
        } catch (error) {
            setError(error.message || 'Error al eliminar el producto')
            return { success: false, message: 'Error al eliminar el producto' }
        } finally {
            setProductsLoading(false)
        }
    }, [])

    const getLowStockProducts = useCallback(async (threshold = 10) => {
        const response = await axios.get(
            `${API_URL}/low-stock?threshold=${threshold}`,
            { withCredentials: true },
        )
        return response.data
    }, [])

    useEffect(() => {
        getProducts()
    }, [getProducts])

    const value = {
        products,
        product,
        productsLoading,
        productLoading,
        error,
        getProducts,
        getProductById,
        updateProduct,
        createProduct,
        deleteProduct,
        getLowStockProducts,
    }

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    )
}

//hook personalizado
export const useProduct = () => useContext(ProductContext)
