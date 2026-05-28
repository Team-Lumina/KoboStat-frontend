import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../locales/translations';
import BottomNav from '../components/BottomNav';
import GlobalHeader from '../components/GlobalHeader';
import { 
  FiCheckCircle as Lightbulb, 
  FiZap as Zap, 
  FiX as X,
  FiArrowLeft as ArrowLeft,
  FiMaximize as Maximize
} from 'react-icons/fi';

export default function Receive() {
  const navigate = useNavigate();
  const { isDarkMode, language } = useTheme();
  const t = translations[language] || translations.en;
  
  const [amount, setAmount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showTip, setShowTip] = useState(true);

  // Trigger entrance animation on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const quickAmounts = [500, 1000, 2500, 5000, 10000];

  return (
    <div className={`min-h-screen pb-28 md:pb-12 transition-colors duration-700 ease-in-out ${isDarkMode ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        
        {/* REUSABLE GLOBAL HEADER */}
        <GlobalHeader />

        {/* Page Title & Back Button (Mobile mainly) */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className={`md:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ease-out border shadow-sm ${isDarkMode ? 'bg-black border-blue-900/30 text-blue-400' : 'bg-white border-blue-100 text-blue-600'}`}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-blue-400/50' : 'text-blue-600/50'}`}>{t.lightningFast || "LIGHTNING FAST"}</p>
            <h1 className="font-extrabold text-2xl md:text-3xl tracking-tight">{t.receivePayment || "Receive payment"}</h1>
          </div>
        </div>

        {/* Desktop Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Input & Controls */}
          <div className="lg:col-span-7 space-y-6">
            
            {showTip && (
              <div className={`p-4 md:p-5 rounded-2xl flex items-start gap-3 transition-all duration-500 border ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30 text-slate-300' : 'bg-blue-50 border-blue-100 text-blue-900'}`}>
                <Lightbulb size={20} className="mt-0.5 flex-shrink-0 text-blue-500" />
                <p className="text-sm font-medium flex-1 leading-relaxed">{t.trackingTip || "Tip: Tracking debts digitally reduces lost payments."}</p>
                <button onClick={() => setShowTip(false)} className="opacity-50 hover:opacity-100 transition-opacity p-1">
                  <X size={18} />
                </button>
              </div>
            )}

            <div className={`p-8 md:p-12 rounded-[2rem] border transition-all duration-500 text-center ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30' : 'bg-white shadow-sm border-blue-100'}`}>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-6 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.enterAmount || "ENTER AMOUNT"}</p>
              
              <div className="flex justify-center items-center gap-2 mb-4">
                <span className={`text-5xl md:text-6xl font-light ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>₦</span>
                <input 
                  type="number" 
                  value={amount || ''} 
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="0"
                  className="bg-transparent border-none outline-none text-6xl md:text-7xl font-extrabold w-full max-w-[250px] text-center p-0 m-0"
                />
              </div>
              
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border ${isDarkMode ? 'bg-blue-900/20 border-blue-900/50 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                <Zap size={14} fill="currentColor" />
                = {(amount * 0.42).toFixed(0)} sats
              </div>
            </div>

            {/* Quick Amounts */}
            <div className="grid grid-cols-3 sm:flex sm:flex-wrap justify-center gap-3 pt-2">
              {quickAmounts.map((amt) => (
                <button 
                  key={amt}
                  onClick={() => setAmount(amount + amt)}
                  className={`py-3 sm:px-6 sm:py-3 rounded-xl sm:rounded-full text-sm font-bold border transition-all duration-300 ease-out hover:-translate-y-0.5 ${
                    isDarkMode 
                      ? 'bg-[#0a0a0a] border-blue-900/30 text-blue-400 hover:bg-blue-900/20 hover:border-blue-500' 
                      : 'bg-white border-slate-200 text-slate-700 hover:border-blue-600 hover:bg-blue-50 shadow-sm'
                  }`}
                >
                  +₦{amt.toLocaleString()}
                </button>
              ))}
              <button 
                onClick={() => setAmount(0)}
                className={`py-3 sm:px-6 sm:py-3 rounded-xl sm:rounded-full text-sm font-bold border transition-all duration-300 ease-out hover:-translate-y-0.5 ${isDarkMode ? 'bg-[#0a0a0a] border-red-900/30 text-red-400 hover:bg-red-900/20' : 'bg-white border-slate-200 text-red-500 hover:bg-red-50 hover:border-red-200 shadow-sm'}`}
              >
                Clear
              </button>
            </div>

            <div className="pt-4 md:hidden">
              <button className="w-full py-4 rounded-full bg-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all active:scale-95 flex justify-center items-center gap-2">
                <Zap size={20} fill="currentColor" /> {t.generateInvoice || "Generate Invoice"}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Desktop Invoice Preview Card */}
          <div className="hidden lg:block lg:col-span-5">
            <div className={`sticky top-32 p-8 rounded-[2rem] border transition-all duration-500 flex flex-col items-center text-center ${isDarkMode ? 'bg-gradient-to-b from-[#0a0a0a] to-[#050505] border-blue-900/30 shadow-2xl shadow-black' : 'bg-white border-blue-100 shadow-xl shadow-blue-900/5'}`}>
              
              <div className="w-full flex justify-between items-center mb-10 opacity-50">
                <Maximize size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Invoice Preview</span>
                <Maximize size={20} />
              </div>

              {/* Mock QR Code Area */}
              <div className={`w-64 h-64 rounded-3xl flex items-center justify-center mb-8 border-2 border-dashed transition-colors duration-500 ${amount > 0 ? (isDarkMode ? 'border-blue-500/50 bg-blue-900/10' : 'border-blue-400 bg-blue-50') : (isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50')}`}>
                {amount > 0 ? (
                  <div className="text-center space-y-3">
                    <Zap size={48} className="mx-auto text-blue-500 animate-pulse" fill="currentColor" />
                    <p className="text-sm font-bold text-blue-500">Ready to Generate</p>
                  </div>
                ) : (
                  <p className="text-sm font-medium opacity-40 px-8">Enter an amount to generate Lightning Invoice</p>
                )}
              </div>

              <div className="space-y-2 mb-10 w-full px-6">
                <div className="flex justify-between items-end border-b border-dashed pb-3 opacity-70 border-inherit">
                  <span className="text-sm font-medium">Total Naira</span>
                  <span className="font-bold text-lg">₦{amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-end pt-3 text-blue-500">
                  <span className="text-sm font-bold">Total Sats</span>
                  <span className="font-extrabold text-xl">{(amount * 0.42).toFixed(0)}</span>
                </div>
              </div>

              <button 
                disabled={amount === 0}
                className="w-full py-5 rounded-full bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none text-white font-bold text-lg shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-1 transition-all flex justify-center items-center gap-2"
              >
                <Zap size={20} fill={amount > 0 ? "currentColor" : "none"} /> {t.generateInvoice || "Generate Invoice"}
              </button>
              
              <p className="text-xs opacity-50 font-medium mt-6">{t.customerScans || "Customer scans • You get paid instantly in naira"}</p>
            </div>
          </div>

        </div>
      </div>

      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
}