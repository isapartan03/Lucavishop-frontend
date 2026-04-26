// src/components/AdminDashboard/TableProductDashboard/TableProducts.jsx
import { Link } from 'react-router'
import { useProduct } from '../../../context/productContext'
import toast from 'react-hot-toast'

const TableProducts = ({ products }) => {
    const { deleteProduct } = useProduct()

    const onHandleDelete = async (id) => {
        const result = await deleteProduct(id)
        if (result.success) {
            toast.success(result.message)
        } else {
            toast.error(result.message)
        }
    }

    return (
        <table className="table text-center">
            <thead>
                <tr>
                    <th></th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Imagen del artículo</th>

                    <th>Modificar</th>
                    <th>Eliminar</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product, index) => (
                    <tr key={product.id}>
                        <th>{index + 1}</th>
                        <td>{product.name}</td>
                        <td>{product.description}</td>
                        <td>{product.price}</td>
                        <td>{product.stock}</td>
                        <td>{product.imageUrl}</td>
                        <td>
                            <Link
                                to={`/admin/dashboard/products/updateProduct/${product.id}`}
                                className="btn btn-info"
                            >
                                Editar
                            </Link>
                        </td>
                        <td>
                            <button
                                className="btn btn-error"
                                onClick={() => onHandleDelete(product.id)}
                            >
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default TableProducts
