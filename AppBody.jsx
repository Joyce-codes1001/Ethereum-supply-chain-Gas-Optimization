// src/App.js
import React from 'react'
import { useState } from 'react'
import { WalletConnection } from './components/common/WalletConnection'
import { ErrorMessage } from './components/common/ErrorMessage'
import { ProducerRegistration } from './components/producer/ProducerRegistration'
import { ProducerDashboard } from './components/producer/ProducerDashboard'
import { CustomerDashboard } from './components/customer/CustomerDashboard'
import { UseWeb3 } from './hooks/UseWeb3'
import { UseProducer } from './hooks/UseProducer'
import { UseProducts } from './hooks/UseProducts'
import { useOrders } from './hooks/UseOrders'
import { UseCustomer } from './hooks/useCustomer'
import { ProductFilters } from './components/products/ProductFilters'
import { ProductList } from './components/products/ProductList'
import { OrderHistory } from './components/orders/OrderHistory'
import { NavBar } from './components/common/Navbar'

const AppBody = () => {
    const {
        contract,
        signer,
        defaultAccount,
        errorMessage,
        connectionStatus,
        isProducer,
        connectWallet,
        setErrorMessage,
    } = UseWeb3()
    const [isSeller, setIsSeller] = useState(false)

    const toggleRole = () => {
        setIsSeller((prev) => !prev)
    }
    const { producerName, setProducerName, registerAsProducer } = UseProducer(
        contract,
        setErrorMessage
    )

    const {
        products,
        loading: productsLoading,
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        refreshProducts,
    } = UseProducts(contract)

    const {
        orders,
        loading: ordersLoading,
        refreshOrders,
    } = useOrders(contract, defaultAccount)

    const { orderDetails, setOrderDetails, placeNewOrder } = UseCustomer(
        contract,
        setErrorMessage
    )

    // Handler for when "Order Now" is clicked on a product
    const handleOrderClick = (product) => {
        setOrderDetails({
            ...orderDetails,
            productId: product.id,
        })
        // You might want to scroll to the order form or show a modal here
        document
            .getElementById('orderForm')
            ?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <>
            <NavBar
                connectWallet={connectWallet}
                connectionStatus={connectionStatus}
                defaultAccount={defaultAccount}
                isSeller={!isSeller}
                toggleRole={toggleRole}
            />
            <div className='p-4'>
                {!isProducer && defaultAccount && (
                    <ProducerRegistration
                        producerName={producerName}
                        setProducerName={setProducerName}
                        registerAsProducer={registerAsProducer}
                    />
                )}

                {defaultAccount && (
                    <>
                        {/* Product Browsing Section */}
                        <div className='flex '>
                            <div className='mb-8 pe-4'>
                                <h2 className='text-xl font-semibold mb-4'>
                                    Available Products
                                </h2>

                                <ProductFilters
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    filters={filters}
                                    setFilters={setFilters}
                                />

                                <ProductList
                                    products={products}
                                    loading={productsLoading}
                                    onOrderClick={handleOrderClick}
                                />
                            </div>

                            {/* Producer Dashboard */}
                            {!isSeller ? (
                                isProducer && (
                                    <ProducerDashboard
                                        signer={signer}
                                        contract={contract}
                                        setErrorMessage={setErrorMessage}
                                        refreshProducts={refreshProducts}
                                    />
                                )
                            ) : (
                                <div>
                                    <div id='orderForm'>
                                        <CustomerDashboard
                                            contract={contract}
                                            setErrorMessage={setErrorMessage}
                                            orderDetails={orderDetails}
                                            setOrderDetails={setOrderDetails}
                                            placeNewOrder={placeNewOrder}
                                            onOrderSuccess={() => {
                                                refreshOrders()
                                                refreshProducts()
                                            }}
                                        />
                                    </div>

                                    <OrderHistory
                                        orders={orders}
                                        loading={ordersLoading}
                                    />
                                </div>
                            )}
                        </div>
                    </>
                )}

                <ErrorMessage message={errorMessage} />
            </div>
        </>
    )
}

export default AppBody
