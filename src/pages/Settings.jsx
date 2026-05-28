import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../locales/translations';
import Tooltip from '../components/Tooltip';
import BottomNav from '../components/BottomNav';
import GlobalHeader from '../components/GlobalHeader';
import { 
  FiShield as ShieldCheck, 
  FiDownload as Download, 
  FiCopy as Copy, 
  FiUser as User, 
  FiLock as Lock, 
  FiLogOut as LogOut,
  FiArrowLeft as ArrowLeft,
  FiAlertTriangle as AlertTriangle,
  FiEye as Eye,
  FiSun as Sun,
  FiMoon as Moon,
  FiBell as Bell
} from 'react-icons/fi';

// 1. Inject the user prop here!
export default function Settings({ user, onLogout }) {
  const navigate = useNavigate();
  const { isDarkMode, setIsDarkMode, language } = useTheme();
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

  const handleSignOut = () => {
    onLogout();
    navigate('/auth');
  };

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
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-blue-400/50' : 'text-blue-600/50'}`}>{t.yourAccount}</p>
            <h1 className="font-extrabold text-2xl md:text-3xl tracking-tight">{t.settings}</h1>
          </div>
        </div>

        {/* Desktop Asymmetrical Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* LEFT COLUMN: Identity & Core Actions */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Premium Profile Card - NOW DYNAMIC */}
            <div className="w-full bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-[2rem] p-8 shadow-2xl shadow-blue-600/20 flex flex-col md:flex-row md:items-center gap-6 relative overflow-hidden group transition-all duration-500 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:opacity-10 transition-opacity duration-1000 ease-out"></div>
              
              {/* 2. Dynamically pull initials based on the user's name */}
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center font-bold text-3xl backdrop-blur-sm border border-white/20 shadow-inner z-10 shrink-0 uppercase">
                {user?.name ? user.name.substring(0, 2) : 'KS'}
              </div>
              <div className="z-10">
                {/* 3. Display real name and phone number */}
                <h3 className="font-bold text-2xl leading-tight mb-1">{user?.name || 'KoboSats User'}</h3>
                <p className="text-sm opacity-90 mb-3 font-medium tracking-wide">{user?.phone || 'Secure Wallet'}</p>
                
                {/* 4. Updated global wording */}
                <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold border border-white/10 backdrop-blur-md shadow-sm">
                  <ShieldCheck size={14} className="text-blue-200" /> Verified Account
                </div>
              </div>
            </div>

            {/* Nostr Identity Section */}
            <section className={`p-6 rounded-[2rem] border transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30 hover:border-blue-700/50 hover:shadow-black/50' : 'bg-white border-blue-100 hover:border-blue-200 hover:shadow-blue-900/5'}`}>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-4">{t.identitySection}</p>
              <p className="text-xs font-bold opacity-60 mb-2">{t.nostrKey}</p>
              <div className={`p-4 rounded-xl mb-4 font-mono text-xs break-all leading-relaxed border ${isDarkMode ? 'bg-blue-900/10 border-blue-900/30 text-blue-300' : 'bg-blue-50/50 border-blue-100 text-blue-800'}`}>
                {nostrKey}
              </div>
              <Tooltip text={copied ? "Copied!" : "Copy to clipboard"}>
                <button 
                  onClick={handleCopy}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 border ${isDarkMode ? 'bg-blue-900/20 border-blue-900/50 text-blue-400 hover:bg-blue-900/40' : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 shadow-sm'}`}
                >
                  {copied ? <ShieldCheck size={16} className="text-green-500" /> : <Copy size={16} />}
                  {copied ? "Copied to clipboard" : t.copyKey}
                </button>
              </Tooltip>
            </section>

            {/* Account Management */}
            <section className={`rounded-[2rem] border overflow-hidden transition-all duration-500 hover:shadow-xl ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30 hover:border-blue-700/50 hover:shadow-black/50' : 'bg-white border-blue-100 hover:border-blue-200 hover:shadow-blue-900/5'}`}>
              <div className="p-6 border-b border-inherit bg-transparent">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{t.accountSection}</p>
              </div>
              {[
                { icon: User, title: t.editProfile, desc: t.editProfileDesc, onClick: () => {} },
                { icon: Lock, title: t.security, desc: t.securityDesc, onClick: () => {} },
                { icon: LogOut, title: t.signOut, desc: t.signOutDesc, isDestructive: true, onClick: handleSignOut }
              ].map((action, i) => (
                <button 
                  key={i}
                  onClick={action.onClick}
                  className={`w-full flex items-center gap-4 p-5 border-b border-inherit last:border-0 transition-colors duration-300 ${isDarkMode ? 'hover:bg-blue-900/10' : 'hover:bg-blue-50/50'}`}
                >
                  <div className={`p-2.5 rounded-full ${action.isDestructive ? (isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600') : (isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600')}`}>
                    <action.icon size={20} />
                  </div>
                  <div className="text-left flex-1">
                    <p className={`font-bold text-sm ${action.isDestructive ? 'text-red-500 dark:text-red-400' : ''}`}>{action.title}</p>
                    <p className="text-xs opacity-60 mt-0.5 font-medium">{action.desc}</p>
                  </div>
                  <div className="opacity-40 font-bold">›</div>
                </button>
              ))}
            </section>
          </div>

          {/* RIGHT COLUMN: Preferences, Security & Data */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Wallet Recovery Section */}
            <section className={`p-6 rounded-[2rem] border transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30 hover:border-blue-700/50 hover:shadow-black/50' : 'bg-white border-blue-100 hover:border-blue-200 hover:shadow-blue-900/5'}`}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">{t.recoverySection}</p>
                  <h3 className="font-bold text-xl">{t.seedPhrase}</h3>
                  <p className="text-sm opacity-70 mt-1 font-medium max-w-md">{t.seedPhraseDesc}</p>
                </div>
                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-orange-900/20 text-orange-400' : 'bg-orange-50 text-orange-500'}`}>
                  <AlertTriangle size={24} />
                </div>
              </div>

              {!showRecovery ? (
                <button 
                  onClick={() => setShowRecovery(true)}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 border ${isDarkMode ? 'border-blue-900/50 bg-blue-900/20 hover:bg-blue-900/40 text-blue-400' : 'border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 shadow-sm'}`}
                >
                  <Eye size={18} /> {t.revealSeed}
                </button>
              ) : (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
                    {seedPhrase.map((word, i) => (
                      <div key={i} className={`flex items-center gap-2 p-2 sm:p-3 rounded-lg border ${isDarkMode ? 'bg-black border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <span className="text-[10px] font-bold opacity-40 w-4">{i + 1}.</span>
                        <span className="text-sm font-bold">{word}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={handleCopyRecovery}
                      className={`flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'}`}
                    >
                      {recoveryCopied ? <ShieldCheck size={18} /> : <Copy size={18} />}
                      {recoveryCopied ? "Copied Securely" : t.copySeed}
                    </button>
                    <button 
                      onClick={() => setShowRecovery(false)}
                      className={`px-6 py-3.5 rounded-xl font-bold transition-colors duration-300 border ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-600'}`}
                    >
                      Hide
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Appearance Section */}
            <section className={`rounded-[2rem] border overflow-hidden transition-all duration-500 hover:shadow-xl ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30 hover:border-blue-700/50 hover:shadow-black/50' : 'bg-white border-blue-100 hover:border-blue-200 hover:shadow-blue-900/5'}`}>
              <div className="p-6 border-b border-inherit">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{t.appearanceSection}</p>
              </div>
              
              <div className="flex items-center justify-between p-6 border-b border-inherit">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full shadow-inner ${isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                    {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{isDarkMode ? t.darkMode : t.lightMode}</p>
                    <p className="text-xs opacity-60 mt-0.5 font-medium">{t.themeDesc}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-500 border ${isDarkMode ? 'bg-blue-600 border-blue-500' : 'bg-slate-200 border-slate-300 shadow-inner'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-500 ease-out ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full shadow-inner ${isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                    <Bell size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{t.notifications}</p>
                    <p className="text-xs opacity-60 mt-0.5 font-medium">{t.notificationsDesc}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-500 border ${notificationsEnabled ? 'bg-blue-600 border-blue-500' : isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300 shadow-inner'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-500 ease-out ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </section>

            {/* Data Export Section */}
            <section className={`p-6 rounded-[2rem] border transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30 hover:border-blue-700/50 hover:shadow-black/50' : 'bg-white border-blue-100 hover:border-blue-200 hover:shadow-blue-900/5'}`}>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-6">{t.dataSection}</p>
              <button className={`w-full flex items-center gap-5 p-6 rounded-[1.5rem] border transition-all duration-300 hover:-translate-y-0.5 ${isDarkMode ? 'border-zinc-800 bg-black hover:border-blue-900/50 hover:bg-blue-900/10' : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/50 shadow-sm'}`}>
                <div className={`p-3.5 rounded-full shadow-inner ${isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                  <Download size={22} />
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-base">{t.exportTransactions}</p>
                  <p className="text-sm opacity-60 mt-1 font-medium">{t.exportDesc}</p>
                </div>
              </button>
            </section>

          </div>
        </div>

        <div className="text-center py-10 mt-4">
          <p className="text-xs font-bold opacity-30 uppercase tracking-widest">KoboSats v1.0 • Built with ⚡ for financial freedom</p>
        </div>
      </div>

      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
}