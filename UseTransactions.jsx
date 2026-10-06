import { useState } from 'react'

export const useTransactions = () => {
    const [transactions, setTransactions] = useState([])

    const addTransaction = (tx, description) => {
        const newTx = {
            hash: tx.hash,
            description,
            status: 'pending',
            timestamp: Date.now(),
        }
        setTransactions((prev) => [newTx, ...prev])
        return newTx
    }

    const updateTransaction = (hash, status) => {
        setTransactions((prev) =>
            prev.map((tx) => (tx.hash === hash ? { ...tx, status } : tx))
        )
    }

    return {
        transactions,
        addTransaction,
        updateTransaction,
    }
}
