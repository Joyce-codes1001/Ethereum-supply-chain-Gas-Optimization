import React from 'react'
import { ProductForm } from './ProductForm'
import { ProducerOrderManagement } from './ProducerOrderManagement'
import { UseProducer } from '../../hooks/UseProducer'
import { useProducerOrders } from '../../hooks/useProducerOrders'
import { useTransactions } from '../../hooks/useTransactions'
import { TransactionStatus } from '../transactions/TransactionStatus'

export const ProducerDashboard = ({
    contract,
    setErrorMessage,
    signer,
    refreshProducts,
}) => {
    const { productDetails, setProductDetails, addNewProduct, updateProduct } =
        UseProducer(contract, setErrorMessage)

    const {
        producerOrders,
        loading: ordersLoading,
        refreshOrders,
    } = useProducerOrders(contract, signer?.getAddress())

    const { transactions, addTransaction, updateTransaction } =
        useTransactions()

    const handleAddProduct = async (e) => {
        e.preventDefault()
        try {
            const tx = await addNewProduct(e)
            const txRecord = addTransaction(
                tx,
                `Adding product: ${productDetails.name}`
            )

            await tx.wait()
            updateTransaction(txRecord.hash, 'completed')
            refreshProducts()
            setErrorMessage('Product added successfully!')
        } catch (error) {
            setErrorMessage(error.message)
        }
    }
    const handleUpdateProducts = async (productId, newPrice) => {
        try {
            const result = await updateProduct(productId, newPrice)
            refreshProducts()
        } catch (error) {
            setErrorMessage(error.message)
        }
    }
    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            const tx = await contract.updateOrderStatus(orderId, newStatus)
            const txRecord = addTransaction(
                tx,
                `Updating order ${orderId} to ${newStatus}`
            )

            await tx.wait()
            updateTransaction(txRecord.hash, 'completed')
            refreshOrders()
            setErrorMessage(`Order ${orderId} status updated to ${newStatus}`)
        } catch (error) {
            setErrorMessage(error.message)
        }
    }

    return (
        <div>
            <h2 className='text-2xl font-bold mb-4'>Producer Dashboard</h2>

            <ProductForm
                productDetails={productDetails}
                setProductDetails={setProductDetails}
                addNewProduct={handleAddProduct}
                updateProduct={handleUpdateProducts}
            />

            <ProducerOrderManagement
                orders={producerOrders}
                loading={ordersLoading}
                onUpdateStatus={handleUpdateOrderStatus}
                refreshOrders={refreshOrders}
            />

            <TransactionStatus transactions={transactions} />
        </div>
    )
}
