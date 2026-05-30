// ========================================================
// CONFIGURATION & EMERGENCY TOGGLE
// ========================================================
const BASE_URL = 'https://kobosat-backend.onrender.com';

// SET TO true FOR A BULLETPROOF KILL-SWITCH ON DEMO SUNDAY.
// If the Breez LSP fails, the internet drops, or CORS blocks you,
// flip this to true to run a flawless local simulation.
const DEMO_MODE = false;

// Helper to initialize local storage for Demo Mode
const initDemoStorage = (phone) => {
  if (!localStorage.getItem(`kobosat_balance_${phone}`)) {
    localStorage.setItem(`kobosat_balance_${phone}`, JSON.stringify({ balance: 25000, sat: 25000 }));
  }
  if (!localStorage.getItem(`kobosat_tx_${phone}`)) {
    localStorage.setItem(`kobosat_tx_${phone}`, JSON.stringify([]));
  }
};

// --------------------------------------------------------
// HEALTHCHECK
// --------------------------------------------------------
export const checkApiHealth = async () => {
  if (DEMO_MODE) return true;
  try {
    const response = await fetch(`${BASE_URL}/api/health`, { method: 'GET' });
    return response.ok;
  } catch (error) {
    console.error("Health check failed:", error);
    return false;
  }
};

// --------------------------------------------------------
// TRADERS MANAGEMENT (Auth)
// --------------------------------------------------------
export const registerTrader = async (phoneNumber, language = 'en') => {
  if (DEMO_MODE) {
    initDemoStorage(phoneNumber);
    return { status: "success", phone_number: phoneNumber, language };
  }
  try {
    const response = await fetch(`${BASE_URL}/api/v1/traders/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: phoneNumber, language })
    });
    if (!response.ok) throw new Error('Registration failed');
    return await response.json();
  } catch (error) {
    console.error("Error registering trader:", error);
    return null;
  }
};

export const getTraderProfile = async (phone) => {
  if (DEMO_MODE) return { phone_number: phone, language: 'en', name: "Trader" };
  try {
    const response = await fetch(`${BASE_URL}/api/v1/traders/${phone}`, { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return await response.json();
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

// --------------------------------------------------------
// LIGHTNING WALLET & TRANSACTIONS
// --------------------------------------------------------
export const getWalletBalance = async (phone) => {
  if (DEMO_MODE) {
    initDemoStorage(phone);
    return JSON.parse(localStorage.getItem(`kobosat_balance_${phone}`));
  }
  try {
    const response = await fetch(`${BASE_URL}/api/v1/lightning/balance/${phone}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch balance');
    return await response.json();
  } catch (error) {
    console.error("Error fetching balance:", error);
    return null; 
  }
};

export const getTransactionHistory = async (phone) => {
  if (DEMO_MODE) {
    initDemoStorage(phone);
    return JSON.parse(localStorage.getItem(`kobosat_tx_${phone}`));
  }
  try {
    const response = await fetch(`${BASE_URL}/api/v1/transactions/${phone}`, { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch transaction history');
    return await response.json();
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    return []; 
  }
};

export const generateInvoice = async (phoneNumber, amountNgn) => {
  if (DEMO_MODE) {
    return { 
      payment_request: "lnbc98830n1p4pnd08pp545d32jypwycfqffn63qqdrsf3hyejypx5nk4cecyjfdzpmcxsaeqsp5nwax33wnmev46...",
      amount: Number(amountNgn)
    };
  }
  try {
    const response = await fetch(`${BASE_URL}/api/v1/lightning/invoice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        phone_number: phoneNumber, 
        amount_ngn: Number(amountNgn) 
      })
    });
    if (!response.ok) throw new Error('Failed to generate invoice');
    return await response.json();
  } catch (error) {
    console.error("Error generating invoice:", error);
    return null;
  }
};

// --------------------------------------------------------
// DEBT TRACKER LEDGER
// --------------------------------------------------------
export const createDebtRecord = async (creditorPhone, debtorPhone, amountNgn, description, dueDate) => {
  if (DEMO_MODE) return { id: "demo-debt", amount_ngn: amountNgn, description };
  try {
    const response = await fetch(`${BASE_URL}/api/v1/debts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creditor_phone: creditorPhone,
        debtor_phone: debtorPhone,
        amount_ngn: Number(amountNgn),
        description: description,
        due_date: dueDate || null
      })
    });
    if (!response.ok) throw new Error('Failed to create debt record');
    return await response.json();
  } catch (error) {
    console.error("Error logging debt:", error);
    return null;
  }
};

