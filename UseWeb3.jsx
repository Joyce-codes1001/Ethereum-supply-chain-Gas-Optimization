// src/hooks/useWeb3.js
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/ContractConfig'

export const UseWeb3 = () => {
    const [contract, setContract] = useState(null)
    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [defaultAccount, setDefaultAccount] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [connectionStatus, setConnectionStatus] = useState('Connect Wallet')
    const [isProducer, setIsProducer] = useState(false)

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

    const checkProducerStatus = async (contractInstance, address) => {
        try {
            const producerName = await contractInstance.producers(address)
            return producerName !== ''
        } catch (error) {
            console.error('Error checking producer status:', error)
            return false
        }
    }

    const accountChangedHandler = (newAccount) => {
        const account = Array.isArray(newAccount) ? newAccount[0] : newAccount
        console.log(account)
        setDefaultAccount(account)
        updateEthers()
    }

    const updateEthers = async () => {
        try {
            const tempProvider = new ethers.BrowserProvider(window.ethereum)
            setProvider(tempProvider)

            const tempSigner = await tempProvider.getSigner()
            setSigner(tempSigner)

            const tempContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                CONTRACT_ABI,
                tempSigner
            )
            setContract(tempContract)

            const signerAddress = await tempSigner.getAddress()
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

    return {
        contract,
        provider,
        signer,
        defaultAccount,
        errorMessage,
        connectionStatus,
        isProducer,
        connectWallet,
        setErrorMessage,
    }
}
