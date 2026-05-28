import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { 
  FiZap as Zap, 
  FiSmartphone as Smartphone, 
  FiShield as ShieldCheck, 
  FiArrowRight as ArrowRight,
  FiHelpCircle as HelpCircle,
  FiLock as Lock,
  FiMaximize as Maximize
} from 'react-icons/fi';

// Soft "melting" transition physics
const meltTransition = { 
  type: "spring", 
  stiffness: 50, 
  damping: 20 
};

// Reusable animation variant for fading up and sharpening
const meltUpVariant = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: meltTransition }
};

export default function Landing() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen font-sans selection:bg-blue-500/30 transition-colors duration-700 overflow-hidden ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-[#FFFDF9] text-slate-900'}`}>
      
      {/* 1. NAVIGATION */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={meltTransition}
        className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20"
      >
        <div className="flex items-center gap-3">
          <img 
            src="/assets/white-bg.png" 
            alt="KoboSats Logo" 
            className="w-10 h-10 rounded-full shadow-lg shadow-blue-600/10 object-cover" 
          />
<span className="font-extrabold text-2xl tracking-tighter">
  Kobo<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Sat</span>
</span>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/auth')} 
            className={`font-semibold text-sm transition-colors ${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Sign in
          </button>
          <button 
            onClick={() => navigate('/auth')} 
            className="px-5 py-2.5 rounded-full bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
          >
            Get started
          </button>
        </div>
      </motion.nav>

      {/* 2. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-24 md:pt-20 md:pb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Copy & CTAs */}
        <div className="space-y-8 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={meltUpVariant}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${isDarkMode ? 'bg-blue-900/20 border-blue-900/50 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}
          >
            <Zap size={14} fill="currentColor" className="text-yellow-500" /> Powered by Bitcoin Lightning
          </motion.div>
          
          <motion.h1 
            initial="hidden"
            animate="visible"
            variants={meltUpVariant}
            className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1]"
          >
            Get paid instantly.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400">
              In naira.
            </span>
          </motion.h1>
          
          <motion.p 
            initial="hidden"
            animate="visible"
            variants={meltUpVariant}
            className={`text-lg md:text-xl font-medium leading-relaxed max-w-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
          >
            KoboSat helps traders receive Lightning payments, track debts, and access borderless money — using Bitcoin and USSD. No BVN. No bank delays.
          </motion.p>
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={meltUpVariant}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <button 
              onClick={() => navigate('/auth')}
              className="px-8 py-4 rounded-full bg-blue-600 text-white font-bold text-base shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-1 transition-all flex justify-center items-center gap-2 group"
            >
              Create free account 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/auth')}
              className={`px-8 py-4 rounded-full font-bold text-base border-2 transition-all hover:-translate-y-1 ${isDarkMode ? 'border-slate-800 bg-transparent hover:bg-slate-900 text-white' : 'border-slate-200 bg-white hover:border-slate-300 text-slate-900 shadow-sm'}`}
            >
              Sign in
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className={`flex items-center gap-6 pt-4 text-xs font-semibold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}
          >
            <span className="flex items-center gap-1.5"><Lock size={14} /> Forgot PIN</span>
            <span className="flex items-center gap-1.5"><HelpCircle size={14} /> Help</span>
            <span className="flex items-center gap-1.5 text-green-500/80"><ShieldCheck size={14} /> Non-custodial wallet</span>
          </motion.div>
        </div>

        {/* Right: Floating Mockup */}
        <div className="relative flex justify-center lg:justify-end">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>
          
          {/* Animated Wallet Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 40, damping: 15, delay: 0.2 }}
            className="relative z-10 w-full max-w-md"
          >
            {/* Gentle, non-distracting vertical float */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className={`w-full p-8 rounded-[2rem] border-4 shadow-2xl ${isDarkMode ? 'bg-zinc-900 border-zinc-800 shadow-black/50' : 'bg-white border-white shadow-slate-200/50'}`}
            >
              <div className="flex justify-between items-center mb-8">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>Wallet</span>
                <img 
                  src="/assets/white-bg.png" 
                  alt="KS" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
              
              <p className={`text-[10px] font-bold tracking-widest uppercase mb-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Balance</p>
              <h2 className="text-5xl font-extrabold tracking-tight mb-2">₦113,791</h2>
              <p className="text-sm flex items-center gap-1.5 font-medium text-slate-500 mb-10">
                <Zap size={14} className="text-yellow-500" fill="currentColor" /> 47,820 sats
              </p>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Maximize, label: "Receive" },
                  { icon: Zap, label: "Send" },
                  { icon: Smartphone, label: "USSD" }
                ].map((action, i) => (
                  <div key={i} className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-colors ${isDarkMode ? 'bg-black border-zinc-800' : 'bg-slate-50 border-slate-100'}`}>
                    <action.icon size={20} className={`mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span className="text-[10px] font-bold">{action.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3. FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-200/50 dark:border-zinc-800/50">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={meltUpVariant}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Built for African commerce</h2>
          <p className={`text-base md:text-lg font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Naira-first, Bitcoin invisible. Everything traders need to get paid and grow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: "Instant Lightning payments",
              desc: "Customers scan and you're paid in seconds — settled directly in your wallet."
            },
            {
              icon: Smartphone,
              title: "USSD for any phone",
              desc: "Dial *384*7287# from any phone — no smartphone required to transact."
            },
            {
              icon: ShieldCheck,
              title: "Your keys, your money",
              desc: "Non-custodial wallet powered by Breez SDK. We never hold your funds."
            }
          ].map((feature, i) => (
            <motion.div 
              key={i} 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { ...meltTransition, delay: i * 0.15 } }
              }}
              className={`p-8 rounded-[2rem] border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:border-blue-900/50' : 'bg-white border-slate-200 hover:border-blue-100 hover:shadow-blue-900/5'}`}
            >
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mb-6 shadow-md shadow-blue-600/20">
                <feature.icon size={20} />
              </div>
              <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
              <p className={`text-sm leading-relaxed font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={meltUpVariant}
          className="w-full rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden"
        >
          {/* Abstract background shapes */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400 opacity-10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
          
          <div className="max-w-xl relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
              Start receiving Lightning payments today.
            </h2>
            <p className="text-base md:text-lg font-medium opacity-90 leading-relaxed mb-8">
              Open a free trader wallet in 30 seconds. Get a personal Lightning address like <span className="font-bold underline decoration-blue-400 underline-offset-4">amara@kobosat.app</span>.
            </p>
            <button 
              onClick={() => navigate('/auth')}
              className="px-8 py-4 rounded-full bg-white text-blue-700 font-bold text-base shadow-xl hover:scale-105 transition-transform flex items-center gap-2 group"
            >
              Create my wallet 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* 5. FOOTER */}
      <footer className={`max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-t ${isDarkMode ? 'border-zinc-800/50 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
        <div className="flex items-center gap-3">
          <img 
            src="/assets/white-bg.png" 
            alt="KS" 
            className="w-6 h-6 rounded-full object-cover grayscale opacity-70"
          />
          <span className="text-sm font-semibold">© 2026 KoboSat</span>
        </div>
        
        <div className="flex items-center gap-6 text-sm font-semibold">
          <button onClick={() => navigate('/auth')} className="hover:text-blue-600 transition-colors">Sign in</button>
          <button onClick={() => navigate('/auth')} className="hover:text-blue-600 transition-colors">Sign up</button>
        </div>
      </footer>

    </div>
  );
}