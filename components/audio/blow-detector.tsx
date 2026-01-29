'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { useBlowDetector } from '@/hooks/use-blow-detector';

interface BlowDetectorProps {
  onBlow: (intensity: number) => void;
  onBlowEnd: () => void;
}

export function BlowDetector({ onBlow, onBlowEnd }: BlowDetectorProps) {
  const {
    isListening,
    intensity,
    hasPermission,
    error,
    startListening,
    stopListening,
  } = useBlowDetector({
    threshold: 0.15,
    onBlow,
    onBlowEnd,
  });

  useEffect(() => {
    startListening();
    return () => stopListening();
  }, [startListening, stopListening]);

  if (error || hasPermission === false) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg"
      >
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">
          {error || 'Microphone access denied. Use tap to blow instead.'}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-2"
    >
      <motion.div
        className={`relative p-4 rounded-full ${
          isListening ? 'bg-green-100' : 'bg-gray-100'
        }`}
        animate={{
          scale: isListening ? 1 + intensity * 0.3 : 1,
        }}
        transition={{ duration: 0.1 }}
      >
        {isListening ? (
          <Mic className="w-6 h-6 text-green-600" />
        ) : (
          <MicOff className="w-6 h-6 text-gray-400" />
        )}

        {/* Pulse rings when detecting blow */}
        {isListening && intensity > 0.1 && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-green-400"
              animate={{
                scale: [1, 1.5],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-green-400"
              animate={{
                scale: [1, 1.8],
                opacity: [0.3, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: 0.2,
              }}
            />
          </>
        )}
      </motion.div>

      <p className="text-sm text-gray-500">
        {isListening ? 'Blow into your microphone!' : 'Starting microphone...'}
      </p>
    </motion.div>
  );
}
