import { renderHook, act } from '@testing-library/react';
import { useApiKey } from '../useApiKey';
import { mockLocalStorage } from '../../utils/testUtils';

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage(),
  writable: true,
});

describe('useApiKey', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with null apiKey', () => {
    const { result } = renderHook(() => useApiKey());
    
    expect(result.current.apiKey).toBeNull();
    expect(result.current.hasApiKey).toBe(false);
  });

  it('should load existing key from localStorage', () => {
    localStorage.setItem('openrouter-api-key', 'existing-key');
    
    const { result } = renderHook(() => useApiKey());
    
    expect(result.current.apiKey).toBe('existing-key');
    expect(result.current.hasApiKey).toBe(true);
  });

  it('should set and persist new API key', () => {
    const { result } = renderHook(() => useApiKey());
    
    act(() => {
      result.current.setApiKey('new-api-key');
    });
    
    expect(result.current.apiKey).toBe('new-api-key');
    expect(result.current.hasApiKey).toBe(true);
    expect(localStorage.getItem('openrouter-api-key')).toBe('new-api-key');
  });

  it('should trim whitespace when setting key', () => {
    const { result } = renderHook(() => useApiKey());
    
    act(() => {
      result.current.setApiKey('  spaced-key  ');
    });
    
    expect(result.current.apiKey).toBe('spaced-key');
    expect(localStorage.getItem('openrouter-api-key')).toBe('spaced-key');
  });

  it('should not set empty or whitespace-only keys', () => {
    const { result } = renderHook(() => useApiKey());
    
    act(() => {
      result.current.setApiKey('   ');
    });
    
    expect(result.current.apiKey).toBeNull();
    expect(result.current.hasApiKey).toBe(false);
    expect(localStorage.getItem('openrouter-api-key')).toBeNull();
  });

  it('should clear API key', () => {
    localStorage.setItem('openrouter-api-key', 'test-key');
    const { result } = renderHook(() => useApiKey());
    
    act(() => {
      result.current.clearApiKey();
    });
    
    expect(result.current.apiKey).toBeNull();
    expect(result.current.hasApiKey).toBe(false);
    expect(localStorage.getItem('openrouter-api-key')).toBeNull();
  });
});