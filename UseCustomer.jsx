import { useState } from 'react'
import { toast } from 'react-toastify'

export const UseCustomer = (contract, setErrorMessage) => {
    const [orderDetails, setOrderDetails] = useState({
        customerName: '',
        deliveryAddress: '',
        productId: '',
        quantity: '',
    })

    const placeNewOrder = async (e) => {
        e.preventDefault()
        if (!contract) {
            setErrorMessage('Please connect your wallet first')
            return
        }
        try {
            const tx = await contract.placeOrder(
                orderDetails.customerName,
                orderDetails.deliveryAddress,
                orderDetails.productId,
                orderDetails.quantity
            )
            await tx.wait()
            setErrorMessage('Order placed successfully!')
            setOrderDetails({
                customerName: '',
                deliveryAddress: '',
                productId: '',
                quantity: '',
            })
            toast.success('Successfully Ordered Product')
        } catch (error) {
            setErrorMessage(error.message)
            toast.error('Error While Ordering Product')
        }
    }

    return {
        orderDetails,
        setOrderDetails,
        placeNewOrder,
    }
}
