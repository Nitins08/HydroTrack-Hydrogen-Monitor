import React from 'react';
import { NavLink } from 'react-router-dom';
import { Plus, Droplet } from 'lucide-react';

export default function Navbar({ onOpenAddModal }) {
  const navLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/sustainability', label: 'Sustainability' },
  ];

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

          {/* Plain Text Nav Links with Underline */}
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

          {/* Primary Action Button: Add Reading */}
          <div>
            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#111111] hover:bg-black text-white text-xs font-semibold rounded-[2px] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Reading</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
