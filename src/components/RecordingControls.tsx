import React from 'react';

interface RecordingControlsProps {
  onStartRecording: () => void;
  onStopRecording: () => void;
  onTranslate: () => void;
  onClearFrames: () => void;
  isRecording: boolean;
  canTranslate: boolean;
  recordingTime: number;
  frameCount: number;
  isTranslating: boolean;
  isStreaming: boolean;
}

export const RecordingControls: React.FC<RecordingControlsProps> = ({
  onStartRecording,
  onStopRecording,
  onTranslate,
  onClearFrames,
  isRecording,
  canTranslate,
  recordingTime,
  frameCount,
  isTranslating,
  isStreaming,
}) => {
  const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const ms = Math.floor((milliseconds % 1000) / 10);
    return `${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}s`;
  };

  const getRecordingProgress = (): number => {
    const maxTime = 30000; // 30 seconds
    return Math.min((recordingTime / maxTime) * 100, 100);
  };

  return (
    <div className="recording-controls">
      <div className="controls-section">
        <div className="recording-info">
          {isRecording && (
            <div className="recording-status">
              <div className="recording-indicator">
                <div className="recording-dot"></div>
                <span>RECORDING</span>
              </div>
              <div className="recording-timer">
                {formatTime(recordingTime)}
              </div>
            </div>
          )}

          {!isRecording && frameCount > 0 && (
            <div className="frames-info">
              <span className="frames-count">
                {frameCount} frames captured
              </span>
            </div>
          )}
        </div>

        {isRecording && (
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${getRecordingProgress()}%` }}
              ></div>
            </div>
            <div className="progress-text">
              {Math.floor(recordingTime / 1000)}/30s
            </div>
          </div>
        )}

        <div className="control-buttons">
          {!isRecording ? (
            <button
              onClick={onStartRecording}
              disabled={!isStreaming}
              className="btn-record"
              title={!isStreaming ? 'Start camera first' : 'Start recording ASL gestures'}
            >
              <span className="record-icon">⏺</span>
              Start Recording
            </button>
          ) : (
            <button
              onClick={onStopRecording}
              className="btn-stop"
            >
              <span className="stop-icon">⏹</span>
              Stop Recording
            </button>
          )}

          <button
            onClick={onTranslate}
            disabled={!canTranslate || isTranslating}
            className="btn-translate"
            title={!canTranslate ? 'Record some frames first' : 'Translate captured frames'}
          >
            {isTranslating ? (
              <>
                <span className="loading-icon">⏳</span>
                Translating...
              </>
            ) : (
              <>
                <span className="translate-icon">🔤</span>
                Translate
              </>
            )}
          </button>

          {frameCount > 0 && !isRecording && (
            <button
              onClick={onClearFrames}
              disabled={isTranslating}
              className="btn-clear"
              title="Clear captured frames"
            >
              <span className="clear-icon">🗑</span>
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="instructions">
        <div className="instruction-step">
          <span className="step-number">1</span>
          <span>Start your camera and position yourself in view</span>
        </div>
        <div className="instruction-step">
          <span className="step-number">2</span>
          <span>Click "Start Recording" and perform your ASL gesture</span>
        </div>
        <div className="instruction-step">
          <span className="step-number">3</span>
          <span>Stop recording and click "Translate" to get the result</span>
        </div>
      </div>
    </div>
  );
};