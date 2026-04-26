import { Link } from 'react-router'
import { useProduct } from '../../../context/productContext'
import TableProducts from './TableProducts'

const TableProductDashboard = () => {
    const { products, producstLoding } = useProduct()

    return (
        <>
            <div className="overflow-x-auto">
                {producstLoding ? (
                    <div className="loading loading-spinner"></div>
                ) : (
                    <TableProducts products={products} />
                )}
            </div>
        </>
    )
}

export default TableProductDashboard
