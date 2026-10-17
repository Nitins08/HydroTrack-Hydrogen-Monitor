import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import AddReadingModal from './components/AddReadingModal';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SustainabilityPage from './pages/SustainabilityPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReading, setEditingReading] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTriggerRefresh = () => {
    // Incrementing trigger forces all active pages to refetch metrics immediately
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
            <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F17] text-gray-900 dark:text-slate-100 flex flex-col font-sans selection:bg-teal-600 selection:text-white transition-colors duration-200">
              {/* Top Navigation */}
              <Navbar onOpenAddModal={handleOpenAdd} />

            {/* Main Body */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                      />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/analytics" 
                  element={
                    <ProtectedRoute>
                      <AnalyticsPage refreshTrigger={refreshTrigger} />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/sustainability" 
                  element={
                    <ProtectedRoute>
                      <SustainabilityPage refreshTrigger={refreshTrigger} />
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
            </main>

            {/* Footer */}
            <footer className="border-t border-[#D1D1D1] dark:border-slate-800 bg-white dark:bg-[#151C28] py-4 text-center text-xs text-[#5C5C5C] dark:text-slate-400 transition-colors duration-200">
              <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
                <div>
                  HydroTrack • Hydrogen Production, Cost & Sustainability Monitoring System
                </div>
                <div>
                  MERN Stack: MongoDB + Express.js + React.js + Node.js
                </div>
              </div>
            </footer>

            {/* Add / Edit Daily Reading Modal */}
            <AddReadingModal
              isOpen={isModalOpen}
              initialData={editingReading}
              onClose={handleCloseModal}
              onReadingAdded={handleTriggerRefresh}
            />
          </div>
        </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
