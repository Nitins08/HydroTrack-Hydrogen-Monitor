import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Plus, Droplets, LogOut, ShieldCheck, HardHat, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenAddModal }) {
  const { user, isAuthenticated, logout } = useAuth();
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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-[3px] border border-teal-600 bg-teal-50 flex items-center justify-center text-teal-700 shadow-2xs">
              <Droplets className="w-4.5 h-4.5 text-teal-600 fill-teal-600" />
            </div>
            <div>
              <div className="text-base font-bold text-gray-900 leading-tight tracking-tight flex items-center space-x-1.5">
                <span>HydroTrack</span>
                <span className="hidden sm:inline-block text-[9px] uppercase font-mono px-1.5 py-0.2 rounded-[2px] bg-gray-100 text-gray-600 border border-gray-200 font-semibold">
                  MERN
                </span>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block">
                Hydrogen Production & Sustainability Monitoring
              </p>
            </div>
          </div>

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
                        ? 'border-teal-600 text-teal-700 font-bold'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          )}

          {/* User Section & Actions */}
          <div className="flex items-center space-x-2.5">
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

                {/* User Role & Profile Badge */}
                <div className="hidden sm:flex items-center space-x-2 pl-2 border-l border-gray-200">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-gray-900 leading-tight">
                      {user?.name || 'Operator'}
                    </span>
                    <span className={`inline-flex items-center space-x-1 text-[9px] uppercase font-mono px-1.5 py-0.2 rounded-[2px] border font-semibold ${
                      isAdmin
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-teal-50 text-teal-800 border-teal-200'
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
                    className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-white border border-gray-300 hover:border-gray-900 text-gray-700 hover:text-gray-900 text-xs font-medium rounded-[2px] transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">Logout</span>
                  </motion.button>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-1.5 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-[2px]"
                  aria-label="Toggle Navigation"
                >
                  {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <NavLink
                  to="/login"
                  className="px-3 py-1.5 bg-white border border-gray-300 hover:border-gray-900 text-gray-800 text-xs font-semibold rounded-[2px] transition-colors"
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

        {/* Mobile Dropdown Menu */}
        {isAuthenticated && mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-100 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 px-1">
              <div>
                <span className="text-xs font-bold text-gray-900 block">{user?.name}</span>
                <span className="text-[10px] uppercase font-mono text-teal-700 font-semibold">{user?.role}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-red-600 flex items-center space-x-1"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 text-xs font-semibold rounded-[2px] ${
                      isActive
                        ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
