import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../locales/translations';
import BottomNav from '../components/BottomNav';
import GlobalHeader from '../components/GlobalHeader';
import { getWalletBalance, getTransactionHistory } from '../services/api'; 
import { 
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
  FiRefreshCw as RefreshCw
} from 'react-icons/fi';

// Bulletproof Tooltip that ONLY shows on hover
const HoverTooltip = ({ text, children }) => (
  <div className="relative group flex items-center justify-center">
    {children}
    <div className="absolute bottom-full mb-2 px-2 py-1 bg-slate-800 dark:bg-slate-700 text-white text-[10px] font-bold uppercase tracking-wider rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 whitespace-nowrap z-50 shadow-lg">
      {text}
    </div>
  </div>
);

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const { isDarkMode, language } = useTheme();
  const t = translations[language] || translations.en;
  
  const [showBalance, setShowBalance] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Live State
  const [walletBalance, setWalletBalance] = useState({ ngn: 0, sats: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);

  // 🔥 THE FIX: Prioritize actual user prop, then local storage, and fallback to null.
  // We completely removed the "08012345678" hardcoded test number.
  const activePhone = user?.phone || localStorage.getItem('kobosat_user_phone') || null;

  const fetchDashboardData = async (silentRefresh = false) => {
    // 🔥 THE FIX: Stop fetching if we don't have a real user yet!
    if (!activePhone) {
      setIsLoadingData(false);
      return;
    }

    // DEBUG: See exactly what phone number the frontend is using
    console.log("Fetching live data for:", activePhone);

    if (!silentRefresh) setIsLoadingData(true);
    else setIsRefreshing(true);

    try {
      const balanceData = await getWalletBalance(activePhone);
      if (balanceData) {
        setWalletBalance({
          ngn: balanceData.balance_ngn || 0,
          sats: balanceData.balance_sats || 0
        });
      }

      const txData = await getTransactionHistory(activePhone);
      
      // DEBUG: See exactly what the backend is sending back
      console.log("Backend returned TX Data:", txData);
      
      if (Array.isArray(txData) && txData.length > 0) {
        const mappedTxs = txData.slice(0, 4).map(tx => ({
          id: tx.id || Math.random().toString(),
          name: tx.counterparty || tx.type === 'receive' ? 'Payment Received' : 'Payment Sent',
          desc: tx.description || (tx.type === 'receive' ? 'Lightning Deposit' : 'Lightning Payment'),
          amount: `${tx.type === 'send' ? '-' : '+'}₦${(tx.amount_ngn || 0).toLocaleString()}`,
          sats: `${(tx.amount_sats || 0).toLocaleString()} sats`,
          isSettle: tx.is_settled !== undefined ? tx.is_settled : true,
          type: tx.type || 'receive'
        }));
        setRecentTransactions(mappedTxs);
      } else {
        setRecentTransactions([]);
      }
    } catch (error) {
      console.error("Failed to load live data:", error);
      if (!silentRefresh) {
        setWalletBalance({ ngn: 0, sats: 0 });
        setRecentTransactions([]);
      }
    } finally {
      setIsLoadingData(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setIsLoaded(true);
    fetchDashboardData();

    const intervalId = setInterval(() => {
      fetchDashboardData(true);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [user, activePhone]); // Re-run if activePhone finally loads

  return (
    <div className={`min-h-screen pb-28 md:pb-12 transition-colors duration-700 ease-in-out ${isDarkMode ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        
        <GlobalHeader user={user} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          <div className="lg:col-span-8 space-y-6 lg:space-y-8">
            
            {/* ORIGINAL BLUE BALANCE CARD */}
            <div className="p-8 md:p-10 rounded-[2rem] bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-2xl shadow-blue-600/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:opacity-10 transition-opacity duration-1000 ease-out"></div>
              
              <div className="flex justify-between items-center mb-8 relative z-10">
                <p className="text-[10px] font-bold tracking-widest opacity-90 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm uppercase shadow-sm border border-white/5">
                  {t.walletBalance || "WALLET BALANCE"}
                </p>
                
                {/* FIXED TOOLTIP HOVER */}
                <HoverTooltip text={showBalance ? t.hideBalance || "Hide Balance" : t.showBalance || "Show Balance"}>
                  <button onClick={() => setShowBalance(!showBalance)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-500">
                    {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </HoverTooltip>
              </div>
              
              <div className="relative z-10 mb-10 min-h-[100px]">
                {isLoadingData && !isRefreshing ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-14 w-48 bg-white/20 rounded-xl"></div>
                    <div className="h-4 w-32 bg-white/10 rounded-full"></div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 tracking-tight drop-shadow-sm">
                      {showBalance ? `₦${walletBalance.ngn.toLocaleString()}` : "******"}
                    </h1>
                    <p className="text-sm md:text-base opacity-90 flex items-center gap-2 font-medium">
                      <Zap size={18} fill="currentColor" className="text-yellow-300 drop-shadow-md" /> 
                      {walletBalance.sats.toLocaleString()} {t.availableSats || "sats available"}
                    </p>
                  </>
                )}
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-white/20 relative z-10">
                <p className="text-sm flex items-center gap-2 font-medium opacity-90">
                  <TrendingUp size={16} /> {t.thisWeek || "This week"}
                </p>
                <p className="text-base font-bold tracking-wide">+₦0</p>
              </div>
            </div>

            {/* RESTORED BLUE QUICK ACTIONS */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {[
                { name: t.actionReceive || "Receive", icon: <ArrowDown size={24} />, path: '/receive' },
                { name: t.actionSendSats || "Send Sats", icon: <Send size={24} />, path: '/send' },
                { name: t.actionLogDebt || "Log Debt", icon: <FileText size={24} />, path: '/debts' },
                { name: t.actionViewDebts || "View Debts", icon: <Users size={24} />, path: '/debts' },
              ].map((action, i) => (
                <button 
                  key={i}
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
              ))}
            </div>

            {/* RECENT ACTIVITY */}
            <div className="pt-2">
              <div className="flex justify-between items-end mb-6">
                <h3 className="font-bold text-xl">{t.recentActivity || "Recent activity"}</h3>
                
                {/* FIXED REFRESH TOOLTIP */}
                <HoverTooltip text="Refresh Data">
                  <button 
                    onClick={() => fetchDashboardData(true)} 
                    className="text-blue-600 flex items-center gap-1 text-sm font-bold hover:underline transition-all"
                  >
                    <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
                    {t.seeAll || "See all"}
                  </button>
                </HoverTooltip>
              </div>
              
              <div className={`rounded-[2rem] p-3 transition-all duration-700 ${isDarkMode ? 'bg-[#0a0a0a] border border-blue-900/30' : 'bg-white shadow-sm border border-blue-100'}`}>
                {isLoadingData && !isRefreshing ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((skeleton) => (
                      <div key={skeleton} className={`w-full flex items-center justify-between p-4 rounded-2xl animate-pulse ${isDarkMode ? 'bg-blue-900/10' : 'bg-blue-50/50'}`}>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-slate-400/20"></div>
                          <div className="space-y-2">
                            <div className="h-4 w-24 bg-slate-400/20 rounded"></div>
                            <div className="h-3 w-16 bg-slate-400/20 rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentTransactions.length === 0 ? (
                  <div className={`flex flex-col items-center justify-center py-12 px-4 rounded-2xl border-2 border-dashed transition-all duration-500 ${isDarkMode ? 'border-zinc-800 bg-black/50' : 'border-blue-100 bg-slate-50'}`}>
                    <div className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center shadow-inner ${isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                      <Zap size={28} fill="currentColor" className="opacity-50" />
                    </div>
                    <p className="font-bold text-lg mb-1">No transactions yet</p>
                    <p className="text-sm opacity-60 text-center max-w-[220px] mb-6">Your Lightning wallet is ready. Receive your first payment!</p>
                    <button 
                      onClick={() => navigate('/receive')} 
                      className="px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-full shadow-md shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all"
                    >
                      Receive Sats
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentTransactions.map((tx) => (
                      <button key={tx.id} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-500 ease-out hover:scale-[1.01] ${isDarkMode ? 'hover:bg-blue-900/10' : 'hover:bg-blue-50/50 hover:shadow-sm'}`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                            {tx.type === 'send' ? (
                              <Send size={20} className="text-red-500" />
                            ) : tx.isSettle ? (
                              <CheckCircle size={20} className="text-green-500" />
                            ) : (
                              <ArrowDownLeft size={20} className="text-blue-600" />
                            )}
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-sm md:text-base">{tx.name}</p>
                            <p className="text-xs opacity-50 font-medium mt-0.5 truncate max-w-[150px] sm:max-w-[200px]">{tx.desc}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-sm md:text-base ${tx.type === 'send' ? 'text-red-500' : 'text-green-500'}`}>
                            {tx.amount}
                          </p>
                          <p className="text-xs opacity-50 font-medium mt-0.5">{tx.sats}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-4 space-y-6 lg:space-y-8">
            <div className={`p-6 md:p-8 rounded-[2rem] border transition-all duration-500 ease-out hover:shadow-xl hover:-translate-y-1 ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30 hover:border-blue-700/50 hover:shadow-black/50' : 'bg-white border-blue-100 hover:border-blue-200 hover:shadow-blue-900/5'}`}>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3">{t.todaysMarket || "TODAY'S MARKET"}</p>
              <h4 className="font-extrabold text-xl md:text-2xl mb-3 leading-tight flex items-center gap-2">
                Customers are paying faster <Zap size={24} className="text-yellow-400 drop-shadow-sm" fill="currentColor" />
              </h4>
              <p className="text-sm opacity-70 leading-relaxed font-medium">Your average settlement time this week is under 3 seconds. Keep it going, Amara.</p>
            </div>

            <div className={`p-6 md:p-8 rounded-[2rem] border transition-all duration-500 ease-out hover:shadow-xl hover:-translate-y-1 flex flex-col justify-center ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30 hover:border-blue-700/50 hover:shadow-black/50' : 'bg-white border-blue-100 hover:border-blue-200 hover:shadow-blue-900/5'}`}>
              <div className="flex items-center gap-3 mb-4">
                <Smartphone size={20} className="text-blue-500 opacity-80" />
                <p className="text-[10px] font-bold text-blue-500 opacity-80 uppercase tracking-widest">{t.ussdCodeLabel || "USSD CODE"}</p>
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
                {t.openUssdEmulator || "Open USSD emulator"}
              </button>
            </div>
          </div>
          
        </div>
      </div>

      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}