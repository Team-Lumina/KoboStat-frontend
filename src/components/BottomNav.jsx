import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../locales/translations';
import Tooltip from './Tooltip';
import { FiHome as Home, FiBookOpen as BookText, FiZap as Zap, FiSmartphone as Smartphone, FiSettings as Settings } from 'react-icons/fi';export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, language } = useTheme();
  const t = translations[language] || translations.en;

  const navItems = [
    { name: t.home, path: '/', icon: <Home size={20} strokeWidth={2.5} /> },
    { name: t.debts, path: '/debts', icon: <BookText size={20} strokeWidth={2.5} /> },
    { name: t.receive, path: '/receive', icon: <Zap size={24} fill="currentColor" />, isPrimary: true },
    { name: t.ussd, path: '/ussd', icon: <Smartphone size={20} strokeWidth={2.5} /> },
    { name: t.settings, path: '/settings', icon: <Settings size={20} strokeWidth={2.5} /> },
  ];

  return (
    <div className={`fixed bottom-0 w-full md:max-w-md border-t px-4 py-2 flex justify-between items-end pb-6 z-40 ${isDarkMode ? 'bg-black border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-500'}`}>
      {navItems.map((item) => (
        <Tooltip key={item.name} text={`Go to ${item.name}`}>
          <button 
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 ${item.isPrimary ? '-translate-y-4' : ''}`}
          >
            {item.isPrimary ? (
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                {item.icon}
              </div>
            ) : (
              <div className={`transition-colors ${location.pathname === item.path ? 'text-blue-600' : ''}`}>
                {item.icon}
              </div>
            )}
            <span className={`text-[10px] font-medium ${location.pathname === item.path ? 'text-blue-600' : ''}`}>
              {item.name}
            </span>
          </button>
        </Tooltip>
      ))}
    </div>
  );
}