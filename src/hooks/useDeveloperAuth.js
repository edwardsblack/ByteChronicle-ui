import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import developerService from '../services/developerService';

export const useDeveloperAuth = () => {
  const [searchParams] = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentKey, setCurrentKey] = useState(null);

  const providedKey = searchParams.get('key');

  useEffect(() => {
    const validateAccess = async () => {
      if (!providedKey) {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        const isValid = await developerService.validateKey(providedKey);
        setIsAuthorized(isValid);
        
        if (isValid) {
          setCurrentKey(providedKey);
        }
      } catch (error) {
        console.error('Error validating developer key:', error);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    validateAccess();
  }, [providedKey]);

  return {
    isAuthorized,
    loading,
    currentKey,
    providedKey
  };
};
