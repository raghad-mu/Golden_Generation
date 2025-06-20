import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Modal = ({ children, onClose, title }) => {
  const themeContext = useTheme();
  const theme = themeContext?.theme || 'light';
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
      <div className={`rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 text-2xl ${
            theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-700'
          }`}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className={`text-xl font-bold mb-4 ${
          theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
        }`}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

export default Modal; 