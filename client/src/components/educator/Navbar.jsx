import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { useAuth } from '../../context/AuthContext.jsx'
import { LogOut, Menu } from 'lucide-react'

function Navbar({ onMenuToggle }) {
    const { user, logout, isAuthenticated } = useAuth()
    const location = useLocation();
    const isEducator = location.pathname.startsWith('/educator');

    return (
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
            <div className="flex items-center justify-between px-4 md:px-6 h-14">
                {/* Left: hamburger + logo + role switcher */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMenuToggle}
                        className="md:hidden p-1.5 -ml-1.5 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <Link to="/educator" className="flex-shrink-0">
                        <img src={assets.eduLogo} alt="VidyaTrack" className="h-7 lg:h-8 w-auto" />
                    </Link>
                    <div className="hidden sm:flex items-center gap-1.5 ml-2">
                        <Link
                            to="/educator"
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-150
                                ${isEducator ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                            Educator
                        </Link>
                        <Link
                            to="/switch-role?target=student"
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-150
                                ${!isEducator ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                            Student
                        </Link>
                    </div>
                </div>

                {/* Right: user info */}
                <div className="flex items-center gap-3">
                    {isAuthenticated() && (
                        <span className="hidden sm:block text-sm text-slate-500">
                            {user?.name}
                        </span>
                    )}
                    {isAuthenticated() ? (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-semibold">
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <button
                                onClick={logout}
                                className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-sm font-semibold">
                            ?
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Navbar
