import React from 'react'

export const ErrorMessage = ({ message }) => {
    if (!message) return null

    return (
        <div
            className={`mt-4 p-4 rounded ${
                message.includes('Success')
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
            }`}
        >
            {message}
        </div>
    )
}
