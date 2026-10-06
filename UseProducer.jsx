import { useState } from 'react'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
export const UseProducer = (contract, setErrorMessage) => {
    const [producerName, setProducerName] = useState('')
    const [productDetails, setProductDetails] = useState({
        name: '',
        price: '',
        quantity: '',
    })

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
            setErrorMessage('Successfully registered as producer!')
            toast.success('Successfully registered as a producer')
            return true
        } catch (error) {
            console.error('Registration error:', error)
            setErrorMessage(error.message)
            toast.error('Error registering as a producer')
            return false
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
            toast.success('Successfully Added Product')
            return tx
        } catch (error) {
            toast.error('Error While Adding Product')
            setErrorMessage(error.message)
        }
    }
    // 🔥 New function: Update product price
    const updateProduct = async (productId, newPrice) => {
        if (!contract) {
            setErrorMessage('Please connect your wallet first')
            return
        }
        try {
            setErrorMessage('Updating product price...')
            const tx = await contract.updatePrice(
                productId,
                ethers.parseEther(newPrice)
            ) // Convert to Wei
            await tx.wait()
            toast.success('Successfully Updated Product price')
            setErrorMessage('Product price updated successfully!')
            return tx
        } catch (error) {
            setErrorMessage(error.message)
            toast.error('Error While Updating Product')
        }
    }

    return {
        producerName,
        setProducerName,
        productDetails,
        setProductDetails,
        registerAsProducer,
        addNewProduct,
        updateProduct,
    }
}
