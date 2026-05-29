// Grab the URL from the .env file we just created
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// --------------------------------------------------------
// 1. HEALTHCHECK
// --------------------------------------------------------
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/health`, { method: 'GET' });
    return response.ok;
  } catch (error) {
    console.error("Health check failed:", error);
    return false;
  }
};

// --------------------------------------------------------
// 2. TRADERS MANAGEMENT (Auth)
// --------------------------------------------------------
export const registerTrader = async (phoneNumber, language = 'en') => {
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
// 3. LIGHTNING WALLET & TRANSACTIONS
// --------------------------------------------------------
export const getWalletBalance = async (phone) => {
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
// 4. DEBT TRACKER LEDGER
// --------------------------------------------------------
export const createDebtRecord = async (creditorPhone, debtorPhone, amountNgn, description, dueDate) => {
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
// 5. USSD SIMULATOR ENGINE
// --------------------------------------------------------
export const sendUssdCommand = async (phoneNumber, textInput) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/ussd/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        phone_number: phoneNumber, 
        text: textInput 
      })
    });
    
    if (!response.ok) throw new Error('USSD simulation request failed');
    return await response.json(); 
  } catch (error) {
    console.error("Error with USSD Simulation:", error);
    return "END Connection Error. Please try again.";
  }
};

// Add this to the bottom of src/services/api.js

export const payInvoice = async (phone, invoiceString) => {
  try {
    // Note: Double check with Busayomi if the endpoint is exactly '/api/pay' or something like '/api/lightning/pay'
    const response = await fetch('https://kobosat-backend.onrender.com/api/pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        phone: phone, 
        invoice: invoiceString 
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || data.error || 'Payment failed');
    }
    
    return data;
  } catch (error) {
    console.error('Error paying invoice:', error);
    return { error: error.message || "Failed to connect to the server" };
  }
};

// Add to src/services/api.js
export const getWalletSeed = async (phone) => {
  try {
    // Verify this endpoint URL with Busayomi
    const response = await fetch(`https://kobosat-backend.onrender.com/api/wallets/${phone}/seed`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch seed');
    return data;
  } catch (error) {
    console.error('Error fetching seed:', error);
    throw error; // Let the UI catch it and show the dummy fallback
  }
};