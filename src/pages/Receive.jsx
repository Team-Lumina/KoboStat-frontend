import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../locales/translations';
import BottomNav from '../components/BottomNav';
import GlobalHeader from '../components/GlobalHeader'; 
import { generateInvoice, getWalletBalance } from '../services/api'; 
import { QRCodeSVG } from 'qrcode.react';
import { 
  FiCheckCircle as Lightbulb, 
  FiZap as Zap, 
  FiX as X,
  FiArrowLeft as ArrowLeft,
  FiMaximize as Maximize,
  FiCopy as Copy,
  FiCheck as Check
} from 'react-icons/fi';

export default function Receive({ user }) {
  const navigate = useNavigate();
  const { isDarkMode, language } = useTheme();
  const t = translations[language] || translations.en;
  
  const [amount, setAmount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showTip, setShowTip] = useState(true);

  // Live API States
  const [isGenerating, setIsGenerating] = useState(false);
  const [invoiceStr, setInvoiceStr] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  
  // Real-time Payment Tracking States
  const [initialBalance, setInitialBalance] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const pollingInterval = useRef(null);

  const activePhone = user?.phone || "08012345678";

  // Trigger entrance animation & grab starting balance
  useEffect(() => {
    setIsLoaded(true);
    const fetchStartingBalance = async () => {
      const data = await getWalletBalance(activePhone);
      if (data && data.balance !== undefined) {
        setInitialBalance(data.balance);
      }
    };
    fetchStartingBalance();
    
    // Cleanup interval on unmount
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, [activePhone]);

  // The Magic Polling Hook
  useEffect(() => {
    if (invoiceStr && initialBalance !== null && !isPaid) {
      // Check the balance every 3 seconds
      pollingInterval.current = setInterval(async () => {
        try {
          const data = await getWalletBalance(activePhone);
          // If balance increased, payment was successful!
          if (data && data.balance > initialBalance) {
            clearInterval(pollingInterval.current);
            setIsPaid(true);
            
            // Auto-redirect to dashboard after 3 seconds of showing success
            setTimeout(() => {
              navigate('/dashboard');
            }, 3000);
          }
        } catch (err) {
          console.error("Polling error", err);
        }
      }, 3000);
    }

    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, [invoiceStr, initialBalance, isPaid, activePhone, navigate]);

  const quickAmounts = [500, 1000, 2500, 5000, 10000];

  const handleGenerateInvoice = async () => {
    if (amount <= 0) return;
    
    setIsGenerating(true);
    setError('');
    setInvoiceStr('');
    setIsPaid(false);

    try {
      const data = await generateInvoice(activePhone, amount);
      
      if (data && (data.invoice || data.payment_request)) {
        setInvoiceStr(data.invoice || data.payment_request);
      } else {
        setError('Failed to generate invoice from server.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(invoiceStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setAmount(0);
    setInvoiceStr('');
    setError('');
    setIsPaid(false);
    if (pollingInterval.current) clearInterval(pollingInterval.current);
  };

  return (
    <div className={`min-h-screen pb-28 md:pb-12 transition-colors duration-700 ease-in-out ${isDarkMode ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        
        <GlobalHeader user={user} />

        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className={`md:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ease-out border shadow-sm ${isDarkMode ? 'bg-black border-blue-900/30 text-blue-400' : 'bg-white border-blue-100 text-blue-600'}`}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-blue-400/50' : 'text-blue-600/50'}`}>{t.lightningFast || "LIGHTNING FAST"}</p>
            <h1 className="font-extrabold text-2xl md:text-3xl tracking-tight">{t.receivePayment || "Receive payment"}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Input & Controls */}
          <div className="lg:col-span-7 space-y-6">
            
            {showTip && !isPaid && (
              <div className={`p-4 md:p-5 rounded-2xl flex items-start gap-3 transition-all duration-500 border ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30 text-slate-300' : 'bg-blue-50 border-blue-100 text-blue-900'}`}>
                <Lightbulb size={20} className="mt-0.5 flex-shrink-0 text-blue-500" />
                <p className="text-sm font-medium flex-1 leading-relaxed">{t.trackingTip || "Tip: Tracking debts digitally reduces lost payments."}</p>
                <button onClick={() => setShowTip(false)} className="opacity-50 hover:opacity-100 transition-opacity p-1">
                  <X size={18} />
                </button>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold text-center">
                {error}
              </div>
            )}

            <div className={`p-8 md:p-12 rounded-[2rem] border transition-all duration-500 text-center ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30' : 'bg-white shadow-sm border-blue-100'}`}>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-6 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.enterAmount || "ENTER AMOUNT"}</p>
              
              <div className="flex justify-center items-center gap-2 mb-4">
                <span className={`text-5xl md:text-6xl font-light ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>₦</span>
                <input 
                  type="number" 
                  value={amount || ''} 
                  onChange={(e) => {
                    setAmount(Number(e.target.value));
                    setInvoiceStr('');
                    setIsPaid(false);
                    if (pollingInterval.current) clearInterval(pollingInterval.current);
                  }}
                  placeholder="0"
                  disabled={isGenerating || isPaid}
                  className="bg-transparent border-none outline-none text-6xl md:text-7xl font-extrabold w-full max-w-[250px] text-center p-0 m-0"
                />
              </div>
              
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border ${isDarkMode ? 'bg-blue-900/20 border-blue-900/50 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                <Zap size={14} fill="currentColor" />
                = {(amount * 0.42).toFixed(0)} sats
              </div>
            </div>

            <div className="grid grid-cols-3 sm:flex sm:flex-wrap justify-center gap-3 pt-2">
              {quickAmounts.map((amt) => (
                <button 
                  key={amt}
                  disabled={isGenerating || isPaid}
                  onClick={() => {
                    setAmount(amount + amt);
                    setInvoiceStr('');
                    setIsPaid(false);
                    if (pollingInterval.current) clearInterval(pollingInterval.current);
                  }}
                  className={`py-3 sm:px-6 sm:py-3 rounded-xl sm:rounded-full text-sm font-bold border transition-all duration-300 ease-out hover:-translate-y-0.5 ${
                    isDarkMode 
                      ? 'bg-[#0a0a0a] border-blue-900/30 text-blue-400 hover:bg-blue-900/20 hover:border-blue-500 disabled:opacity-50' 
                      : 'bg-white border-slate-200 text-slate-700 hover:border-blue-600 hover:bg-blue-50 shadow-sm disabled:opacity-50'
                  }`}
                >
                  +₦{amt.toLocaleString()}
                </button>
              ))}
              <button 
                disabled={isGenerating}
                onClick={handleClear}
                className={`py-3 sm:px-6 sm:py-3 rounded-xl sm:rounded-full text-sm font-bold border transition-all duration-300 ease-out hover:-translate-y-0.5 ${isDarkMode ? 'bg-[#0a0a0a] border-red-900/30 text-red-400 hover:bg-red-900/20' : 'bg-white border-slate-200 text-red-500 hover:bg-red-50 hover:border-red-200 shadow-sm'}`}
              >
                Clear
              </button>
            </div>

            <div className="pt-4 md:hidden">
              <button 
                onClick={handleGenerateInvoice}
                disabled={amount === 0 || isGenerating || !!invoiceStr}
                className="w-full py-4 rounded-full bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold text-lg shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all active:scale-95 flex justify-center items-center gap-2"
              >
                {isGenerating ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Zap size={20} fill="currentColor" /> {invoiceStr ? "Invoice Generated" : (t.generateInvoice || "Generate Invoice")}</>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Desktop Invoice Preview Card */}
          <div className="hidden lg:block lg:col-span-5">
            <div className={`sticky top-32 p-8 rounded-[2rem] border transition-all duration-500 flex flex-col items-center text-center ${isPaid ? (isDarkMode ? 'bg-green-900/20 border-green-500/50' : 'bg-green-50 border-green-200') : (isDarkMode ? 'bg-gradient-to-b from-[#0a0a0a] to-[#050505] border-blue-900/30 shadow-2xl shadow-black' : 'bg-white border-blue-100 shadow-xl shadow-blue-900/5')}`}>
              
              <div className="w-full flex justify-between items-center mb-10 opacity-50">
                <Maximize size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{isPaid ? 'Payment Complete' : 'Invoice Preview'}</span>
                <Maximize size={20} />
              </div>

              {/* Success State vs QR State */}
              <div className={`w-full max-w-[280px] min-h-[256px] rounded-3xl flex items-center justify-center mb-8 border-2 border-dashed p-4 transition-all duration-500 ${isPaid ? 'border-green-400 bg-white dark:bg-black scale-105' : invoiceStr ? (isDarkMode ? 'border-green-500/50 bg-green-900/10' : 'border-green-400 bg-green-50') : amount > 0 ? (isDarkMode ? 'border-blue-500/50 bg-blue-900/10' : 'border-blue-400 bg-blue-50') : (isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50')}`}>
                
                {isPaid ? (
                  <div className="flex flex-col items-center animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-100 text-green-500 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                      <Check size={48} strokeWidth={3} />
                    </div>
                    <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">Paid!</h3>
                    <p className="text-sm opacity-60 mt-2">Redirecting...</p>
                  </div>
                ) : invoiceStr ? (
                  <div className="w-full flex flex-col items-center animate-in fade-in">
                    <div className="p-3 bg-white rounded-xl shadow-sm mb-4">
                      <QRCodeSVG 
                        value={`lightning:${invoiceStr}`} 
                        size={160} 
                        level={"M"}
                        includeMargin={true}
                        className="rounded-lg"
                      />                    
                    </div>
                    <div className={`w-full flex items-center gap-2 p-2 rounded-lg border transition-colors duration-500 ${isDarkMode ? 'bg-black border-slate-800' : 'bg-slate-100 border-slate-200'}`}>                      
                      <p className="text-xs truncate font-mono opacity-70 w-full text-left">{invoiceStr}</p>
                      <button onClick={handleCopy} className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 transition-colors">
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                ) : amount > 0 ? (
                  <div className="text-center space-y-3">
                    <Zap size={48} className="mx-auto text-blue-500 animate-pulse" fill="currentColor" />
                    <p className="text-sm font-bold text-blue-500">Ready to Generate</p>
                  </div>
                ) : (
                  <p className="text-sm font-medium opacity-40 px-8">Enter an amount to generate Lightning Invoice</p>
                )}
              </div>

              {!isPaid && (
                <>
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
                    onClick={handleGenerateInvoice}
                    disabled={amount === 0 || isGenerating || !!invoiceStr}
                    className="w-full py-5 rounded-full bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none text-white font-bold text-lg shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-1 transition-all flex justify-center items-center gap-2"
                  >
                    {isGenerating ? (
                       <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : invoiceStr ? (
                       <><Lightbulb size={20} /> Listening for payment...</>
                    ) : (
                       <><Zap size={20} fill={amount > 0 ? "currentColor" : "none"} /> {t.generateInvoice || "Generate Invoice"}</>
                    )}
                  </button>
                  <p className="text-xs opacity-50 font-medium mt-6">{t.customerScans || "Customer scans • You get paid instantly in naira"}</p>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Generated Invoice Overlay */}
      {invoiceStr && !isPaid && (
        <div className="md:hidden fixed inset-x-0 bottom-0 top-20 bg-white dark:bg-black z-50 p-6 flex flex-col items-center justify-center animate-in slide-in-from-bottom">
           <button onClick={handleClear} className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
             <X size={24} />
           </button>
           <h2 className="text-2xl font-bold mb-8">Scan to Pay</h2>
           <div className="p-4 bg-white rounded-2xl shadow-xl border border-slate-100 mb-8 flex justify-center items-center relative overflow-hidden">
             {/* Scanning radar sweep animation overlay */}
             <div className="absolute inset-0 bg-gradient-to-b from-blue-500/0 via-blue-500/20 to-blue-500/0 h-1/2 w-full animate-[ping_3s_ease-in-out_infinite] pointer-events-none" />
             <QRCodeSVG 
               value={`lightning:${invoiceStr}`} 
               size={220} 
               level={"M"}
               includeMargin={true}
               className="rounded-lg relative z-10"
             />
           </div>
           <div className="w-full max-w-sm flex items-center gap-2 bg-slate-50 dark:bg-zinc-900 p-3 rounded-xl border border-slate-200 dark:border-zinc-800 mb-8">
              <p className="text-sm truncate font-mono opacity-70 w-full text-left">{invoiceStr}</p>
              <button onClick={handleCopy} className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 transition-colors">
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
            <p className="text-xl font-bold">₦{amount.toLocaleString()}</p>
            <p className="text-blue-500 font-medium mt-1">Listening for {(amount * 0.42).toFixed(0)} sats...</p>
        </div>
      )}

      {/* Mobile Success Overlay */}
      {isPaid && (
        <div className="md:hidden fixed inset-0 bg-white dark:bg-black z-50 flex flex-col items-center justify-center animate-in zoom-in duration-300">
           <div className="w-32 h-32 bg-green-100 text-green-500 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
             <Check size={64} strokeWidth={3} />
           </div>
           <h2 className="text-4xl font-extrabold text-green-600 dark:text-green-400 mb-2">Paid!</h2>
           <p className="text-lg opacity-60">₦{amount.toLocaleString()} added to wallet</p>
        </div>
      )}

      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
}