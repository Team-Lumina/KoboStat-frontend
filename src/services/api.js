// Grab the URL from the .env file we just created
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 1. Get Wallet Balance
 * Expected to return something like { balance_sats: 47820 }
 */
export const getWalletBalance = async () => {
  try {
    const response = await fetch(`${BASE_URL}/wallet/balance`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch balance');
    return await response.json();
  } catch (error) {
    console.error("Error fetching balance:", error);
    return null; // Return null so your UI can show a fallback or error state
  }
};

/**
 * 2. Generate Invoice
 * Expected to return something like { invoice: "lnbc50n1..." }
 */
export const generateInvoice = async (amount, memo) => {
  try {
    const response = await fetch(`${BASE_URL}/wallet/invoice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount_sats: amount, description: memo })
    });
    if (!response.ok) throw new Error('Failed to generate invoice');
    return await response.json();
  } catch (error) {
    console.error("Error generating invoice:", error);
    return null;
  }
};

/**
 * 3. Pay Invoice
 * Expected to return something like { status: "success", fee_paid: 2 }
 */
export const payInvoice = async (bolt11String) => {
  try {
    const response = await fetch(`${BASE_URL}/wallet/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoice: bolt11String })
    });
    if (!response.ok) throw new Error('Payment failed');
    return await response.json();
  } catch (error) {
    console.error("Error paying invoice:", error);
    return null;
  }
};

/**
 * 4. USSD Gateway Handler
 * Sends the session data to the backend USSD processor
 */
export const sendUssdCommand = async (sessionId, phoneNumber, textInput) => {
  try {
    const response = await fetch(`${BASE_URL}/ussd`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        sessionId: sessionId, 
        phoneNumber: phoneNumber, 
        text: textInput 
      })
    });
    
    // USSD usually returns plain text (e.g., "CON Welcome to KoboSats...")
    if (!response.ok) throw new Error('USSD request failed');
    return await response.text(); 
  } catch (error) {
    console.error("Error with USSD:", error);
    return "END Connection Error. Please try again.";
  }
};