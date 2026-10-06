import { useState, useEffect } from 'react'

export const useOrders = (contract, account) => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchOrders = async () => {
        if (!contract || !account) return

        setLoading(true)
        try {
            const totalOrders = await contract.getTotalOrder(account)
            const ordersArray = []

            for (let i = 1; i <= totalOrders; i++) {
                const orderData = await contract.fetchNextOrderById(account, i)
                if (orderData[6]) {
                    // if order exists (based on the boolean in return value)
                    ordersArray.push({
                        id: orderData[0].toString(),
                        productId: orderData[1].toString(),
                        quantity: orderData[2].toString(),
                        customerName: orderData[3],
                        status: orderData[4],
                        deliveryAddress: orderData[5],
                    })
                }
            }
            setOrders(ordersArray)
        } catch (error) {
            console.error('Error fetching orders:', error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchOrders()
    }, [contract, account])

    return {
        orders,
        loading,
        refreshOrders: fetchOrders,
    }
}
