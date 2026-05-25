import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../locales/translations';
import Tooltip from '../components/Tooltip';
import BottomNav from '../components/BottomNav';
import { 
  FiGlobe as Globe, 
  FiBell as Bell, 
  FiEye as Eye, 
  FiEyeOff as EyeOff, 
  FiZap as Zap, 
  FiArrowDown as ArrowDown, 
  FiSend as Send,
  FiFileText as FileText, 
  FiUsers as Users,
  FiArrowDownLeft as ArrowDownLeft,
  FiTrendingUp as TrendingUp,
  FiCheckCircle as CheckCircle,
  FiSmartphone as Smartphone,
  FiUser as User
} from 'react-icons/fi';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, language, setLanguage } = useTheme();
  const t = translations[language] || translations.en;
  
  const [showBalance, setShowBalance] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Trigger entrance animation on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleLanguageToggle = () => {
    const langs = ['en', 'yo', 'ha', 'ig'];
    const currentIndex = langs.indexOf(language);
    const nextIndex = (currentIndex + 1) % langs.length;
    if (setLanguage) setLanguage(langs[nextIndex]);
  };

  const recentTransactions = [
    { id: 1, name: "Mama Nkechi", desc: "Received • Just now", amount: "+₦4,500", sats: "1,890 sats", isSettle: false },
    { id: 2, name: "Tunde Bakery", desc: "Received • 2h ago", amount: "+₦12,500", sats: "5,250 sats", isSettle: false },
    { id: 3, name: "Aisha Tailor", desc: "Debt settled • Yesterday", amount: "+₦8,000", sats: "3,360 sats", isSettle: true },
    { id: 4, name: "Chinedu Phones", desc: "Received • Yesterday", amount: "+₦22,000", sats: "9,240 sats", isSettle: false },
  ];

  return (
    <div className={`min-h-screen pb-28 md:pb-12 transition-colors duration-700 ease-in-out ${isDarkMode ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Maximum Width Wrapper for Desktop */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        
        {/* Premium Header - Strictly White/Blue and Black/Blue */}
        <header className="flex justify-between items-center mb-8 md:mb-10">
          
          {/* Logo & User Info */}
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm md:text-lg shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/40 group-hover:-translate-y-0.5 transition-all duration-500">
                KS
              </div>
              <span className={`font-extrabold text-xl tracking-tight hidden lg:block transition-colors duration-500 ${isDarkMode ? 'text-white group-hover:text-blue-400' : 'text-slate-900 group-hover:text-blue-600'}`}>KoboSats</span>
            </div>
            
            <div className={`hidden md:block w-px h-8 transition-colors duration-700 ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}></div>
            
            <div className="hidden md:block">
              <p className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${isDarkMode ? 'text-blue-400/50' : 'text-blue-600/50'}`}>{t.greeting}</p>
              <h2 className={`font-bold text-sm leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Amara Okonkwo</h2>
            </div>
          </div>
          
          {/* Desktop Top Navigation (Floating Pill) */}
          <nav className={`hidden md:flex items-center p-1.5 rounded-full border shadow-sm transition-colors duration-700 ${isDarkMode ? 'bg-black border-blue-900/30' : 'bg-white border-blue-100'}`}>
            {[
              { name: t.home, path: '/' },
              { name: t.debts, path: '/debts' },
              { name: t.receive, path: '/receive' },
              { name: t.ussd, path: '/ussd' },
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
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white dark:ring-black"></span>
              </button>
            </Tooltip>
            <Tooltip text="Account Settings">
              <button 
                onClick={() => navigate('/settings')}
                className={`hidden md:flex w-10 h-10 rounded-full items-center justify-center transition-all duration-500 ease-out hover:-translate-y-0.5 border shadow-sm hover:shadow-md ${isDarkMode ? 'bg-black border-blue-900/30 text-blue-400 hover:bg-blue-900/20' : 'bg-white border-blue-100 text-blue-600 hover:bg-blue-50'}`}
              >
                <User size={18} />
              </button>
            </Tooltip>
          </div>
        </header>

        {/* CSS Grid for Desktop Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* LEFT COLUMN (Spans 8 cols on desktop) */}
          <div className="lg:col-span-8 space-y-6 lg:space-y-8">
            
            {/* Wallet Balance Card */}
            <div className="p-8 md:p-10 rounded-[2rem] bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-2xl shadow-blue-600/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:opacity-10 transition-opacity duration-1000 ease-out"></div>
              
              <div className="flex justify-between items-center mb-8 relative z-10">
                <p className="text-[10px] font-bold tracking-widest opacity-90 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm uppercase shadow-sm border border-white/5">
                  {t.walletBalance}
                </p>
                <Tooltip text={showBalance ? "Hide Balance" : "Show Balance"}>
                  <button onClick={() => setShowBalance(!showBalance)} className="p-2 rounded-full hover:bg-white/20 transition-colors duration-500">
                    {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </Tooltip>
              </div>
              
              <div className="relative z-10 mb-10">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 tracking-tight drop-shadow-sm">
                  ₦{showBalance ? "113,857" : "******"}
                </h1>
                <p className="text-sm md:text-base opacity-90 flex items-center gap-2 font-medium">
                  <Zap size={18} fill="currentColor" className="text-yellow-300 drop-shadow-md" /> 
                  47,820 {t.availableSats}
                </p>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-white/20 relative z-10">
                <p className="text-sm flex items-center gap-2 font-medium opacity-90">
                  <TrendingUp size={16} /> This week
                </p>
                <p className="text-base font-bold tracking-wide">+₦48,200</p>
              </div>
            </div>

            {/* Quick Actions (4-Grid matching the image) */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {[
                { name: "Receive", icon: <ArrowDown size={24} />, path: '/receive' },
                { name: "Send Sats", icon: <Send size={24} />, path: '/' },
                { name: "Log Debt", icon: <FileText size={24} />, path: '/debts' },
                { name: "View Debts", icon: <Users size={24} />, path: '/debts' },
              ].map((action, i) => (
                <Tooltip key={i} text={action.name}>
                  <button 
                    onClick={() => navigate(action.path)}
                    className={`flex flex-col items-center justify-center p-4 sm:p-6 rounded-[1.5rem] transition-all duration-500 ease-out hover:-translate-y-1 group border ${
                      isDarkMode 
                        ? 'bg-[#0a0a0a] border-blue-900/30 hover:border-blue-700/50 hover:shadow-lg hover:shadow-black/50' 
                        : 'bg-white border-blue-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5'
                    }`}
                  >
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-3 transition-transform duration-500 group-hover:scale-110 ${
                      isDarkMode ? 'bg-blue-900/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white shadow-inner group-hover:shadow-blue-600/30'
                    }`}>
                      {action.icon}
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-center opacity-80 whitespace-nowrap">{action.name}</span>
                  </button>
                </Tooltip>
              ))}
            </div>

            {/* Recent Activity List */}
            <div className="pt-2">
              <div className="flex justify-between items-end mb-6">
                <h3 className="font-bold text-xl">{t.recentActivity}</h3>
                <button className="text-blue-600 text-sm font-bold hover:underline transition-all">{t.seeAll}</button>
              </div>
              
              <div className={`rounded-[2rem] p-3 space-y-2 transition-all duration-700 ${isDarkMode ? 'bg-[#0a0a0a] border border-blue-900/30' : 'bg-white shadow-sm border border-blue-100'}`}>
                {recentTransactions.map((tx) => (
                  <button key={tx.id} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-500 ease-out hover:scale-[1.01] ${isDarkMode ? 'hover:bg-blue-900/10' : 'hover:bg-blue-50/50 hover:shadow-sm'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                        {tx.isSettle ? (
                          <CheckCircle size={20} className="text-green-500" />
                        ) : (
                          <ArrowDownLeft size={20} className="text-blue-600" />
                        )}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-sm md:text-base">{tx.name}</p>
                        <p className="text-xs opacity-50 font-medium mt-0.5">{tx.desc}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm md:text-base text-green-500">{tx.amount}</p>
                      <p className="text-xs opacity-50 font-medium mt-0.5">{tx.sats}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Spans 4 cols on desktop) */}
          <div className="lg:col-span-4 space-y-6 lg:space-y-8">
            
            {/* Today's Market Banner */}
            <div className={`p-6 md:p-8 rounded-[2rem] border transition-all duration-500 ease-out hover:shadow-xl hover:-translate-y-1 ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30 hover:border-blue-700/50 hover:shadow-black/50' : 'bg-white border-blue-100 hover:border-blue-200 hover:shadow-blue-900/5'}`}>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3">Today's Market</p>
              <h4 className="font-extrabold text-xl md:text-2xl mb-3 leading-tight flex items-center gap-2">
                Customers are paying faster <Zap size={24} className="text-yellow-400 drop-shadow-sm" fill="currentColor" />
              </h4>
              <p className="text-sm opacity-70 leading-relaxed font-medium">Your average settlement time this week is under 3 seconds. Keep it going, Amara.</p>
            </div>

            {/* USSD Feature Card */}
            <div className={`p-6 md:p-8 rounded-[2rem] border transition-all duration-500 ease-out hover:shadow-xl hover:-translate-y-1 flex flex-col justify-center ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30 hover:border-blue-700/50 hover:shadow-black/50' : 'bg-white border-blue-100 hover:border-blue-200 hover:shadow-blue-900/5'}`}>
              <div className="flex items-center gap-3 mb-4">
                <Smartphone size={20} className="text-blue-500 opacity-80" />
                <p className="text-[10px] font-bold text-blue-500 opacity-80 uppercase tracking-widest">USSD Code</p>
              </div>
              <h3 className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-4 tracking-wider">
                *384*7287#
              </h3>
              <p className="text-sm opacity-70 mb-8 font-medium leading-relaxed">Dial from any phone — no internet needed.</p>
              <button 
                onClick={() => navigate('/ussd')}
                className={`w-full py-4 rounded-full font-bold text-sm transition-all duration-500 ease-out hover:scale-[1.02] active:scale-95 ${
                  isDarkMode 
                    ? 'border border-blue-800 bg-blue-900/20 hover:bg-blue-600 text-blue-400 hover:text-white' 
                    : 'border border-blue-200 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white'
                }`}
              >
                Open USSD emulator
              </button>
            </div>
          </div>
          
        </div>
      </div>

      {/* Hide Bottom Nav on Desktop Screens */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}