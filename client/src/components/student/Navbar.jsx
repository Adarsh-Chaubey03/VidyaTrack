import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Menu, Bell, X, User, LogOut, BellOff, Info, CheckCircle, AlertTriangle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { assets } from '../../assets/assets';

function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isActiveEducator, activeRole } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen]           = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);

  const mobileProfileRef = useRef(null);
  const notifRef         = useRef(null);
  const bellRef          = useRef(null);

  const [notifications, setNotifications] = useState([]);

  const unreadCount = useMemo(
    () => notifications.filter(n => !n.isRead).length,
    [notifications]
  );

  const markAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const notifTypeIcon = useCallback((type) => {
    switch (type) {
      case 'success': return <CheckCircle size={15} className="text-emerald-500 shrink-0 mt-0.5" />;
      case 'alert':   return <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />;
      default:        return <Info size={15} className="text-sky-500 shrink-0 mt-0.5" />;
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(e.target) &&
        bellRef.current &&
        !bellRef.current.contains(e.target)
      ) setNotifOpen(false);

      if (
        mobileProfileRef.current &&
        !mobileProfileRef.current.contains(e.target)
      ) setMobileProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* Active nav link: pill highlight */
  const navCls = ({ isActive }) =>
    isActive
      ? 'text-white text-sm font-semibold bg-white/15 rounded-full px-4 py-1.5 transition-all'
      : 'text-gray-300 text-sm font-medium hover:text-white transition-colors px-1';

  return (
    <>
      {/* ── Sticky dark-green single navbar ── */}
      <nav
        className="sticky top-0 z-40 w-full flex items-center justify-between px-5 sm:px-10 md:px-14 lg:px-20 py-3"
        style={{ background: 'linear-gradient(90deg,#042d1e 0%,#053d28 40%,#064e3b 100%)' }}
      >
        {/* LEFT: Logo + role switcher */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Logo — just navigates, no scroll */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              src={assets.logo}
              alt="VidyaTrack"
              className="w-28 sm:w-32"
              style={{ filter: 'brightness(1.15)' }}
            />
          </Link>

          {/* Role-switcher pill */}
          <div className="flex items-center bg-[#1a3d2b] rounded-full p-[3px]">
            <button
              className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeRole !== 'educator'
                  ? 'bg-[#c6e8d4] text-[#1a3d2b] shadow-sm'
                  : 'text-[#a8d5b5] hover:text-white'
              }`}
              onClick={() =>
                activeRole === 'educator'
                  ? navigate('/switch-role?target=student')
                  : navigate('/')
              }
            >
              Student
            </button>
            <button
              className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeRole === 'educator'
                  ? 'bg-[#c6e8d4] text-[#1a3d2b] shadow-sm'
                  : 'text-[#a8d5b5] hover:text-white'
              }`}
              onClick={() => {
                if (isActiveEducator && isActiveEducator()) { navigate('/educator'); return; }
                if (isAuthenticated()) {
                  navigate(
                    user?.role === 'educator' && user?.educatorApproved
                      ? '/educator'
                      : '/educator-access'
                  );
                } else {
                  navigate('/educator-access');
                }
              }}
            >
              Educator
            </button>
          </div>
        </div>

        {/* CENTER: Nav links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          <NavLink to="/" end className={navCls}>Home</NavLink>
          {isAuthenticated() && (
            <NavLink to="/my-dashboard" className={navCls}>Dashboard</NavLink>
          )}
          <NavLink to="/course-list" className={navCls}>Courses</NavLink>
          <NavLink to="/mentor" className={navCls}>Mentor</NavLink>
          <NavLink to="/copilot" className={navCls}>Copilot</NavLink>
          <NavLink to="/resume" className={navCls}>Resume</NavLink>
        </div>

        {/* RIGHT: Bell + Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            ref={bellRef}
            onClick={() => setNotifOpen(prev => !prev)}
            className="relative text-gray-300 hover:text-white transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 leading-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {!isAuthenticated() ? (
            <>
              <button
                onClick={() => navigate('/login')}
                className="border border-white/60 text-white text-sm font-semibold rounded-full px-5 py-1.5 hover:bg-white/10 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="flex items-center gap-1.5 bg-emerald-400 hover:bg-emerald-300 text-[#042d1e] text-sm font-bold rounded-full px-5 py-1.5 transition"
              >
                Signup <span className="text-base leading-none font-bold">↗</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <button onClick={logout} className="text-gray-300 hover:text-white" aria-label="Logout">
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile: profile + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <div className="relative" ref={mobileProfileRef}>
            <button
              onClick={() => setMobileProfileOpen(prev => !prev)}
              className="flex items-center gap-1 text-white"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
                {isAuthenticated()
                  ? <span className="text-white text-sm font-bold">{user?.name?.charAt(0)?.toUpperCase()}</span>
                  : <User size={16} className="text-white" />}
              </div>
              <ChevronDown size={13} className={`text-white/70 transition-transform ${mobileProfileOpen ? 'rotate-180' : ''}`} />
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
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { navigate('/login'); setMobileProfileOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <User size={15} /> Login
                    </button>
                    <button onClick={() => { navigate('/signup'); setMobileProfileOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50">
                      <User size={15} /> Sign Up
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          <button onClick={() => setMobileMenuOpen(prev => !prev)} className="text-white">
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.26 }}
            className="fixed top-0 right-0 w-64 h-full bg-[#042d1e] shadow-2xl p-6 z-50 flex flex-col gap-4"
          >
            <button onClick={() => setMobileMenuOpen(false)} className="self-end text-white"><X size={22} /></button>
            <div className="flex flex-col gap-5 mt-2">
              {isAuthenticated() && (
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-white text-sm">{user?.name}</span>
                </div>
              )}
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white text-sm font-medium">Home</Link>
              {isAuthenticated() && <Link to="/my-dashboard" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white text-sm font-medium">My Dashboard</Link>}
              <Link to="/course-list" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white text-sm font-medium">Courses</Link>
              <Link to="/mentor" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white text-sm font-medium">Mentor</Link>
              <Link to="/copilot" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white text-sm font-medium">Copilot</Link>
              <Link to="/resume" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white text-sm font-medium">Resume</Link>
              {isAuthenticated()
                ? <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-left text-red-400 text-sm font-medium mt-2">Logout</button>
                : <div className="flex flex-col gap-2 mt-2">
                    <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="text-white border border-white/30 rounded-full py-1.5 text-sm font-semibold">Login</button>
                    <button onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }} className="bg-emerald-400 text-[#042d1e] rounded-full py-1.5 text-sm font-bold">Sign Up</button>
                  </div>
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Notifications panel ── */}
      <AnimatePresence>
        {notifOpen && (
          <motion.div
            ref={notifRef}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed top-16 right-10 w-80 bg-white shadow-xl rounded-2xl border border-gray-100 text-sm z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <p className="font-bold text-gray-800 text-base">Notifications</p>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4">
                  <BellOff size={32} className="text-gray-300 mb-3" />
                  <p className="text-gray-400 text-sm">You're all caught up 🎉</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {notifications.map((notif) => (
                    <li
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-emerald-50/60 ${
                        !notif.isRead
                          ? 'border-l-[3px] border-l-emerald-500 bg-emerald-50/30'
                          : 'border-l-[3px] border-l-transparent'
                      }`}
                    >
                      {notifTypeIcon(notif.type)}
                      <div className="flex-1 min-w-0">
                        <p className={`text-gray-800 text-sm leading-snug ${!notif.isRead ? 'font-semibold' : 'font-normal'}`}>
                          {notif.title}
                        </p>
                        {notif.message  && <p className="text-gray-500 text-xs mt-0.5 truncate">{notif.message}</p>}
                        {notif.createdAt && <p className="text-gray-400 text-[11px] mt-1">{notif.createdAt}</p>}
                      </div>
                      {!notif.isRead && <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />}
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
