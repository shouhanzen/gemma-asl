import { useState, useEffect } from 'react';
import { ApiKeyHook } from '../types';

const API_KEY_STORAGE_KEY = 'openrouter-api-key';

export const useApiKey = (): ApiKeyHook => {
  const [apiKey, setApiKeyState] = useState<string | null>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedKey) {
      setApiKeyState(savedKey);
    }
  }, []);

  const setApiKey = (key: string) => {
    const trimmedKey = key.trim();
    if (trimmedKey) {
      localStorage.setItem(API_KEY_STORAGE_KEY, trimmedKey);
      setApiKeyState(trimmedKey);
    }
  };

  const clearApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKeyState(null);
  };

  const hasApiKey = Boolean(apiKey && apiKey.trim().length > 0);

  return {
    apiKey,
    setApiKey,
    clearApiKey,
    hasApiKey,
  };
};