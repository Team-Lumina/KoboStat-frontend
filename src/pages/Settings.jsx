import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../locales/translations';
import Tooltip from '../components/Tooltip';
import BottomNav from '../components/BottomNav';
import { 
  FiGlobe as Globe, 
  FiBell as Bell, 
  FiShield as ShieldCheck, 
  FiSun as Sun, 
  FiMoon as Moon, 
  FiDownload as Download, 
  FiCopy as Copy, 
  FiUser as User, 
  FiLock as Lock, 
  FiLogOut as LogOut,
  FiArrowLeft as ArrowLeft,
  FiAlertTriangle as AlertTriangle,
  FiEye as Eye
} from 'react-icons/fi';

export default function Settings() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, setIsDarkMode, language, setLanguage } = useTheme();
  const t = translations[language] || translations.en;
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Recovery State
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryCopied, setRecoveryCopied] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const nostrKey = "npub1koboq3rl9awzm7d2x8q5jf7yhep3v6k4ld9k7sat0vmf3pn0t2qsr5kobo";
  const seedPhrase = ["breeze", "dune", "pioneer", "execute", "absorb", "clerk", "various", "custom", "vintage", "satoshi", "lion", "dilemma"];

  const handleCopy = () => {
    navigator.clipboard.writeText(nostrKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyRecovery = () => {
    navigator.clipboard.writeText(seedPhrase.join(' '));
    setRecoveryCopied(true);
    setTimeout(() => setRecoveryCopied(false), 2000);
  };

  const handleLanguageToggle = () => {
    const langs = ['en', 'yo', 'ha', 'ig'];
    const currentIndex = langs.indexOf(language);
    if (setLanguage) setLanguage(langs[(currentIndex + 1) % langs.length]);
  };

  const languages = [
    { code: 'en', name: 'English', label: 'EN' },
    { code: 'yo', name: 'Yorùbá', label: 'YO' },
    { code: 'ha', name: 'Hausa', label: 'HA' },
    { code: 'ig', name: 'Igbo', label: 'IG' },
  ];

  // --------------------------------------------------------
  // RESPONSIVE GLOBAL HEADER
  // --------------------------------------------------------
  const GlobalHeader = () => (
    <header className="flex justify-between items-center mb-8 md:mb-12">
      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm md:text-lg shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/40 group-hover:-translate-y-0.5 transition-all duration-500">
            KS
          </div>
          <span className={`font-extrabold text-xl tracking-tight hidden lg:block transition-colors duration-500 ${isDarkMode ? 'text-white group-hover:text-blue-400' : 'text-slate-900 group-hover:text-blue-600'}`}>KoboSats</span>
        </div>
        
        <div className={`hidden md:block w-px h-8 transition-colors duration-700 ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}></div>
        
        <div className="hidden md:block">
          <p className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${isDarkMode ? 'text-blue-400/50' : 'text-blue-600/50'}`}>{t.greeting || "GOOD MORNING"}</p>
          <h2 className={`font-bold text-sm leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Amara Okonkwo</h2>
        </div>
      </div>
      
      <nav className={`hidden md:flex items-center p-1.5 rounded-full border shadow-sm transition-colors duration-700 ${isDarkMode ? 'bg-black border-blue-900/30' : 'bg-white border-blue-100'}`}>
        {[
          { name: t.home || 'Home', path: '/' },
          { name: t.debts || 'Debts', path: '/debts' },
          { name: t.receive || 'Receive', path: '/receive' },
          { name: t.ussd || 'USSD', path: '/ussd' },
        ].map(item => (
          <button 
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-500 ease-out ${
              location.pathname === item.path 
                ? (isDarkMode ? 'bg-blue-900/30 text-blue-400 shadow-inner' : 'bg-blue-50 text-blue-600 shadow-inner')
                : (isDarkMode ? 'text-slate-400 hover:bg-blue-900/10 hover:text-blue-400' : 'text-slate-500 hover:bg-blue-50/50 hover:text-blue-600')
            }`}
          >
            {item.name}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3 sm:gap-4">
        <Tooltip text="Change Language">
          <button 
            onClick={handleLanguageToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-500 ease-out hover:-translate-y-0.5 border shadow-sm hover:shadow-md ${isDarkMode ? 'bg-black border-blue-900/30 text-blue-400 hover:bg-blue-900/20' : 'bg-white border-blue-100 text-blue-600 hover:bg-blue-50'}`}
          >
            <Globe size={16} /> <span className="hidden sm:inline">{language.toUpperCase()}</span>
          </button>
        </Tooltip>
        <Tooltip text="Notifications">
          <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ease-out hover:-translate-y-0.5 relative border shadow-sm hover:shadow-md ${isDarkMode ? 'bg-black border-blue-900/30 text-blue-400 hover:bg-blue-900/20' : 'bg-white border-blue-100 text-blue-600 hover:bg-blue-50'}`}>
            <Bell size={18} />
            {notificationsEnabled && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white dark:ring-black"></span>}
          </button>
        </Tooltip>
        <Tooltip text="Account Settings">
          <button 
            onClick={() => navigate('/settings')}
            className={`hidden md:flex w-10 h-10 rounded-full items-center justify-center transition-all duration-500 ease-out hover:-translate-y-0.5 border shadow-sm hover:shadow-md ${isDarkMode ? 'bg-blue-900/30 border-blue-500/50 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'}`}
          >
            <User size={18} />
          </button>
        </Tooltip>
      </div>
    </header>
  );

  return (
    <div className={`min-h-screen pb-28 md:pb-12 transition-colors duration-700 ease-in-out ${isDarkMode ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        
        <GlobalHeader />

        {/* Page Title & Mobile Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className={`md:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ease-out border shadow-sm ${isDarkMode ? 'bg-black border-blue-900/30 text-blue-400' : 'bg-white border-blue-100 text-blue-600'}`}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-blue-400/50' : 'text-blue-600/50'}`}>{t.yourAccount || "YOUR ACCOUNT"}</p>
            <h1 className="font-extrabold text-2xl md:text-3xl tracking-tight">{t.settings || "Settings"}</h1>
          </div>
        </div>

        {/* Desktop Asymmetrical Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* LEFT COLUMN: Identity & Core Actions */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Premium Profile Card */}
            <div className="w-full bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-[2rem] p-8 shadow-2xl shadow-blue-600/20 flex flex-col md:flex-row md:items-center gap-6 relative overflow-hidden group transition-all duration-500 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:opacity-10 transition-opacity duration-1000 ease-out"></div>
              
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center font-bold text-3xl backdrop-blur-sm border border-white/20 shadow-inner z-10 shrink-0">
                AO
              </div>
              <div className="z-10">
                <h3 className="font-bold text-2xl leading-tight mb-1">Amara Okonkwo</h3>
                <p className="text-sm opacity-90 mb-3 font-medium">Mama Amara Provisions</p>
                <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold border border-white/10 backdrop-blur-md shadow-sm">
                  <ShieldCheck size={14} className="text-blue-200" /> {t.verifiedTrader || "Verified Trader"}
                </div>
              </div>
            </div>

            {/* Nostr Identity Section */}
            <section className={`p-6 rounded-[2rem] border transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30 hover:border-blue-700/50 hover:shadow-black/50' : 'bg-white border-blue-100 hover:border-blue-200 hover:shadow-blue-900/5'}`}>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-4">{t.identitySection || "IDENTITY"}</p>
              <p className="text-xs font-bold opacity-60 mb-2">{t.nostrKey || "Nostr Public Key"}</p>
              <div className={`p-4 rounded-xl mb-4 font-mono text-xs break-all leading-relaxed border ${isDarkMode ? 'bg-blue-900/10 border-blue-900/30 text-blue-300' : 'bg-blue-50/50 border-blue-100 text-blue-800'}`}>
                {nostrKey}
              </div>
              <Tooltip text={copied ? "Copied!" : "Copy to clipboard"}>
                <button 
                  onClick={handleCopy}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 border ${isDarkMode ? 'bg-blue-900/20 border-blue-900/50 text-blue-400 hover:bg-blue-900/40' : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 shadow-sm'}`}
                >
                  {copied ? <ShieldCheck size={16} className="text-green-500" /> : <Copy size={16} />}
                  {copied ? "Copied to clipboard" : (t.copyKey || "Copy Key")}
                </button>
              </Tooltip>
            </section>

            {/* Account Management */}
            <section className={`rounded-[2rem] border overflow-hidden transition-all duration-500 hover:shadow-xl ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30 hover:border-blue-700/50 hover:shadow-black/50' : 'bg-white border-blue-100 hover:border-blue-200 hover:shadow-blue-900/5'}`}>
              <div className="p-6 border-b border-inherit bg-transparent">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{t.accountSection || "ACCOUNT"}</p>
              </div>
              {[
                { icon: User, title: t.editProfile || "Edit Profile", desc: t.editProfileDesc || "Change your personal details" },
                { icon: Lock, title: t.security || "Security", desc: t.securityDesc || "PIN and biometrics" },
                { icon: LogOut, title: t.signOut || "Sign Out", desc: t.signOutDesc || "Disconnect this device", isDestructive: true }
              ].map((action, i) => (
                <Tooltip key={i} text={`${action.title} Settings`}>
                  <button className={`w-full flex items-center gap-4 p-5 border-b border-inherit last:border-0 transition-colors duration-300 ${isDarkMode ? 'hover:bg-blue-900/10' : 'hover:bg-blue-50/50'}`}>
                    <div className={`p-2.5 rounded-full ${action.isDestructive ? (isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600') : (isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600')}`}>
                      <action.icon size={20} />
                    </div>
                    <div className="text-left flex-1">
                      <p className={`font-bold text-sm ${action.isDestructive ? 'text-red-500 dark:text-red-400' : ''}`}>{action.title}</p>
                      <p className="text-xs opacity-60 mt-0.5 font-medium">{action.desc}</p>
                    </div>
                    <div className="opacity-40 font-bold">›</div>
                  </button>
                </Tooltip>
              ))}
            </section>
          </div>

          {/* RIGHT COLUMN: Preferences, Security & Data */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Wallet Recovery Section */}
            <section className={`p-6 rounded-[2rem] border transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30 hover:border-blue-700/50 hover:shadow-black/50' : 'bg-white border-blue-100 hover:border-blue-200 hover:shadow-blue-900/5'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">{t.recoverySection || "WALLET RECOVERY"}</p>
                  <p className="text-sm font-bold">{t.seedPhrase || "Secret Recovery Phrase"}</p>
                </div>
                <div className={`p-2 rounded-full ${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500'}`}>
                   <AlertTriangle size={18} />
                </div>
              </div>
              
              <p className="text-xs opacity-60 mb-6 font-medium leading-relaxed">
                {t.recoveryWarning || "This 12-word phrase is the only way to recover your wallet. Never share it with anyone."}
              </p>

              {showRecovery ? (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="grid grid-cols-3 gap-2">
                    {seedPhrase.map((word, index) => (
                      <div key={index} className={`flex items-center gap-2 p-2 rounded-xl border ${isDarkMode ? 'bg-black border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <span className="text-[10px] font-bold opacity-40">{index + 1}</span>
                        <span className="text-sm font-bold">{word}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-2">
                     <button onClick={() => setShowRecovery(false)} className={`flex-1 py-3.5 rounded-xl font-bold text-xs transition-colors border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800' : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'}`}>
                        Hide Phrase
                     </button>
                     <button onClick={handleCopyRecovery} className={`flex-1 py-3.5 rounded-xl font-bold text-xs transition-colors border ${isDarkMode ? 'bg-blue-900/30 border-blue-900/50 text-blue-400 hover:bg-blue-900/50' : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'}`}>
                        {recoveryCopied ? "Copied!" : "Copy Phrase"}
                     </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setShowRecovery(true)}
                  className={`w-full py-4 rounded-[1.25rem] font-bold text-sm border-2 border-dashed flex items-center justify-center gap-2 transition-colors duration-300 ${isDarkMode ? 'bg-black border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-900/50' : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200'}`}
                >
                  <Eye size={18} /> Reveal Recovery Phrase
                </button>
              )}
            </section>

            {/* Appearance Section */}
            <section className={`rounded-[2rem] border overflow-hidden transition-all duration-500 hover:shadow-xl ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30 hover:border-blue-700/50 hover:shadow-black/50' : 'bg-white border-blue-100 hover:border-blue-200 hover:shadow-blue-900/5'}`}>
              <div className="p-6 border-b border-inherit">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{t.appearanceSection || "PREFERENCES"}</p>
              </div>
              
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between p-6 border-b border-inherit">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full shadow-inner ${isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                    {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{isDarkMode ? (t.darkMode || "Dark Mode") : (t.lightMode || "Light Mode")}</p>
                    <p className="text-xs opacity-60 mt-0.5 font-medium">{t.themeDesc || "Adjust the app interface"}</p>
                  </div>
                </div>
                <Tooltip text="Toggle Theme">
                  <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-500 border ${isDarkMode ? 'bg-blue-600 border-blue-500' : 'bg-slate-200 border-slate-300 shadow-inner'}`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-500 ease-out ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </Tooltip>
              </div>

              {/* Notifications Toggle */}
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full shadow-inner ${isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                    <Bell size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{t.notifications || "Push Notifications"}</p>
                    <p className="text-xs opacity-60 mt-0.5 font-medium">{t.notificationsDesc || "Alerts for payments and debts"}</p>
                  </div>
                </div>
                <Tooltip text="Toggle Notifications">
                  <button 
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-500 border ${notificationsEnabled ? 'bg-blue-600 border-blue-500' : isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300 shadow-inner'}`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-500 ease-out ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </Tooltip>
              </div>
            </section>

            {/* Language Section Grid */}
            <section className={`p-6 rounded-[2rem] border transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30 hover:border-blue-700/50 hover:shadow-black/50' : 'bg-white border-blue-100 hover:border-blue-200 hover:shadow-blue-900/5'}`}>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-6">{t.languageSection || "LANGUAGE REGION"}</p>
              <div className="grid grid-cols-2 gap-4">
                {languages.map((lang) => (
                  <Tooltip key={lang.code} text={`Switch to ${lang.name}`}>
                    <button
                      onClick={() => setLanguage(lang.code)}
                      className={`flex items-center justify-between p-5 rounded-[1.5rem] border transition-all duration-300 hover:-translate-y-0.5 ${
                        language === lang.code
                          ? isDarkMode 
                            ? 'border-blue-500 bg-blue-900/20 text-blue-400 shadow-md shadow-blue-900/20' 
                            : 'border-blue-600 bg-blue-50 text-blue-600 shadow-md shadow-blue-600/10'
                          : isDarkMode
                            ? 'border-slate-800 bg-black hover:border-blue-900/50 text-white'
                            : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/30 text-black shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Globe size={18} className={language === lang.code ? '' : 'opacity-40'} />
                        <span className="font-bold text-sm">{lang.name}</span>
                      </div>
                      <span className={`text-[10px] font-extrabold px-2 py-1 rounded border ${language === lang.code ? (isDarkMode ? 'border-blue-500/30 bg-blue-900/40' : 'border-blue-200 bg-blue-100') : 'opacity-40 border-inherit'}`}>
                        {lang.label}
                      </span>
                    </button>
                  </Tooltip>
                ))}
              </div>
            </section>

            {/* Data Export Section */}
            <section className={`p-6 rounded-[2rem] border transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30 hover:border-blue-700/50 hover:shadow-black/50' : 'bg-white border-blue-100 hover:border-blue-200 hover:shadow-blue-900/5'}`}>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-6">{t.dataSection || "DATA EXPORT"}</p>
              <Tooltip text="Download CSV">
                <button className={`w-full flex items-center gap-5 p-6 rounded-[1.5rem] border transition-all duration-300 hover:-translate-y-0.5 ${isDarkMode ? 'border-zinc-800 bg-black hover:border-blue-900/50 hover:bg-blue-900/10' : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/50 shadow-sm'}`}>
                  <div className={`p-3.5 rounded-full shadow-inner ${isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                    <Download size={22} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-base">{t.exportTransactions || "Export Transaction History"}</p>
                    <p className="text-sm opacity-60 mt-1 font-medium">{t.exportDesc || "Download your ledger as a CSV file"}</p>
                  </div>
                </button>
              </Tooltip>
            </section>

          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-10 mt-4">
          <p className="text-xs font-bold opacity-30 uppercase tracking-widest">KoboSats v1.0 • Built with ⚡ for African traders</p>
        </div>

      </div>

      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
}