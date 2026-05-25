import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../locales/translations';
import Tooltip from '../components/Tooltip';
import BottomNav from '../components/BottomNav';
import { 
  FiGlobe as Globe, 
  FiSearch as Search, 
  FiPhone as Phone, 
  FiCheckCircle as CheckCircle2, 
  FiBell as Bell, 
  FiPlus as Plus, 
  FiArrowLeft as ArrowLeft, 
  FiInfo as Lightbulb, 
  FiUser as User, 
  FiUsers as Users, 
  FiCreditCard as Wallet, 
  FiCalendar as Calendar, 
  FiFileText as FileText, 
  FiX as X 
} from 'react-icons/fi';

export default function Debts() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, language, setLanguage } = useTheme();
  const t = translations[language] || translations.en;
  
  const [activeTab, setActiveTab] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggingDebt, setIsLoggingDebt] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Trigger entrance animation on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const [formData, setFormData] = useState({
    name: '', phone: '', amount: '', due: '', notes: ''
  });

  const handleLanguageToggle = () => {
    const langs = ['en', 'yo', 'ha', 'ig'];
    const currentIndex = langs.indexOf(language);
    if (setLanguage) setLanguage(langs[(currentIndex + 1) % langs.length]);
  };

  const [mockDebts, setMockDebts] = useState([
    { id: 1, name: "Mama Risi", phone: "0803 123 4567", item: "Rice - 5kg bag", amount: "7,500", due: "May 28, 2026", status: "PENDING" },
    { id: 2, name: "Bro Femi", phone: "0706 998 8221", item: "Phone airtime", amount: "3,200", due: "May 30, 2026", status: "PENDING" },
    { id: 3, name: "Sister Joy", phone: "0814 566 7788", item: "Ankara fabric", amount: "15,000", due: "Jun 02, 2026", status: "PENDING" },
  ]);

  const filteredDebts = mockDebts.filter(debt => {
    const matchesSearch = debt.name.toLowerCase().includes(searchQuery.toLowerCase()) || debt.phone.includes(searchQuery);
    const matchesTab = activeTab === 'All' || debt.status === activeTab.toUpperCase();
    return matchesSearch && matchesTab;
  });

  const handleSettle = (id) => {
    setMockDebts(mockDebts.map(debt => debt.id === id ? { ...debt, status: 'SETTLED' } : debt));
  };

  const handleSaveDebt = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;
    const newDebt = {
      id: Date.now(),
      name: formData.name,
      phone: formData.phone || "No phone",
      item: formData.notes || "General item",
      amount: Number(formData.amount).toLocaleString(),
      due: formData.due || "TBD",
      status: "PENDING"
    };
    setMockDebts([newDebt, ...mockDebts]);
    setIsLoggingDebt(false);
    setFormData({ name: '', phone: '', amount: '', due: '', notes: '' });
  };

  // --------------------------------------------------------
  // RESPONSIVE GLOBAL HEADER 
  // --------------------------------------------------------
  const GlobalHeader = () => (
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
          <p className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${isDarkMode ? 'text-blue-400/50' : 'text-blue-600/50'}`}>{t.greeting || "GOOD MORNING"}</p>
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
  );

  // --------------------------------------------------------
  // LOG A DEBT FORM 
  // --------------------------------------------------------
  if (isLoggingDebt) {
    return (
      <div className={`min-h-screen pb-28 md:pb-12 transition-colors duration-700 ease-in-out ${isDarkMode ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <GlobalHeader />
          <div className="max-w-4xl mx-auto mt-4 sm:mt-10">
            
            {/* Contextual Back Button & Page Title */}
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setIsLoggingDebt(false)} className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 ease-out hover:-translate-y-0.5 border shadow-sm hover:shadow-md ${isDarkMode ? 'bg-black border-blue-900/30 text-blue-400 hover:bg-blue-900/20' : 'bg-white border-blue-100 text-blue-600 hover:bg-blue-50'}`}>
                <ArrowLeft size={20} />
              </button>
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-blue-400/50' : 'text-blue-600/50'}`}>{t.newEntry || "NEW ENTRY"}</p>
                <h1 className="font-extrabold text-2xl md:text-3xl tracking-tight">{t.logADebt || "Log a debt"}</h1>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSaveDebt}>
              {[
                { id: 'name', icon: User, label: t.customerName || "CUSTOMER NAME", placeholder: "e.g. Mama Nkechi", type: "text", required: true },
                { id: 'phone', icon: Phone, label: t.phoneNumber || "PHONE NUMBER", placeholder: "0803 123 4567", type: "tel", required: false },
                { id: 'amount', icon: Wallet, label: t.amountOwed || "AMOUNT OWED (₦)", placeholder: "0", type: "number", required: true },
                { id: 'due', icon: Calendar, label: t.dueDate || "DUE DATE", placeholder: "mm/dd/yyyy", type: "date", required: false },
                { id: 'notes', icon: FileText, label: t.notesOptional || "NOTES (OPTIONAL)", placeholder: t.whatDidTheyBuy || "What did they buy?", type: "text", required: false },
              ].map((field) => (
                <div key={field.id} className={`p-4 sm:p-5 rounded-[1.5rem] border flex flex-col gap-2 transition-all duration-500 ease-out group ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30 focus-within:border-blue-500 focus-within:shadow-lg focus-within:shadow-blue-900/20' : 'bg-white border-blue-100 focus-within:border-blue-400 focus-within:shadow-xl focus-within:shadow-blue-900/5'}`}>
                  <div className="flex items-center gap-2">
                    <field.icon size={14} className={`transition-colors duration-500 ${isDarkMode ? 'text-slate-500 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-600'}`} />
                    <label className={`text-[10px] font-bold tracking-wider uppercase transition-colors duration-500 ${isDarkMode ? 'text-slate-500 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-600'}`}>{field.label}</label>
                  </div>
                  <input 
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={formData[field.id]}
                    onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                    className="w-full bg-transparent border-none outline-none text-base sm:text-lg font-medium placeholder:opacity-30 dark:placeholder:opacity-20"
                  />
                </div>
              ))}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button type="button" onClick={() => setIsLoggingDebt(false)} className={`w-full sm:w-1/3 py-4 rounded-full font-bold text-sm border transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-md ${isDarkMode ? 'bg-black border-blue-900/30 text-white hover:bg-blue-900/20' : 'bg-white border-blue-100 text-slate-800 hover:bg-blue-50'}`}>
                  {t.cancel || "Cancel"}
                </button>
                <button type="submit" className="w-full sm:w-2/3 py-4 rounded-full bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all duration-500 ease-out">
                  {t.saveDebt || "Save debt"}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="md:hidden"><BottomNav /></div>
      </div>
    );
  }

  // --------------------------------------------------------
  // MAIN DEBT TRACKER
  // --------------------------------------------------------
  return (
    <div className={`min-h-screen pb-32 md:pb-12 transition-colors duration-700 ease-in-out ${isDarkMode ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <GlobalHeader />
        
        <div className="max-w-4xl mx-auto mt-4 sm:mt-10">
          
          {/* Page Title */}
          <div className="mb-6 md:mb-8">
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-blue-400/50' : 'text-blue-600/50'}`}>{t.yourLedger || "YOUR LEDGER"}</p>
            <h1 className="font-extrabold text-2xl md:text-3xl tracking-tight">{t.debtTracker || "Debt Tracker"}</h1>
          </div>

          <div className="w-full bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-[2rem] p-6 sm:p-10 shadow-2xl shadow-blue-600/20 relative overflow-hidden mb-8 group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:opacity-10 transition-opacity duration-1000 ease-out"></div>
            <div className="relative z-10">
              <p className="text-[10px] font-bold tracking-widest opacity-90 bg-white/10 px-4 py-2 rounded-full inline-block mb-4 backdrop-blur-sm uppercase shadow-sm border border-white/5">{t.totalOutstanding || "TOTAL OUTSTANDING"}</p>
              <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-sm">₦25,700</h1>
              <p className="text-sm opacity-90 mt-2 sm:mt-4 font-medium flex items-center gap-2">
                <Users size={16} /> {filteredDebts.length} {t.customersOweYou || "customers owe you"}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className={`flex-1 flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all duration-500 ease-out group ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30 focus-within:border-blue-500 focus-within:shadow-lg focus-within:shadow-blue-900/20' : 'bg-white border-blue-100 focus-within:border-blue-400 focus-within:shadow-xl focus-within:shadow-blue-900/5'}`}>
              <Search size={18} className={`transition-colors duration-500 ${isDarkMode ? 'text-slate-500 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-600'}`} />
              <input 
                type="text" 
                placeholder={t.searchCustomer || "Search customer or phone..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-sm font-medium placeholder:opacity-40"
              />
            </div>

            <div className={`flex p-1.5 rounded-2xl sm:w-96 border transition-colors duration-700 ${isDarkMode ? 'bg-black border-blue-900/30' : 'bg-white shadow-sm border-blue-100'}`}>
              {['Pending', 'Settled', 'All'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all duration-500 ease-out ${
                    activeTab === tab 
                      ? (isDarkMode ? 'bg-blue-900/30 text-blue-400 shadow-inner' : 'bg-blue-50 text-blue-600 shadow-inner')
                      : (isDarkMode ? 'text-slate-400 hover:bg-blue-900/10 hover:text-blue-400' : 'text-slate-500 hover:bg-blue-50/50 hover:text-blue-600')
                  }`}
                >
                  {t[tab.toLowerCase()] || tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredDebts.length === 0 ? (
              <div className={`text-center py-16 rounded-[2rem] border border-dashed transition-colors duration-700 ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30' : 'bg-white border-blue-200'}`}>
                <p className="text-sm font-medium opacity-50">No debts found in this category.</p>
              </div>
            ) : (
              filteredDebts.map((debt) => (
                <div key={debt.id} className={`p-5 sm:p-6 rounded-[1.5rem] border transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-xl ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30 hover:border-blue-700/50 hover:shadow-black/50' : 'bg-white border-blue-100 hover:border-blue-200 hover:shadow-blue-900/5'}`}>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-inner shrink-0 transition-colors duration-500 ${isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                        {debt.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-base">{debt.name}</h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-bold mt-1 tracking-wider uppercase ${
                          debt.status === 'SETTLED' 
                            ? (isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700')
                            : (isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600')
                        }`}>
                          {debt.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right pl-16 sm:pl-0">
                      <p className="font-bold text-lg">₦{debt.amount}</p>
                      <p className="text-[11px] opacity-60 mt-0.5 font-medium">{t.due || "Due"} {debt.due}</p>
                    </div>
                  </div>

                  <div className="pl-16 mb-6 space-y-2 text-xs sm:text-sm">
                    <p className="flex items-center gap-2 opacity-70 font-medium"><Phone size={12} /> {debt.phone}</p>
                    <p className="italic opacity-60">{debt.item}</p>
                  </div>

                  <div className="flex gap-3 pl-16">
                    {debt.status === 'PENDING' ? (
                      <>
                        <button 
                          onClick={() => handleSettle(debt.id)}
                          className={`flex-1 sm:flex-none sm:px-8 py-3 rounded-xl text-xs font-bold flex justify-center items-center gap-2 border transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-md ${isDarkMode ? 'bg-black border-green-900/50 text-green-500 hover:bg-green-900/20' : 'bg-white border-green-200 text-green-600 hover:bg-green-50'}`}
                        >
                          <CheckCircle2 size={16} /> {t.settle || "Settle"}
                        </button>
                        <button className={`flex-1 sm:flex-none sm:px-8 py-3 rounded-xl text-xs font-bold flex justify-center items-center gap-2 border transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-md ${isDarkMode ? 'bg-black border-blue-900/30 text-blue-400 hover:bg-blue-900/20' : 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50'}`}>
                          <Bell size={16} /> {t.remind || "Remind"}
                        </button>
                      </>
                    ) : (
                      <div className={`w-full sm:w-auto sm:px-8 py-3 rounded-xl text-xs font-bold flex justify-center items-center gap-2 border transition-colors duration-500 ${isDarkMode ? 'bg-black border-blue-900/20 text-slate-500' : 'bg-white border-slate-100 text-slate-400'}`}>
                        <CheckCircle2 size={16} /> Settled
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <Tooltip text="Log new debt">
          <button 
            onClick={() => setIsLoggingDebt(true)}
            className={`fixed bottom-24 md:bottom-10 right-6 sm:right-10 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-600/40 hover:bg-blue-700 hover:shadow-blue-600/60 transition-all duration-500 ease-out hover:-translate-y-1 z-30 transform ${isLoaded ? 'scale-100' : 'scale-0'}`}
          >
            <Plus size={28} strokeWidth={2.5} />
          </button>
        </Tooltip>
      </div>

      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
}