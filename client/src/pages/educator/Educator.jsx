import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/educator/Navbar'
import Sidebar from '../../components/educator/Sidebar'
import Footer from '../../components/educator/Footer'
import Preview from './Preview'
import { useUser } from '@clerk/clerk-react'

function Educator() {
    const { user } = useUser();

    if (!user) {
        // Not logged in: show only the Preview page
        return <Preview />;
    }

    // Logged in: show full educator dashboard
    return (
        <div className="min-h-screen flex flex-col">
            {/* Pass afterSignOutUrl to Navbar for correct redirect */}
            <Navbar afterSignOutUrl="/educator" />
            <div className="border-b border-gray-300 w-full" />
            <div className='flex flex-1'>
                <Sidebar />
                <main className='flex-1'>
                  <Outlet />
                </main>
            </div>
            <Footer />
        </div>
    )
}

export default Educator
