import { Routes, Route } from 'react-router'
import Layout from './layout/Layout'
import Home from './pages/Home'
import Register from './pages/register'
import Login from './pages/login'
import { UserContextProvider } from './context/UserContext'
import { ProductContextProviader } from './context/productContext'
import { CartContextProvider } from './context/cartContex'
import Favorites from './pages/Favorites'
import { Toaster } from 'react-hot-toast'
import DetailProduct from './pages/DetailProduct'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import { NotificationProvider } from './context/NotificationContext'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

function App() {
    return (
        <UserContextProvider>
            <NotificationProvider>
                <ProductContextProviader>
                    <CartContextProvider>
                        <Routes>
                            <Route element={<Layout />}>
                                <Route path="/" element={<Home />}></Route>
                                <Route
                                    path="/register"
                                    element={<Register />}
                                ></Route>
                                <Route
                                    path="/login"
                                    element={<Login />}
                                ></Route>
                                <Route
                                    path="/forgot-password"
                                    element={<ForgotPassword />}
                                />
                                <Route
                                    path="/reset-password"
                                    element={<ResetPassword />}
                                />
                                <Route
                                    path="/detailProduct/:id"
                                    element={<DetailProduct />}
                                />
                                <Route
                                    path="/admin/dashboard/*"
                                    element={
                                        <ProtectedRoute requireAdmin={true}>
                                            <AdminDashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/checkout"
                                    element={<Checkout />}
                                />
                                <Route
                                    path="/order-confirmation"
                                    element={<OrderConfirmation />}
                                />
                                <Route
                                    path="/favorites"
                                    element={<Favorites />}
                                />
                                <Route path="/orders" element={<Orders />} />
                                <Route
                                    path="/profile"
                                    element={
                                        <ProtectedRoute>
                                            <Profile />
                                        </ProtectedRoute>
                                    }
                                />
                            </Route>
                        </Routes>
                    </CartContextProvider>
                </ProductContextProviader>
                <Toaster />
            </NotificationProvider>
        </UserContextProvider>
    )
}

export default App
