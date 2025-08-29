import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, AlertCircle } from 'lucide-react';

const TextToSpeech = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(0.8);
  
  const utteranceRef = useRef(null);

  // Initialize voices
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setError('Text-to-speech not supported in this browser');
      return;
    }

    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      if (availableVoices.length === 0) {
        // Chrome needs time to load voices
        setTimeout(loadVoices, 100);
        return;
      }
      
      setVoices(availableVoices);
      
      // Select best English voice
      const englishVoice = availableVoices.find(v => 
        v.lang.startsWith('en') && v.localService
      ) || availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
      
      setSelectedVoice(englishVoice);
    };

    // Chrome requires voices to be loaded after page load
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.addEventListener('voiceschanged', loadVoices);
    } else {
      loadVoices();
    }

    return () => {
      speechSynthesis.cancel();
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const cleanText = (text) => {
    return text
      .replace(/[#*`]/g, '')
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const speak = () => {
    if (!selectedVoice || !text) {
      setError('No voice or text available');
      return;
    }

    if (isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Chrome requires complete cancellation before new speech
    speechSynthesis.cancel();
    
    // Chrome needs a longer delay to properly cancel
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(cleanText(text));
      utterance.voice = selectedVoice;
      utterance.rate = rate;
      utterance.volume = volume;
      utterance.pitch = 1;

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        setError(null);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        // Chrome-specific error handling
        if (event.error === 'not-allowed') {
          setError('Speech blocked - please interact with the page first');
        } else if (event.error === 'network') {
          setError('Network error - check your connection');
        } else {
          setError(`Speech error: ${event.error}`);
        }
        setIsPlaying(false);
        setIsPaused(false);
      };

      utterance.onpause = () => {
        setIsPaused(true);
        setIsPlaying(false);
      };

      utterance.onresume = () => {
        setIsPaused(false);
        setIsPlaying(true);
      };

      utteranceRef.current = utterance;
      
      try {
        speechSynthesis.speak(utterance);
        
        // Chrome workaround: ensure speech starts
        setTimeout(() => {
          if (!speechSynthesis.speaking && !speechSynthesis.pending) {
            setError('Speech failed to start - try again');
            setIsPlaying(false);
          }
        }, 500);
      } catch (error) {
        console.error('Failed to speak:', error);
        setError('Failed to start speech synthesis');
        setIsPlaying(false);
        setIsPaused(false);
      }
    }, 200);
  };

  const pause = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  if (!text || voices.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Listen to Article
          </h3>
        </div>
        
        {error && (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center space-x-4 mb-4">
        <button
          onClick={isPlaying ? pause : speak}
          className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>

        <button
          onClick={stop}
          disabled={!isPlaying && !isPaused}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          <Square className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Speed: {rate}x</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Volume: {Math.round(volume * 100)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Voice</label>
          <select
            value={selectedVoice?.name || ''}
            onChange={(e) => setSelectedVoice(voices.find(v => v.name === e.target.value))}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-700"
          >
            {voices.filter(v => v.lang.startsWith('en')).map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;
