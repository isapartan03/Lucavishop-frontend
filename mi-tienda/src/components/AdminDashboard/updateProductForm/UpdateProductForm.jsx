import { useForm } from 'react-hook-form'
import { useProduct } from '../../../context/productContext'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'

const UpdateProductForm = ({ product }) => {
    const { updateProduct } = useProduct()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ mode: 'onChange', defaultValues: product })

    const onSubmit = async (data) => {
        const result = await updateProduct(product.id, data)
        if (result.success) {
            toast.success(result.message)
            navigate('/admin/dashboard/products')
        } else {
            toast.error(result.message)
        } //
    }
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 flex flex-col gap-4 lg:gap-6 max-w-[500px] mx-auto"
        >
            <div>
                <input
                    {...register('name', {
                        required: 'El nombre es requerido',
                        minLength: {
                            value: 3,
                            message: 'Minimo 3 caracteres ',
                        },
                        maxLength: {
                            value: 50,
                            message: 'Maximo 50 caracteres ',
                        },
                    })}
                    className={`p-2 outline-2 rounded border focus:outline-primary w-full ${
                        errors.name
                            ? 'border-red-500 outline-red-500 focus:outline-red-500'
                            : ''
                    }`}
                    type="text"
                    placeholder="Nombre del Producto"
                    name="name"
                    autoComplete="name"
                />
                {errors.name && (
                    <p className="text-red-400 text-sm mt-2 ml-1">
                        {errors.name.message}
                    </p>
                )}
            </div>

            <div>
                <input
                    {...register('description', {
                        required: 'La descripcion es requerida',
                        minLength: {
                            value: 10,
                            message: 'Minimo 10 caracteres ',
                        },
                        maxLength: {
                            value: 500,
                            message: 'Maximo 500 caracteres ',
                        },
                    })}
                    className={`p-2 outline-2 rounded border focus:outline-primary w-full ${
                        errors.description
                            ? 'border-red-500 outline-red-500 focus:outline-red-500'
                            : ''
                    }`}
                    type="text"
                    placeholder="Descripcion"
                    name="description"
                    autoComplete="description"
                />
                {errors.description && (
                    <p className="text-red-400 text-sm mt-2 ml-1">
                        {errors.description.message}
                    </p>
                )}
            </div>
            <div>
                <input
                    {...register('price', {
                        required: 'El precio es requerido',
                        min: {
                            value: 2,
                            message: 'El precio debe ser mayor a 1 ',
                        },
                    })}
                    className={`p-2 outline-2 rounded border focus:outline-primary w-full ${
                        errors.price
                            ? 'border-red-500 outline-red-500 focus:outline-red-500'
                            : ''
                    }`}
                    type="number"
                    placeholder=" Ejemplo: 500"
                    name="price"
                    autoComplete="price"
                />
                {errors.price && (
                    <p className="text-red-400 text-sm mt-2 ml-1">
                        {errors.price.message}
                    </p>
                )}
            </div>
            <div>
                <input
                    {...register('stock', {
                        required: 'El stock es requerido',
                        min: {
                            value: 0,
                            message: 'El stock debe ser mayor o igual  a 0 ',
                        },
                    })}
                    className={`p-2 outline-2 rounded border focus:outline-primary w-full ${
                        errors.stock
                            ? 'border-red-500 outline-red-500 focus:outline-red-500'
                            : ''
                    }`}
                    type="number"
                    placeholder="Stock disponible"
                    name="stock"
                    autoComplete="stock"
                />
                {errors.stock && (
                    <p className="text-red-400 text-sm mt-2 ml-1">
                        {errors.stock.message}
                    </p>
                )}
            </div>
            <div>
                <input
                    {...register('imageUrl', {
                        required: 'La url es  es requerida',
                    })}
                    className={`p-2 outline-2 rounded border focus:outline-primary w-full ${
                        errors.imageUrl
                            ? 'border-red-500 outline-red-500 focus:outline-red-500'
                            : ''
                    }`}
                    type="text"
                    placeholder="Url de la imagen del producto"
                    name="imageUrl"
                    autoComplete="imageUrl"
                />
                {errors.imageUrl && (
                    <p className="text-red-400 text-sm mt-2 ml-1">
                        {errors.imageUrl.message}
                    </p>
                )}
            </div>
            <button className="btn btn-primary" type="submit">
                Actualizar Producto
            </button>
        </form>
    )
}

export default UpdateProductForm
