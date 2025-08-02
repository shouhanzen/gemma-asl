import React from 'react';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isStreaming: boolean;
  error: string | null;
  onStartCamera: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({
  videoRef,
  isStreaming,
  error,
  onStartCamera,
}) => {
  return (
    <div className="camera-view">
      <div className="camera-container">
        {!isStreaming && !error && (
          <div className="camera-placeholder">
            <div className="camera-icon">📹</div>
            <p>Camera not started</p>
            <button
              onClick={onStartCamera}
              className="btn-primary"
            >
              Start Camera
            </button>
          </div>
        )}

        {error && (
          <div className="camera-error">
            <div className="error-icon">⚠️</div>
            <p className="error-message">{error}</p>
            <button
              onClick={onStartCamera}
              className="btn-secondary"
            >
              Try Again
            </button>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`camera-video ${isStreaming ? 'streaming' : 'hidden'}`}
          width="640"
          height="480"
        />

        {isStreaming && (
          <div className="camera-status">
            <div className="status-indicator">
              <div className="status-dot"></div>
              <span>Camera Active</span>
            </div>
          </div>
        )}
      </div>

      <div className="camera-info">
        <p className="info-text">
          Position yourself in front of the camera and perform ASL gestures.
          The recording will capture frames at 3fps for up to 30 seconds.
        </p>
      </div>
    </div>
  );
};