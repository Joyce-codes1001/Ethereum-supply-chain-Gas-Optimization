// https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import SimpleStorage_abi from './contracts/SimpleStorage_abi.json'

const SimpleStorage = () => {
    // deploy simple storage contract and paste deployed contract address here. This value is local ganache chain
    let contractAddress = '0x406AB5033423Dcb6391Ac9eEEad73294FA82Cfbc'

    const [errorMessage, setErrorMessage] = useState(null)
    const [defaultAccount, setDefaultAccount] = useState(null)
    const [connButtonText, setConnButtonText] = useState('Connect Wallet')

    const [currentContractVal, setCurrentContractVal] = useState(null)

    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [contract, setContract] = useState(null)

    const connectWalletHandler = () => {
        if (window.ethereum && window.ethereum.isMetaMask) {
            window.ethereum
                .request({ method: 'eth_requestAccounts' })
                .then((result) => {
                    accountChangedHandler(result[0])
                    setConnButtonText('Wallet Connected')
                })
                .catch((error) => {
                    setErrorMessage(error.message)
                })
        } else {
            console.log('Need to install MetaMask')
            setErrorMessage(
                'Please install MetaMask browser extension to interact'
            )
        }
    }

    // update account, will cause component re-render
    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount)
        updateEthers()
    }
    useEffect(() => {
        if (!provider) return

        const readOnlyContract = new ethers.Contract(
            contractAddress,
            SimpleStorage_abi,
            provider
        )

        const handleEvent = (eventOutput) => {
            console.log('Event received:', eventOutput)
            setCurrentContractVal(eventOutput)
        }

        console.log('Listening to MyEventTest...')
        readOnlyContract.on('myEventTest', handleEvent)

        return () => {
            console.log('Cleaning up event listener...')
            readOnlyContract.off('myEventTest', handleEvent)
        }
    }, [provider])
    const chainChangedHandler = () => {
        // reload the page to avoid any errors with chain change mid use of application
        window.location.reload()
    }

    // listen for account changes
    window.ethereum.on('accountsChanged', accountChangedHandler)

    window.ethereum.on('chainChanged', chainChangedHandler)

    const updateEthers = async () => {
        let tempProvider = new ethers.BrowserProvider(window.ethereum)
        setProvider(tempProvider)

        let tempSigner = await tempProvider.getSigner()
        setSigner(tempSigner)

        let tempContract = new ethers.Contract(
            contractAddress,
            SimpleStorage_abi,
            tempSigner
        )
        setContract(tempContract)
    }

    const setHandler = async (event) => {
        event.preventDefault()
        if (!contract) {
            console.error('Contract is not initialized yet')
        }
        console.log(
            'sending ' + event.target.setText.value + ' to the contract'
        )
        try {
            const tx = await contract.set(event.target.setText.value) // ✅ Fix: Await transaction
            console.log('Transaction sent:', tx.hash)
            await tx.wait() // ✅ Fix: Wait for confirmation
            console.log('Transaction confirmed!')
        } catch (error) {
            console.error('Transaction failed:', error)
        }
    }

    const getCurrentVal = async () => {
        if (!contract) {
            console.error('Contract is not initialized yet')
            return
        }

        try {
            const logs = await contract.queryFilter(
                contract.filters.myEventTest()
            )
            console.log('Past Events:', logs)
            // const tempProvider = new ethers.BrowserProvider(window.ethereum) // ✅ Use provider for read-only calls
            // const readOnlyContract = new ethers.Contract(
            //     contractAddress,
            //     SimpleStorage_abi,
            //     tempProvider // ✅ Use provider, not signer
            // )

            // const val = await readOnlyContract.get() // ✅ Call contract function correctly
            // console.log('Contract value:', val)
            const tx = await contract.get() // ⛔ This is a transaction now!
            console.log('Transaction sent:', tx.hash)
            const receipt = await tx.wait() // ✅ Wait for confirmation
            console.log('Logs:', receipt)
            const event = receipt.logs.find(
                (log) => log.event === 'myEventTest'
            )
            if (event) {
                console.log('Stored Value from Event:', event.args.eventOutput)
                setCurrentContractVal(event.args.eventOutput)
            } else {
                console.log('No Event')
            }
            // console.log("Transaction confirmed!", receipt);
            setCurrentContractVal('updated')
        } catch (error) {
            console.error('Error fetching contract value:', error)
        }
    }

    return (
        <div>
            <h4> {'Get/Set Contract interaction'} </h4>
            <button onClick={connectWalletHandler}>{connButtonText}</button>
            <div>
                <h3>Address: {defaultAccount}</h3>
            </div>
            <form onSubmit={setHandler}>
                <input id='setText' type='text' />
                <button type={'submit'}> Update Contract </button>
            </form>
            <div>
                <button onClick={getCurrentVal} style={{ marginTop: '5em' }}>
                    {' '}
                    Get Current Contract Value{' '}
                </button>
            </div>
            {currentContractVal}
            {errorMessage}
        </div>
    )
}

export default SimpleStorage
