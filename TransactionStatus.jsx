import React from 'react'

export const TransactionStatus = ({ transactions }) => {
    if (transactions.length === 0) return null

    return (
        <div className='fixed bottom-4 right-4 max-w-sm'>
            {transactions.slice(0, 5).map((tx) => (
                <div
                    key={tx.hash}
                    className={`mb-2 p-4 rounded shadow-lg ${
                        tx.status === 'pending'
                            ? 'bg-yellow-100'
                            : tx.status === 'completed'
                            ? 'bg-green-100'
                            : 'bg-red-100'
                    }`}
                >
                    <p className='font-medium'>{tx.description}</p>
                    <p className='text-sm text-gray-600'>Status: {tx.status}</p>
                </div>
            ))}
        </div>
    )
}
