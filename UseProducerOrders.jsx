import { useState, useEffect } from 'react'

export const useProducerOrders = (contract, producerAddress) => {
    const [producerOrders, setProducerOrders] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchProducerOrders = async () => {
        if (!contract || !producerAddress) return

        setLoading(true)
        try {
            const totalProducts = await contract.totalProduct()
            const allOrders = []

            // Fetch all orders and filter for producer's products
            for (let i = 1; i <= totalProducts; i++) {
                const product = await contract.products(i)
                if (product.producer_address === (await producerAddress)) {
                    const totalOrders = await contract.totalOrder()
                    for (let j = 1; j <= totalOrders; j++) {
                        const order = await contract.orders(j)
                        if (order.product_id.toString() === i.toString()) {
                            allOrders.push({
                                orderId: j.toString(),
                                productId: i.toString(),
                                customerName: order.customer_name,
                                quantity: order.quantity.toString(),
                                status: order.status,
                                deliveryAddress: order.delivery_address,
                                customerAddress: order.customer_address,
                            })
                        }
                    }
                }
            }
            console.log('All Orders->', allOrders)
            setProducerOrders(allOrders)
        } catch (error) {
            console.error('Error fetching producer orders:', error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchProducerOrders()
    }, [contract])

    return {
        producerOrders,
        loading,
        refreshOrders: fetchProducerOrders,
    }
}
