import { useUser } from '../../context/UserContext'
import toast from 'react-hot-toast'
import { logoutServices } from '../../services/authServices'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../../utils/ulrHelpers'

const UserDropDown = () => {
    const { setUserInfo } = useUser()
    const { userInfo } = useUser()
    const handleLogout = async () => {
        try {
            await logoutServices()
            setUserInfo({})
            toast.success('Sesión cerrada exitosamente')
        } catch (error) {
            console.log(error)
            toast.error('Error al cerrar sesión')
        }
    }
    return (
        <div className="dropdown dropdown-end">
            <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
            >
                <div className="w-10 rounded-full">
                    <img
                        src={
                            getImageUrl(userInfo?.avatar) ||
                            'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
                        }
                        alt="Avatar"
                    />
                </div>
            </div>
            <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 w-52 p-2 shadow"
            >
                <li>
                    <Link to="/profile" className="justify-between">
                        Perfil
                    </Link>
                </li>

                <li>
                    <Link to="/orders" className="justify-between">
                        Mis pedidos
                    </Link>
                </li>
                <li>
                    <Link to="/favorites" className="justify-between">
                        Mis favoritos
                    </Link>
                </li>

                <li>
                    <a onClick={handleLogout} className="justify-between">
                        Cerrar sesión
                    </a>
                </li>
            </ul>
        </div>
    )
}

export default UserDropDown
