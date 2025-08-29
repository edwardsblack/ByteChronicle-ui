/**
 * @copyright 2025 PrasadKotkar
 * @license Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Settings, X, Type, AlignLeft, Monitor } from 'lucide-react';
import { useReadingPreferences } from '../contexts/ReadingPreferencesContext';

const ReadingPreferencesPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const { preferences, updatePreference, resetPreferences } = useReadingPreferences();

  const fontSizeOptions = [
    { value: 'small', label: 'Small', size: 'text-sm' },
    { value: 'medium', label: 'Medium', size: 'text-base' },
    { value: 'large', label: 'Large', size: 'text-lg' },
    { value: 'xlarge', label: 'Extra Large', size: 'text-xl' },
  ];

  const fontFamilyOptions = [
    { value: 'serif', label: 'Serif', class: 'font-serif' },
    { value: 'sans', label: 'Sans Serif', class: 'font-sans' },
    { value: 'mono', label: 'Monospace', class: 'font-mono' },
  ];

  const lineHeightOptions = [
    { value: 'tight', label: 'Tight', class: 'leading-tight' },
    { value: 'relaxed', label: 'Relaxed', class: 'leading-relaxed' },
    { value: 'loose', label: 'Loose', class: 'leading-loose' },
  ];

  // Calculate panel position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const panelWidth = 384; // max-w-md = 384px
      const panelHeight = 500; // estimated panel height
      
      let top = buttonRect.bottom + 8; // 8px gap below button
      let left = buttonRect.left;
      
      // Adjust horizontal position if panel would go off-screen
      if (left + panelWidth > viewportWidth - 16) {
        left = viewportWidth - panelWidth - 16;
      }
      if (left < 16) {
        left = 16;
      }
      
      // Adjust vertical position if panel would go off-screen
      if (top + panelHeight > viewportHeight - 16) {
        top = buttonRect.top - panelHeight - 8; // Show above button instead
        if (top < 16) {
          top = 16; // Fallback to top of viewport
        }
      }
      
      setPosition({ top, left });
    }
  }, [isOpen]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && 
          panelRef.current && 
          !panelRef.current.contains(event.target) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Close panel on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <>
      {/* Toggle Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
        aria-label="Reading preferences"
        title="Reading preferences"
      >
        <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Panel - Positioned absolutely below button */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden" />
          
          {/* Panel */}
          <div
            ref={panelRef}
            className="fixed z-50 w-full max-w-sm md:max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-all duration-300 scale-100"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              maxHeight: 'calc(100vh - 32px)',
            }}
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Reading Preferences
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
              {/* Font Size */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Type className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Font Size
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {fontSizeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updatePreference('fontSize', option.value)}
                      className={`p-3 text-left rounded-lg border transition-all duration-200 ${
                        preferences.fontSize === option.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className={option.size}>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Family */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <AlignLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Font Family
                  </label>
                </div>
                <div className="space-y-2">
                  {fontFamilyOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updatePreference('fontFamily', option.value)}
                      className={`w-full p-3 text-left rounded-lg border transition-all duration-200 ${option.class} ${
                        preferences.fontFamily === option.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Height */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Monitor className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Line Height
                  </label>
                </div>
                <div className="space-y-2">
                  {lineHeightOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updatePreference('lineHeight', option.value)}
                      className={`w-full p-3 text-left rounded-lg border transition-all duration-200 ${
                        preferences.lineHeight === option.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className={option.class}>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 flex items-center justify-between p-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl">
              <button
                onClick={resetPreferences}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
              >
                Reset to defaults
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-primary"
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ReadingPreferencesPanel;
