// src/components/producer/ProducerRegistration.js
import React from 'react'

export const ProducerRegistration = ({
    producerName,
    setProducerName,
    registerAsProducer,
}) => {
    return (
        <div className='mb-6 p-4 border rounded'>
            <h2 className='text-xl font-semibold mb-4'>Register as Producer</h2>
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
    )
}
