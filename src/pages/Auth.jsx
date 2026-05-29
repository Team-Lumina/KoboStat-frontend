import React, { useState } from 'react';
import { FiUser, FiPhone, FiLock, FiArrowRight, FiShield, FiCheckCircle } from 'react-icons/fi';
import { registerTrader, getTraderProfile } from '../services/api'; 
import whiteLogo from '/assets/white-bg.png';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); 
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    pin: '',
    confirmPin: ''
  });
  const [otp, setOtp] = useState(['', '', '', '']);
  
  // UX States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotMsg, setShowForgotMsg] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    setShowForgotMsg(false); // Clear the forgot pin message if they start typing again
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setError('');
    setShowForgotMsg(false);

    // 1. Phone Number Validation (Ensuring standard 11+ digit format)
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 11) {
      setError('Please enter a valid phone number (at least 11 digits).');
      return;
    }

    // 2. Full Name Validation (Must be at least 2 words during signup)
    if (!isLogin) {
      const nameParts = formData.fullName.trim().split(/\s+/);
      if (nameParts.length < 2) {
        setError('Please enter your full name (first and last name).');
        return;
      }
    }

    // 3. PIN Validation
    if (formData.pin.length !== 4) {
      setError('PIN must be exactly 4 digits.');
      return;
    }
    
    // 4. Confirm PIN Validation
    if (!isLogin && formData.pin !== formData.confirmPin) {
      setError('PINs do not match. Please try again.');
      return;
    }

    setIsLoading(true);

    // Simulate network delay for UI polish before showing OTP screen
    setTimeout(() => {
      setIsLoading(false);
      setStep(2); 
    }, 800);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    
    if (enteredOtp.length !== 4) {
      setError('Please enter the full 4-digit code.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        // REAL-TIME: Check if the phone number exists
        const profile = await getTraderProfile(formData.phone);
        
        // STRICT LOGIN CHECK: Do not bypass if not found or API fails!
        if (!profile || profile.error) {
          setError("Sorry, cannot fetch data at the moment from backend, create a new account");
          setIsLoading(false);
          return; // Block login completely
        }

        // Success! Pass live data to the parent app state
        onLogin({ 
          phone: formData.phone, 
          name: profile.name || 'Trader',
          isOnboarded: true 
        }); 

      } else {
        // REAL-TIME: Register the new trader
        const newTrader = await registerTrader(formData.phone, 'en');
        
        if (!newTrader) {
          setError("Registration failed. Please try again.");
          setIsLoading(false);
          return;
        }

        // Success! Pass the new local data
        onLogin({ 
          phone: formData.phone, 
          name: formData.fullName || 'Trader',
          isOnboarded: false 
        });
      }
    } catch (err) {
      console.error("Auth API Error:", err);
      // Catch network failures and display truthful error
      if (isLogin) {
        setError("Sorry, cannot fetch data at the moment from backend, create a new account");
      } else {
        setError("Network error. Could not create account.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setStep(1);
    setError('');
    setShowForgotMsg(false);
    setFormData({ fullName: '', phone: '', pin: '', confirmPin: '' });
    setOtp(['', '', '', '']);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FFFDF9]">
      
      {/* LEFT: Branding/Pitch - The Blue Background (Desktop Only) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-indigo-800 p-16 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 opacity-20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

        <div className="relative z-10 flex items-center gap-3">
          <img 
            src={whiteLogo} 
            alt="KoboSats Logo" 
            className="w-12 h-12 rounded-full shadow-lg object-cover" 
          />
          <span className="font-extrabold text-3xl tracking-tight">
            Kobo<span className="text-blue-300">Sat</span>
          </span>
        </div>
        
        <div className="relative z-10 space-y-6">
          <h1 className="text-6xl font-extrabold leading-[1.1] tracking-tight">
            Protect your <br />
            business. <br />
            <span className="text-blue-300">Grow your wealth.</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-md font-medium leading-relaxed">
            Join thousands of traders securing their money via Bitcoin Lightning. No banks, no borders, total control.
          </p>
        </div>
        
        <div className="relative z-10 flex items-center gap-6 text-blue-200 text-sm font-medium">
          <span>© 2026 KoboSat</span>
          <span className="w-1 h-1 rounded-full bg-blue-300"></span>
          <button className="hover:text-white transition-colors">Privacy & Security</button>
        </div>
      </div>

      {/* RIGHT: Auth Form - The White Background */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-72 h-72 bg-blue-500/10 blur-[100px] rounded-full lg:hidden pointer-events-none"></div>

        <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-blue-900/5 border border-slate-100 p-8 sm:p-10 transition-all relative z-10">
          
          {/* Step 1: Login / Signup Form */}
          {step === 1 ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="text-center mb-8 lg:text-left">
                <div className="lg:hidden flex justify-center mb-6">
                   <img 
                    src={whiteLogo} 
                    alt="KoboSats Logo" 
                    className="w-16 h-16 rounded-2xl shadow-lg shadow-blue-600/20 object-cover" 
                  />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                  {isLogin ? 'Welcome back' : 'Create wallet'}
                </h2>
                <p className="text-base font-medium text-slate-500">
                  {isLogin ? 'Enter your details to access your funds.' : 'Your borderless business starts here.'}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 text-center flex items-center justify-center gap-2">
                  <FiShield /> {error}
                </div>
              )}

              <form onSubmit={handleInitialSubmit} className="space-y-4">
                
                {!isLogin && (
                  <div className="relative group">
                    <div className="flex items-center bg-slate-50 border-2 border-transparent focus-within:border-blue-500 rounded-2xl transition-all overflow-hidden">
                      <div className="pl-4 text-slate-400"><FiUser size={18} /></div>
                      <input 
                        type="text" 
                        placeholder="Full Name"
                        className="w-full h-14 bg-transparent px-4 outline-none font-bold text-slate-900 placeholder:font-medium placeholder:opacity-50"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        required={!isLogin}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}

                <div className="relative group">
                  <div className="flex items-center bg-slate-50 border-2 border-transparent focus-within:border-blue-500 rounded-2xl transition-all overflow-hidden">
                    <div className="pl-4 text-slate-400"><FiPhone size={18} /></div>
                    <input 
                      type="tel" 
                      placeholder="Phone (e.g. 0803 000 0000)"
                      className="w-full h-14 bg-transparent px-4 outline-none font-bold text-slate-900 placeholder:font-medium placeholder:opacity-50"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value.replace(/[^0-9+]/g, ''))}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="relative group">
                    <div className="flex items-center bg-slate-50 border-2 border-transparent focus-within:border-blue-500 rounded-2xl transition-all overflow-hidden">
                      <div className="pl-4 text-slate-400"><FiLock size={18} /></div>
                      <input 
                        type="password" 
                        inputMode="numeric"
                        maxLength="4"
                        placeholder="4-Digit PIN"
                        className="w-full h-14 bg-transparent px-4 outline-none font-bold text-slate-900 tracking-[0.3em] placeholder:tracking-normal placeholder:font-medium placeholder:opacity-50"
                        value={formData.pin}
                        onChange={(e) => handleInputChange('pin', e.target.value.replace(/[^0-9]/g, ''))}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {!isLogin && (
                    <div className="relative group">
                      <div className="flex items-center bg-slate-50 border-2 border-transparent focus-within:border-blue-500 rounded-2xl transition-all overflow-hidden">
                        <div className="pl-4 text-slate-400"><FiLock size={18} /></div>
                        <input 
                          type="password" 
                          inputMode="numeric"
                          maxLength="4"
                          placeholder="Confirm PIN"
                          className="w-full h-14 bg-transparent px-4 outline-none font-bold text-slate-900 tracking-[0.3em] placeholder:tracking-normal placeholder:font-medium placeholder:opacity-50"
                          value={formData.confirmPin}
                          onChange={(e) => handleInputChange('confirmPin', e.target.value.replace(/[^0-9]/g, ''))}
                          required={!isLogin}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {isLogin && (
                  <div className="flex flex-col items-end pt-1">
                    <button 
                      type="button"
                      onClick={() => setShowForgotMsg(true)}
                      className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Forgot PIN?
                    </button>
                    {showForgotMsg && (
                      <span className="text-xs font-medium text-red-500 mt-1 animate-in fade-in zoom-in duration-300">
                        feature not available yet
                      </span>
                    )}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-14 mt-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:bg-blue-300 disabled:scale-100 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>{isLogin ? 'Sign In' : 'Continue'} <FiArrowRight /></>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center lg:text-left">
                <button 
                  onClick={toggleAuthMode}
                  disabled={isLoading}
                  className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors disabled:opacity-50"
                >
                  {isLogin ? "Don't have a wallet? Create one" : "Already have a wallet? Sign in"}
                </button>
              </div>
            </div>

          ) : (

            /* Step 2: OTP Verification */
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full mx-auto flex items-center justify-center mb-6">
                  <FiShield size={28} />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                  Verify number
                </h2>
                <p className="text-sm font-medium text-slate-500">
                  We sent a 4-digit code to <br/><span className="font-bold text-slate-700">{formData.phone}</span>
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleOtpSubmit} className="space-y-8">
                <div className="flex justify-between gap-3 px-2">
                  {[0, 1, 2, 3].map((index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      className="w-14 h-16 sm:w-16 sm:h-18 text-center text-3xl font-extrabold bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all text-slate-900 shadow-inner"
                      value={otp[index]}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        const newOtp = [...otp];
                        newOtp[index] = val;
                        setOtp(newOtp);
                        if (val && index < 3) document.getElementById(`otp-${index + 1}`).focus();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otp[index] && index > 0) {
                          document.getElementById(`otp-${index - 1}`).focus();
                        }
                      }}
                      required
                      disabled={isLoading}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2 text-xs font-bold text-green-600 bg-green-50 py-2.5 rounded-xl border border-green-100">
                  <FiCheckCircle size={14} /> SMS Verification Secured
                </div>

                <div className="space-y-3">
                  <button 
                    type="submit" 
                    disabled={isLoading || otp.join('').length < 4}
                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:bg-blue-300 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Verify & Secure Wallet'
                    )}
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={isLoading}
                    className="w-full h-14 bg-transparent text-slate-500 hover:text-slate-900 rounded-2xl font-bold transition-colors"
                  >
                    Go Back
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}