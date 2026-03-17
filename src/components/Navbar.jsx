import React, { useState, useContext, useEffect, Suspense, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FiLogOut, FiBell, FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
import { IoChevronDownOutline } from "react-icons/io5";
const MessageList = React.lazy(() => import("./messages/MessageList"));
const NotificationDropdown = React.lazy(() => import("./NotificationDropdown"));
import logo from "../assets/logo.png";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openMessages, setOpenMessages] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [svc, setSvc] = useState(null);
  const userId = user?.id || user?._id;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getRoleLabel = (r) => {
    if (!r) return '';
    const role = (r || '').toUpperCase();
    switch (role) {
      case 'STUDENT': return 'Student';
      case 'LECTURER': return 'Lecturer';
      case 'HOD': return 'Head of Department';
      case 'TO': return 'Technical Officer';
      case 'ADMIN': return 'Admin';
      default: return role.charAt(0) + role.slice(1).toLowerCase();
    }
  };

  const refreshNotificationCount = async () => {
    if (!user) return;
    const role = (user.role || '').toLowerCase();
    
    try {
      const API = (await import('../api/axiosClient')).default;
      let endpoint = '';
      
      if (role === 'to') {
        endpoint = '/to/notices';
      } else if (role === 'hod') {
        endpoint = '/hod/notices';
      } else if (role === 'student') {
        endpoint = userId ? `/student/${userId}/notices` : '';
      } else if (role === 'lecturer') {
        endpoint = '/notifications';
      } else {
        return;
      }
      
      const res = await API.get(endpoint);
      const data = res.data || [];
      const unreadCount = data.filter(n => n.isIncoming && !n.isRead).length;
      setUnreadNotifications(unreadCount);
    } catch (err) {
      console.error('Failed to refresh notification count:', err);
    }
  };

  const containerRef = useRef(null);
  const profileTriggerRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const [profilePos, setProfilePos] = useState(null);

  // close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e) => {
      const insideContainer = containerRef.current && containerRef.current.contains(e.target);
      const insideDropdown = profileDropdownRef.current && profileDropdownRef.current.contains(e.target);
      if (!insideContainer && !insideDropdown) {
        setOpen(false);
        setOpenMessages(false);
        setOpenNotifications(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // compute profile dropdown position when opened or on resize/scroll
  useEffect(() => {
    if (!open) return;
    const calc = () => {
      const el = profileTriggerRef.current;
      if (!el) { setProfilePos(null); return; }
      const rect = el.getBoundingClientRect();
      setProfilePos({ top: rect.bottom + window.scrollY + 8, right: window.innerWidth - rect.right - window.scrollX });
    };
    calc();
    window.addEventListener('resize', calc);
    window.addEventListener('scroll', calc, true);
    return () => { window.removeEventListener('resize', calc); window.removeEventListener('scroll', calc, true); };
  }, [open]);

  useEffect(() => {
    let mounted = true;
    // dynamically import the message service and fetch unread count
    import("../services/messageService").then(mod => {
      if (!mounted) return;
      const svc = mod.default;
      setSvc(svc);
      try {
        // svc.getUnreadCount is async
        svc.getUnreadCount().then(c => { if (mounted) setUnread(c); }).catch(() => { if (mounted) setUnread(0); });
      } catch (e) { if (mounted) setUnread(0); }
    }).catch(() => {
      if (mounted) setUnread(0);
    });
    return () => { mounted = false };
  }, []);

  // fetch unread notifications for all roles
  useEffect(() => {
    if (!user) return;
    const role = (user.role || '').toLowerCase();
    
    // Only show notification bell for roles that have notification support
    if (!['to', 'hod', 'student', 'lecturer'].includes(role)) return;
    
    let mounted = true;
    const fetchUnreadNotifications = async () => {
      try {
        const API = (await import('../api/axiosClient')).default;
        let endpoint = '';
        
        if (role === 'to') {
          endpoint = '/to/notices';
        } else if (role === 'hod') {
          endpoint = '/hod/notices';
        } else if (role === 'student') {
          endpoint = userId ? `/student/${userId}/notices` : '';
        } else if (role === 'lecturer') {
          endpoint = '/notifications';
        }
        
        if (!endpoint) return;
        
        const res = await API.get(endpoint);
        const data = res.data || [];
        const unreadCount = data.filter(n => n.isIncoming && !n.isRead).length;
        if (mounted) setUnreadNotifications(unreadCount);
      } catch (err) {
        if (mounted) setUnreadNotifications(0);
      }
    };

    // Listen to dashboard change events
    const dashboardChangeEvent = `${role}DashboardChange`;
    const onNoticesChanged = () => fetchUnreadNotifications();
    
    fetchUnreadNotifications();
    window.addEventListener(dashboardChangeEvent, onNoticesChanged);
    const interval = setInterval(fetchUnreadNotifications, 30000); // refresh every 30s
    
    return () => {
      mounted = false;
      clearInterval(interval);
      window.removeEventListener(dashboardChangeEvent, onNoticesChanged);
    };
  }, [user]);

  return (
    <>
      <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img src={logo} alt="Timelyx Logo" className="h-8 sm:h-10 w-auto" />
            <div>
              <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-slate-100">
                Timelyx
              </h1>
              <p className="text-xs text-gray-500 dark:text-slate-400 hidden sm:block">
                Efficient Booking & Scheduling
              </p>
            </div>
          </div>

          {/* RIGHT SIDE - DESKTOP */}
          {!user ? (
            <div className="flex items-center gap-4 sm:gap-6">
              <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-gray-700 dark:text-slate-300">
                <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">HOME</Link>
                <Link to="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">ABOUT</Link>
                <Link to="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">CONTACT</Link>
                <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">LOGIN</Link>
                <Link to="/signup" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">SIGN UP</Link>
              </nav>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <FiMoon size={20} className="text-gray-700 dark:text-slate-300" />
                ) : (
                  <FiSun size={20} className="text-amber-400" />
                )}
              </button>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <FiX size={24} className="text-gray-700 dark:text-slate-300" />
                ) : (
                  <FiMenu size={24} className="text-gray-700 dark:text-slate-300" />
                )}
              </button>
            </div>
          ) : (
            <div ref={containerRef} className="relative flex items-center gap-2 sm:gap-3 overflow-visible">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <FiMoon size={20} className="text-gray-700 dark:text-slate-300" />
                ) : (
                  <FiSun size={20} className="text-amber-400" />
                )}
              </button>
              {/* Profile + messages/notifications cluster */}
              <div
                ref={profileTriggerRef}
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 px-2 sm:px-3 py-2 rounded-lg transition"
              >
              {/* Notifications for all roles */}
              {user && ['to', 'hod', 'student', 'lecturer'].includes((user.role || '').toLowerCase()) && (
                <div className="relative">
                  <button
                    onClick={async (e) => { e.stopPropagation(); setOpenNotifications(!openNotifications); }}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                    aria-label="Notifications"
                  >
                    <FiBell size={18} className="text-indigo-600" />
                  </button>
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{unreadNotifications}</span>
                  )}
                  {openNotifications && (
                    <div className="absolute right-0 top-12 z-50">
                      <Suspense fallback={<div className="p-4">Loading…</div>}>
                        <NotificationDropdown 
                          endpoint={
                            (user.role || '').toLowerCase() === 'to' 
                              ? '/to/notices'
                              : (user.role || '').toLowerCase() === 'hod'
                              ? '/hod/notices'
                              : (user.role || '').toLowerCase() === 'student'
                                ? (userId ? `/student/${userId}/notices` : '')
                              : '/notifications'
                          }
                          noticePageUrl={
                            (user.role || '').toLowerCase() === 'to'
                              ? '/to/notices'
                              : (user.role || '').toLowerCase() === 'hod'
                              ? '/hod/notices'
                              : (user.role || '').toLowerCase() === 'student'
                              ? '/student/notices'
                              : '/lecturer/notices'
                          }
                          onClose={() => setOpenNotifications(false)} 
                          onNotificationRead={refreshNotificationCount} 
                        />
                      </Suspense>
                    </div>
                  )}
                </div>
              )}

              {/* Message bell for users without notification support */}
              {(!user || !['to', 'hod', 'student', 'lecturer'].includes((user.role || '').toLowerCase())) && (
                <div className="relative">
                  <button
                    onClick={async (e) => { e.stopPropagation(); setOpenMessages(!openMessages); try { const c = await svc?.getUnreadCount?.(); setUnread(c || 0); } catch (err) {} }}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                    aria-label="Messages"
                  >
                    <FiBell size={18} />
                  </button>
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{unread}</span>
                  )}
                  {openMessages && (
                    <div className="absolute right-0 top-12 z-50">
                      <Suspense fallback={<div className="p-4">Loading…</div>}>
                        <MessageList onClose={() => setOpenMessages(false)} />
                      </Suspense>
                    </div>
                  )}
                </div>
              )}

              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium dark:text-slate-100">
                  {user?.name || user?.username || getRoleLabel(user?.role)}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400">{getRoleLabel(user?.role)}</p>
              </div>

              <div className="h-8 w-8 sm:h-9 sm:w-9 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                {(user.name || "S").charAt(0).toUpperCase()}
              </div>

              <IoChevronDownOutline className="text-gray-500 hidden sm:block" />
            </div>

            {/* Dropdown (rendered in portal to avoid clipping) */}
            {open && profilePos && createPortal(
              <div ref={profileDropdownRef} style={{ position: 'fixed', top: profilePos.top + 'px', right: profilePos.right + 'px', width: Math.min(224, window.innerWidth - 32) }} className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-md z-60">
                {/* triangle pointer */}
                <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)' }} className="pointer-events-none">
                  <svg width="20" height="8" viewBox="0 0 20 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 8L10 0L20 8H0Z" fill="currentColor" stroke="#e5e7eb" className="text-white dark:text-slate-800" />
                  </svg>
                </div>
                {/* small handle to indicate dropdown */}
                <div className="w-full flex justify-center">
                  <div className="w-14 h-0.5 bg-gray-200 dark:bg-slate-700 rounded-full mt-3"></div>
                </div>
                <div className="px-4 py-3 border-b dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                  <p className="text-sm font-medium dark:text-slate-100">{user.name || user.username}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">{(user.role || '').toUpperCase()}</p>
                </div>

                <Link
                  to={(user && (user.role || '').toLowerCase() === 'lecturer') ? '/lecturer/profile' : (user && (user.role || '').toLowerCase() === 'hod') ? '/hod/profile' : (user && (user.role || '').toLowerCase() === 'to') ? '/to/profile' : (user && (user.role || '').toLowerCase() === 'student') ? '/student/profile' : '/'}
                  className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-slate-200"
                  onClick={() => setOpen(false)}
                >
                  My Profile
                </Link>

                <button
                  onClick={() => { handleLogout(); setOpen(false); }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  <FiLogOut />
                  Logout
                </button>
              </div>, document.body
            )}

          </div>
        )}

        </div>
      </header>

      {/* Mobile Menu - Public Navigation */}
      {!user && mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 transition-colors">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col space-y-2">
            <Link
              to="/"
              className="px-4 py-3 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              HOME
            </Link>
            <Link
              to="/about"
              className="px-4 py-3 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              ABOUT
            </Link>
            <Link
              to="/contact"
              className="px-4 py-3 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              CONTACT
            </Link>
            <Link
              to="/login"
              className="px-4 py-3 text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              LOGIN
            </Link>
            <Link
              to="/signup"
              className="px-4 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition font-semibold text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              SIGN UP
            </Link>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;