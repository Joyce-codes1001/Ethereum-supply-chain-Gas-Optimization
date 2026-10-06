import React from 'react'

export const ProductList = ({ products, loading, onOrderClick }) => {
    if (loading) {
        return <div className='text-center py-4'>Loading products...</div>
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {products.map((product) => (
                <div
                    key={product.id}
                    className='border rounded-lg p-4 shadow-sm'
                >
                    <h3 className='text-lg font-semibold'>
                        {product.id} . {product.name}
                    </h3>
                    <div className='mt-2'>
                        <p>Price: {product.price} ETH</p>
                        <p>Available: {product.quantity} units</p>
                    </div>
                    <button
                        onClick={() => onOrderClick(product)}
                        className='mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full'
                        disabled={parseInt(product.quantity) === 0}
                    >
                        {parseInt(product.quantity) === 0
                            ? 'Out of Stock'
                            : 'Order Now'}
                    </button>
                </div>
            ))}
        </div>
    )
}
