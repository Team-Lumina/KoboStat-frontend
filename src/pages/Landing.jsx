import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─── Animation Variants ──────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 60, damping: 18, delay },
  },
});

const slideInLeft = (delay = 0) => ({
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut', delay } },
});

const slideInRight = (delay = 0) => ({
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut', delay } },
});

// ─── Icons ───────────────────────────────────────────────────────────────────

const IconBolt = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const IconPhone = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <path d="M12 18h.01" /><path d="M9 7h6" />
  </svg>
);

const IconShield = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconUsers = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconDollar = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const IconGlobe = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const IconArrowRight = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const IconCheck = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const IconPlay = ({ size = 15, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" /><path d="M10 8l6 4-6 4V8z" fill="currentColor" />
  </svg>
);

const IconReceive = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2v20M2 12l10 10 10-10" />
  </svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="flex items-center gap-2.5 font-bold text-lg tracking-tight text-slate-900">
      <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-white border border-slate-100">
        <img src="/assets/white-bg.png" alt="KoboSat Logo" className="w-full h-full object-cover" />
      </div>
      <span>
        Kobo<span className="text-blue-600">Sat</span>
      </span>
    </div>
  );
}

function WalletCard() {
  const actions = [
    { icon: <IconReceive size={14} />, label: 'Receive' },
    { icon: <IconBolt size={14} />, label: 'Send' },
    { icon: <IconPhone size={14} />, label: 'USSD' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, rotate: -1 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 50, damping: 16, delay: 0.3 }}
      className="relative w-full max-w-[300px] mx-auto lg:mx-0"
    >
      {/* Ghost card behind */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 -rotate-3 w-[280px] h-[180px] bg-blue-600/10 rounded-3xl border border-blue-600/15" />

      {/* Floating live badge */}
      <motion.div
        variants={slideInLeft(1.2)}
        initial="hidden"
        animate="visible"
        className="absolute top-12 -left-4 lg:-left-8 bg-slate-900 text-white rounded-2xl py-2.5 px-3.5 text-[11px] font-bold z-20 flex items-center shadow-xl whitespace-nowrap"
      >
        +₦2,400 received <span className="text-green-400 ml-1 mr-1">●</span> live
      </motion.div>

      {/* Main wallet card */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative bg-white rounded-[28px] p-7 border border-slate-200 shadow-2xl z-10 w-full"
      >
        {/* Card header */}
        <div className="flex justify-between items-center mb-7">
          <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-slate-500">
            <div className="w-6 h-4 bg-gradient-to-br from-amber-500 to-amber-400 rounded" />
            Wallet
          </div>
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-white border border-slate-100">
            <img src="/assets/white-bg.png" alt="KoboSat Logo" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Balance */}
        <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-500 mb-1.5">Available balance</p>
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none mb-2">₦113,791</h2>
        <div className="font-mono text-[11px] text-slate-500 mb-6 flex items-center">
          <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-bold">⚡ 47,820 sats</span>
          <span className="ml-2">≈ $30.40 USD</span>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-2">
          {actions.map((a, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                {a.icon}
              </div>
              <span className="text-[10px] font-bold text-slate-700 tracking-wide">{a.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Payment notification */}
      <motion.div
        variants={slideInRight(1.0)}
        initial="hidden"
        animate="visible"
        className="absolute -bottom-6 -right-2 lg:-right-6 bg-white rounded-2xl p-3 border border-slate-200 shadow-xl flex items-center gap-2.5 z-20 w-[210px]"
      >
        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
          <IconCheck size={15} className="text-green-600" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-900 leading-tight">Payment received</p>
          <p className="text-[10px] text-slate-500 font-mono">+₦12,500 · just now</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  return (
    <motion.div
      variants={fadeUp(delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className="group p-8 lg:p-10 bg-white hover:bg-blue-50/50 transition-colors duration-300 border-b md:border-b-0 border-r-0 md:border-r border-slate-200 last:border-b-0 md:last:border-r-0 md:[&:nth-child(3n)]:border-r-0"
    >
      <div className="w-14 h-14 rounded-2xl border border-slate-200 flex items-center justify-center mb-6 bg-white group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-300">
        <span className="text-blue-600 group-hover:text-white transition-colors duration-300 flex">
          {icon}
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2.5 tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <IconBolt size={22} />,
      title: 'Instant Lightning payments',
      desc: 'Customers scan your QR and you\'re paid in under 3 seconds — settled directly to your wallet with zero fees.',
    },
    {
      icon: <IconPhone size={22} />,
      title: 'USSD for any phone',
      desc: 'Dial *384*7287# from any device — feature phone or smartphone. No internet required to transact.',
    },
    {
      icon: <IconShield size={22} />,
      title: 'Your keys, your money',
      desc: 'Powered by Breez SDK. Non-custodial from day one — we never touch your funds. Full sovereignty.',
    },
    {
      icon: <IconUsers size={22} />,
      title: 'Debt tracking',
      desc: 'Track who owes you and send instant payment requests. No more manual ledgers or missed payments.',
    },
    {
      icon: <IconDollar size={22} />,
      title: 'Naira-first experience',
      desc: 'See your balance in naira always. Bitcoin and sats live quietly in the background — invisible complexity.',
    },
    {
      icon: <IconGlobe size={22} />,
      title: 'Borderless money',
      desc: 'Send and receive from anywhere in the world with a Lightning address like amara@kobosat.app.',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Create your wallet',
      desc: 'Sign up with a phone number. Your Lightning address is instantly generated — no BVN or ID required.',
    },
    {
      num: '02',
      title: 'Share your QR or address',
      desc: 'Show your QR code in-person, or share your Lightning address online. Customers pay from any wallet.',
    },
    {
      num: '03',
      title: 'Get paid in naira',
      desc: 'Funds arrive in seconds, displayed as naira in your wallet. Withdraw via USSD anytime.',
    },
  ];

  const stats = [
    { value: '₦0', suffix: ' fees', label: 'On Lightning transactions. You keep everything.' },
    { value: '30s', suffix: '', label: 'To create a wallet and get your Lightning address.' },
    { value: '100%', suffix: ' yours', label: 'Non-custodial. Your keys, your money — always.' },
  ];

  return (
    <div className="font-sora bg-white text-slate-900 min-h-screen overflow-x-hidden selection:bg-blue-600/15">
      
      {/* ── NAVBAR ── */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex items-center justify-between px-6 lg:px-12 py-5 border-b border-slate-200 sticky top-0 bg-white/90 backdrop-blur-md z-50"
      >
        <Logo />
        <div className="flex items-center gap-2 lg:gap-4">
          <button onClick={() => navigate('/auth')} className="hidden sm:block px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            Sign in
          </button>
          <button onClick={() => navigate('/auth')} className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
            Get started →
          </button>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)] lg:max-h-[860px]">
        {/* Left copy */}
        <div className="px-6 py-16 lg:px-16 lg:py-24 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-200 order-2 lg:order-1">
          <motion.div variants={fadeUp(0)} initial="hidden" animate="visible" className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 rounded-full text-[11px] font-bold tracking-[1.2px] uppercase text-blue-600 w-fit mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Bitcoin Lightning · Nigeria
          </motion.div>

          <motion.h1 variants={fadeUp(0.1)} initial="hidden" animate="visible" className="text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-slate-900 mb-6">
            Get paid instantly.<br />
            <span className="text-blue-600 relative">In naira.</span>
          </motion.h1>

          <motion.p variants={fadeUp(0.2)} initial="hidden" animate="visible" className="text-base lg:text-lg text-slate-500 leading-relaxed max-w-md mb-10">
            The fastest way for Nigerian traders to receive Lightning payments,
            settle in naira, and access borderless money — no BVN, no bank delays.
          </motion.p>

          <motion.div variants={fadeUp(0.3)} initial="hidden" animate="visible" className="flex flex-col sm:flex-row items-center gap-4 mb-12">
            <button onClick={() => navigate('/auth')} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-blue-600 text-white text-[15px] font-bold shadow-xl shadow-blue-600/25 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
              Create free wallet
              <IconArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/auth')} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white text-slate-800 text-[15px] font-semibold border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all">
              <IconPlay size={15} />
              See how it works
            </button>
          </motion.div>

          <motion.div variants={fadeUp(0.4)} initial="hidden" animate="visible" className="flex flex-wrap items-center gap-5 lg:gap-7">
            {[
              { color: 'bg-green-500', label: 'Non-custodial' },
              { color: 'bg-blue-600', label: 'Breez SDK' },
              { color: 'bg-amber-500', label: 'USSD *384*7287#' },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span className={`w-1.5 h-1.5 rounded-full ${t.color}`} />
                {t.label}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right wallet mockup */}
        <div className="bg-slate-50 relative overflow-hidden flex items-center justify-center p-12 lg:p-16 min-h-[500px] order-1 lg:order-2">
          {/* Decorative Grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#1855F1 1px, transparent 1px), linear-gradient(90deg, #1855F1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          {/* Glow */}
          <div className="absolute w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] rounded-full bg-blue-600/5 blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          
          <WalletCard />
        </div>
      </section>

      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-200">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            variants={fadeUp(i * 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`px-8 py-10 lg:p-12 ${i < 2 ? 'border-b md:border-b-0 md:border-r border-slate-200' : ''}`}
          >
            <div className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
              <span className="text-blue-600">{s.value}</span>{s.suffix}
            </div>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section className="px-6 py-20 lg:p-24 bg-slate-50/50">
        <motion.div
          variants={fadeUp(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-xl mb-14"
        >
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-blue-600 mb-5">
            Features
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">Built for African commerce</h2>
          <p className="text-base text-slate-500 leading-relaxed">
            Naira-first. Bitcoin invisible. Everything a trader needs to get paid fast and stay in control.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-slate-200 gap-[1px] border border-slate-200 rounded-3xl overflow-hidden">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} delay={i * 0.08} />
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-6 py-20 lg:p-24 bg-white border-t border-b border-slate-200">
        <motion.div
          variants={fadeUp(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-xl mb-16"
        >
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-blue-600 mb-5">
            How it works
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">Live in 30 seconds</h2>
          <p className="text-base text-slate-500 leading-relaxed">No documents. No bank account. No waiting.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting line (Desktop only) */}
          <div className="hidden md:block absolute top-7 left-[16.6%] w-[66.6%] h-[1.5px] bg-slate-200" />
          
          {steps.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp(i * 0.15)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col items-start lg:px-8"
            >
              <div className="w-14 h-14 rounded-full bg-white border-2 border-slate-100 shadow-sm flex items-center justify-center text-[15px] font-extrabold text-blue-600 mb-6 relative z-10">
                {s.num}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2.5 tracking-tight">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="px-6 py-20 lg:p-24">
        <motion.div
          variants={fadeUp(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-slate-900 rounded-[2rem] p-10 lg:p-20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 relative overflow-hidden"
        >
          {/* Decorative rings */}
          <div className="absolute -right-20 -top-20 w-[320px] h-[320px] rounded-full border border-white/5 pointer-events-none" />
          <div className="absolute -right-10 -top-10 w-[200px] h-[200px] rounded-full border border-white/10 pointer-events-none" />

          <div className="relative z-10">
            <p className="text-[11px] font-bold tracking-widest uppercase text-white/40 mb-5">Get started free</p>
            <h2 className="text-3xl lg:text-[42px] font-extrabold tracking-tight text-white leading-[1.1] mb-5">
              Start receiving Lightning<br />
              payments <span className="text-blue-400">today.</span>
            </h2>
            <p className="text-[15px] text-white/60 leading-relaxed max-w-md">
              Open a free trader wallet in 30 seconds. Get a personal Lightning address like
            </p>
            <p className="font-mono text-sm text-blue-400 mt-2">amara@kobosat.app</p>
          </div>

          <button onClick={() => navigate('/auth')} className="inline-flex items-center gap-2.5 px-9 py-4.5 rounded-full bg-blue-600 text-white text-[15px] font-bold shadow-xl shadow-blue-600/40 hover:bg-blue-500 hover:-translate-y-0.5 transition-all relative z-10 whitespace-nowrap">
            Create my wallet
            <IconArrowRight size={16} />
          </button>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-6 px-6 lg:px-12 py-8 border-t border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white border border-slate-200 shadow-sm">
            <img src="/assets/white-bg.png" alt="KoboSat Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-[13px] font-bold text-slate-500">KoboSat</span>
          <span className="text-xs text-slate-400">· © 2026</span>
        </div>
        <div className="flex items-center gap-6">
          {['Sign in', 'Sign up', 'Help'].map((label) => (
            <button key={label} onClick={() => navigate('/auth')} className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
              {label}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
