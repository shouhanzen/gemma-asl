import React, { useState } from 'react';

interface ApiKeyModalProps {
  onApiKeySubmit: (apiKey: string) => void;
  onClose?: () => void;
  isOpen: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  onApiKeySubmit,
  onClose,
  isOpen,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedKey = apiKey.trim();
    if (!trimmedKey) {
      setError('Please enter an API key');
      return;
    }

    if (trimmedKey.length < 10) {
      setError('API key appears to be too short');
      return;
    }

    setError('');
    onApiKeySubmit(trimmedKey);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>OpenRouter API Key Required</h2>
          {onClose && (
            <button
              type="button"
              className="modal-close"
              onClick={handleClose}
              aria-label="Close"
            >
              ×
            </button>
          )}
        </div>
        
        <div className="modal-body">
          <p>
            To use the ASL translator, you need an OpenRouter API key with access to Gemini 2.5 Flash.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="apiKey">API Key:</label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your OpenRouter API key"
                className={error ? 'error' : ''}
                autoFocus
              />
              {error && <div className="error-message">{error}</div>}
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Save API Key
              </button>
              {onClose && (
                <button type="button" className="btn-secondary" onClick={handleClose}>
                  Cancel
                </button>
              )}
            </div>
          </form>
          
          <div className="help-text">
            <p>
              Don't have an API key? Get one at{' '}
              <a
                href="https://openrouter.ai"
                target="_blank"
                rel="noopener noreferrer"
              >
                OpenRouter.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};