export const listDebts = async (phone) => {
  if (DEMO_MODE) return [{ id: "debt-1", debtor_phone: "08012345678", amount_ngn: 2500, description: "Bag of Rice", settled: false }];
  try {
    const response = await fetch(`${BASE_URL}/api/v1/debts/${phone}`, { method: 'GET' });
    if (!response.ok) throw new Error('Failed to load ledger');
    return await response.json();
  } catch (error) {
    console.error("Error listing debts:", error);
    return [];
  }
};

export const settleDebt = async (debtId, phone) => {
  if (DEMO_MODE) return { status: "success", message: "Debt settled locally" };
  try {
    const response = await fetch(`${BASE_URL}/api/v1/debts/${debtId}/settle?phone=${phone}`, {
      method: 'PATCH'
    });
    if (!response.ok) throw new Error('Failed to settle debt record');
    return await response.json();
  } catch (error) {
    console.error("Error settling debt:", error);
    return null;
  }
};

// --------------------------------------------------------
//  USSD SIMULATOR ENGINE
// --------------------------------------------------------
export const sendUssdCommand = async (phone, ussdText) => {
  if (DEMO_MODE) {
    return { status: "CON", message: "KoboSats Gateway\n1. Check Balance\n2. Pay Invoice\n3. Cashout" };
  }
  try {
    const response = await fetch(`${BASE_URL}/api/v1/ussd/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        phoneNumber: phone, 
        text: ussdText 
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('USSD Error:', error);
    throw error;
  }
};

// --------------------------------------------------------
// 6. PAYMENTS & SEED PHRASE
// --------------------------------------------------------
export const payInvoice = async (phone, invoiceString) => {
  if (DEMO_MODE) {
    initDemoStorage(phone);
    
    // Simulate updating balance locally for visual feedback during presentation
    let currentData = JSON.parse(localStorage.getItem(`kobosat_balance_${phone}`));
    // Assuming a 5,000 satoshi payment for the demo script
    if (currentData.balance >= 5000) {
        currentData.balance -= 5000; 
        currentData.sat -= 5000;
    }
    localStorage.setItem(`kobosat_balance_${phone}`, JSON.stringify(currentData));

    // Append to fake transaction history
    let txHistory = JSON.parse(localStorage.getItem(`kobosat_tx_${phone}`));
    txHistory.unshift({ id: `tx-${Date.now()}`, type: 'send', amount: 5000, status: 'success', timestamp: new Date().toISOString() });
    localStorage.setItem(`kobosat_tx_${phone}`, JSON.stringify(txHistory));

    return { status: "success", message: "Payment processed successfully", balance: currentData.balance };
  }
  
  try {
    //  STEP 1: PREPARE THE PAYMENT 
    // This tells the Breez SDK to calculate the route and exact fees
    const prepareRes = await fetch(`${BASE_URL}/api/v1/lightning/prepare-send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        phone_number: phone, 
        invoice: invoiceString 
      }),
    });

    const prepareData = await prepareRes.json();
    
    if (!prepareRes.ok) {
      throw new Error(prepareData.detail || prepareData.message || 'Failed to prepare payment route');
    }

    // 🔥 STEP 2: EXECUTE THE PAYMENT 🔥
    // Pass the prepared data/id back to the server to finalize the transaction
    const sendRes = await fetch(`${BASE_URL}/api/v1/lightning/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        phone_number: phone, 
        invoice: invoiceString,
        // Depending on Busayo's schema, pass the preparation ID/req_id if required
        req_id: prepareData.id || prepareData.req_id 
      }),
    });

    const sendData = await sendRes.json();
    
    if (!sendRes.ok) {
      throw new Error(sendData.detail || sendData.message || 'Payment failed to execute');
    }
    
    return sendData;
  } catch (error) {
    console.error('Error paying invoice:', error);
    return { error: error.message || "Failed to connect to the server" };
  }
};

export const getWalletSeed = async (phone) => {
  if (DEMO_MODE) return { seed: "apple banana cherry dog elephant fox grape horse ink jam kite lemon" };
  try {
    const response = await fetch(`${BASE_URL}/api/wallets/${phone}/seed`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch seed');
    return data;
  } catch (error) {
    console.error('Error fetching seed:', error);
    throw error; 
  }
};
