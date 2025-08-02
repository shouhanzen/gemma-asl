import { useState, useCallback, useRef } from 'react';
import { FrameCaptureHook } from '../types';
import { captureFrameFromVideo } from '../utils/frameUtils';

const FRAME_CAPTURE_INTERVAL = 333; // ~3fps (1000ms / 3)
const MAX_RECORDING_TIME = 30000; // 30 seconds
const TARGET_FRAME_SIZE = 256;

export const useFrameCapture = (videoRef: React.RefObject<HTMLVideoElement | null>): FrameCaptureHook => {
  const [frames, setFrames] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const captureFrame = useCallback(() => {
    if (!videoRef.current) return;

    try {
      const frameDataUrl = captureFrameFromVideo(videoRef.current, TARGET_FRAME_SIZE);
      setFrames(prev => [...prev, frameDataUrl]);
    } catch (error) {
      console.error('Failed to capture frame:', error);
    }
  }, [videoRef]);

  const updateTimer = useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current;
    setRecordingTime(elapsed);
    
    if (elapsed >= MAX_RECORDING_TIME) {
      stopRecording();
    }
  }, []);

  const startRecording = useCallback(() => {
    if (!videoRef.current || isRecording) return;

    setFrames([]);
    setRecordingTime(0);
    setIsRecording(true);
    startTimeRef.current = Date.now();

    // Start capturing frames at specified interval
    intervalRef.current = setInterval(captureFrame, FRAME_CAPTURE_INTERVAL);
    
    // Start timer updates every 100ms for smooth display
    timerRef.current = setInterval(updateTimer, 100);

    // Auto-stop after max recording time
    setTimeout(() => {
      if (intervalRef.current) {
        stopRecording();
      }
    }, MAX_RECORDING_TIME);
  }, [videoRef, isRecording, captureFrame, updateTimer]);

  const stopRecording = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRecording(false);
  }, []);

  const clearFrames = useCallback(() => {
    setFrames([]);
    setRecordingTime(0);
  }, []);

  return {
    frames,
    isRecording,
    startRecording,
    stopRecording,
    clearFrames,
    recordingTime,
  };
};