import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AddReadingModal from './components/AddReadingModal';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SustainabilityPage from './pages/SustainabilityPage';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReadingAdded = () => {
    // Incrementing trigger forces all active pages to refetch metrics immediately
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#F5F5F5] text-[#111111] flex flex-col font-sans selection:bg-black selection:text-white">
        {/* Top Navigation */}
        <Navbar onOpenAddModal={() => setIsModalOpen(true)} />

        {/* Main Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route 
              path="/" 
              element={<DashboardPage refreshTrigger={refreshTrigger} />} 
            />
            <Route 
              path="/analytics" 
              element={<AnalyticsPage refreshTrigger={refreshTrigger} />} 
            />
            <Route 
              path="/sustainability" 
              element={<SustainabilityPage refreshTrigger={refreshTrigger} />} 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#D1D1D1] bg-white py-4 text-center text-xs text-[#5C5C5C]">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
            <div>
              HydroTrack • Hydrogen Production, Cost & Sustainability Monitoring System
            </div>
            <div>
              MERN Stack: MongoDB + Express.js + React.js + Node.js
            </div>
          </div>
        </footer>

        {/* Add Daily Reading Modal */}
        <AddReadingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onReadingAdded={handleReadingAdded}
        />
      </div>
    </Router>
  );
}
