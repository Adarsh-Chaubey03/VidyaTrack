import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { assets, dummyEducatorData } from '../../assets/assets'
import { useAuth } from '../../context/AuthContext.jsx'
import { LogOut } from 'lucide-react'

function Navbar({ afterSignOutUrl }) {
    const educatorData = dummyEducatorData
    const { user, logout, isAuthenticated } = useAuth()
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
              to="/educator"
              className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors duration-200 ${isEducator ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-600'}`}
            >
              Educator
            </Link>
            <Link
              to="/"
              className={`px-3 py-1 rounded-full text-sm font-semibold border border-gray-400 transition-colors duration-200 ${!isEducator ? 'text-gray-700 bg-white hover:bg-emerald-500 hover:text-white' : 'text-gray-700 bg-white hover:bg-emerald-500 hover:text-white'}`}
            >
              Student
            </Link>
          </div>
        </div>
        <div className='flex items-center gap-5 text-gray-500'>
            <p>Hi! {isAuthenticated() ? user?.name : 'Educator'}</p>
            {isAuthenticated() ? (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                        {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <button onClick={logout} className="text-gray-700 hover:text-emerald-600">
                        <LogOut size={20} />
                    </button>
                </div>
            ) : (
                <img src={assets.profile_img} className='w-10 h-10 rounded-full' alt="Profile" />
            )}
        </div>
       </div> 
    )
}

export default Navbar
