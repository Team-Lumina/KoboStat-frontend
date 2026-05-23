import React, { useState } from 'react';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  
  // UX States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (phoneNumber.length < 10) {
      setError('Please enter a valid phone number.');
      return;
    }
    if (pin.length !== 4) {
      setError('PIN must be exactly 4 digits.');
      return;
    }

    setIsLoading(true);

    // Mock API Call - Simulates network request delay (1.5 seconds)
    setTimeout(() => {
      setIsLoading(false);
      // Pass the user data up to App.jsx to handle global state
      onLogin({ phone: phoneNumber }); 
    }, 1500);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setPin('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 transition-all">
        
        {/* Logo & Hero Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-sm">
            <span className="text-white text-2xl font-bold">KS</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            KoboSats
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            {isLogin ? 'Welcome back to your wallet.' : 'Your business, powered by Lightning.'}
          </p>
        </div>

        {/* Error Message Alert */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number
            </label>
            <input 
              id="phone"
              type="tel" 
              placeholder="0803 000 0000"
              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none text-lg"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9+]/g, ''))}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="pin" className="block text-sm font-medium text-slate-700 mb-1">
              4-Digit PIN
            </label>
            <input 
              id="pin"
              type="password" 
              inputMode="numeric"
              maxLength="4"
              placeholder="••••"
              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none text-center text-2xl tracking-[0.5em]"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading || pin.length < 4 || phoneNumber.length < 10}
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-xl font-medium text-lg transition-colors shadow-sm flex items-center justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              isLogin ? 'Sign In' : 'Create Wallet'
            )}
          </button>
        </form>

        {/* Help Links */}
        <div className="mt-8 flex flex-col items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            {isLogin ? "New to KoboSats?" : "Already have a wallet?"}
            <button 
              type="button"
              onClick={toggleAuthMode}
              disabled={isLoading}
              className="text-blue-600 font-medium hover:underline disabled:opacity-50"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
          
          <div className="flex gap-4 text-slate-500">
            <button className="hover:text-blue-600 transition-colors">Forgot PIN?</button>
            <span>•</span>
            <button className="hover:text-blue-600 transition-colors">Need Help?</button>
          </div>
        </div>

      </div>
    </div>
  );
}