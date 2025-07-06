import React, { useEffect, useRef, useState, useContext } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { Menu, Bell, X, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { assets } from '../../assets/assets';
import MyEnrollment from '../../pages/student/MyEnrollment';  
import { AppContext } from '../../context/AppContext';
// import EducatorNavbar from '../educator/Navbar';

function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isCourseListPage = pathname.includes('/course-list');
  const { openSignIn } = useClerk();
  const { user } = useUser();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isWhiteBarFixed, setIsWhiteBarFixed] = useState(false);

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
      <div className="w-full flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 py-2 border-b bg-gradient-to-r from-emerald-600 via-emerald-700 to-gray-500">
        <div className="flex items-center gap-2 -ml-4">
          <Link to="/" onClick={scrollToTop}>
            <img src={assets.logo} alt="VidyaTrack Logo" className='w-32 lg:w-40 cursor-pointer' />
          </Link>
          <div className="flex items-center gap-1 sm:gap-3 ml-1">
            <button
              className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-sm sm:text-base font-semibold transition-colors duration-200 bg-white text-emerald-600`}
              onClick={() => navigate('/')}
            >
              Student
            </button>
            <button
              className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-sm sm:text-base font-semibold transition-colors duration-200 bg-emerald-500 text-white`}
              onClick={() => navigate('/educator')}
            >
              Educator
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {!user && (
            <>
              <button onClick={() => openSignIn()} className="border border-white text-white font-bold text-sm sm:text-base rounded-full px-3 py-1 sm:px-6 sm:py-1 cursor-pointer bg-transparent hover:bg-white hover:text-emerald-600 transition">Login</button>
              <button onClick={() => openSignIn()} className="border border-white text-white font-bold text-sm sm:text-base rounded-full px-3 py-1 sm:px-6 sm:py-1 cursor-pointer bg-transparent hover:bg-white hover:text-emerald-600 transition">Signup</button>
            </>
          )}
        </div>
      </div>

      {/* Bottom Bar: Main Navigation */}
      <div className={`${isWhiteBarFixed ? 'fixed top-0 left-0 right-0 z-40' : ''} border-b py-3 px-4 sm:px-10 md:px-14 lg:px-36 flex items-center transition-all duration-300 bg-white`}>
        <div className='flex items-center gap-4'>
          <Link to="/" onClick={scrollToTop} className={`flex items-center gap-2 transition-colors ${pathname === '/' ? 'text-emerald-600 font-bold' : 'text-gray-700'}`}>
            <Home size={20} />
            <span className="hidden sm:inline text-sm font-medium">Home</span>
          </Link>
        </div>
        <div className='hidden md:flex flex-1 justify-center items-center gap-6 text-gray-700'>
          {user && <NavLink to="/my-enrollment" className={({ isActive }) => isActive ? 'text-emerald-600 font-bold' : undefined}>My Enrollment</NavLink>}
          <NavLink to="/course-list" className={({ isActive }) => isActive ? 'text-emerald-600 font-bold' : undefined}>Courses</NavLink>
          <NavLink to="/mentor" className={({ isActive }) => isActive ? 'text-emerald-600 font-bold' : undefined}>Mentor</NavLink>
          <NavLink to="/resumereview" className={({ isActive }) => isActive ? 'text-emerald-600 font-bold' : undefined}>Resume</NavLink>
          <NavLink to="/interview" className={({ isActive }) => isActive ? 'text-emerald-600 font-bold' : undefined}>Interview</NavLink>
        </div>
        <div className='hidden md:flex items-center gap-4'>
          <button ref={bellRef} onClick={toggleNotif} className='relative hover:text-blue-600'>
            <Bell />
            <span className='absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full'></span>
          </button>
          {user && <UserButton />}
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
            {user && <Link to="/my-enrollment" onClick={toggleMobileMenu}>My Enrollment</Link>}
            <Link to="/course-list" onClick={toggleMobileMenu}>Courses</Link>
            <Link to="/mentor" onClick={toggleMobileMenu}>Mentor</Link>
            <Link to="/resumereview" onClick={toggleMobileMenu}>Resume</Link>
            <Link to="/interview" onClick={toggleMobileMenu}>Interview</Link>
            {user ? <UserButton afterSignOutUrl='/' /> : <button onClick={() => openSignIn()} className='text-blue-600'>Create Account</button>}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {notifOpen && (
          <motion.div
            ref={notifRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='absolute top-16 right-10 w-72 bg-white shadow-xl rounded-xl p-4 text-sm z-40'
          >
            <p className='font-semibold mb-2'>Notifications</p>
            <ul className='space-y-2 text-gray-700'>
              <li>🎉 New course added</li>
              <li>📢 System maintenance at 10 PM</li>
              <li>📥 New enrollment approved</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
