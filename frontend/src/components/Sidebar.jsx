import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Home, 
  BarChart3, 
  Leaf, 
  Factory, 
  FileText, 
  Bell, 
  Settings, 
  LogOut, 
  Sun, 
  Moon, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  HardHat
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import HydroTrackLogo from './HydroTrackLogo';

export default function Sidebar({ isCollapsed, onToggleCollapse, mobileOpen, onCloseMobile }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: 'Dashboard', icon: Home },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/sustainability', label: 'Sustainability', icon: Leaf },
  ];

  if (isAdmin) {
    navItems.push({ to: '/admin', label: 'Admin Panel', icon: Factory });
  }

  const secondaryNavItems = [
    { id: 'reports', label: 'Reports', icon: FileText, action: () => navigate('/#readings') },
    { id: 'alerts', label: 'Alerts', icon: Bell, action: () => navigate('/#alerts') },
    { id: 'settings', label: 'Settings', icon: Settings, action: () => toggleTheme() },
  ];

  // User initials
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'OP';

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white dark:bg-[#1D2226] border-r border-[#E5E2DA] dark:border-[#2C333A] transition-all duration-200 select-none ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header: Logo */}
        <div className={`h-20 flex items-center px-4 border-b border-[#ECE9E2] dark:border-[#252B30] ${
          isCollapsed ? 'justify-center' : 'justify-between'
        }`}>
          {isCollapsed ? (
            <HydroTrackLogo variant="icon" size="md" />
          ) : (
            <HydroTrackLogo variant="full" size="md" />
          )}

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-[3px] hover:bg-gray-100 dark:hover:bg-[#252B30] transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Main Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div className="space-y-1">
            {!isCollapsed && (
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 font-mono">
                Main Menu
              </span>
            )}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onCloseMobile}
                  title={isCollapsed ? item.label : undefined}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-[4px] text-xs font-semibold transition-all relative group ${
                    isActive
                      ? 'bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold'
                      : 'text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-[#252B30] hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {/* Active Indicator Bar on Left */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-amber-500 rounded-r-sm"
                    />
                  )}

                  <Icon className={`w-4 h-4 flex-shrink-0 ${
                    isActive ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400 dark:text-neutral-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'
                  }`} />
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </div>

          {/* Secondary Nav */}
          <div className="space-y-1 pt-2 border-t border-[#ECE9E2] dark:border-[#252B30]">
            {!isCollapsed && (
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 font-mono">
                Operations
              </span>
            )}
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    item.action();
                    onCloseMobile();
                  }}
                  title={isCollapsed ? item.label : undefined}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-[4px] text-xs font-medium text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-[#252B30] hover:text-gray-900 dark:hover:text-white transition-colors group text-left"
                >
                  <Icon className="w-4 h-4 text-gray-400 dark:text-neutral-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 flex-shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Section: Mission Card & User Info */}
        <div className="p-3 border-t border-[#ECE9E2] dark:border-[#252B30] space-y-3">
          {/* Mission Card (from Reference Image 2) */}
          {!isCollapsed && (
            <div className="p-3 rounded-[4px] bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-[#252B30] dark:to-[#1D2226] border border-amber-200/70 dark:border-[#382F24] flex items-center space-x-2.5 shadow-2xs">
              <div className="w-7 h-7 rounded-[3px] bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                <Leaf className="w-3.5 h-3.5" />
              </div>
              <div className="overflow-hidden">
                <div className="text-[11px] font-bold text-gray-900 dark:text-white leading-tight truncate">
                  {isDark ? 'Clean Hydrogen' : 'Green Energy'}
                </div>
                <div className="text-[9.5px] text-gray-500 dark:text-neutral-400 truncate">
                  {isDark ? 'Brighter Future' : 'Cleaner Tomorrow'}
                </div>
              </div>
            </div>
          )}

          {/* Theme Switch & User Bar */}
          <div className="flex items-center justify-between gap-1 pt-1">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 text-gray-500 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#252B30] rounded-[3px] transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-600" />}
            </button>

            {/* User Profile Pill */}
            {isAuthenticated && (
              <div className="flex items-center space-x-2 overflow-hidden flex-1 justify-end">
                {!isCollapsed && (
                  <div className="text-right overflow-hidden">
                    <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
                      {user?.name || 'Operator'}
                    </div>
                    <div className="text-[10px] text-gray-400 dark:text-neutral-400 uppercase font-mono tracking-wider">
                      {user?.role || 'OPERATOR'}
                    </div>
                  </div>
                )}
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {initials}
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-[3px] hover:bg-gray-100 dark:hover:bg-[#252B30] transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
