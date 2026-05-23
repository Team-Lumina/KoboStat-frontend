import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Pages
import Auth from './pages/Auth';
// TODO: Create/Import these pages as we build
// import Dashboard from './pages/Dashboard';
// import Receive from './pages/Receive';
// import Debts from './pages/Debts';
// import USSDDemo from './pages/USSDDemo';
// import Settings from './pages/Settings';

export default function App() {
  // Global Auth State
  const [user, setUser] = useState(null);

  // Check for saved session on load (simulated)
  useEffect(() => {
    const savedSession = localStorage.getItem('kobo_user');
    if (savedSession) {
      setUser(JSON.parse(savedSession));
    }
  }, []);

  // Handle Successful Login/Signup
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('kobo_user', JSON.stringify(userData)); // Persist session
  };

  // Handle Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('kobo_user');
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Routes>
          {/* Unauthenticated Route: Force users to Auth page */}
          {!user ? (
            <Route path="*" element={<Auth onLogin={handleLogin} />} />
          ) : (
            /* Authenticated Routes: The Main App */
            <>
              {/* Replace these placeholder divs with actual components once imported */}
              <Route path="/" element={
                <div className="p-8 text-center text-kobo-blue font-bold text-xl">
                  Coming Soon!
                  <button onClick={handleLogout} className="block mx-auto mt-4 text-sm text-red-500 underline">Logout</button>
                </div>
              } />
              
              <Route path="/receive" element={<div>Receive Component</div>} />
              <Route path="/debts" element={<div>Debts Component</div>} />
              <Route path="/ussd" element={<div>USSD Demo Component</div>} />
              <Route path="/settings" element={<div>Settings Component</div>} />
              
              {/* Catch-all: Redirect any unknown URL back to Dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}
