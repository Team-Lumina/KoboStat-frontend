import React, { createContext, useContext, useState, useEffect } from 'react';

//Create the context
const ThemeContext = createContext();

//Export the Provider (this wraps the app in main.jsx)
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, language, setLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
};

//  EXPORT THE HOOK TO USE THE CONTEXT IN ANY COMPONENT
export const useTheme = () => useContext(ThemeContext);