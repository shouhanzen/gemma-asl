export interface ApiKeyHook {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  hasApiKey: boolean;
}

export interface CameraHook {
  videoRef: React.RefObject<HTMLVideoElement>;
  isStreaming: boolean;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  error: string | null;
}

export interface FrameCaptureHook {
  frames: string[];
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  clearFrames: () => void;
  recordingTime: number;
}

export interface TranslationRequest {
  frames: string[];
  apiKey: string;
}

export interface TranslationResponse {
  translation: string;
  success: boolean;
  error?: string;
}

export interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
}

export interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isStreaming: boolean;
  error: string | null;
  onStartCamera: () => void;
}

export interface RecordingControlsProps {
  onStartRecording: () => void;
  onStopRecording: () => void;
  onTranslate: () => void;
  isRecording: boolean;
  canTranslate: boolean;
  recordingTime: number;
  isTranslating: boolean;
}

export interface TranslationResultProps {
  result: string | null;
  isLoading: boolean;
  error: string | null;
}