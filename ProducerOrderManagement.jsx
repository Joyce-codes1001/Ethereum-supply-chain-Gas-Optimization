import React from 'react'

export const ProducerOrderManagement = ({
    orders,
    loading,
    onUpdateStatus,
    refreshOrders,
}) => {
    const handleStatusUpdate = async (orderId, newStatus) => {
        await onUpdateStatus(orderId, newStatus)
        refreshOrders()
    }

    if (loading) {
        return <div className='text-center py-4'>Loading orders...</div>
    }

    return (
        <div className='mt-6'>
            <h2 className='text-xl font-semibold mb-4'>Manage Orders</h2>
            <div className='overflow-x-auto'>
                <table className='min-w-full table-auto'>
                    <thead>
                        <tr className='bg-gray-100'>
                            <th className='px-4 py-2'>Order ID</th>
                            <th className='px-4 py-2'>Product ID</th>
                            <th className='px-4 py-2'>Customer</th>
                            <th className='px-4 py-2'>Quantity</th>
                            <th className='px-4 py-2'>Status</th>
                            <th className='px-4 py-2'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.orderId} className='border-b'>
                                <td className='px-4 py-2 text-center'>
                                    {order.orderId}
                                </td>
                                <td className='px-4 py-2 text-center'>
                                    {order.productId}
                                </td>
                                <td className='px-4 py-2'>
                                    {order.customerName}
                                </td>
                                <td className='px-4 py-2 text-center'>
                                    {order.quantity}
                                </td>
                                <td className='px-4 py-2 text-center'>
                                    <span
                                        className={`px-2 py-1 rounded ${
                                            order.status === 'Delivered'
                                                ? 'bg-green-100 text-green-800'
                                                : order.status === 'Rejected'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                                <td className='px-4 py-2'>
                                    {order.status === 'Placed' && (
                                        <div className='flex gap-2 justify-center'>
                                            <button
                                                onClick={() =>
                                                    handleStatusUpdate(
                                                        order.orderId,
                                                        'Delivered'
                                                    )
                                                }
                                                className='px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600'
                                            >
                                                Deliver
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleStatusUpdate(
                                                        order.orderId,
                                                        'Rejected'
                                                    )
                                                }
                                                className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600'
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
