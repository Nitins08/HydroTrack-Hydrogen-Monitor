import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Bell, 
  Sun, 
  Moon, 
  Menu, 
  Calendar, 
  ShieldCheck, 
  HardHat,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import HydroTrackLogo from './HydroTrackLogo';

export default function TopBar({ 
  onOpenAddModal, 
  onOpenMobileSidebar, 
  period = '30d', 
  onPeriodChange,
  alertCount = 0 
}) {
  const { user, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState('');
  const [cycleDropdownOpen, setCycleDropdownOpen] = useState(false);

  const isAdmin = user?.role === 'admin';

  // User initials
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'OP';

  const periodOptions = [
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' },
    { value: 'all', label: 'ALL' },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-[#1D2226]/95 backdrop-blur-sm border-b border-[#E5E2DA] dark:border-[#2C333A] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 transition-colors duration-200">
      
      {/* Left Area: Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center space-x-3 flex-1 max-w-md">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open mobile menu"
          className="p-2 lg:hidden text-gray-600 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white rounded-[3px] hover:bg-gray-100 dark:hover:bg-[#252B30] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Brand Mark */}
        <div className="lg:hidden flex-shrink-0">
          <HydroTrackLogo variant="compact" size="sm" />
        </div>

        {/* Search Input (matching Reference Image 2) */}
        <div className="relative w-full hidden sm:block">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search readings, reports..."
            className="w-full bg-[#F8F7F4] dark:bg-[#131618] border border-[#E5E2DA] dark:border-[#2C333A] rounded-[4px] pl-9 pr-3 py-1.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Right Area: Controls & Profile */}
      <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
        
        {/* Cycle Filter Dropdown (matching Image 2 "Cycle: 30D") */}
        {onPeriodChange && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setCycleDropdownOpen(!cycleDropdownOpen)}
              className="px-2.5 py-1.5 bg-[#F8F7F4] dark:bg-[#131618] border border-[#E5E2DA] dark:border-[#2C333A] rounded-[4px] text-xs font-semibold text-gray-700 dark:text-neutral-200 flex items-center space-x-1.5 hover:border-gray-400 dark:hover:border-neutral-500 transition-colors shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>Cycle: <strong className="font-mono text-gray-900 dark:text-white">{period.toUpperCase()}</strong></span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {cycleDropdownOpen && (
              <div 
                className="absolute right-0 mt-1 w-32 bg-white dark:bg-[#1D2226] border border-[#E5E2DA] dark:border-[#2C333A] rounded-[4px] shadow-lg py-1 z-40"
                onClick={() => setCycleDropdownOpen(false)}
              >
                {periodOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onPeriodChange(opt.value)}
                    className={`w-full px-3 py-1.5 text-left text-xs font-semibold transition-colors flex items-center justify-between ${
                      period === opt.value
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold'
                        : 'text-gray-700 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-[#252B30]'
                    }`}
                  >
                    <span>{opt.label === 'ALL' ? 'All Data' : `Last ${opt.label}`}</span>
                    {period === opt.value && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notifications Bell */}
        <button
          type="button"
          title="Plant alerts"
          className="relative p-2 text-gray-600 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#252B30] rounded-[4px] transition-colors"
        >
          <Bell className="w-4 h-4" />
          {alertCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
          )}
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 text-gray-600 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#252B30] rounded-[4px] transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-600" />}
        </button>

        {/* User Identity Chip (from Image 2) */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center space-x-2 pl-2 border-l border-[#E5E2DA] dark:border-[#2C333A]">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center">
              {initials}
            </div>
            <div className="text-left leading-none">
              <span className="text-xs font-bold text-gray-900 dark:text-white block">
                {user?.name || 'Operator'}
              </span>
              <span className="text-[9.5px] uppercase font-mono tracking-wider text-gray-400 dark:text-neutral-400 font-medium">
                {user?.role || 'OPERATOR'}
              </span>
            </div>
          </div>
        )}

        {/* "+ Add Reading" Action Button in Vibrant Amber */}
        {onOpenAddModal && (
          <motion.button
            whileHover={shouldReduceMotion ? {} : { y: -1 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            onClick={onOpenAddModal}
            className="px-3.5 py-1.5 bg-[#F5A623] hover:bg-[#E09618] active:bg-[#C9820F] text-gray-950 rounded-[4px] text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 flex-shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden xs:inline">Add Reading</span>
            <span className="xs:hidden">Add</span>
          </motion.button>
        )}
      </div>

    </header>
  );
}
