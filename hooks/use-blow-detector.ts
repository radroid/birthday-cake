'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface BlowDetectorState {
  isListening: boolean;
  intensity: number;
  isBlowing: boolean;
  hasPermission: boolean | null;
  error: string | null;
}

interface BlowDetectorOptions {
  threshold?: number;
  minFreq?: number;
  maxFreq?: number;
  onBlow?: (intensity: number) => void;
  onBlowEnd?: () => void;
}

export function useBlowDetector(options: BlowDetectorOptions = {}) {
  const {
    threshold = 0.15,
    minFreq = 20,
    maxFreq = 500,
    onBlow,
    onBlowEnd,
  } = options;

  const [state, setState] = useState<BlowDetectorState>({
    isListening: false,
    intensity: 0,
    isBlowing: false,
    hasPermission: null,
    error: null,
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isBlowingRef = useRef(false);
  const blowStartTimeRef = useRef<number | null>(null);

  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  }, []);

  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    const sampleRate = audioContextRef.current?.sampleRate || 44100;
    const binSize = sampleRate / (bufferLength * 2);

    const minBin = Math.floor(minFreq / binSize);
    const maxBin = Math.min(Math.ceil(maxFreq / binSize), bufferLength);

    let sum = 0;
    let count = 0;
    for (let i = minBin; i < maxBin; i++) {
      sum += dataArray[i];
      count++;
    }

    const averageIntensity = count > 0 ? sum / count / 255 : 0;
    const isCurrentlyBlowing = averageIntensity > threshold;

    setState(prev => ({
      ...prev,
      intensity: averageIntensity,
      isBlowing: isCurrentlyBlowing,
    }));

    if (isCurrentlyBlowing && !isBlowingRef.current) {
      isBlowingRef.current = true;
      blowStartTimeRef.current = Date.now();
    }

    if (isCurrentlyBlowing && isBlowingRef.current) {
      onBlow?.(averageIntensity);
    }

    if (!isCurrentlyBlowing && isBlowingRef.current) {
      isBlowingRef.current = false;
      blowStartTimeRef.current = null;
      onBlowEnd?.();
    }

    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  }, [threshold, minFreq, maxFreq, onBlow, onBlowEnd]);

  const startListening = useCallback(async () => {
    try {
      cleanup();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.3;

      source.connect(analyser);
      analyserRef.current = analyser;

      setState(prev => ({
        ...prev,
        isListening: true,
        hasPermission: true,
        error: null,
      }));

      animationFrameRef.current = requestAnimationFrame(analyzeAudio);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to access microphone';
      setState(prev => ({
        ...prev,
        isListening: false,
        hasPermission: false,
        error: errorMessage,
      }));
    }
  }, [cleanup, analyzeAudio]);

  const stopListening = useCallback(() => {
    cleanup();
    setState(prev => ({
      ...prev,
      isListening: false,
      intensity: 0,
      isBlowing: false,
    }));
  }, [cleanup]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    ...state,
    startListening,
    stopListening,
  };
}
