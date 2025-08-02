# PLAN.md - Implementation Roadmap: PREV → NEXT

## 🎯 Overview
Transform the basic Create React App into an ASL-to-English translator using Gemini 2.5 Flash via OpenRouter.

---

## 📋 Implementation Phases

### Phase 1: Project Setup & Dependencies
**Goal**: Set up foundation and install required packages

#### Tasks:
1. **Install Dependencies**
   ```bash
   npm install axios react-webcam
   npm install --save-dev @types/react-webcam
   ```

2. **Project Structure Changes**
   ```
   src/
   ├── components/
   │   ├── ApiKeyModal.tsx
   │   ├── CameraView.tsx
   │   ├── RecordingControls.tsx
   │   └── TranslationResult.tsx
   ├── hooks/
   │   ├── useApiKey.ts
   │   ├── useCamera.ts
   │   └── useFrameCapture.ts
   ├── services/
   │   └── openRouterApi.ts
   ├── types/
   │   └── index.ts
   └── utils/
       └── frameUtils.ts
   ```

3. **Testing Setup**
   - Ensure Jest/RTL are configured for component testing
   - Add test utilities for mocking camera API

---

### Phase 2: Core Infrastructure
**Goal**: Build foundational components and hooks

#### 2.1 API Key Management (`useApiKey.ts`)
```typescript
interface ApiKeyHook {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  hasApiKey: boolean;
}
```
- Store/retrieve from localStorage
- Validate key format
- **Tests**: localStorage persistence, validation logic

#### 2.2 API Key Modal (`ApiKeyModal.tsx`)
- Modal overlay for first-time setup
- Input field with validation
- Save/cancel functionality
- **Tests**: form submission, validation states, modal behavior

#### 2.3 OpenRouter Service (`openRouterApi.ts`)
```typescript
interface TranslationRequest {
  frames: string[]; // base64 data URLs
  apiKey: string;
}

interface TranslationResponse {
  translation: string;
  success: boolean;
  error?: string;
}
```
- API call to OpenRouter Gemini 2.5 Flash
- Handle multiple images in single request
- Error handling for invalid keys/network issues
- **Tests**: API call mocking, error scenarios, response parsing

---

### Phase 3: Camera & Video Capture
**Goal**: Implement video capture and frame sampling

#### 3.1 Camera Hook (`useCamera.ts`)
```typescript
interface CameraHook {
  videoRef: RefObject<HTMLVideoElement>;
  isStreaming: boolean;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  error: string | null;
}
```
- getUserMedia integration
- Camera permissions handling
- Stream management
- **Tests**: permission scenarios, stream lifecycle

#### 3.2 Frame Capture Hook (`useFrameCapture.ts`)
```typescript
interface FrameCaptureHook {
  frames: string[];
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  clearFrames: () => void;
  recordingTime: number;
}
```
- Canvas-based frame extraction at 3fps
- Resize frames to 256x256
- Convert to base64 data URLs
- Auto-stop at 30 seconds (~90 frames)
- **Tests**: frame timing, canvas operations, memory management

#### 3.3 Frame Utilities (`frameUtils.ts`)
```typescript
export const captureFrameFromVideo = (
  video: HTMLVideoElement,
  targetSize: number = 256
): string => { /* canvas operations */ }

export const resizeImageToSquare = (
  canvas: HTMLCanvasElement,
  size: number
): void => { /* resize logic */ }
```
- Canvas drawing and resizing logic
- Image format conversion
- **Tests**: image dimensions, quality preservation

---

### Phase 4: UI Components
**Goal**: Build user interface components

#### 4.1 Camera View (`CameraView.tsx`)
- Video element (640x480 display)
- Camera status indicators
- Permission request UI
- **Tests**: video element rendering, status updates

#### 4.2 Recording Controls (`RecordingControls.tsx`)
```typescript
interface RecordingControlsProps {
  onStartRecording: () => void;
  onStopRecording: () => void;
  onTranslate: () => void;
  isRecording: boolean;
  canTranslate: boolean;
  recordingTime: number;
}
```
- Start/Stop recording buttons
- Timer display
- Translate button (enabled after recording)
- **Tests**: button states, timer accuracy, interaction flows

