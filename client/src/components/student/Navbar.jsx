import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Menu, Bell, X, Home, User, LogOut, BellOff, Info, CheckCircle, AlertTriangle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { assets } from '../../assets/assets';
// import EducatorNavbar from '../educator/Navbar';

function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isCourseListPage = pathname.includes('/course-list');
  const { user, logout, isAuthenticated, isActiveEducator, activeRole, switchToStudent } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isWhiteBarFixed, setIsWhiteBarFixed] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const mobileProfileRef = useRef(null);

  // ── Dynamic Notifications State ──
  // Ready for API integration: replace initial value with fetched data
  const [notifications, setNotifications] = useState([]);

  const unreadCount = useMemo(
    () => notifications.filter(n => !n.isRead).length,
    [notifications]
  );

  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const notifTypeIcon = useCallback((type) => {
    switch (type) {
      case 'success': return <CheckCircle size={15} className="text-emerald-500 shrink-0 mt-0.5" />;
      case 'alert': return <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />;
      default: return <Info size={15} className="text-sky-500 shrink-0 mt-0.5" />;
    }
  }, []);

  const notifRef = useRef(null);
  const bellRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsWhiteBarFixed(scrollTop > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(e.target) &&
        bellRef.current &&
        !bellRef.current.contains(e.target)
      ) {
        setNotifOpen(false);
      }
      if (
        mobileProfileRef.current &&
        !mobileProfileRef.current.contains(e.target)
      ) {
        setMobileProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleNotif = () => setNotifOpen(prev => !prev);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Bar: Logo + Student/Educator toggle, Login/Signup/UserButton */}
      <div className="w-full flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 py-2 md:py-3 border-b border-emerald-900/20 shadow-sm shadow-emerald-950/10" style={{ background: 'linear-gradient(90deg, #043927 0%, #064e3b 30%, #065f46 65%, #0d9488 100%)' }}>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/" onClick={scrollToTop} className="flex items-center">
            <img src={assets.logo} alt="VidyaTrack Logo" className='w-28 sm:w-36 lg:w-44 cursor-pointer drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]' style={{ filter: 'brightness(1.1) contrast(1.05)' }} />
          </Link>
          <div className="flex items-center gap-1 sm:gap-3 ml-1 sm:ml-2">
            <button
              className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-base font-semibold transition-colors duration-200 ${activeRole === 'user' ? 'bg-white text-emerald-600' : 'bg-emerald-500 text-white'}`}
              onClick={() => {
                if (activeRole === 'educator') {
                  navigate('/switch-role?target=student');
                } else {
                  navigate('/');
                }
              }}
            >
              Student
            </button>
            <button
              className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-base font-semibold transition-colors duration-200 ${activeRole === 'educator' ? 'bg-white text-emerald-600' : 'bg-emerald-500 text-white'}`}
              onClick={() => {
                if (isActiveEducator && isActiveEducator()) {
                  navigate('/educator');
                } else if (isAuthenticated()) {
                  navigate('/switch-role?target=educator');
                } else {
                  navigate('/educator-access');
                }
              }}
            >
              Educator
            </button>
          </div>
        </div>
        {/* Desktop: Login/Signup or Welcome/Logout */}
        <div className="hidden md:flex items-center gap-2 sm:gap-4">
          {!isAuthenticated() ? (
            <>
              <button onClick={() => navigate('/login')} className="border border-white text-white font-bold text-sm sm:text-base rounded-full px-3 py-1 sm:px-6 sm:py-1 cursor-pointer bg-transparent hover:bg-white hover:text-emerald-600 transition">Login</button>
              <button onClick={() => navigate('/signup')} className="border border-white text-white font-bold text-sm sm:text-base rounded-full px-3 py-1 sm:px-6 sm:py-1 cursor-pointer bg-transparent hover:bg-white hover:text-emerald-600 transition">Signup</button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-white text-sm">Welcome, {user?.name}</span>
              <button 
                onClick={logout}
                className="border border-white text-white font-bold text-sm sm:text-base rounded-full px-3 py-1 sm:px-6 sm:py-1 cursor-pointer bg-transparent hover:bg-white hover:text-emerald-600 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        {/* Mobile: Profile icon with dropdown */}
        <div className="md:hidden relative" ref={mobileProfileRef}>
          <button
            onClick={() => setMobileProfileOpen(prev => !prev)}
            className="flex items-center gap-1 text-white"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
              {isAuthenticated() ? (
                <span className="text-white text-sm font-bold">{user?.name?.charAt(0)?.toUpperCase()}</span>
              ) : (
                <User size={16} className="text-white" />
              )}
            </div>
            <ChevronDown size={14} className={`text-white/80 transition-transform duration-200 ${mobileProfileOpen ? 'rotate-180' : ''}`} />
          </button>
          {mobileProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
              {isAuthenticated() ? (
                <>
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => { logout(); setMobileProfileOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { navigate('/login'); setMobileProfileOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User size={15} />
                    Login
                  </button>
                  <button
                    onClick={() => { navigate('/signup'); setMobileProfileOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors"
                  >
                    <User size={15} />
                    Sign Up
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar: Main Navigation */}
      <div className={`${isWhiteBarFixed ? 'fixed top-0 left-0 right-0 z-40' : ''} border-b py-2 md:py-3 px-4 sm:px-10 md:px-14 lg:px-36 flex items-center transition-all duration-300 bg-white`}>
        <div className='flex items-center gap-4'>
          <Link to="/" onClick={scrollToTop} className={`flex items-center gap-2 transition-colors ${pathname === '/' ? 'text-emerald-600 font-bold' : 'text-gray-700'}`}>
            <Home size={20} />
            <span className="hidden sm:inline text-sm font-medium">Home</span>
          </Link>
        </div>
        <div className='hidden md:flex flex-1 justify-center items-center gap-6 text-gray-700'>
          {isAuthenticated() && <NavLink to="/my-dashboard" className={({ isActive }) => isActive ? 'text-emerald-600 font-bold' : undefined}>My Dashboard</NavLink>}
          <NavLink to="/course-list" className={({ isActive }) => isActive ? 'text-emerald-600 font-bold' : undefined}>Courses</NavLink>
          <NavLink to="/mentor" className={({ isActive }) => isActive ? 'text-emerald-600 font-bold' : undefined}>Mentor</NavLink>
          <NavLink to="/blog" className={({ isActive }) => isActive ? 'text-emerald-600 font-bold' : undefined}>Blog</NavLink>
          <NavLink to="/resume" className={({ isActive }) => isActive ? 'text-emerald-600 font-bold' : undefined}>Resume</NavLink>
        </div>
        <div className='hidden md:flex items-center gap-4'>
          <button ref={bellRef} onClick={toggleNotif} className='relative hover:text-emerald-600 transition-colors duration-200'>
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className='absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 leading-none'>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          {isAuthenticated() && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <button onClick={logout} className="text-gray-700 hover:text-emerald-600">
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
        <div className='hidden md:flex items-center gap-4'>
          {/* No Login/Signup on white bar when not logged in */}
        </div>
        {/* Mobile menu icon on the right of the white bar */}
        <div className='md:hidden flex-1 flex justify-end items-center'>
          <button onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {/* Mobile Menu and Notifications remain unchanged */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3 }}
            className='fixed top-0 right-0 w-64 h-full bg-white shadow-xl p-6 z-50 flex flex-col gap-4'
          >
            <button onClick={toggleMobileMenu} className='self-end'><X /></button>
            {/* Centered profile icon on mobile */}
            <div className='flex justify-center mb-4'>
              {isAuthenticated() ? (
                <div className="flex flex-col items-center gap-2">
                  <div className='w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-lg'>
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-600">{user?.name}</span>
                  <button onClick={() => { logout(); toggleMobileMenu(); }} className="text-red-600 text-sm">
                    Logout
                  </button>
                </div>
              ) : (
                <div className='w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-lg'>I</div>
              )}
            </div>
            {isAuthenticated() && <Link to="/my-dashboard" onClick={toggleMobileMenu}>My Dashboard</Link>}
            <Link to="/course-list" onClick={toggleMobileMenu}>Courses</Link>
            <Link to="/mentor" onClick={toggleMobileMenu}>Mentor</Link>
            <Link to="/blog" onClick={toggleMobileMenu}>Blog</Link>
            <Link to="/resume" onClick={toggleMobileMenu}>Resume</Link>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {notifOpen && (
          <motion.div
            ref={notifRef}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className='absolute top-16 right-10 w-80 bg-white shadow-xl shadow-gray-200/60 rounded-2xl border border-gray-100 text-sm z-40 overflow-hidden'
          >
            {/* Header */}
            <div className='flex items-center justify-between px-4 pt-4 pb-2'>
              <p className='font-bold text-gray-800 text-base'>Notifications</p>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className='text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors'
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className='max-h-72 overflow-y-auto'>
              {notifications.length === 0 ? (
                /* ── Empty State ── */
                <div className='flex flex-col items-center justify-center py-10 px-4'>
                  <BellOff size={32} className='text-gray-300 mb-3' />
                  <p className='text-gray-400 text-sm'>You're all caught up 🎉</p>
                </div>
              ) : (
                <ul className='divide-y divide-gray-50'>
                  {notifications.map((notif) => (
                    <li
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors duration-150 hover:bg-emerald-50/60 ${
                        !notif.isRead ? 'border-l-[3px] border-l-emerald-500 bg-emerald-50/30' : 'border-l-[3px] border-l-transparent'
                      }`}
                    >
                      {notifTypeIcon(notif.type)}
                      <div className='flex-1 min-w-0'>
                        <p className={`text-gray-800 text-sm leading-snug ${
                          !notif.isRead ? 'font-semibold' : 'font-normal'
                        }`}>
                          {notif.title}
                        </p>
                        {notif.message && (
                          <p className='text-gray-500 text-xs mt-0.5 truncate'>{notif.message}</p>
                        )}
                        {notif.createdAt && (
                          <p className='text-gray-400 text-[11px] mt-1'>{notif.createdAt}</p>
                        )}
                      </div>
                      {!notif.isRead && (
                        <span className='w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5' />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
