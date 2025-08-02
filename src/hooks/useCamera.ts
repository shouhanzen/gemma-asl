import { useState, useRef, useCallback } from 'react';
import { CameraHook } from '../types';

export const useCamera = (): CameraHook => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in this browser');
      }

      // Request camera access with front-facing preference
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user', // Front-facing camera
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;

      // Attach stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        await new Promise<void>((resolve, reject) => {
          if (!videoRef.current) return reject(new Error('Video element not found'));
          
          const handleLoadedMetadata = () => {
            videoRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
            resolve();
          };
          
          const handleError = () => {
            videoRef.current?.removeEventListener('error', handleError);
            reject(new Error('Failed to load video stream'));
          };

          videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
          videoRef.current.addEventListener('error', handleError);
        });

        setIsStreaming(true);
      }
    } catch (err: any) {
      let errorMessage = 'Failed to access camera';

      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera access denied. Please allow camera permissions and try again.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No front-facing camera found. Please ensure you have a working camera.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Camera does not support the required settings.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setIsStreaming(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      // Stop all tracks
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }

    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsStreaming(false);
    setError(null);
  }, []);

  return {
    videoRef,
    isStreaming,
    startCamera,
    stopCamera,
    error,
  };
};