import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Tooltip({ text, children }) {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="relative group flex items-center justify-center">
      {children}
      <div className={`absolute bottom-full mb-2 hidden group-hover:block px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap z-50 transition-opacity ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
        {text}
        {/* Tooltip Arrow */}
        <div className={`absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent ${isDarkMode ? 'border-t-white' : 'border-t-black'}`}></div>
      </div>
    </div>
  );
}