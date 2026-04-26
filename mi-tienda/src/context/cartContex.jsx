import { createContext, useState, useEffect, useContext } from 'react'
import { useUser } from './UserContext'
import { useCallback } from 'react'
import {
    addToCartService,
    getCartService,
    updateCartService,
    removeFromCartService,
    clearCartService,
    getCartTotalService,
} from '../services/cartServices'
import toast from 'react-hot-toast'

export const CartContext = createContext({})
export const CartContextProvider = ({ children }) => {
    const [cart, setCart] = useState([])
    const [total, setTotal] = useState(0)
    const [itemsQuantity, setItemsQuantity] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setloading] = useState(true)
    const {
        getUserId,
        isAuthenticated,
        loading: userLoading,
        userInfo,
    } = useUser()

    //Funcion para acxargar el carrito
    const loadLocalCart = useCallback(() => {
        try {
            const localCart = localStorage.getItem('cart')
            return localCart ? JSON.parse(localCart) : []
        } catch (error) {
            console.error('Error al cargar el carrito local: ', error)
            return []
        }
    }, [])

    //Funcion para guardar el carrito en local storage
    const saveLocalCart = (cartItems) => {
        try {
            localStorage.setItem('cart', JSON.stringify(cartItems))
        } catch (error) {
            console.error(
                'Error al guardar el carrito en el local estoarge: ',
                error,
            )
        }
    }

    //función para cargar el carrito (en el backend o localStorage)
    const loadCart = useCallback(async () => {
        if (isAuthenticated()) {
            //usuario autenticado: carga desde el backend
            try {
                setloading(true)
                const userId = getUserId()
                const response = await getCartService(userId)
                //transformar los datos del backend al formato del frontend
                const cartItems =
                    response.cart?.items?.map((item) => {
                        const product = item.product || item.productId // intenta ambas
                        return {
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            imageUrl: product.imageUrl,
                            description: product.description,
                            stock: product.stock,
                            quantity: item.quantity,
                        }
                    }) || []
                setCart(cartItems || [])
            } catch (error) {
            } finally {
                setloading(false)
            }
        } else {
            //Usiario no autenticado: carga desde el local storage
            const localCart = loadLocalCart()
            setCart(localCart || [])
            setloading(false)
        }
    }, [isAuthenticated, getUserId, loadLocalCart])

    //función para sincronizar carrito local con el backend
    const syncCartWithBackend = useCallback(async () => {
        const localCart = loadLocalCart()

        if (localCart.length > 0 && isAuthenticated()) {
            try {
                setloading(true)
                const userId = getUserId()

                //agregar cada producto del carrito local al backend
                for (const item of localCart) {
                    try {
                        await addToCartService(userId, item.id, item.quantity)
                    } catch (error) {
                        console.error(
                            `Error al sincronizar producto ${item.name}`,
                        )
                    }
                }
                //limpiar localStorage después de sincronizar
                localStorage.removeItem('cart')

                //recargar carrito desde el backend
                await loadCart()
                toast.success('Carrito sincronizado con éxito')
            } catch (error) {
                console.error('Error al sincronizar carrito', error)
            } finally {
                setloading(false)
            }
        }
    }, [isAuthenticated, getUserId, loadCart, loadLocalCart])

    //añadir producto al carrito
    const addToCart = async (product, quantity = 1) => {
        if (isAuthenticated()) {
            //usuario autenticado / usar el backend
            try {
                setloading(true)
                const userId = getUserId()
                await addToCartService(userId, product.id, quantity)

                //recargar el carrito después de agregar
                await loadCart()
                toast.success('Producto agregado al carrito')
            } catch (error) {
                console.error('Error al agregar producto al carrito', error)
                toast.error('Error al agregar producto al carrito')
            } finally {
                setloading(false)
            }
        } else {
            //usuario no autenticado: usar localStorage
            try {
                const currentCart = [...cart]
                const existingIndex = currentCart.findIndex(
                    (item) => item.id === product.id,
                )

                if (existingIndex > -1) {
                    //producto ya existe, actualizar cantidad
                    currentCart[existingIndex].quantity += quantity
                } else {
                    //nuevo producto: agregar
                    currentCart.push({ ...product, quantity })
                    setCart(currentCart)
                    saveLocalCart(currentCart)
                    toast.success('Producto agregado al carrito')
                }
            } catch (error) {
                console.error('Error al agregar al carrito local', error)
                toast.error('Error al agregar al carrito local')
            }
        }
    }

    //eliminar producto del carrito
    const removeFromCart = async (productId) => {
        if (isAuthenticated) {
            try {
                setloading(true)
                const userId = getUserId()
                await removeFromCartService(userId, productId)

                //recargar el carrito después de eliminar
                await loadCart()
                toast.success('Producto eliminado del carrito')
            } catch (error) {
                console.error(
                    'Error al eliminar producto del carrito local',
                    error,
                )
                toast.error('Error al eliminar producto del carrito local')
            } finally {
                setloading(false)
            }
        } else {
            try {
                const currentCart = cart.filter((item) => item.id !== productId)
                setCart(currentCart)
                saveLocalCart(currentCart)
                toast.success('Producto eliminado del carrito')
            } catch (error) {
                console.error(
                    'Error al eliminar producto del carrito local',
                    error,
                )
                toast.error('Error al eliminar producto del carrito local')
            }
        }
    }

    //actualizar cantidad de producto
    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) {
            toast.error('La cantidad debe ser al menos 1')
            return
        }

        if (isAuthenticated()) {
            try {
                setloading(true)
                const userId = getUserId()
                await updateCartService(userId, productId, newQuantity)

                //recargar el carrito después de actualizar
                await loadCart()
                toast.success('Cantidad actualizada')
            } catch (error) {
                console.error('Error al actualizar la cantidad', error)
                toast.error('Error al actualizar la cantidad')
            }
        } else {
            try {
                const currentCart = cart.map((item) =>
                    item.id === productId
                        ? { ...item, quantity: newQuantity }
                        : item,
                )
                setCart(currentCart)
                saveLocalCart(currentCart)
                toast.success('Cantidad actualizada')
            } catch (error) {
                console.error('Error al actualizar la cantidad', error)
                toast.error('Error al actualizar la cantidad')
            }
        }
    }

    //limpiar el carrito
    const cleanCart = async () => {
        if (isAuthenticated()) {
            try {
                setloading(true)
                const userId = getUserId()
                await clearCartService(userId)

                //limpiar el estado local
                setCart([])
                toast.success('Carrito vacio')
            } catch (error) {
                console.error('Error al vaciar el carrito', error)
                toast.error('Error al vaciar el carrito')
            } finally {
                setloading(false)
            }
        } else {
            try {
                setCart([])
                saveLocalCart([])
                toast.success('Carrito vacio')
            } catch (error) {
                console.error('Error al vaciar el carrito', error)
                toast.error('Error al vaciar el carrito')
            }
        }
    }

    //cargar carrito al inicializar
    useEffect(() => {
        let isMounted = true

        const initializeCart = async () => {
            //esperar un poco para que el UserContext se inicialice
            await new Promise((resolve) => setTimeout(resolve, 100))

            if (!isMounted) return

            const previousAuthState = localStorage.getItem('wasAuthenticated')
            const currentAuthState = isAuthenticated()

            if (!previousAuthState && currentAuthState) {
                //usuario acaba de iniciar sesión: sincronizar el carrito local
                await syncCartWithBackend()
            } else {
                //cargar carrito normalemente
                await loadCart()
            }

            //guardar estado de auntentificación actual
            localStorage.setItem(
                'wasAuthenticated',
                currentAuthState.toString(),
            )

            setloading(false)
        }

        initializeCart()

        return () => {
            isMounted = false
        }
    }, [isAuthenticated, loadCart, syncCartWithBackend, userLoading])

    //escuchar cambios de autenticación por separado
    useEffect(() => {
        const previousAuthState =
            localStorage.getItem('wasAuthenticated') === 'true'
        const currentAuthState = isAuthenticated()

        //solo actuar si relamente cambió el estado de autentificación
        if (previousAuthState !== currentAuthState && cart.length === 0) {
            loadCart()
            localStorage.setItem(
                'wasAuthenticated',
                currentAuthState.toString(),
            )
        }
    }, [isAuthenticated, loadCart, cart])

    //reaccionar directamente a cambios en userInfo (login/logout)
    useEffect(() => {
        //Esperar a que UserContext termine de verificar la sesión
        if (userLoading) return

        //Si el usuario inició sesión (userInfo.id aparece), sincronizar o cargar
        if (userInfo?.id) {
            ;(async () => {
                try {
                    const localCart = loadLocalCart()
                    if (localCart.length > 0) {
                        await syncCartWithBackend()
                    } else {
                        await loadCart()
                    }
                } catch (error) {
                    console.error(
                        'Error al sincronizar/cargar carrito tras login',
                        error,
                    )
                }
            })()
        } else {
            //si el usuario hace un logout mostrar carrito local
            try {
                setCart(loadLocalCart())
            } catch (error) {
                console.error(
                    'Error al cargar el carrito tras cierre de sesión',
                    error,
                )
            }
        }
    }, [
        userInfo?.id,
        userLoading,
        loadCart,
        loadLocalCart,
        syncCartWithBackend,
    ])

    //calculamos total y cantidad de items cuando cambia el carrito
    useEffect(() => {
        const newTotal = cart.reduce(
            (acc, item) => acc + item.price * (item.quantity || 1),
            0,
        )
        setTotal(newTotal)
        const newItemsQuantity = cart.reduce(
            (acc, item) => acc + (item.quantity || 1),
            0,
        )
        setItemsQuantity(newItemsQuantity)
    }, [cart])

    //abrir el modal
    const openModal = () => setIsModalOpen(true)
    //cerrar el modal
    const closeModal = () => setIsModalOpen(false)

    return (
        <CartContext.Provider
            value={{
                cart,
                total,
                itemsQuantity,
                isModalOpen,
                closeModal,
                loading,
                addToCart,
                removeFromCart,
                cleanCart,
                openModal,
                updateQuantity,
                loadCart,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)
