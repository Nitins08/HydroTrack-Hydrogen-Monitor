import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Plus, Droplet, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenAddModal }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

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

  return (
    <header className="bg-white border-b border-[#D1D1D1] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Minimal Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border border-black flex items-center justify-center text-black bg-white">
              <Droplet className="w-4 h-4 fill-black text-black" />
            </div>
            <div>
              <div className="text-base font-bold text-[#111111] leading-tight">
                HydroTrack
              </div>
              <p className="text-xs text-[#5C5C5C] hidden sm:block">
                Hydrogen Production Monitoring System
              </p>
            </div>
          </div>

          {/* Plain Text Nav Links with Underline (only visible if logged in) */}
          {isAuthenticated && (
            <nav className="flex items-center space-x-6 sm:space-x-8 h-full">
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `h-full flex items-center text-sm font-medium transition-colors border-b-2 ${
                      isActive
                        ? 'border-black text-[#111111] font-semibold'
                        : 'border-transparent text-[#5C5C5C] hover:text-[#111111]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          )}

          {/* User Section & Actions */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* Add Reading Button */}
                <button
                  onClick={onOpenAddModal}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#111111] hover:bg-black text-white text-xs font-semibold rounded-[2px] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add Reading</span>
                </button>

                {/* User Menu & Role */}
                <div className="flex items-center space-x-2 pl-2 border-l border-[#D1D1D1]">
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-xs font-semibold text-[#111111] leading-tight">
                      {user?.name || 'Operator'}
                    </span>
                    <span className="text-[10px] uppercase font-mono text-[#5C5C5C] tracking-wide">
                      {user?.role || 'operator'}
                    </span>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="flex items-center space-x-1 px-2.5 py-1.5 bg-white border border-[#D1D1D1] hover:border-black text-[#111111] text-xs font-medium rounded-[2px] transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <NavLink
                  to="/login"
                  className="px-3 py-1.5 bg-white border border-[#D1D1D1] hover:border-black text-[#111111] text-xs font-medium rounded-[2px] transition-colors"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="px-3 py-1.5 bg-[#111111] hover:bg-black text-white text-xs font-semibold rounded-[2px] transition-colors"
                >
                  Signup
                </NavLink>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
