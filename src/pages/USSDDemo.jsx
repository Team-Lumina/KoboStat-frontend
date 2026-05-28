import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../locales/translations';
import BottomNav from '../components/BottomNav';
import GlobalHeader from '../components/GlobalHeader';
import { sendUssdCommand } from '../services/api'; // Live API import
import { 
  FiArrowLeft as ArrowLeft,
  FiDelete as Delete, 
  FiPhone as Phone, 
  FiSmartphone as Smartphone,
  FiWifiOff as WifiOff,
  FiZap as Zap
} from 'react-icons/fi';

// THE FIX: Accept the `user` prop
export default function USSDDemo({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, language } = useTheme();
  const t = translations[language] || translations.en;
  
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Advanced Emulator State
  const [ussdInput, setUssdInput] = useState('');
  const [sessionState, setSessionState] = useState('dialer'); // 'dialer', 'loading', 'menu'
  
  // Live API States
  const [ussdResponse, setUssdResponse] = useState('');
  const [isSessionEnded, setIsSessionEnded] = useState(false);
  
  const activePhone = user?.phone || "08012345678";

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Dialer Logic
  const handlePadClick = (val) => setUssdInput(prev => prev + val);
  const handleClear = () => setUssdInput('');
  const handleDelete = () => setUssdInput(prev => prev.slice(0, -1));

  // Process the raw string from the backend
  const processUssdResponse = (rawResponse) => {
    // Ensure we are working with a string
    const text = typeof rawResponse === 'string' ? rawResponse : (rawResponse.message || JSON.stringify(rawResponse));
    
    setSessionState('menu');
    setUssdInput('');

    if (text.startsWith('END')) {
      setIsSessionEnded(true);
      // Strip "END " for a cleaner UI
      setUssdResponse(text.replace(/^END\s*/, ''));
    } else if (text.startsWith('CON')) {
      setIsSessionEnded(false);
      // Strip "CON " for a cleaner UI
      setUssdResponse(text.replace(/^CON\s*/, ''));
    } else {
      // Fallback if the backend forgets the prefix
      setIsSessionEnded(false);
      setUssdResponse(text);
    }
  };

  const handleDial = async () => {
    if (!ussdInput) return;
    setSessionState('loading');
    
    try {
      // Send the initial shortcode (e.g. *384*7287#)
      const res = await sendUssdCommand(activePhone, ussdInput);
      processUssdResponse(res);
    } catch (error) {
      processUssdResponse("END Connection Error. Please try again.");
    }
  };

  // Interactive USSD Menu Logic for live demos
  const handleMenuSubmit = async () => {
    setSessionState('loading');
    
    try {
      // Send the user's menu selection (e.g. "1")
      const res = await sendUssdCommand(activePhone, ussdInput);
      processUssdResponse(res);
    } catch (error) {
      processUssdResponse("END Connection Error. Please check your network.");
    }
  };

  const cancelSession = () => {
    setSessionState('dialer');
    setUssdResponse('');
    setUssdInput('');
    setIsSessionEnded(false);
  };

  return (
    <div className={`min-h-screen pb-28 md:pb-12 transition-colors duration-700 ease-in-out ${isDarkMode ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        
        {/* REUSABLE GLOBAL HEADER WITH USER PROP */}
        <GlobalHeader user={user} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center min-h-[75vh]">
          
          {/* LEFT COLUMN: Presentation Pitch (Desktop Only) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-8 pr-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 text-blue-600 border border-blue-600/20 w-fit">
              <WifiOff size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Offline Access Enabled</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              No internet?<br />
              <span className="text-blue-600">No problem.</span>
            </h1>
            
            <p className="text-lg opacity-70 leading-relaxed font-medium max-w-lg">
              Interact with the Lightning Network directly from any basic mobile phone. Dial our USSD code to check balances, log debts, and generate invoices seamlessly.
            </p>

            <div className={`p-6 rounded-[2rem] border mt-4 ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30' : 'bg-white shadow-xl shadow-blue-900/5 border-blue-100'}`}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Live Demo Instructions</p>
              <p className="font-medium text-sm leading-relaxed mb-4">Dial the developer shortcode below in the emulator to initiate a simulated connection to the KoboSat gateway.</p>
              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 rounded-xl font-mono text-lg font-bold tracking-widest ${isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                  *384*7287#
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Emulator */}
          <div className="lg:col-span-6 flex justify-center">
            
            {/* CSS Phone Frame */}
            <div className={`w-full max-w-sm md:max-w-md mx-auto transition-all duration-700 ease-out ${
              'md:border-[12px] md:rounded-[3rem] md:shadow-2xl md:overflow-hidden relative ' + 
              (isDarkMode ? 'md:border-zinc-900 md:bg-black md:shadow-blue-900/20' : 'md:border-slate-800 md:bg-white md:shadow-slate-400/50')
            }`}>
              
              {/* Fake Phone Notch */}
              <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-50"></div>

              {/* Mobile Page Title & Back Button */}
              <div className="flex items-center gap-4 mb-6 md:hidden px-2 pt-2">
                <button onClick={() => navigate(-1)} className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-sm ${isDarkMode ? 'bg-black border-blue-900/30 text-blue-400' : 'bg-white border-blue-100 text-blue-600'}`}>
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-blue-400/50' : 'text-blue-600/50'}`}>{t.ussdEmulator || "USSD EMULATOR"}</p>
                  <h1 className="font-extrabold text-2xl tracking-tight">Offline Mode</h1>
                </div>
              </div>

              <div className="md:px-6 md:py-12 md:min-h-[750px] flex flex-col justify-between h-full">
                
                {/* --- USSD SESSION UI --- */}
                {sessionState !== 'dialer' ? (
                  <div className={`flex-1 flex items-center justify-center p-6 rounded-[2rem] shadow-inner border mb-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-800 text-white border-slate-700'}`}>
                    
                    {sessionState === 'loading' ? (
                      <div className="text-center space-y-4 animate-pulse">
                        <Smartphone size={32} className="mx-auto text-blue-400" />
                        <p className="font-mono text-sm tracking-widest uppercase text-white">Executing USSD...</p>
                      </div>
                    ) : (
                      <div className="w-full text-left font-mono space-y-4">
                        
                        {/* Display the live response from the backend */}
                        <div className="text-sm leading-relaxed whitespace-pre-line tracking-tight text-green-400">
                          {ussdResponse}
                        </div>
                        
                        {/* Conditionally show input and buttons based on END vs CON */}
                        {!isSessionEnded ? (
                          <>
                            <div className="flex items-center gap-2 border-b-2 border-green-500/50 pb-1 mt-6">
                              <span className="text-green-500">{'>'}</span>
                              <input 
                                type="text" 
                                value={ussdInput}
                                readOnly
                                className="bg-transparent border-none outline-none text-white font-bold w-full"
                              />
                            </div>
                            
                            <div className="flex gap-3 pt-4">
                              <button onClick={cancelSession} className="flex-1 py-2 rounded-lg text-xs font-bold border border-slate-600 hover:bg-slate-700 transition-colors text-white">CANCEL</button>
                              <button onClick={handleMenuSubmit} className="flex-1 py-2 rounded-lg text-xs font-bold bg-green-600 hover:bg-green-700 transition-colors text-white">SEND</button>
                            </div>
                          </>
                        ) : (
                          <div className="flex gap-3 pt-4 mt-6">
                            <button onClick={cancelSession} className="flex-1 py-2 rounded-lg text-xs font-bold border border-slate-600 hover:bg-slate-700 transition-colors text-white">OK</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                ) : (

                  /* --- STANDARD DIALER UI --- */
                  <>
                    <div className="px-2 mb-8">
                      <div className={`w-full h-32 md:h-40 rounded-[2rem] p-6 shadow-inner flex flex-col items-center justify-center text-center transition-colors ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-slate-100 border border-slate-200'}`}>
                        {ussdInput ? (
                          <h1 className="text-4xl font-mono tracking-widest text-blue-500 font-bold drop-shadow-sm">
                            {ussdInput}
                          </h1>
                        ) : (
                          <>
                            <p className="text-3xl font-mono font-bold tracking-widest opacity-20 mb-2">_ _ _ _</p>
                            <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Dial *384*7287#</p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="px-4 md:px-2">
                      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
                        {[
                          { val: 1, sub: '' }, { val: 2, sub: 'ABC' }, { val: 3, sub: 'DEF' },
                          { val: 4, sub: 'GHI' }, { val: 5, sub: 'JKL' }, { val: 6, sub: 'MNO' },
                          { val: 7, sub: 'PQRS' }, { val: 8, sub: 'TUV' }, { val: 9, sub: 'WXYZ' },
                          { val: '*', sub: '' }, { val: 0, sub: '+' }, { val: '#', sub: '' }
                        ].map((key) => (
                          <button 
                            key={key.val}
                            onClick={() => handlePadClick(key.val.toString())}
                            className={`py-3 md:py-4 rounded-full flex flex-col items-center justify-center transition-all active:scale-90 border shadow-sm hover:shadow-md ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30 hover:border-blue-500/50 hover:bg-blue-900/20' : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50'}`}
                          >
                            <span className="text-2xl md:text-3xl font-light">{key.val}</span>
                            <span className="text-[9px] font-bold tracking-widest opacity-40 h-3">{key.sub}</span>
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center justify-center">
                          {ussdInput && (
                            <button onClick={handleClear} className="w-12 h-12 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                              <Delete size={24} />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center justify-center">
                          <button 
                            onClick={handleDial} 
                            className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/40 hover:bg-green-600 hover:scale-105 active:scale-95 transition-all"
                          >
                            <Phone size={28} className="fill-current" />
                          </button>
                        </div>
                        <div className="flex items-center justify-center">
                          {ussdInput && (
                            <button onClick={handleDelete} className="w-12 h-12 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                              <ArrowLeft size={24} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}