import { renderHook, act } from '@testing-library/react';
import { useCamera } from '../useCamera';
import { mockGetUserMedia, createMockVideo } from '../../utils/testUtils';

// Mock navigator.mediaDevices
const mockGetUserMediaFn = jest.fn();
Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: mockGetUserMediaFn,
  },
  writable: true,
});

describe('useCamera', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCamera());

    expect(result.current.isStreaming).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.videoRef.current).toBeNull();
  });

  it('should start camera successfully', async () => {
    const mockStream = {
      getTracks: () => [{ stop: jest.fn() }],
    };
    
    mockGetUserMediaFn.mockResolvedValueOnce(mockStream);

    const { result } = renderHook(() => useCamera());

    // Mock video element
    const mockVideoElement = createMockVideo();
    Object.defineProperty(result.current.videoRef, 'current', {
      value: mockVideoElement,
      writable: true,
    });

    await act(async () => {
      await result.current.startCamera();
    });

    expect(mockGetUserMediaFn).toHaveBeenCalledWith({
      video: {
        facingMode: 'user',
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
      audio: false,
    });

    expect(result.current.isStreaming).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should handle camera permission denied', async () => {
    const permissionError = new Error('Permission denied');
    permissionError.name = 'NotAllowedError';
    
    mockGetUserMediaFn.mockRejectedValueOnce(permissionError);

    const { result } = renderHook(() => useCamera());

    await act(async () => {
      await result.current.startCamera();
    });

    expect(result.current.isStreaming).toBe(false);
    expect(result.current.error).toBe('Camera access denied. Please allow camera permissions and try again.');
  });

  it('should handle no camera found', async () => {
    const notFoundError = new Error('No camera found');
    notFoundError.name = 'NotFoundError';
    
    mockGetUserMediaFn.mockRejectedValueOnce(notFoundError);

    const { result } = renderHook(() => useCamera());

    await act(async () => {
      await result.current.startCamera();
    });

    expect(result.current.isStreaming).toBe(false);
    expect(result.current.error).toBe('No front-facing camera found. Please ensure you have a working camera.');
  });

  it('should handle camera already in use', async () => {
    const inUseError = new Error('Camera in use');
    inUseError.name = 'NotReadableError';
    
    mockGetUserMediaFn.mockRejectedValueOnce(inUseError);

    const { result } = renderHook(() => useCamera());

    await act(async () => {
      await result.current.startCamera();
    });

    expect(result.current.isStreaming).toBe(false);
    expect(result.current.error).toBe('Camera is already in use by another application.');
  });

  it('should stop camera and clean up', () => {
    const mockTrack = { stop: jest.fn() };
    const mockStream = {
      getTracks: () => [mockTrack],
    };

    const { result } = renderHook(() => useCamera());

    // Mock video element and stream
    const mockVideoElement = createMockVideo();
    Object.defineProperty(result.current.videoRef, 'current', {
      value: mockVideoElement,
      writable: true,
    });

    // Simulate active stream
    act(() => {
      (result.current as any).streamRef = { current: mockStream };
      (result.current as any).setIsStreaming(true);
    });

    act(() => {
      result.current.stopCamera();
    });

    expect(mockTrack.stop).toHaveBeenCalled();
    expect(result.current.isStreaming).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle missing getUserMedia support', async () => {
    // Mock unsupported browser
    Object.defineProperty(navigator, 'mediaDevices', {
      value: undefined,
      writable: true,
    });

    const { result } = renderHook(() => useCamera());

    await act(async () => {
      await result.current.startCamera();
    });

    expect(result.current.isStreaming).toBe(false);
    expect(result.current.error).toBe('Camera access is not supported in this browser');
  });
});