import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TextToSpeech from '../components/TextToSpeech';
import { AlertCircle, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useDeveloperAuth } from '../hooks/useDeveloperAuth';

const TTSTestPage = () => {
  const { isAuthorized, loading: authLoading, currentKey } = useDeveloperAuth();
  const [browserSupport, setBrowserSupport] = useState(null);
  const [voices, setVoices] = useState([]);
  const [testResults, setTestResults] = useState({});

  const testText = `
    Welcome to the Text-to-Speech test page. This is a comprehensive test to ensure that the TTS functionality is working correctly. 
    We will test various aspects including voice loading, speech synthesis, volume control, and playback controls.
    If you can hear this message clearly, then the TTS system is functioning properly.
  `;

  useEffect(() => {
    if (!isAuthorized) return;
    
    // Test browser support
    const supported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    setBrowserSupport(supported);

    if (supported) {
      // Test voice loading
      let attempts = 0;
      const maxAttempts = 10;
      
      const loadVoices = () => {
        attempts++;
        const availableVoices = speechSynthesis.getVoices();
        
        if (availableVoices.length === 0 && attempts < maxAttempts) {
          setTimeout(loadVoices, 100);
          return;
        }
        
        setVoices(availableVoices);
        
        // Test results
        setTestResults({
          voicesLoaded: availableVoices.length > 0,
          voiceCount: availableVoices.length,
          englishVoices: availableVoices.filter(v => v.lang.startsWith('en')).length,
          defaultVoice: availableVoices.find(v => v.default)?.name || 'None'
        });
      };

      loadVoices();
      
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, [isAuthorized]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl text-gray-900 dark:text-white">Validating access...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">Invalid or missing developer key</p>
        </div>
      </div>
    );
  }

  const runBasicTest = () => {
    if (!browserSupport) {
      alert('Speech synthesis not supported');
      return;
    }

    const utterance = new SpeechSynthesisUtterance('This is a basic TTS test. Can you hear this?');
    utterance.volume = 0.8;
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => {
      console.log('Basic TTS test started');
    };

    utterance.onend = () => {
      console.log('Basic TTS test completed');
    };

    utterance.onerror = (event) => {
      console.error('Basic TTS test error:', event.error);
      alert(`TTS Error: ${event.error}`);
    };

    try {
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Failed to start basic TTS test:', error);
      alert(`Failed to start TTS: ${error.message}`);
    }
  };

  const stopAllSpeech = () => {
    speechSynthesis.cancel();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to={`/developer-dashboard?key=${currentKey}`}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Developer Dashboard
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Text-to-Speech Test Page</h1>
          
          {/* Browser Support Status */}
          <div className="mb-8 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
              Browser Support Status
              {browserSupport ? (
                <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 ml-2" />
              )}
            </h2>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-medium text-gray-900 dark:text-white">Speech Synthesis API:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  browserSupport ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                }`}>
                  {browserSupport ? 'Supported' : 'Not Supported'}
                </span>
              </div>
              
              {browserSupport && (
                <>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900 dark:text-white">Total Voices:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{testResults.voiceCount || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900 dark:text-white">English Voices:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{testResults.englishVoices || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900 dark:text-white">Default Voice:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{testResults.defaultVoice}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Available Voices */}
          {voices.length > 0 && (
            <div className="mb-8 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Available Voices ({voices.length})</h2>
              <div className="max-h-40 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {voices.map((voice, index) => (
                    <div key={index} className="text-sm p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="font-medium text-gray-900 dark:text-white">{voice.name}</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {voice.lang} • {voice.localService ? 'Local' : 'Remote'}
                        {voice.default && ' • Default'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Test Controls */}
          <div className="mb-8 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Test Controls</h2>
            <div className="space-x-4">
              <button
                onClick={runBasicTest}
                disabled={!browserSupport}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Run Basic TTS Test
              </button>
              <button
                onClick={stopAllSpeech}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Stop All Speech
              </button>
            </div>
          </div>

          {/* TTS Component Test */}
          {browserSupport && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">TTS Component Test</h2>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <TextToSpeech 
                  text={testText}
                  title="TTS Test Article"
                />
              </div>
            </div>
          )}

          {/* Troubleshooting */}
          <div className="p-4 rounded-lg border border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              Troubleshooting Tips
            </h2>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>• Make sure your browser supports the Web Speech API (Chrome, Edge, Safari, Firefox)</li>
              <li>• Check that your system volume is turned up</li>
              <li>• Try different voices if available</li>
              <li>• Some browsers require user interaction before allowing speech synthesis</li>
              <li>• Check browser console for any error messages</li>
              <li>• Try refreshing the page if voices don't load initially</li>
              <li>• On mobile devices, ensure the browser tab is active</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TTSTestPage;
