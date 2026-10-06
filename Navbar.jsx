import { useState } from 'react'
import { WalletConnection } from './WalletConnection'

export const NavBar = ({
    connectWallet,
    connectionStatus,
    defaultAccount,
    isSeller,
    toggleRole,
}) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <nav className='bg-gray-800'>
            <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
                <div className='relative flex h-16 items-center justify-between'>
                    {/* Mobile Menu Button */}
                    <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
                        <button
                            type='button'
                            className='relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white'
                            aria-controls='mobile-menu'
                            aria-expanded={mobileMenuOpen}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <svg
                                    className='size-6'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='1.5'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='M6 18 18 6M6 6l12 12'
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className='size-6'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='1.5'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                                    />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Logo and Navigation */}
                    <div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
                        <div className='flex shrink-0 items-center'>
                            <img
                                className='h-8 w-auto'
                                src='https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500'
                                alt='Company Logo'
                            />
                        </div>
                        <div className='hidden sm:ml-6 sm:flex space-x-4'>
                            <button
                                className={`px-3 py-2 rounded-md text-sm font-medium focus:outline-none ${
                                    isSeller
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                                onClick={toggleRole}
                            >
                                Seller
                            </button>
                            <button
                                className={`px-3 py-2 rounded-md text-sm font-medium focus:outline-none ${
                                    !isSeller
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                                onClick={toggleRole}
                            >
                                Buyer
                            </button>
                        </div>
                    </div>

                    {/* Wallet Connection */}
                    <div className='absolute inset-y-0 right-0 flex items-center pr-2 mt-5'>
                        <WalletConnection
                            connectWallet={connectWallet}
                            connectionStatus={connectionStatus}
                            defaultAccount={defaultAccount}
                        />
                    </div>
                </div>
            </div>
        </nav>
    )
}
