import React from 'react'

export const WalletConnection = ({
    connectWallet,
    connectionStatus,
    defaultAccount,
}) => {
    return (
        <div className='flex mb-6'>
            <button className='mt-2 me-4 text-white'>
                Connected Account: {defaultAccount || 'None'}
            </button>
            <button
                onClick={
                    connectionStatus === 'Wallet Connected'
                        ? null
                        : connectWallet
                }
                className={`px-4 py-2 rounded ${
                    connectionStatus === 'Wallet Connected'
                        ? 'bg-green-400 text-white cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                disabled={connectionStatus === 'Wallet Connected'}
            >
                {connectionStatus}
            </button>
        </div>
    )
}
