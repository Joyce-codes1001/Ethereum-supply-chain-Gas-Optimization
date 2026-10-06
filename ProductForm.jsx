import React from 'react'

export const ProductForm = ({
    productDetails,
    setProductDetails,
    addNewProduct,
    updateProduct,
}) => {
    return (
        <div className='mb-6 p-4 border rounded'>
            <h2 className='text-xl font-semibold mb-4'>Manage Product</h2>
            <form onSubmit={addNewProduct}>
                <div className='grid grid-cols-1 gap-4'>
                    <input
                        type='text'
                        placeholder='Product Name'
                        value={productDetails.name}
                        onChange={(e) =>
                            setProductDetails({
                                ...productDetails,
                                name: e.target.value,
                            })
                        }
                        className='border p-2 rounded'
                        required
                    />
                    <input
                        type='number'
                        placeholder='Price (ETH)'
                        value={productDetails.price}
                        onChange={(e) =>
                            setProductDetails({
                                ...productDetails,
                                price: e.target.value,
                            })
                        }
                        className='border p-2 rounded'
                        required
                        step='0.000000000000000001'
                    />
                    <input
                        type='number'
                        placeholder='Quantity'
                        value={productDetails.quantity}
                        onChange={(e) =>
                            setProductDetails({
                                ...productDetails,
                                quantity: e.target.value,
                            })
                        }
                        className='border p-2 rounded'
                        required
                    />
                    <button
                        type='submit'
                        className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
                    >
                        Add Product
                    </button>
                </div>
            </form>

            {/* Update Product Section */}
            <div className='mt-6 p-4 border rounded'>
                <h2 className='text-xl font-semibold mb-4'>
                    Update Product Price
                </h2>
                <input
                    type='number'
                    placeholder='Product ID'
                    value={productDetails.productId || ''}
                    onChange={(e) =>
                        setProductDetails({
                            ...productDetails,
                            productId: e.target.value,
                        })
                    }
                    className='border p-2 rounded w-full mb-2'
                    required
                />
                <input
                    type='number'
                    placeholder='New Price (ETH)'
                    value={productDetails.newPrice || ''}
                    onChange={(e) =>
                        setProductDetails({
                            ...productDetails,
                            newPrice: e.target.value,
                        })
                    }
                    className='border p-2 rounded w-full mb-2'
                    required
                    step='0.000000000000000001'
                />
                <button
                    type='button'
                    className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full'
                    onClick={() =>
                        updateProduct(
                            productDetails.productId,
                            productDetails.newPrice
                        )
                    }
                >
                    Update Price
                </button>
            </div>
        </div>
    )
}
