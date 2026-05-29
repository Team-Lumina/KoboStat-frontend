import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../locales/translations';
import BottomNav from '../components/BottomNav';
import GlobalHeader from '../components/GlobalHeader';
import { payInvoice } from '../services/api'; // Make sure Busayomi exposes this!
import { 
  FiArrowLeft as ArrowLeft,
  FiSend as SendIcon,
  FiClipboard as Clipboard,
  FiCamera as Camera,
  FiCheckCircle as CheckCircle,
  FiAlertCircle as AlertCircle,
  FiZap as Zap
} from 'react-icons/fi';

export default function Send({ user }) {
  const navigate = useNavigate();
  const { isDarkMode, language } = useTheme();
  const t = translations[language] || translations.en;
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [invoice, setInvoice] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const activePhone = user?.phone || "08012345678";

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInvoice(text);
      setError('');
      setSuccess(false);
    } catch (err) {
      setError("Failed to read clipboard.");
    }
  };

  const handlePay = async () => {
    if (!invoice) {
      setError("Please paste a valid Lightning invoice.");
      return;
    }

    setIsPaying(true);
    setError('');

    try {
      // Assuming your api.js has a payInvoice(phone, invoiceString) function
      const result = await payInvoice(activePhone, invoice);
      
      if (result && !result.error) {
        setSuccess(true);
        setInvoice('');
      } else {
        setError(result.error || "Payment failed. Check your balance or invoice.");
      }
    } catch (err) {
      setError("Network error. Could not process payment.");
    } finally {
      setIsPaying(false);
    }
  };

  // Simple UI check to see if it looks like a Lightning Invoice
  const isValidFormat = invoice.toLowerCase().startsWith('lnbc') || invoice.toLowerCase().startsWith('lnurl');

  return (
    <div className={`min-h-screen pb-28 md:pb-12 transition-colors duration-700 ease-in-out ${isDarkMode ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        
        <GlobalHeader user={user} />

        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className={`md:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ease-out border shadow-sm ${isDarkMode ? 'bg-black border-blue-900/30 text-blue-400' : 'bg-white border-blue-100 text-blue-600'}`}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-blue-400/50' : 'text-blue-600/50'}`}>INSTANT SETTLEMENT</p>
            <h1 className="font-extrabold text-2xl md:text-3xl tracking-tight">Send payment</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Input */}
          <div className="lg:col-span-7 space-y-6">
            
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center gap-2">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            {success && (
              <div className="p-4 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm font-bold flex items-center gap-2">
                <CheckCircle size={18} /> Payment Sent Successfully!
              </div>
            )}

            <div className={`p-6 md:p-8 rounded-[2rem] border transition-all duration-500 ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30' : 'bg-white shadow-sm border-blue-100'}`}>
              <div className="flex justify-between items-center mb-4">
                <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Destination</p>
                <button onClick={handlePaste} className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                  <Clipboard size={14} /> Paste
                </button>
              </div>

              <textarea 
                value={invoice}
                onChange={(e) => {
                  setInvoice(e.target.value);
                  setError('');
                  setSuccess(false);
                }}
                placeholder="Paste Lightning Invoice (lnbc...) or Address"
                className={`w-full h-32 p-4 rounded-xl font-mono text-sm border resize-none outline-none transition-colors ${isDarkMode ? 'bg-black border-slate-800 focus:border-blue-500 text-blue-400' : 'bg-slate-50 border-slate-200 focus:border-blue-400 text-blue-600'}`}
              />

              <div className="grid grid-cols-2 gap-4 mt-4">
                <button className={`py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition-colors ${isDarkMode ? 'border-slate-800 hover:bg-slate-900' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <Camera size={18} /> Scan QR
                </button>
                <button 
                  onClick={handlePay}
                  disabled={!invoice || isPaying}
                  className="py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 active:scale-95 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:shadow-none transition-all"
                >
                  {isPaying ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><SendIcon size={18} /> Pay Now</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Invoice Details Preview */}
          <div className="hidden lg:block lg:col-span-5">
            <div className={`sticky top-32 p-8 rounded-[2rem] border transition-all duration-500 flex flex-col items-center text-center ${isDarkMode ? 'bg-gradient-to-b from-[#0a0a0a] to-[#050505] border-blue-900/30 shadow-2xl shadow-black' : 'bg-white border-blue-100 shadow-xl shadow-blue-900/5'}`}>
              
              <div className="w-full flex justify-between items-center mb-8 opacity-50">
                <Zap size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Invoice Decoder</span>
                <Zap size={20} />
              </div>

              {invoice ? (
                <div className="w-full space-y-6 animate-in fade-in zoom-in duration-300">
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${isValidFormat ? 'bg-green-100 text-green-500 dark:bg-green-900/30' : 'bg-orange-100 text-orange-500 dark:bg-orange-900/30'}`}>
                    {isValidFormat ? <CheckCircle size={32} /> : <AlertCircle size={32} />}
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-1">{isValidFormat ? 'Valid Lightning Invoice' : 'Unknown Format'}</h3>
                    <p className="text-sm opacity-60">
                      {isValidFormat ? 'Ready to route payment instantly.' : 'Ensure you pasted a valid Bolt11 invoice.'}
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border text-left ${isDarkMode ? 'bg-black border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <p className="text-[10px] font-bold uppercase opacity-50 mb-1">Network Payload</p>
                    <p className="font-mono text-xs opacity-80 break-all line-clamp-3">{invoice}</p>
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center opacity-40">
                  <Clipboard size={48} className="mb-4" />
                  <p className="font-bold text-sm">Awaiting Invoice</p>
                  <p className="text-xs font-medium">Paste a string to decode details</p>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
}