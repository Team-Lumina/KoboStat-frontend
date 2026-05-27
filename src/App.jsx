import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';

// Import Pages
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Receive from './pages/Receive';
import Debts from './pages/Debts';
import Settings from './pages/Settings';
import USSDDemo from './pages/USSDDemo';

export default function App() {
  const { isDarkMode } = useTheme();
  
  // Global Auth State
  const [user, setUser] = useState(null);

  // Check for saved session on load (simulated persistence)
  useEffect(() => {
    const savedSession = localStorage.getItem('kobosats_user');
    if (savedSession) {
      setUser(JSON.parse(savedSession));
    }
  }, []);

  // Handle Successful Login
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('kobosats_user', JSON.stringify(userData));
  };

  // Handle Logout (Clears state so the router knows to kick them out)
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('kobosats_user');
  };

  // Route Protection Wrapper
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/auth" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-zinc-950' : 'bg-slate-50'}`}>
        <Routes>
          {/* Main Entry Route (Landing or Dashboard) */}
          <Route 
            path="/" 
            element={
              user ? <Dashboard /> : <Landing />
            } 
          />

          {/* Auth Route */}
          <Route 
            path="/auth" 
            element={
              user ? <Navigate to="/" replace /> : <Auth onLogin={handleLogin} />
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/receive" 
            element={
              <ProtectedRoute>
                <Receive />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/debts" 
            element={
              <ProtectedRoute>
                <Debts />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ussd" 
            element={
              <ProtectedRoute>
                <USSDDemo />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                {/* Pass the logout function as a prop to Settings */}
                <Settings onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}