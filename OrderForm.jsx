// src/components/customer/OrderForm.js
import React from 'react'

export const OrderForm = ({ orderDetails, setOrderDetails, placeNewOrder }) => {
    return (
        <div className='mb-6 p-4 border rounded'>
            <h2 className='text-xl font-semibold mb-4'>Place Order</h2>
            <form onSubmit={placeNewOrder}>
                <div className='grid grid-cols-1 gap-4'>
                    <input
                        type='text'
                        placeholder='Customer Name'
                        value={orderDetails.customerName}
                        onChange={(e) =>
                            setOrderDetails({
                                ...orderDetails,
                                customerName: e.target.value,
                            })
                        }
                        className='border p-2 rounded'
                        required
                    />
                    <input
                        type='text'
                        placeholder='Delivery Address'
                        value={orderDetails.deliveryAddress}
                        onChange={(e) =>
                            setOrderDetails({
                                ...orderDetails,
                                deliveryAddress: e.target.value,
                            })
                        }
                        className='border p-2 rounded'
                        required
                    />
                    <input
                        type='number'
                        placeholder='Product ID'
                        value={orderDetails.productId}
                        onChange={(e) =>
                            setOrderDetails({
                                ...orderDetails,
                                productId: e.target.value,
                            })
                        }
                        className='border p-2 rounded'
                        required
                    />
                    <input
                        type='number'
                        placeholder='Quantity'
                        value={orderDetails.quantity}
                        onChange={(e) =>
                            setOrderDetails({
                                ...orderDetails,
                                quantity: e.target.value,
                            })
                        }
                        className='border p-2 rounded'
                        required
                    />
                    <button
                        type='submit'
                        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                    >
                        Place Order
                    </button>
                </div>
            </form>
        </div>
    )
}
