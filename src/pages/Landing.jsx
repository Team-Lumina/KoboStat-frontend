import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../locales/translations';
import BottomNav from '../components/BottomNav';
import GlobalHeader from '../components/GlobalHeader';
import { getWalletBalance, getTransactionHistory } from '../services/api';
import { motion } from 'framer-motion';
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
  FiRefreshCw as RefreshCw,
} from 'react-icons/fi';

// ─── Design Tokens ────────────────────────────────────────────────────────────

const C = {
  blue:       '#1855F1',
  blueLight:  '#EBF0FF',
  blueXLight: '#F5F7FF',
  ink:        '#0A0F1E',
  ink2:       '#2D3555',
  ink3:       '#6B7394',
  white:      '#FFFFFF',
  line:       '#E4E8F4',
  green:      '#22C55E',
  red:        '#EF4444',
  amber:      '#FCD34D',
  // Dark
  darkBg:     '#060810',
  darkCard:   '#0D1117',
  darkBorder: '#1A2035',
};

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 60, damping: 18, delay } },
});

// ─── Sub-components ───────────────────────────────────────────────────────────

function QuickAction({ action, isDarkMode, card, border, text, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            10,
        padding:        '20px 12px',
        borderRadius:   20,
        background:     hovered ? (isDarkMode ? '#111827' : '#EBF0FF') : card,
        border:         `1.5px solid ${hovered ? C.blue : border}`,
        cursor:         'pointer',
        transition:     'all 0.2s ease',
        transform:      hovered ? 'translateY(-2px)' : 'none',
        boxShadow:      hovered ? '0 8px 24px rgba(24,85,241,0.12)' : 'none',
        fontFamily:     "'Sora', sans-serif",
      }}
    >
      <div style={{
        width:          48,
        height:         48,
        borderRadius:   '50%',
        background:     hovered ? C.blue : (isDarkMode ? 'rgba(24,85,241,0.15)' : C.blueLight),
        color:          hovered ? '#fff' : C.blue,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        transition:     'all 0.2s ease',
        flexShrink:     0,
      }}>
        {action.icon}
      </div>
      <span style={{
        fontSize:    11,
        fontWeight:  700,
        color:       text,
        letterSpacing: '0.2px',
        whiteSpace:  'nowrap',
      }}>
        {action.name}
      </span>
    </button>
  );
}

function TransactionRow({ tx, isDarkMode, text, muted, isLast }) {
  const [hovered, setHovered] = useState(false);

  const iconBg = tx.type === 'send'
    ? (isDarkMode ? 'rgba(239,68,68,0.12)' : '#FEF2F2')
    : tx.isSettle
      ? (isDarkMode ? 'rgba(34,197,94,0.12)' : '#F0FDF4')
      : (isDarkMode ? 'rgba(24,85,241,0.12)' : C.blueLight);

  const icon = tx.type === 'send'
    ? <Send   size={17} style={{ color: C.red }}   />
    : tx.isSettle
      ? <CheckCircle    size={17} style={{ color: C.green }} />
      : <ArrowDownLeft  size={17} style={{ color: C.blue }}  />;

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width:          '100%',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        padding:        '14px 16px',
        borderRadius:   16,
        background:     hovered ? (isDarkMode ? 'rgba(24,85,241,0.06)' : C.blueXLight) : 'transparent',
        border:         'none',
        cursor:         'pointer',
        textAlign:      'left',
        transition:     'background 0.15s',
        fontFamily:     "'Sora', sans-serif",
        borderBottom:   !isLast ? `1px solid ${isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}` : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width:          44,
          height:         44,
          borderRadius:   '50%',
          background:     iconBg,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          flexShrink:     0,
        }}>
          {icon}
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: text, marginBottom: 3, lineHeight: 1.2 }}>
            {tx.name}
          </p>
          <p style={{
            fontSize:     11,
            color:        muted,
            fontWeight:   500,
            maxWidth:     180,
            overflow:     'hidden',
            textOverflow: 'ellipsis',
            whiteSpace:   'nowrap',
          }}>
            {tx.desc}
          </p>
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: tx.type === 'send' ? C.red : C.green, marginBottom: 3 }}>
          {tx.amount}
        </p>
        <p style={{ fontSize: 10, color: muted, fontFamily: "'DM Mono', monospace" }}>
          {tx.sats}
        </p>
      </div>
    </button>
  );
}

