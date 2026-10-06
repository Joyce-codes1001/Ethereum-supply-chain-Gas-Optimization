import React from 'react'

export const ProductFilters = ({
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
}) => {
    return (
        <div className='mb-6 p-4 border rounded'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <input
                    type='text'
                    placeholder='Search products...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='border p-2 rounded'
                />
                <input
                    type='number'
                    placeholder='Min Price (ETH)'
                    value={filters.minPrice}
                    onChange={(e) =>
                        setFilters({ ...filters, minPrice: e.target.value })
                    }
                    className='border p-2 rounded'
                    step='0.000000000000000001'
                />
                <input
                    type='number'
                    placeholder='Max Price (ETH)'
                    value={filters.maxPrice}
                    onChange={(e) =>
                        setFilters({ ...filters, maxPrice: e.target.value })
                    }
                    className='border p-2 rounded'
                    step='0.000000000000000001'
                />
                <div className='flex items-center'>
                    <input
                        type='checkbox'
                        id='inStock'
                        checked={filters.inStock}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                inStock: e.target.checked,
                            })
                        }
                        className='mr-2'
                    />
                    <label htmlFor='inStock'>In Stock Only</label>
                </div>
            </div>
        </div>
    )
}
