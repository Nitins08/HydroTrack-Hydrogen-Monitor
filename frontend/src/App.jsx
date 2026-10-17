import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import AddReadingModal from './components/AddReadingModal';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SustainabilityPage from './pages/SustainabilityPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function AppLayout({ 
  children, 
  onOpenAdd, 
  onOpenEdit,
  refreshTrigger,
  onTriggerRefresh,
  period,
  setPeriod
}) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('hydrotrack_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('hydrotrack_sidebar_collapsed', String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#131618] text-[#171A1C] dark:text-[#F7F5F0] flex flex-col font-sans transition-colors duration-200">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#131618] text-[#171A1C] dark:text-[#F7F5F0] flex font-sans transition-colors duration-200">
      {/* Collapsible Left Sidebar (Desktop & Mobile Drawer) */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Header Bar matching Reference Image 2 */}
        <TopBar
          onOpenAddModal={onOpenAdd}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          period={period}
          onPeriodChange={setPeriod}
        />

        {/* Dynamic Route Body */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-[#E5E2DA] dark:border-[#2C333A] bg-white dark:bg-[#1D2226] py-3.5 text-center text-xs text-[#606870] dark:text-[#8E97A0] transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
            <div>
              HydroTrack • Clean Hydrogen Production & Sustainability Telemetry
            </div>
            <div className="font-mono text-[11px]">
              MERN Platform: MongoDB • Express • React • Node.js
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReading, setEditingReading] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [globalPeriod, setGlobalPeriod] = useState('30d');

  const handleTriggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleOpenAdd = () => {
    setEditingReading(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (reading) => {
    setEditingReading(reading);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReading(null);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <AppLayout
              onOpenAdd={handleOpenAdd}
              onOpenEdit={handleOpenEdit}
              refreshTrigger={refreshTrigger}
              onTriggerRefresh={handleTriggerRefresh}
              period={globalPeriod}
              setPeriod={setGlobalPeriod}
            >
              <Routes>
                {/* Public Authentication Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Protected Application Routes */}
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <DashboardPage 
                        refreshTrigger={refreshTrigger} 
                        onEditReading={handleOpenEdit}
                        onTriggerRefresh={handleTriggerRefresh}
                        period={globalPeriod}
                        onPeriodChange={setGlobalPeriod}
                      />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/analytics" 
                  element={
                    <ProtectedRoute>
                      <AnalyticsPage 
                        refreshTrigger={refreshTrigger} 
                        period={globalPeriod}
                        onPeriodChange={setGlobalPeriod}
                      />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/sustainability" 
                  element={
                    <ProtectedRoute>
                      <SustainabilityPage 
                        refreshTrigger={refreshTrigger} 
                        period={globalPeriod}
                        onPeriodChange={setGlobalPeriod}
                      />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminPage />
                    </ProtectedRoute>
                  } 
                />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>

            {/* Add / Edit Daily Reading Modal */}
            <AddReadingModal
              isOpen={isModalOpen}
              initialData={editingReading}
              onClose={handleCloseModal}
              onReadingAdded={handleTriggerRefresh}
            />
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
