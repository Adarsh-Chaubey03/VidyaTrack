import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { assets, dummyEducatorData } from '../../assets/assets'
import { UserButton, useUser } from '@clerk/clerk-react'

function Navbar({ afterSignOutUrl }) {
    const educatorData = dummyEducatorData
    const { user } = useUser()
    const location = useLocation();
    const isEducator = location.pathname.startsWith('/educator');
    
    return (
       <div className='flex justify-between items-center px-4 md:px-8 border-b border-gray-500 py-3 bg-white'>
        <div className="flex items-center gap-4">
          <Link to='/educator'>
            <img src={assets.eduLogo} alt="VidyaTrack Educator Logo" className='w-32 lg:w-40 cursor-pointer' />
          </Link>
          <div className="flex items-center gap-2 ml-2">
            <Link
              to="/"
              className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors duration-200 ${!isEducator ? 'bg-white text-emerald-600' : 'bg-emerald-400 text-white'}`}
            >
              Student
            </Link>
            <Link
              to="/educator"
              className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors duration-200 ${isEducator ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-600'}`}
            >
              Educator
      </Link>
          </div>
        </div>
        <div className='flex items-center gap-5 text-gray-500'>
            <p>Hi! {user ? user.fullName : 'Educator'}</p>
            {user ? <UserButton afterSignOutUrl="/educator" /> : <img src={assets.profile_img} className='w-10 h-10 rounded-full' alt="Profile" />}
        </div>
       </div> 
    )
}

export default Navbar