#### 4.3 Translation Result (`TranslationResult.tsx`)
```typescript
interface TranslationResultProps {
  result: string | null;
  isLoading: boolean;
  error: string | null;
}
```
- Display translation text
- Loading states
- Error messages
- **Tests**: loading states, error display, text rendering

---

### Phase 5: Main App Integration
**Goal**: Wire everything together in App.tsx

#### 5.1 App State Management
```typescript
interface AppState {
  apiKey: string | null;
  showApiKeyModal: boolean;
  frames: string[];
  translation: string | null;
  isTranslating: boolean;
  translationError: string | null;
}
```

#### 5.2 App Component Structure
```jsx
function App() {
  // State management
  // Hook integrations
  return (
    <div className="App">
      {showApiKeyModal && <ApiKeyModal />}
      <CameraView />
      <RecordingControls />
      <TranslationResult />
    </div>
  );
}
```

#### 5.3 Integration Tests
- End-to-end component interaction
- API key flow
- Recording → Translation workflow

---

### Phase 6: Styling & Polish
**Goal**: Create minimal, functional UI

#### 6.1 Basic Styling (`App.css`)
- Clean, modern layout
- Responsive design
- Button states and hover effects
- Modal styling

#### 6.2 Error Handling
- Camera permission denied
- API key validation
- Network failures
- Rate limiting

---

## 🧪 Testing Strategy

### Unit Tests
1. **Hooks Testing**
   - `useApiKey`: localStorage operations
   - `useCamera`: stream management
   - `useFrameCapture`: timing and canvas operations

2. **Component Testing**
   - Modal behavior and form submission
   - Button states and interactions
   - Error state rendering

3. **Service Testing**
   - API call mocking
   - Response parsing
   - Error handling

### Integration Tests
1. **Camera → Recording → Translation** flow
2. **API key management** across app lifecycle
3. **Error recovery** scenarios

### Test Data
- Mock video streams
- Sample base64 frames
- Mock API responses
- Error scenarios

---

## 🔧 Technical Specifications

### OpenRouter API Integration
```typescript
// Request format for Gemini 2.5 Flash
const request = {
  model: "google/gemini-2.5-flash",
  messages: [
    {
      role: "system",
      content: "You are an expert ASL interpreter..."
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "These are frames from a recorded ASL gesture. Please translate the motion as a whole into natural English."
        },
        ...frames.map(frame => ({
          type: "image_url",
          image_url: { url: frame } // base64 data URL
        }))
      ]
    }
  ]
};
```

### Frame Capture Specifications
- **Resolution**: 256x256 pixels
- **Format**: JPEG base64 data URLs
- **Frequency**: 3fps (333ms intervals)
- **Duration**: 30 seconds max
- **Total Frames**: ~90 frames maximum

### Browser Compatibility
- Modern browsers with getUserMedia support
- Canvas API for frame capture
- localStorage for API key persistence

---

## 📦 Dependencies to Add

```json
{
  "dependencies": {
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@types/jest": "^29.5.0"
  }
}
```

Note: react-webcam removed from dependencies as we'll use native getUserMedia for more control.

---

## 🚀 Implementation Order

1. ✅ **Phase 1**: Dependencies & structure (axios installed, basic structure created)
2. 🔄 **Phase 2**: Core infrastructure (useApiKey ✅, openRouterApi ✅, useCamera needs check, useFrameCapture missing)
3. ❌ **Phase 3**: Camera & frame capture (useFrameCapture.ts missing, frameUtils.ts exists but unused)
4. ❌ **Phase 4**: UI components (components/ folder empty - all missing)
5. ❌ **Phase 5**: App integration (App.tsx still default CRA template)
6. ❌ **Phase 6**: Styling & polish (not started)

Each phase includes comprehensive testing to ensure reliability before moving to the next phase.