import AuthButtons from './AuthButtons'
import Cart from './Cart'
import UserDropDown from './UserDropDown'
import { Link } from 'react-router'
import { useUser } from '../../context/UserContext'
import NotificationBell from './NotificationBell'

const Navbar = () => {
    const { loading, userInfo } = useUser()
    return (
        <header>
            <AuthButtons />
            <nav className="navbar bg-base-100 shadow-sm lg:rounded-box w-full">
                <div className="navbar-start">
                    <Link to="/" className="flex items-center gap-2">
                        <img
                            src="/images/marca.jpeg" // Asegúrate de que el archivo exista en public/images/logo.jpg
                            alt="Logo de la tienda"
                            className="h-8 w-auto sm:h-10 md:h-12 cursor-pointer rounded-md"
                        />
                        {/* Opcional: si quieres mantener el texto junto al logo, descomenta la siguiente línea */}
                        <span className="text-xl font-bold">Al-Collection</span>
                    </Link>
                </div>
                <div className="navbar-end gap-3">
                    {userInfo?.isAdmin && (
                        <Link to="/admin/dashboard" className="btn btn-primary">
                            Dashboard
                        </Link>
                    )}
                    <NotificationBell />
                    <Cart />
                    {!loading && userInfo?.username && <UserDropDown />}
                </div>
            </nav>
        </header>
    )
}

export default Navbar