function SkeletonRow({ isDarkMode }) {
  const bg = isDarkMode ? '#1A2035' : '#F1F5F9';
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: bg }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ width: 100, height: 12, borderRadius: 6, background: bg }} />
          <div style={{ width: 64,  height: 10, borderRadius: 5, background: bg }} />
        </div>
      </div>
      <div style={{ width: 60, height: 12, borderRadius: 6, background: bg }} />
    </div>
  );
}

function EmptyState({ navigate, t, isDarkMode }) {
  return (
    <div style={{
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '52px 24px',
      textAlign:      'center',
    }}>
      <div style={{
        width:          64,
        height:         64,
        borderRadius:   '50%',
        background:     isDarkMode ? 'rgba(24,85,241,0.15)' : C.blueLight,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        marginBottom:   20,
      }}>
        <Zap size={28} fill="currentColor" style={{ color: C.blue, opacity: 0.7 }} />
      </div>
      <p style={{ fontSize: 15, fontWeight: 700, color: isDarkMode ? '#fff' : C.ink, marginBottom: 8 }}>
        {t.noTransactionsYet || 'No transactions yet'}
      </p>
      <p style={{ fontSize: 13, color: C.ink3, maxWidth: 200, lineHeight: 1.6, marginBottom: 24 }}>
        {t.walletReadyMessage || 'Your Lightning wallet is ready. Receive your first payment!'}
      </p>
      <button
        onClick={() => navigate('/receive')}
        style={{
          padding:    '12px 28px',
          borderRadius: 100,
          border:     'none',
          background: C.blue,
          color:      '#fff',
          fontFamily: "'Sora', sans-serif",
          fontSize:   13,
          fontWeight: 700,
          cursor:     'pointer',
          boxShadow:  '0 4px 16px rgba(24,85,241,0.28)',
          transition: 'all 0.2s',
        }}
      >
        {t.receiveSatsBtn || 'Receive Sats'}
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const { isDarkMode, language } = useTheme();
  const t = translations[language] || translations.en;

  const [showBalance,       setShowBalance]       = useState(true);
  const [isLoaded,          setIsLoaded]          = useState(false);
  const [isLoadingData,     setIsLoadingData]     = useState(true);
  const [isRefreshing,      setIsRefreshing]      = useState(false);
  const [walletBalance,     setWalletBalance]     = useState({ ngn: 0, sats: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);

  const activePhone    = user?.phone || localStorage.getItem('kobosat_user_phone') || null;
  const userFirstName  = user?.name ? user.name.split(' ')[0] : '';

  // ── Data fetching (original logic preserved exactly) ──────────────────────
  const fetchDashboardData = async (silentRefresh = false) => {
    if (!activePhone) { setIsLoadingData(false); return; }
    console.log('Fetching live data for:', activePhone);

    if (!silentRefresh) setIsLoadingData(true);
    else                setIsRefreshing(true);

    try {
      const txData   = await getTransactionHistory(activePhone);
      const txArray  = txData.transactions || txData;
      const isNewUser = !txArray || txArray.length === 0;

      const balanceData = await getWalletBalance(activePhone);
      if (balanceData) {
        setWalletBalance({
          ngn:  isNewUser ? 0 : (balanceData.balance_ngn  || 0),
          sats: isNewUser ? 0 : (balanceData.balance_sats || 0),
        });
      }

      if (Array.isArray(txArray) && txArray.length > 0) {
        const mappedTxs = txArray.slice(0, 4).map(tx => ({
          id:       tx.id || Math.random().toString(),
          name:     tx.counterparty || (tx.type === 'receive' ? (t.paymentReceived || 'Payment Received') : (t.paymentSent || 'Payment Sent')),
          desc:     tx.description  || (tx.type === 'receive' ? (t.lightningDeposit || 'Lightning Deposit')  : (t.lightningPayment || 'Lightning Payment')),
          amount:   `${tx.type === 'send' ? '-' : '+'}₦${(tx.amount_ngn  || 0).toLocaleString()}`,
          sats:     `${(tx.amount_sats || 0).toLocaleString()} sats`,
          isSettle: tx.is_settled !== undefined ? tx.is_settled : true,
          type:     tx.type || 'receive',
        }));
        setRecentTransactions(mappedTxs);
      } else {
        setRecentTransactions([]);
      }
    } catch (error) {
      console.error('Failed to load live data:', error);
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
    const id = setInterval(() => fetchDashboardData(true), 10000);
    return () => clearInterval(id);
  }, [user, activePhone]);

  // ── Theme shortcuts ────────────────────────────────────────────────────────
  const bg     = isDarkMode ? C.darkBg     : C.blueXLight;
  const card   = isDarkMode ? C.darkCard   : C.white;
  const border = isDarkMode ? C.darkBorder : C.line;
  const text   = isDarkMode ? '#FFFFFF'    : C.ink;
  const muted  = isDarkMode ? '#9CA3AF'    : C.ink3;

  // ── Quick actions config ───────────────────────────────────────────────────
  const quickActions = [
    { name: t.actionReceive  || 'Receive',    icon: <ArrowDown size={22} />, path: '/receive' },
    { name: t.actionSendSats || 'Send Sats',  icon: <Send      size={22} />, path: '/send'    },
    { name: t.actionLogDebt  || 'Log Debt',   icon: <FileText  size={22} />, path: '/debts'   },
    { name: t.actionViewDebts|| 'View Debts', icon: <Users     size={22} />, path: '/debts'   },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight:              '100vh',
      background:             bg,
      fontFamily:             "'Sora', sans-serif",
      WebkitFontSmoothing:    'antialiased',
      color:                  text,
      paddingBottom:          80,
    }}>

      {/* Font imports */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 1024px) {
          .dash-grid    { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .dash-pad     { padding: 16px 16px 100px !important; }
          .actions-row  { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* ── GLOBAL HEADER ── */}
      <GlobalHeader user={user} />

      {/* ── PAGE BODY ── */}
      <div
        className="dash-pad"
        style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 40px 80px' }}
      >
        <motion.div
          className="dash-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          style={{
            display:             'grid',
            gridTemplateColumns: '1fr 340px',
            gap:                 24,
            alignItems:          'start',
          }}
        >

          {/* ═══════════════ LEFT COLUMN ═══════════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ── 1. BALANCE CARD ── */}
            <motion.div
              variants={fadeUp(0)}
              initial="hidden"
              animate="visible"
              style={{
                background:   C.ink,
                borderRadius: 28,
                padding:      '40px 40px 32px',
                position:     'relative',
                overflow:     'hidden',
              }}
            >
              {/* Dot-grid texture */}
              <div style={{
                position:            'absolute',
                inset:               0,
                backgroundImage:     'radial-gradient(circle, rgba(24,85,241,0.18) 1px, transparent 1px)',
                backgroundSize:      '28px 28px',
                pointerEvents:       'none',
              }} />
              {/* Glow */}
              <div style={{
                position:   'absolute',
                top:        -60, right: -60,
                width:      280, height: 280,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(24,85,241,0.28) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              {/* Card top row */}
              <div style={{
                display:        'flex',
                justifyContent: 'space-between',
                alignItems:     'center',
                marginBottom:   32,
                position:       'relative',
                zIndex:         1,
              }}>
                <div style={{
                  display:     'flex',
                  alignItems:  'center',
                  gap:         8,
                  background:  'rgba(255,255,255,0.07)',
                  border:      '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 100,
                  padding:     '6px 14px',
                }}>
                  {/* Live indicator */}
                  <span style={{
                    display:      'inline-block',
                    width:        6, height: 6,
                    borderRadius: '50%',
                    background:   C.green,
                  }} />
                  <span style={{
                    fontSize:      10,
                    fontWeight:    700,
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase',
                    color:         'rgba(255,255,255,0.65)',
                  }}>
                    {t.walletBalance || 'Wallet Balance'}
                  </span>
                </div>

                {/* Show / hide toggle */}
                <button
                  onClick={() => setShowBalance(v => !v)}
                  style={{
                    width:          36, height: 36,
                    borderRadius:   '50%',
                    border:         'none',
                    background:     'rgba(255,255,255,0.07)',
                    color:          'rgba(255,255,255,0.6)',
                    cursor:         'pointer',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    transition:     'background 0.2s',
                    flexShrink:     0,
                  }}
                >
                  {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>

              {/* Balance amount */}
              <div style={{ position: 'relative', zIndex: 1, marginBottom: 32, minHeight: 92 }}>
                {isLoadingData && !isRefreshing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ height: 64, width: 240, borderRadius: 12, background: 'rgba(255,255,255,0.07)' }} />
                    <div style={{ height: 26, width: 160, borderRadius:  8, background: 'rgba(255,255,255,0.04)' }} />
                  </div>
                ) : (
                  <>
                    <div style={{
                      fontSize:      'clamp(40px, 5.5vw, 64px)',
                      fontWeight:    800,
                      letterSpacing: '-3px',
                      color:         '#FFFFFF',
                      lineHeight:    1,
                      marginBottom:  14,
                    }}>
                      {showBalance ? `₦${walletBalance.ngn.toLocaleString()}` : '••••••'}
                    </div>
                    <div style={{
                      display:     'inline-flex',
                      alignItems:  'center',
                      gap:         6,
                      background:  'rgba(24,85,241,0.22)',
                      border:      '1px solid rgba(24,85,241,0.38)',
                      borderRadius: 100,
                      padding:     '4px 12px',
                      fontFamily:  "'DM Mono', monospace",
                      fontSize:    12,
                      fontWeight:  500,
                      color:       '#93B4FD',
                    }}>
                      <Zap size={11} fill="currentColor" style={{ color: C.amber }} />
                      {showBalance ? `${walletBalance.sats.toLocaleString()} sats` : '•••• sats'}
                    </div>
                  </>
                )}
              </div>

              {/* Weekly stat row */}
              <div style={{
                display:       'flex',
                justifyContent:'space-between',
                alignItems:    'center',
                paddingTop:    20,
                borderTop:     '1px solid rgba(255,255,255,0.08)',
                position:      'relative',
                zIndex:        1,
              }}>
                <span style={{
                  fontSize:   13,
                  fontWeight: 500,
                  color:      'rgba(255,255,255,0.45)',
                  display:    'flex',
                  alignItems: 'center',
                  gap:        6,
                }}>
                  <TrendingUp size={13} /> {t.thisWeek || 'This week'}
                </span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>+₦0</span>
              </div>
            </motion.div>

            {/* ── 2. QUICK ACTIONS ── */}
            <motion.div
              className="actions-row"
              variants={fadeUp(0.1)}
              initial="hidden"
              animate="visible"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}
            >
              {quickActions.map((action, i) => (
                <QuickAction
                  key={i}
                  action={action}
                  isDarkMode={isDarkMode}
                  card={card}
                  border={border}
                  text={text}
                  onClick={() => navigate(action.path)}
                />
              ))}
            </motion.div>

            {/* ── 3. RECENT ACTIVITY ── */}
            <motion.div variants={fadeUp(0.18)} initial="hidden" animate="visible">
              {/* Section header */}
              <div style={{
                display:        'flex',
                justifyContent: 'space-between',
                alignItems:     'center',
                marginBottom:   16,
              }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.4px', color: text }}>
                  {t.recentActivity || 'Recent activity'}
                </h3>
                <button
                  onClick={() => fetchDashboardData(true)}
                  style={{
                    display:    'flex',
                    alignItems: 'center',
                    gap:        6,
                    fontSize:   13,
                    fontWeight: 700,
                    color:      C.blue,
                    background: 'none',
                    border:     'none',
                    cursor:     'pointer',
                    fontFamily: "'Sora', sans-serif",
                    padding:    0,
                  }}
                >
                  <RefreshCw
                    size={12}
                    style={isRefreshing ? { animation: 'spin 0.8s linear infinite' } : {}}
                  />
                  {t.seeAll || 'See all'}
                </button>
              </div>

              {/* Activity card */}
              <div style={{
                background:   card,
                borderRadius: 24,
                border:       `1px solid ${border}`,
                overflow:     'hidden',
              }}>
                {isLoadingData && !isRefreshing ? (
                  <div style={{ padding: 8 }}>
                    {[1, 2, 3].map(i => <SkeletonRow key={i} isDarkMode={isDarkMode} />)}
                  </div>
                ) : recentTransactions.length === 0 ? (
                  <EmptyState navigate={navigate} t={t} isDarkMode={isDarkMode} />
                ) : (
                  <div style={{ padding: 8 }}>
                    {recentTransactions.map((tx, i) => (
                      <TransactionRow
                        key={tx.id}
                        tx={tx}
                        isDarkMode={isDarkMode}
                        text={text}
                        muted={muted}
                        isLast={i === recentTransactions.length - 1}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

          </div>{/* end left column */}

          {/* ═══════════════ RIGHT COLUMN ═══════════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ── 4. MARKET INSIGHT CARD ── */}
            <motion.div
              variants={fadeUp(0.14)}
              initial="hidden"
              animate="visible"
              style={{
                background:   card,
                borderRadius: 24,
                padding:      '28px',
                border:       `1px solid ${border}`,
              }}
            >
              <div style={{
                display:     'flex',
                alignItems:  'center',
                gap:         7,
                marginBottom: 14,
              }}>
                <span style={{
                  width: 6, height: 6,
                  borderRadius: '50%',
                  background:   C.blue,
                  flexShrink:   0,
                  display:      'inline-block',
                }} />
                <span style={{
                  fontSize:      10,
                  fontWeight:    700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color:         C.blue,
                }}>
                  {t.todaysMarket || "Today's market"}
                </span>
              </div>

              <h4 style={{
                fontSize:     16,
                fontWeight:   700,
                color:        text,
                letterSpacing:'-0.3px',
                lineHeight:   1.35,
                marginBottom: 10,
              }}>
                {t.customersPayingFaster || 'Customers are paying faster'}&nbsp;
                <Zap size={17} fill={C.amber} style={{ color: C.amber, verticalAlign: 'middle' }} />
              </h4>

              <p style={{ fontSize: 13, color: muted, lineHeight: 1.7 }}>
                {t.settlementMessage || 'Your average settlement time this week is under 3 seconds. Keep it going'}
                {userFirstName ? `, ${userFirstName}.` : '.'}
              </p>
            </motion.div>

            {/* ── 5. USSD CARD ── */}
            <motion.div
              variants={fadeUp(0.20)}
              initial="hidden"
              animate="visible"
              style={{
                background:   card,
                borderRadius: 24,
                padding:      '28px',
                border:       `1px solid ${border}`,
              }}
            >
              <div style={{
                display:     'flex',
                alignItems:  'center',
                gap:         7,
                marginBottom: 16,
              }}>
                <Smartphone size={13} style={{ color: C.blue, opacity: 0.8 }} />
                <span style={{
                  fontSize:      10,
                  fontWeight:    700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color:         C.blue,
                  opacity:       0.85,
                }}>
                  {t.ussdCodeLabel || 'USSD Code'}
                </span>
              </div>

              {/* The big USSD number */}
              <div style={{
                fontFamily:    "'DM Mono', monospace",
                fontSize:      32,
                fontWeight:    700,
                color:         C.blue,
                letterSpacing: '1px',
                marginBottom:  10,
                lineHeight:    1.1,
              }}>
                *384*7287#
              </div>

              <p style={{ fontSize: 13, color: muted, lineHeight: 1.65, marginBottom: 24 }}>
                {t.dialFromAnyPhone || 'Dial from any phone — no internet needed.'}
              </p>

              <button
                onClick={() => navigate('/ussd')}
                style={{
                  width:       '100%',
                  padding:     '14px 0',
                  borderRadius: 100,
                  border:      `1.5px solid ${C.blueLight}`,
                  background:  isDarkMode ? 'rgba(24,85,241,0.10)' : C.blueLight,
                  color:       C.blue,
                  fontFamily:  "'Sora', sans-serif",
                  fontSize:    13,
                  fontWeight:  700,
                  cursor:      'pointer',
                  transition:  'all 0.2s',
                  letterSpacing: '0.1px',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = C.blue;
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.borderColor = C.blue;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = isDarkMode ? 'rgba(24,85,241,0.10)' : C.blueLight;
                  e.currentTarget.style.color = C.blue;
                  e.currentTarget.style.borderColor = C.blueLight;
                }}
              >
                {t.openUssdEmulator || 'Open USSD emulator'}
              </button>
            </motion.div>

          </div>{/* end right column */}

        </motion.div>
      </div>

      {/* ── BOTTOM NAV (mobile) ── */}
      <div className="md:hidden">
        <BottomNav />
      </div>

    </div>
  );
}
