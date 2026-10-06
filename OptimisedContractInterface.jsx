import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import contractABI from './contracts/OptimizedContractAbi.json'

const OptimisedContractInterface = () => {
    // Contract state
    const [contract, setContract] = useState(null)
    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)

    // UI state
    const [defaultAccount, setDefaultAccount] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [connectionStatus, setConnectionStatus] = useState('Connect Wallet')

    // Product state
    const [products, setProducts] = useState([])
    const [totalProducts, setTotalProducts] = useState(0)
    const [orders, setOrders] = useState([])
    const [isProducer, setIsProducer] = useState(false)

    // Form states
    const [producerName, setProducerName] = useState('')
    const [productDetails, setProductDetails] = useState({
        name: '',
        price: '',
        quantity: '',
    })
    const [orderDetails, setOrderDetails] = useState({
        customerName: '',
        deliveryAddress: '',
        productId: '',
        quantity: '',
    })

    const contractAddress = '0x3698406DAD72F8a0Fd89b1D9Be2C478F55db33aa' // Replace with your contract address

    const connectWallet = async () => {
        if (window.ethereum && window.ethereum.isMetaMask) {
            try {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                })
                accountChangedHandler(accounts[0])
                setConnectionStatus('Wallet Connected')
            } catch (error) {
                setErrorMessage(error.message)
            }
        } else {
            setErrorMessage('Please install MetaMask to interact')
        }
    }

    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount)
        updateEthers()
    }
    const checkProducerStatus = async (contractInstance, address) => {
        try {
            // First check if the producer has a name registered
            const producerName = await contractInstance.producers(address)
            console.log('PRoducer Name', producerName)
            // If the producer name exists (is not empty), they are registered
            return producerName !== ''
        } catch (error) {
            console.error('Error checking producer status:', error)
            return false
        }
    }
    const updateEthers = async () => {
        try {
            const tempProvider = new ethers.BrowserProvider(window.ethereum)
            setProvider(tempProvider)

            const tempSigner = await tempProvider.getSigner()
            setSigner(tempSigner)

            const tempContract = new ethers.Contract(
                contractAddress,
                contractABI,
                tempSigner
            )
            setContract(tempContract)

            // Check if connected address is a registered producer
            const signerAddress = await tempSigner.getAddress()
            // const producerStatus = await tempContract.isRegistered(
            //     signerAddress
            // )
            // setIsProducer(producerStatus)
            const producerStatus = await checkProducerStatus(
                tempContract,
                signerAddress
            )
            setIsProducer(producerStatus)
        } catch (error) {
            console.error('Error updating ethers:', error)
            setErrorMessage('Error connecting to contract: ' + error.message)
        }
    }

    // Effect to handle account changes
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', accountChangedHandler)
            window.ethereum.on('chainChanged', () => {
                window.location.reload()
            })
        }
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener(
                    'accountsChanged',
                    accountChangedHandler
                )
            }
        }
    }, [])

    // Producer Functions
    const registerAsProducer = async (e) => {
        e.preventDefault()
        if (!contract) {
            setErrorMessage('Please connect your wallet first')
            return
        }
        try {
            setErrorMessage('Processing registration...')
            const tx = await contract.registerProducer(producerName)
            setErrorMessage('Waiting for transaction confirmation...')
            await tx.wait()
            setIsProducer(true)
            setErrorMessage('Successfully registered as producer!')
        } catch (error) {
            console.error('Registration error:', error)
            setErrorMessage(error.message)
        }
    }

    const addNewProduct = async (e) => {
        e.preventDefault()
        if (!contract) {
            setErrorMessage('Please connect your wallet first')
            return
        }
        try {
            const tx = await contract.addProduct(
                productDetails.name,
                ethers.parseEther(productDetails.price),
                productDetails.quantity
            )
            await tx.wait()
            setErrorMessage('Product added successfully!')
            setProductDetails({ name: '', price: '', quantity: '' })
        } catch (error) {
            setErrorMessage(error.message)
        }
    }

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
        } catch (error) {
            setErrorMessage(error.message)
        }
    }

    return (
        <div className='p-4 max-w-4xl mx-auto'>
            <h1 className='text-2xl font-bold mb-4'>
                Optimised Contract Interface
            </h1>

            {/* Wallet Connection */}
            <div className='mb-6'>
                <button
                    onClick={connectWallet}
                    className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                >
                    {connectionStatus}
                </button>
                <p className='mt-2'>
                    Connected Account: {defaultAccount || 'None'}
                </p>
            </div>

            {/* Producer Registration */}
            {!isProducer && defaultAccount && (
                <div className='mb-6 p-4 border rounded'>
                    <h2 className='text-xl font-semibold mb-4'>
                        Register as Producer
                    </h2>
                    <form onSubmit={registerAsProducer}>
                        <input
                            type='text'
                            placeholder='Producer Name'
                            value={producerName}
                            onChange={(e) => setProducerName(e.target.value)}
                            className='border p-2 mr-2 rounded'
                            required
                        />
                        <button
                            type='submit'
                            className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
                        >
                            Register
                        </button>
                    </form>
                </div>
            )}

            {/* Producer Interface */}
            {isProducer && (
                <div className='mb-6 p-4 border rounded'>
                    <h2 className='text-xl font-semibold mb-4'>
                        Add New Product
                    </h2>
                    <form onSubmit={addNewProduct}>
                        <div className='grid grid-cols-1 gap-4'>
                            <input
                                type='text'
                                placeholder='Product Name'
                                value={productDetails.name}
                                onChange={(e) =>
                                    setProductDetails({
                                        ...productDetails,
                                        name: e.target.value,
                                    })
                                }
                                className='border p-2 rounded'
                                required
                            />
                            <input
                                type='number'
                                placeholder='Price (ETH)'
                                value={productDetails.price}
                                onChange={(e) =>
                                    setProductDetails({
                                        ...productDetails,
                                        price: e.target.value,
                                    })
                                }
                                className='border p-2 rounded'
                                required
                                step='0.000000000000000001'
                            />
                            <input
                                type='number'
                                placeholder='Quantity'
                                value={productDetails.quantity}
                                onChange={(e) =>
                                    setProductDetails({
                                        ...productDetails,
                                        quantity: e.target.value,
                                    })
                                }
                                className='border p-2 rounded'
                                required
                            />
                            <button
                                type='submit'
                                className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
                            >
                                Add Product
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Customer Interface */}
            {defaultAccount && (
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
            )}

            {/* Error Messages */}
            {errorMessage && (
                <div
                    className={`mt-4 p-4 rounded ${
                        errorMessage.includes('Success')
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                    }`}
                >
                    {errorMessage}
                </div>
            )}
        </div>
    )
}

export default OptimisedContractInterface
