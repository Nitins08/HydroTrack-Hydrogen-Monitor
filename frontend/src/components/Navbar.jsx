import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Plus, Droplets, LogOut, ShieldCheck, HardHat, Menu, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onOpenAddModal }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/sustainability', label: 'Sustainability' },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ to: '/admin', label: 'Admin Panel' });
  }

  const isAdmin = user?.role === 'admin';

  return (
    <header className="bg-white dark:bg-[#151C28] border-b border-gray-200 dark:border-slate-800 sticky top-0 z-30 shadow-2xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <NavLink to="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 rounded-[3px] border border-teal-600 bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center text-teal-700 dark:text-teal-400 shadow-2xs group-hover:bg-teal-100/60 dark:group-hover:bg-teal-900/40 transition-colors">
              <Droplets className="w-4.5 h-4.5 text-teal-600 dark:text-teal-400 fill-teal-600 dark:fill-teal-400" />
            </div>
            <div>
              <div className="text-base font-bold text-gray-900 dark:text-white leading-tight tracking-tight flex items-center space-x-1.5">
                <span>HydroTrack</span>
                <span className="hidden sm:inline-block text-[9px] uppercase font-mono px-1.5 py-0.2 rounded-[2px] bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 font-semibold">
                  MERN
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-slate-400 hidden sm:block">
                Hydrogen Production & Sustainability Monitoring
              </p>
            </div>
          </NavLink>

          {/* Desktop Navigation Links */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-1 sm:space-x-2 h-full">
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `h-full flex items-center px-3.5 text-xs font-semibold transition-colors border-b-2 ${
                      isActive
                        ? 'border-teal-600 text-teal-700 dark:text-teal-400 font-bold'
                        : 'border-transparent text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-slate-700'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          )}

          {/* User Section & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Theme Toggle Button (Desktop & Tablet) */}
            <motion.button
              whileHover={shouldReduceMotion ? {} : { y: -1 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-1.5 sm:px-2.5 sm:py-1.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 hover:border-gray-900 dark:hover:border-slate-500 text-gray-700 dark:text-slate-200 rounded-[2px] transition-colors flex items-center space-x-1.5 text-xs font-medium shadow-2xs"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden xl:inline text-[11px]">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700 dark:text-slate-200" />
                  <span className="hidden xl:inline text-[11px]">Dark</span>
                </>
              )}
            </motion.button>

            {isAuthenticated ? (
              <>
                {/* Add Reading Button */}
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { y: -1 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  onClick={onOpenAddModal}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-[2px] transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add Reading</span>
                </motion.button>

                {/* User Role & Profile Badge (Desktop) */}
                <div className="hidden sm:flex items-center space-x-2 pl-2 border-l border-gray-200 dark:border-slate-800">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-gray-900 dark:text-slate-100 leading-tight">
                      {user?.name || 'Operator'}
                    </span>
                    <span className={`inline-flex items-center space-x-1 text-[9px] uppercase font-mono px-1.5 py-0.2 rounded-[2px] border font-semibold ${
                      isAdmin
                        ? 'bg-gray-900 dark:bg-slate-800 text-white border-gray-900 dark:border-slate-700'
                        : 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                    }`}>
                      {isAdmin ? (
                        <ShieldCheck className="w-2.5 h-2.5" />
                      ) : (
                        <HardHat className="w-2.5 h-2.5" />
                      )}
                      <span>{user?.role || 'operator'}</span>
                    </span>
                  </div>

                  {/* Logout Button */}
                  <motion.button
                    whileHover={shouldReduceMotion ? {} : { y: -1 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    onClick={handleLogout}
                    title="Sign out of plant session"
                    className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 hover:border-gray-900 dark:hover:border-slate-500 text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white text-xs font-medium rounded-[2px] transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">Logout</span>
                  </motion.button>
                </div>

                {/* Mobile Menu Toggle Button */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-slate-700 rounded-[2px] hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Toggle navigation menu"
                  aria-expanded={mobileMenuOpen}
                >
                  {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <NavLink
                  to="/login"
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 hover:border-gray-900 dark:hover:border-slate-500 text-gray-800 dark:text-slate-200 text-xs font-semibold rounded-[2px] transition-colors"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-[2px] transition-colors shadow-xs"
                >
                  Signup
                </NavLink>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation with Backdrop */}
      {isAuthenticated && (
        <>
          {/* Backdrop overlay */}
          {mobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-[1px] transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Drawer Panel */}
          <div
            className={`fixed top-0 right-0 bottom-0 w-72 max-w-[85vw] bg-white dark:bg-[#151C28] border-l border-gray-200 dark:border-slate-800 z-50 md:hidden flex flex-col shadow-xl transform transition-transform duration-200 ease-in-out ${
              mobileMenuOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
            }`}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-900/70">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-[2px] border border-teal-600 bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center text-teal-700 dark:text-teal-400">
                  <Droplets className="w-4 h-4 text-teal-600 dark:text-teal-400 fill-teal-600 dark:fill-teal-400" />
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white block leading-tight">HydroTrack</span>
                  <span className="text-[10px] text-gray-500 dark:text-slate-400 font-mono">Plant 01 Mon</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-slate-700 rounded-[2px]"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User Profile Info in Drawer */}
            <div className="p-4 border-b border-gray-100 dark:border-slate-800/80 bg-white dark:bg-[#151C28]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-900 dark:text-slate-100 block">{user?.name || 'Operator'}</span>
                  <span className="text-[11px] text-gray-500 dark:text-slate-400 font-mono">{user?.email}</span>
                </div>
                <span className={`inline-flex items-center space-x-1 text-[9px] uppercase font-mono px-2 py-0.5 rounded-[2px] border font-semibold ${
                  isAdmin
                    ? 'bg-gray-900 dark:bg-slate-800 text-white border-gray-900 dark:border-slate-700'
                    : 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                }`}>
                  {isAdmin ? <ShieldCheck className="w-2.5 h-2.5" /> : <HardHat className="w-2.5 h-2.5" />}
                  <span>{user?.role || 'operator'}</span>
                </span>
              </div>

              {/* Add Reading Action for Mobile */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAddModal();
                }}
                className="mt-3 w-full flex items-center justify-center space-x-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-[2px] shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Daily Reading</span>
              </button>
            </div>

            {/* Navigation Links (min 44px tap targets) */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider px-3 py-1 block font-mono">
                Navigation
              </span>
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center min-h-[44px] px-3 py-2.5 text-xs font-semibold rounded-[2px] transition-colors ${
                      isActive
                        ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 font-bold border-l-4 border-teal-600 pl-2.5'
                        : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/80 hover:text-gray-900 dark:hover:text-white'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Drawer Footer with Theme Toggle & Logout */}
            <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 space-y-2">
              {/* Mobile Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="w-full flex items-center justify-between min-h-[40px] px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 hover:border-gray-900 dark:hover:border-slate-500 text-gray-700 dark:text-slate-200 text-xs font-medium rounded-[2px] transition-colors"
              >
                <span className="flex items-center space-x-2">
                  {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                  <span>Appearance</span>
                </span>
                <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-[2px] bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300">
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center space-x-2 min-h-[40px] px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 hover:border-red-600 hover:text-red-600 text-gray-700 dark:text-slate-200 text-xs font-medium rounded-[2px] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
