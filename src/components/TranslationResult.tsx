import React from 'react';

interface TranslationResultProps {
  result: string | null;
  isLoading: boolean;
  error: string | null;
}

export const TranslationResult: React.FC<TranslationResultProps> = ({
  result,
  isLoading,
  error,
}) => {
  if (!result && !isLoading && !error) {
    return null;
  }

  return (
    <div className="translation-result">
      <div className="result-header">
        <h3>Translation Result</h3>
      </div>

      <div className="result-content">
        {isLoading && (
          <div className="loading-state">
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
            <p className="loading-text">
              Analyzing ASL frames and generating translation...
            </p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <div className="error-icon">❌</div>
            <div className="error-content">
              <h4>Translation Failed</h4>
              <p className="error-message">{error}</p>
            </div>
          </div>
        )}

        {result && !isLoading && (
          <div className="success-state">
            <div className="success-icon">✅</div>
            <div className="translation-text">
              <h4>ASL Translation:</h4>
              <blockquote className="translation-content">
                {result}
              </blockquote>
            </div>
          </div>
        )}
      </div>

      {(result || error) && !isLoading && (
        <div className="result-footer">
          <p className="disclaimer">
            AI-generated translation. Results may vary and should be verified with ASL experts.
          </p>
        </div>
      )}
    </div>
  );
};