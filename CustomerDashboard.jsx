import { OrderForm } from './OrderForm'

export const CustomerDashboard = ({
    contract,
    setErrorMessage,
    orderDetails,
    setOrderDetails,
    placeNewOrder,
    onOrderSuccess,
}) => {
    const handlePlaceOrder = async (e) => {
        await placeNewOrder(e)
        if (onOrderSuccess) {
            onOrderSuccess()
        }
    }

    return (
        <div>
            <h2 className='text-2xl font-bold mb-4'>Customer Dashboard</h2>
            <OrderForm
                orderDetails={orderDetails}
                setOrderDetails={setOrderDetails}
                placeNewOrder={handlePlaceOrder}
            />
        </div>
    )
}
