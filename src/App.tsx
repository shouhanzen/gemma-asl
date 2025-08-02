import React, { useState } from 'react';
import './App.css';

import { useApiKey } from './hooks/useApiKey';
import { useCamera } from './hooks/useCamera';
import { useFrameCapture } from './hooks/useFrameCapture';
import { translateASLFrames } from './services/openRouterApi';

import { ApiKeyModal } from './components/ApiKeyModal';
import { CameraView } from './components/CameraView';
import { RecordingControls } from './components/RecordingControls';
import { TranslationResult } from './components/TranslationResult';

function App() {
  const { apiKey, setApiKey, hasApiKey } = useApiKey();
  const { videoRef, isStreaming, startCamera, stopCamera, error: cameraError } = useCamera();
  const { frames, isRecording, startRecording, stopRecording, clearFrames, recordingTime } = useFrameCapture(videoRef);
  
  const [showApiKeyModal, setShowApiKeyModal] = useState(!hasApiKey);
  const [translation, setTranslation] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  const handleApiKeySubmit = (newApiKey: string) => {
    setApiKey(newApiKey);
    setShowApiKeyModal(false);
  };

  const handleTranslate = async () => {
    if (!apiKey || frames.length === 0) return;

    setIsTranslating(true);
    setTranslationError(null);
    setTranslation(null);

    try {
      const result = await translateASLFrames({
        frames,
        apiKey,
      });

      if (result.success) {
        setTranslation(result.translation);
      } else {
        setTranslationError(result.error || 'Translation failed');
      }
    } catch (error) {
      setTranslationError('Unexpected error during translation');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleClearFrames = () => {
    clearFrames();
    setTranslation(null);
    setTranslationError(null);
  };

  const canTranslate = frames.length > 0 && !isRecording && hasApiKey;

  return (
    <div className="App">
      <header className="app-header">
        <h1>ASL Translator</h1>
        <p>Real-time American Sign Language to English translation</p>
      </header>

      <main className="app-main">
        {showApiKeyModal && (
          <ApiKeyModal
            isOpen={showApiKeyModal}
            onApiKeySubmit={handleApiKeySubmit}
            onClose={() => setShowApiKeyModal(false)}
          />
        )}

        {!hasApiKey && !showApiKeyModal && (
          <div className="api-key-warning">
            <p>⚠️ No API key configured.</p>
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="btn-primary"
            >
              Add API Key
            </button>
          </div>
        )}

        <div className="main-content">
          <div className="camera-section">
            <CameraView
              videoRef={videoRef}
              isStreaming={isStreaming}
              error={cameraError}
              onStartCamera={startCamera}
            />
          </div>

          <div className="controls-section">
            <RecordingControls
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              onTranslate={handleTranslate}
              onClearFrames={handleClearFrames}
              isRecording={isRecording}
              canTranslate={canTranslate}
              recordingTime={recordingTime}
              frameCount={frames.length}
              isTranslating={isTranslating}
              isStreaming={isStreaming}
            />
          </div>

          <div className="result-section">
            <TranslationResult
              result={translation}
              isLoading={isTranslating}
              error={translationError}
            />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Powered by{' '}
          <a
            href="https://openrouter.ai"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenRouter
          </a>{' '}
          and Google Gemini 2.5 Flash
        </p>
        {hasApiKey && (
          <button
            onClick={() => setShowApiKeyModal(true)}
            className="btn-settings"
          >
            ⚙️ Settings
          </button>
        )}
      </footer>
    </div>
  );
}

export default App;
