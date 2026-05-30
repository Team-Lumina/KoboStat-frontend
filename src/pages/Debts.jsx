import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../locales/translations';
import Tooltip from '../components/Tooltip';
import BottomNav from '../components/BottomNav';
import GlobalHeader from '../components/GlobalHeader'; 
import { listDebts, createDebtRecord, settleDebt } from '../services/api'; 
import { 
  FiSearch as Search, 
  FiPhone as Phone, 
  FiCheckCircle as CheckCircle2, 
  FiBell as Bell, 
  FiPlus as Plus, 
  FiArrowLeft as ArrowLeft, 
  FiUser as User, 
  FiUsers as Users, 
  FiCreditCard as Wallet, 
  FiCalendar as Calendar, 
  FiFileText as FileText, 
  FiAlertCircle as AlertCircle
} from 'react-icons/fi';

export default function Debts({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, language, setLanguage } = useTheme();
  const t = translations[language] || translations.en;
  
  const [activeTab, setActiveTab] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggingDebt, setIsLoggingDebt] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Live Backend States
  const [debts, setDebts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '', phone: '', amount: '', due: '', notes: ''
  });

  // 🔥 FIX: No mock data. Use real user phone or local storage fallback.
  const activePhone = user?.phone || localStorage.getItem('kobosat_user_phone') || null;

  // Trigger entrance animation & fetch data on mount
  useEffect(() => {
    setIsLoaded(true);
    fetchLiveDebts();
  }, [user, activePhone]);

  const fetchLiveDebts = async () => {
    if (!activePhone) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await listDebts(activePhone);
      // Safety check to ensure we always have an array
      if (Array.isArray(data)) {
        setDebts(data);
      } else if (data && Array.isArray(data.debts)) {
        setDebts(data.debts);
      } else {
        setDebts([]);
      }
    } catch (err) {
      console.error("Failed to fetch debts", err);
      setDebts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageToggle = () => {
    const langs = ['en', 'yo', 'ha', 'ig'];
    const currentIndex = langs.indexOf(language);
    if (setLanguage) setLanguage(langs[(currentIndex + 1) % langs.length]);
  };

  // Safe mapping and filtering
  const safeDebts = Array.isArray(debts) ? debts : [];
  
  const filteredDebts = safeDebts.filter(debt => {
    const searchLower = searchQuery.toLowerCase();
    const desc = debt.description?.toLowerCase() || '';
    const phone = debt.debtor_phone?.toLowerCase() || '';
    
    const matchesSearch = desc.includes(searchLower) || phone.includes(searchLower);
    const matchesTab = activeTab === 'All' 
      || (activeTab === 'Pending' && !debt.is_settled) 
      || (activeTab === 'Settled' && debt.is_settled);
      
    return matchesSearch && matchesTab;
  });

  // Calculate Total Outstanding dynamically
  const totalOutstanding = safeDebts
    .filter(d => !d.is_settled)
    .reduce((sum, d) => sum + Number(d.amount_ngn || 0), 0);

  // 🔥 FIX: OPTIMISTIC UI REAL-TIME SETTLEMENT
  const handleSettle = async (id) => {
    // Instantly update the UI so it feels incredibly fast to the user
    setDebts(prevDebts => prevDebts.map(d => 
      d.id === id ? { ...d, is_settled: true } : d
    ));

    try {
      // Process it quietly in the background
      await settleDebt(id, activePhone);
    } catch (err) {
      console.error("Failed to settle debt", err);
      // If the backend fails, fetch the real list to revert the UI back
      await fetchLiveDebts(); 
      alert(t.settleError || "Failed to settle debt. Please try again.");
    }
  };

  // 🔥 FIX: REAL-TIME SMS REMINDER INTEGRATION
  const handleRemind = (debt) => {
    const amount = debt.amount_ngn?.toLocaleString() || "0";
    const customerName = debt.description ? debt.description.split(' - ')[0] : (t.customer || 'Customer');
    
    const message = `Hello ${customerName}, this is a polite reminder from KoboSat regarding your pending balance of ₦${amount}. Please let us know when you can settle it. Thank you!`;

    // Triggers the phone's native SMS app
    window.open(`sms:${debt.debtor_phone}?body=${encodeURIComponent(message)}`, '_self');
  };

  const handleSaveDebt = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) {
      setError(t.nameAmountRequired || "Name and Amount are required.");
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Map UI form fields to Backend schema expectations
    const debtorPhone = formData.phone || "0000000000";
    const description = formData.notes ? `${formData.name} - ${formData.notes}` : formData.name;
    const amountStr = formData.amount.replace(/[^0-9]/g, ''); // Strip commas if any

    try {
      const newDebt = await createDebtRecord(
        activePhone, 
        debtorPhone, 
        amountStr, 
        description, 
        formData.due || null
      );

      if (newDebt) {
        setIsLoggingDebt(false);
        setFormData({ name: '', phone: '', amount: '', due: '', notes: '' });
        await fetchLiveDebts(); // Refresh ledger
      } else {
        setError(t.saveDebtError || "Failed to save debt. Please try again.");
      }
    } catch (err) {
      setError(t.networkError || "Network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------------------------------------------------
  // LOG A DEBT FORM 
  // --------------------------------------------------------
  if (isLoggingDebt) {
    return (
      <div className={`min-h-screen pb-28 md:pb-12 transition-colors duration-700 ease-in-out ${isDarkMode ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <GlobalHeader user={user} />
          
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

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100 flex items-center gap-2">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSaveDebt}>
              {[
                { id: 'name', icon: User, label: t.customerName || "CUSTOMER NAME", placeholder: t.customerNamePlaceholder || "e.g. Mama Nkechi", type: "text", required: true },
                { id: 'phone', icon: Phone, label: t.phoneNumber || "PHONE NUMBER", placeholder: "0803 123 4567", type: "tel", required: false },
                { id: 'amount', icon: Wallet, label: t.amountOwed || "AMOUNT OWED (₦)", placeholder: "0", type: "text", required: true }, 
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
                    disabled={isSubmitting}
                    className="w-full bg-transparent border-none outline-none text-base sm:text-lg font-medium placeholder:opacity-30 dark:placeholder:opacity-20"
                  />
                </div>
              ))}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button 
                  type="button" 
                  disabled={isSubmitting}
                  onClick={() => setIsLoggingDebt(false)} 
                  className={`w-full sm:w-1/3 py-4 rounded-full font-bold text-sm border transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 ${isDarkMode ? 'bg-black border-blue-900/30 text-white hover:bg-blue-900/20' : 'bg-white border-blue-100 text-slate-800 hover:bg-blue-50'}`}
                >
                  {t.cancel || "Cancel"}
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full sm:w-2/3 py-4 rounded-full bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all duration-500 ease-out flex justify-center items-center"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    t.saveDebt || "Save debt"
                  )}
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
        <GlobalHeader user={user} />
        
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
              
              <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-sm">
                ₦{totalOutstanding.toLocaleString()}
              </h1>
              
              <p className="text-sm opacity-90 mt-2 sm:mt-4 font-medium flex items-center gap-2">
                <Users size={16} /> {safeDebts.filter(d => !d.is_settled).length} {t.customersOweYou || "customers owe you"}
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
            {isLoading ? (
              [1, 2, 3].map(i => <div key={i} className="w-full h-24 rounded-[1.5rem] bg-slate-200 dark:bg-zinc-800 animate-pulse"></div>)
            ) : filteredDebts.length === 0 ? (
              <div className={`text-center py-16 rounded-[2rem] border border-dashed transition-colors duration-700 ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30' : 'bg-white border-blue-200'}`}>
                <p className="text-sm font-medium opacity-50">{t.noDebtsFound || "No debts found in this category."}</p>
              </div>
            ) : (
              filteredDebts.map((debt) => (
                <div key={debt.id} className={`p-5 sm:p-6 rounded-[1.5rem] border transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-xl ${isDarkMode ? 'bg-[#0a0a0a] border-blue-900/30 hover:border-blue-700/50 hover:shadow-black/50' : 'bg-white border-blue-100 hover:border-blue-200 hover:shadow-blue-900/5'}`}>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-inner shrink-0 transition-colors duration-500 ${isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                        {(debt.description || debt.debtor_phone || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-base truncate max-w-[200px] sm:max-w-[300px]">
                          {debt.description ? debt.description.split(' - ')[0] : (t.unknownCustomer || 'Unknown Customer')}
                        </h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-bold mt-1 tracking-wider uppercase ${
                          debt.is_settled 
                            ? (isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700')
                            : (isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600')
                        }`}>
                          {debt.is_settled ? (t.settled || 'SETTLED') : (t.pending || 'PENDING')}
                        </span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right pl-16 sm:pl-0">
                      <p className="font-bold text-lg">₦{debt.amount_ngn?.toLocaleString()}</p>
                      <p className="text-[11px] opacity-60 mt-0.5 font-medium">
                        {t.addedOn || "Added on"} {debt.created_at ? new Date(debt.created_at).toLocaleDateString() : (t.justNow || 'Just now')}
                      </p>
                    </div>
                  </div>

                  <div className="pl-16 mb-6 space-y-2 text-xs sm:text-sm">
                    <p className="flex items-center gap-2 opacity-70 font-medium"><Phone size={12} /> {debt.debtor_phone}</p>
                    {debt.description && debt.description.includes(' - ') && (
                       <p className="italic opacity-60">{debt.description.split(' - ')[1]}</p>
                    )}
                  </div>

                  <div className="flex gap-3 pl-16">
                    {!debt.is_settled ? (
                      <>
                        <button 
                          onClick={() => handleSettle(debt.id)}
                          className={`flex-1 sm:flex-none sm:px-8 py-3 rounded-xl text-xs font-bold flex justify-center items-center gap-2 border transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-md ${isDarkMode ? 'bg-black border-green-900/50 text-green-500 hover:bg-green-900/20' : 'bg-white border-green-200 text-green-600 hover:bg-green-50'}`}
                        >
                          <CheckCircle2 size={16} /> {t.settle || "Settle"}
                        </button>
                        <button 
                          onClick={() => handleRemind(debt)}
                          className={`flex-1 sm:flex-none sm:px-8 py-3 rounded-xl text-xs font-bold flex justify-center items-center gap-2 border transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-md ${isDarkMode ? 'bg-black border-blue-900/30 text-blue-400 hover:bg-blue-900/20' : 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50'}`}
                        >
                          <Bell size={16} /> {t.remind || "Remind"}
                        </button>
                      </>
                    ) : (
                      <div className={`w-full sm:w-auto sm:px-8 py-3 rounded-xl text-xs font-bold flex justify-center items-center gap-2 border transition-colors duration-500 ${isDarkMode ? 'bg-black border-blue-900/20 text-slate-500' : 'bg-white border-slate-100 text-slate-400'}`}>
                        <CheckCircle2 size={16} /> {t.settled || "Settled"}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <Tooltip text={t.logNewDebt || "Log new debt"}>
          <button 
            onClick={() => setIsLoggingDebt(true)}
            className={`fixed bottom-24 md:bottom-10 right-6 sm:right-10 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-600/40 hover:bg-blue-700 hover:shadow-blue-600/60 transition-all duration-500 ease-out hover:-translate-y-1 z-30 transform ${isLoaded && !isLoggingDebt ? 'scale-100' : 'scale-0'}`}
          >
            <Plus size={28} strokeWidth={2.5} />
          </button>
        </Tooltip>
      </div>

      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
}