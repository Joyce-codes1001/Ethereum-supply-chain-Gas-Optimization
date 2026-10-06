import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

export const UseProducts = (contract) => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        inStock: false,
    })

    const fetchProducts = async () => {
        console.log('fectching products')
        if (!contract) return

        setLoading(true)
        try {
            const totalProducts = await contract.totalProduct()
            const productsArray = []

            for (let i = 1; i <= totalProducts; i++) {
                const product = await contract.products(i)
                productsArray.push({
                    id: product.id.toString(),
                    name: product.product_name,
                    price: ethers.formatEther(product.price),
                    quantity: product.quantity.toString(),
                    producerAddress: product.producer_address,
                })
            }
            setProducts(productsArray)
        } catch (error) {
            console.error('Error fetching products:', error)
        }
        setLoading(false)
    }

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        const matchesPrice =
            (!filters.minPrice ||
                parseFloat(product.price) >= parseFloat(filters.minPrice)) &&
            (!filters.maxPrice ||
                parseFloat(product.price) <= parseFloat(filters.maxPrice))
        const matchesStock = !filters.inStock || parseInt(product.quantity) > 0

        return matchesSearch && matchesPrice && matchesStock
    })

    useEffect(() => {
        fetchProducts()
    }, [contract])

    return {
        products: filteredProducts,
        loading,
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        refreshProducts: fetchProducts,
    }
}
