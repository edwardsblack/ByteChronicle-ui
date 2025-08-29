/**
 * @copyright 2025 PrasadKotkar
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Key, Save, RefreshCw } from 'lucide-react';
import developerService from '../services/developerService';

const DeveloperKeyManager = () => {
  const [currentKey, setCurrentKey] = useState('');
  const [newKey, setNewKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCurrentKey();
  }, []);

  const fetchCurrentKey = async () => {
    try {
      const key = await developerService.getCurrentKey();
      setCurrentKey(key);
      setNewKey(key);
    } catch (err) {
      setError('Failed to fetch current key');
    }
  };

  const handleUpdateKey = async () => {
    if (!newKey.trim()) {
      setError('Key cannot be empty');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await developerService.updateKey(newKey.trim());
      setCurrentKey(response.key);
      setMessage('Key updated successfully! Please refresh all developer pages.');
    } catch (err) {
      setError('Failed to update key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <Key className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Developer Key Management
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Current Key
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={currentKey}
              readOnly
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={fetchCurrentKey}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            New Key
          </label>
          <input
            type="text"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="Enter new developer key"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <button
          onClick={handleUpdateKey}
          disabled={loading || !newKey.trim() || newKey === currentKey}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Updating...' : 'Update Key'}</span>
        </button>

        {message && (
          <div className="p-3 bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400 rounded-md text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p><strong>Note:</strong> Changing the key will require all developers to use the new key to access developer pages.</p>
        </div>
      </div>
    </div>
  );
};

export default DeveloperKeyManager;
