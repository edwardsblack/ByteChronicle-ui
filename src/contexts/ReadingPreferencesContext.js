import React, { createContext, useContext, useState, useEffect } from 'react';

const ReadingPreferencesContext = createContext();

export const useReadingPreferences = () => {
  const context = useContext(ReadingPreferencesContext);
  if (!context) {
    throw new Error('useReadingPreferences must be used within a ReadingPreferencesProvider');
  }
  return context;
};

export const ReadingPreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('readingPreferences');
    return saved ? JSON.parse(saved) : {
      fontSize: 'medium',
      fontFamily: 'serif',
      lineHeight: 'relaxed',
      maxWidth: 'narrow',
    };
  });

  useEffect(() => {
    localStorage.setItem('readingPreferences', JSON.stringify(preferences));
    
    // Apply preferences to document
    const root = document.documentElement;
    
    // Font size
    root.style.setProperty('--reading-font-size', getFontSizeValue(preferences.fontSize));
    
    // Line height
    root.style.setProperty('--reading-line-height', getLineHeightValue(preferences.lineHeight));
    
  }, [preferences]);

  const getFontSizeValue = (size) => {
    const sizes = {
      small: '1rem',
      medium: '1.125rem',
      large: '1.25rem',
      xlarge: '1.375rem',
    };
    return sizes[size] || sizes.medium;
  };

  const getLineHeightValue = (height) => {
    const heights = {
      tight: '1.5',
      relaxed: '1.75',
      loose: '2',
    };
    return heights[height] || heights.relaxed;
  };

  const updatePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetPreferences = () => {
    setPreferences({
      fontSize: 'medium',
      fontFamily: 'serif',
      lineHeight: 'relaxed',
      maxWidth: 'narrow',
    });
  };

  const value = {
    preferences,
    updatePreference,
    resetPreferences,
    getFontSizeValue,
    getLineHeightValue,
  };

  return (
    <ReadingPreferencesContext.Provider value={value}>
      {children}
    </ReadingPreferencesContext.Provider>
  );
};
