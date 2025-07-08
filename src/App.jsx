import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Budget from './pages/Budget';
import Reports from './pages/Reports';
import Navigation from './components/Navigation';
import Header from './components/Header';
import NotificationManager from './components/NotificationManager';
import { FinanceProvider } from './context/FinanceContext';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento inicial
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">FinanFácil</h1>
          <p className="text-gray-600">Carregando sua conta...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <FinanceProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <NotificationManager />
          <div className="pb-20 md:pb-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </div>
          <Navigation />
        </div>
      </Router>
    </FinanceProvider>
  );
}

export default App;