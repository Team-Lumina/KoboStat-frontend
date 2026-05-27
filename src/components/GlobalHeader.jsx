import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../locales/translations';
import Tooltip from './Tooltip';
import { 
  FiGlobe as Globe, 
  FiBell as Bell, 
  FiUser as User 
} from 'react-icons/fi';
import whiteLogo from '/assets/white-bg.png';
import blackLogo from '/assets/black-bg.png';

export default function GlobalHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, language, setLanguage } = useTheme();
  const t = translations[language] || translations.en;
  
  // Local state for the notification dot
  const [notificationsEnabled] = useState(true);

  const handleLanguageToggle = () => {
    const langs = ['en', 'yo', 'ha', 'ig'];
    const currentIndex = langs.indexOf(language);
    const nextIndex = (currentIndex + 1) % langs.length;
    if (setLanguage) setLanguage(langs[nextIndex]);
  };

  return (
    <header className="flex justify-between items-center mb-8 md:mb-12 relative z-20">
      
      {/* Logo & User Info */}
      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <img 
            src={isDarkMode ? blackLogo : whiteLogo} 
            alt="KoboSats Logo" 
            className="w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/40 group-hover:-translate-y-0.5 transition-all duration-500 object-cover" 
          />
          <span className={`font-extrabold text-xl md:text-2xl tracking-tighter hidden lg:block transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Kobo<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Sats</span>
          </span>
        </div>
        
        <div className={`hidden md:block w-px h-8 transition-colors duration-700 ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}></div>
        
        <div className="hidden md:block">
          <p className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${isDarkMode ? 'text-blue-400/50' : 'text-blue-600/50'}`}>{t.greeting || "Good Morning"}</p>
          <h2 className={`font-bold text-sm leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Amara Okonkwo</h2>
        </div>
      </div>
      
      {/* Desktop Top Navigation (Floating Pill) */}
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

      {/* Header Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Tooltip text={t.changeLanguage || "Change Language"}>
          <button 
            onClick={handleLanguageToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-500 ease-out hover:-translate-y-0.5 border shadow-sm hover:shadow-md ${isDarkMode ? 'bg-black border-blue-900/30 text-blue-400 hover:bg-blue-900/20' : 'bg-white border-blue-100 text-blue-600 hover:bg-blue-50'}`}
          >
            <Globe size={16} /> <span className="hidden sm:inline">{language.toUpperCase()}</span>
          </button>
        </Tooltip>
        <Tooltip text={t.notifications || "Notifications"}>
          <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ease-out hover:-translate-y-0.5 relative border shadow-sm hover:shadow-md ${isDarkMode ? 'bg-black border-blue-900/30 text-blue-400 hover:bg-blue-900/20' : 'bg-white border-blue-100 text-blue-600 hover:bg-blue-50'}`}>
            <Bell size={18} />
            {notificationsEnabled && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white dark:ring-black"></span>}
          </button>
        </Tooltip>
        <Tooltip text={t.accountSettings || "Settings"}>
          <button 
            onClick={() => navigate('/settings')}
            className={`hidden md:flex w-10 h-10 rounded-full items-center justify-center transition-all duration-500 ease-out hover:-translate-y-0.5 border shadow-sm hover:shadow-md ${isDarkMode ? 'bg-black border-blue-900/30 text-blue-400 hover:bg-blue-900/20' : 'bg-white border-blue-100 text-blue-600 hover:bg-blue-50'}`}
          >
            <User size={18} />
          </button>
        </Tooltip>
      </div>
    </header>
  );
}