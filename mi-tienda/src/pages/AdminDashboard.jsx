import { Routes, Route } from 'react-router'
import TableProductDashboard from '../components/AdminDashboard/TableProductDashboard/TableProductDashboard'
import DashboardLayout from '../layout/DashboardLayout'
import CreateProduct from './createProduct'
import UpdateProduct from './UpdateProduct'
import OrdersAdmin from '../components/AdminDashboard/OredersAdmin/OrdersAdmin'
import DashboardHome from './DashboardHome'
import Reports from './Reports'
const AdminDashboard = () => {
    return (
        <section>
            <Routes>
                <Route path="/" element={<DashboardLayout />}>
                    <Route index element={<DashboardHome />} />
                    <Route
                        path="/products"
                        element={<TableProductDashboard />}
                    />
                    <Route
                        path="/products/createProduct"
                        element={<CreateProduct />}
                    />
                    <Route
                        path="/products/updateProduct/:id"
                        element={<UpdateProduct />}
                    />
                    <Route path="orders" element={<OrdersAdmin />} />
                    <Route path="reports" element={<Reports />} />
                </Route>
            </Routes>
        </section>
    )
}

export default AdminDashboard
