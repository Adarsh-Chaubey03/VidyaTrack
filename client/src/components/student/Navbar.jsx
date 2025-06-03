import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { Menu, Bell, Search, Sun, Moon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { assets } from '../../assets/assets';

function Navbar() {
  const { pathname } = useLocation();
  const isCourseListPage = pathname.includes('/course-list');
  const { openSignIn } = useClerk();
  const { user } = useUser();

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleNotif = () => setNotifOpen(!notifOpen);

  return (
    <div className={`sticky top-0 z-50 border-b py-4 px-4 sm:px-10 md:px-14 lg:px-36 flex items-center justify-between transition-all duration-300 ${isCourseListPage ? 'bg-white dark:bg-gray-900' : 'bg-cyan-100/70 dark:bg-gray-800'}`}>
      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} alt="Logo" className='w-28 lg:w-32 cursor-pointer' />
      </Link>

      {/* Center Features */}
      <div className='hidden md:flex items-center gap-6 text-gray-700 dark:text-gray-300'>
        <button onClick={toggleNotif} className='relative hover:text-blue-600'>
          <Bell />
          <span className='absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full'></span>
        </button>
        <div className='relative'>
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 rounded-full border dark:border-gray-600 focus:outline-none focus:ring dark:bg-gray-700 dark:text-white"
          />
          <Search className='absolute right-3 top-2.5 text-gray-400 dark:text-gray-300' size={16} />
        </div>
        <button onClick={() => setDarkMode(!darkMode)} className='hover:text-blue-600'>
          {darkMode ? <Sun /> : <Moon />}
        </button>
        {user && <Link to="/my-enrollement">My Enrollment</Link>}
        {user && <button>Become Educator</button>}
      </div>

      {/* Auth Buttons + User */}
      <div className='hidden md:flex items-center gap-4'>
        {user ? <UserButton /> : (
          <button onClick={() => openSignIn()} className='bg-blue-600 px-5 py-2 rounded-full text-white hover:bg-blue-700'>
            Get Started
          </button>
        )}
      </div>

      {/* Mobile Toggle */}
      <div className='md:hidden flex items-center gap-2'>
        <button onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3 }}
            className='fixed top-0 right-0 w-64 h-full bg-white dark:bg-gray-900 shadow-xl p-6 z-50 flex flex-col gap-4'
          >
            <button onClick={toggleMobileMenu} className='self-end'><X /></button>
            {user && <Link to="/my-enrollement" onClick={toggleMobileMenu}>My Enrollment</Link>}
            {user && <button onClick={toggleMobileMenu}>Become Educator</button>}
            {user ? <UserButton afterSignOutUrl='/' /> : <button onClick={() => openSignIn()} className='text-blue-600'>Create Account</button>}
            <button onClick={() => setDarkMode(!darkMode)} className='mt-4 flex items-center gap-2'>
              {darkMode ? <Sun /> : <Moon />} {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {notifOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='absolute top-16 right-10 w-72 bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 text-sm z-40'
          >
            <p className='font-semibold mb-2 dark:text-white'>Notifications</p>
            <ul className='space-y-2 text-gray-700 dark:text-gray-300'>
              <li>🎉 New course added</li>
              <li>📢 System maintenance at 10 PM</li>
              <li>📥 New enrollment approved</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Navbar;
