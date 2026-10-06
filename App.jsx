import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'react-toastify/dist/ReactToastify.css'
import SimpleStorage from './SimpleStorage'
import OptimisedContractInterface from './OptimisedContractInterface'
import AppBody from './AppBody'
import { ToastContainer } from 'react-toastify'

function App() {
    return (
        <>
            <div>
                {/* <SimpleStorage /> */}
                {/* <OptimisedContractInterface /> */}
                <AppBody />
                <ToastContainer />
            </div>
        </>
    )
}

export default App
