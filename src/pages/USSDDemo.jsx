import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../locales/translations';
import GlobalHeader from '../components/GlobalHeader';
import { 
  FiArrowLeft as ArrowLeft,
  FiDelete as Delete, 
  FiPhone as Phone, 
  FiSmartphone as Smartphone,
  FiWifiOff as WifiOff
} from 'react-icons/fi';

export default function USSDDemo({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, language } = useTheme();
  const t = translations[language] || translations.en;
  
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Advanced Emulator State
  const [ussdInput, setUssdInput] = useState('');
  const [ussdHistory, setUssdHistory] = useState('');
  const [sessionState, setSessionState] = useState('dialer'); // 'dialer', 'loading', 'menu'
  
  // Live API States
  const [ussdResponse, setUssdResponse] = useState('');
  const [isSessionEnded, setIsSessionEnded] = useState(false);

  // MOCK DATABASE STATE (This makes the math work in real-time)
  const [mockBalance, setMockBalance] = useState(113791);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Dialer Logic
  const handlePadClick = (val) => setUssdInput(prev => prev + val);
  const handleClear = () => setUssdInput('');
  const handleDelete = () => setUssdInput(prev => prev.slice(0, -1));

  // ========================================================================
  // THE FAKE BACKEND: Mimics Africa's Talking exactly
  // ========================================================================
  const mockUssdBackend = (cumulativeText) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 1. Clean the string just like the real API (remove the initial code)
        let cleanText = cumulativeText.replace('*384*7287#', '');
        if (cleanText.startsWith('*')) cleanText = cleanText.substring(1);
        
        // 2. Split the history into an array (e.g., "1*2*5000" -> ['1', '2', '5000'])
        const parts = cleanText === '' ? [] : cleanText.split('*');
        
        // MAIN MENU (No inputs yet)
        if (parts.length === 0) {
           resolve("CON Welcome to KoboSats\n1. Check Balance\n2. Pay Invoice (Send)\n3. Receive Sats");
           return;
        }
        
        // OPTION 1: Check Balance
        if (parts[0] === '1') {
           resolve(`END Your KoboSats balance is:\n₦${mockBalance.toLocaleString()}`);
           return;
        }
        
        // OPTION 2: Pay Invoice (Send)
        if (parts[0] === '2') {
           if (parts.length === 1) {
              resolve("CON 1. Pay KoboSat Number\n2. Pay External (Short ID)");
              return;
           }
           if (parts[1] === '1' || parts[1] === '2') {
              if (parts.length === 2) {
                 resolve(parts[1] === '1' ? "CON Enter receiver's phone number:" : "CON Enter Merchant Short ID (e.g. 55892):");
                 return;
              }
              if (parts.length === 3) {
                 resolve("CON Enter amount in Naira to send:");
                 return;
              }
              if (parts.length === 4) {
                 resolve(`CON Send ₦${parts[3]}?\nEnter 4-digit PIN to confirm:`);
                 return;
              }
              if (parts.length === 5) {
                 // Verify PIN and deduct from state
                 if (parts[4] === '1234') {
                    setMockBalance(prev => prev - parseInt(parts[3]));
                    resolve(`END Success! ⚡️\n₦${parts[3]} has been routed via the Lightning Network.`);
                 } else {
                    resolve("END Incorrect PIN. Transaction failed.");
                 }
                 return;
              }
           }
        }
        
        // OPTION 3: Receive Sats
        if (parts[0] === '3') {
           if (parts.length === 1) {
              resolve("CON Enter amount in Naira to receive:");
              return;
           }
           if (parts.length === 2) {
              resolve(`CON Generate invoice for ₦${parts[1]}?\n1. Confirm\n2. Cancel`);
              return;
           }
           if (parts.length === 3) {
              if (parts[2] === '1') {
                 // Add to mock state
                 setMockBalance(prev => prev + parseInt(parts[1]));
                 resolve(`END Invoice Generated!\nAsk customer to dial:\n*384*7287*99#\n\n(Simulated: ₦${parts[1]} added to wallet)`);
              } else {
                 resolve("END Transaction Cancelled.");
              }
              return;
           }
        }

        resolve("END Invalid Option selected.");
      }, 1000); // 1-second network delay for realism
    });
  };

  // Process the raw string from the backend
  const processUssdResponse = (text) => {
    setSessionState('menu');
    setUssdInput('');

    if (text.startsWith('END')) {
      setIsSessionEnded(true);
      setUssdResponse(text.replace(/^END\s*/, ''));
    } else if (text.startsWith('CON')) {
      setIsSessionEnded(false);
      setUssdResponse(text.replace(/^CON\s*/, ''));
    } else {
      setIsSessionEnded(false);
      setUssdResponse(text);
    }
  };

  const handleDial = async () => {
    if (ussdInput !== '*384*7287#') {
      alert("Invalid USSD code. Try *384*7287#");
      return;
    }
    setSessionState('loading');
    setUssdHistory('*384*7287#'); // Initialize history
    
    try {
      const res = await mockUssdBackend('*384*7287#');
      processUssdResponse(res);
    } catch (error) {
      processUssdResponse("END Connection Error.");
    }
  };

  // Interactive USSD Menu Logic
  const handleMenuSubmit = async () => {
    if (!ussdInput && !isSessionEnded) return;
    setSessionState('loading');
    
    try {
      // Append the new input to the history with a '*'
      const cumulativeText = ussdHistory ? `${ussdHistory}*${ussdInput}` : ussdInput;
      setUssdHistory(cumulativeText);

      // Send to the fake backend
      const res = await mockUssdBackend(cumulativeText);
      processUssdResponse(res);
    } catch (error) {
      processUssdResponse("END Connection Error.");
    }
  };

  const cancelSession = () => {
    setSessionState('dialer');
    setUssdResponse('');
    setUssdInput('');
    setUssdHistory(''); 
    setIsSessionEnded(false);
  };

  return (
    <div className={`min-h-screen pb-28 md:pb-12 transition-colors duration-700 ease-in-out ${isDarkMode ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        
        <GlobalHeader user={user} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center min-h-[75vh]">
          
          {/* LEFT COLUMN: Presentation Pitch */}
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
            
            <div className={`w-full max-w-sm md:max-w-md mx-auto transition-all duration-700 ease-out ${
              'md:border-[12px] md:rounded-[3rem] md:shadow-2xl md:overflow-hidden relative ' + 
              (isDarkMode ? 'md:border-zinc-900 md:bg-black md:shadow-blue-900/20' : 'md:border-slate-800 md:bg-white md:shadow-slate-400/50')
            }`}>
              
              <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-50"></div>

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
                
                {sessionState !== 'dialer' ? (
                  <div className={`flex-1 flex items-center justify-center p-6 rounded-[2rem] shadow-inner border mb-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-800 text-white border-slate-700'}`}>
                    
                    {sessionState === 'loading' ? (
                      <div className="text-center space-y-4 animate-pulse">
                        <Smartphone size={32} className="mx-auto text-blue-400" />
                        <p className="font-mono text-sm tracking-widest uppercase text-white">Executing USSD...</p>
                      </div>
                    ) : (
                      <div className="w-full text-left font-mono space-y-4">
                        <div className="text-sm leading-relaxed whitespace-pre-line tracking-tight text-green-400">
                          {ussdResponse}
                        </div>
                        
                        {!isSessionEnded ? (
                          <>
                            <div className="flex items-center gap-2 border-b-2 border-green-500/50 pb-1 mt-6">
                              <span className="text-green-500">{'>'}</span>
                              <input 
                                type="text" 
                                value={ussdInput}
                                onChange={(e) => setUssdInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleMenuSubmit()}
                                autoFocus
                                className="bg-transparent border-none outline-none text-white font-bold w-full"
                                placeholder="Reply here..."
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
