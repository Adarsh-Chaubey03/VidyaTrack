import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/educator/Navbar'
import Sidebar from '../../components/educator/Sidebar'
import Footer from '../../components/educator/Footer'

function Educator() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar/>
            {/* Divider below Navbar */}
            <div className="border-b border-gray-300 w-full" />
            <div className='flex flex-1'>
                <Sidebar/>
                <main className='flex-1'>
                  <Outlet />
                </main>
            </div>
            <Footer/>
        </div>
    )
}

export default Educator
