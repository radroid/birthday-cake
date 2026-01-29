'use client';

import { motion } from 'framer-motion';

interface FlameProps {
  isLit: boolean;
  intensity?: number;
  onExtinguish?: () => void;
}

export function Flame({ isLit, intensity = 0 }: FlameProps) {
  if (!isLit) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute -top-2 left-1/2 -translate-x-1/2"
      >
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0.6, 0.3, 0],
            y: -20,
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-3 h-6 rounded-full bg-gradient-to-t from-gray-400/50 to-transparent blur-sm"
        />
      </motion.div>
    );
  }

  const flickerIntensity = Math.max(0, 1 - intensity * 3);
  const scaleModifier = Math.max(0.3, 1 - intensity * 2);

  return (
    <motion.div
      className="absolute -top-6 left-1/2 -translate-x-1/2"
      animate={{
        x: intensity > 0.1 ? [0, -2, 2, -1, 1, 0] : 0,
        scale: scaleModifier,
      }}
      transition={{
        x: { duration: 0.2, repeat: Infinity },
        scale: { duration: 0.1 },
      }}
    >
      <motion.div
        className="relative w-4 h-8"
        animate={{
          scaleY: [1, 1.1, 0.95, 1.05, 1],
          scaleX: [1, 0.9, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Outer flame (yellow/orange) */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(ellipse at bottom, #fbbf24 0%, #f97316 40%, #ef4444 70%, transparent 100%)',
            filter: 'blur(1px)',
            opacity: flickerIntensity,
          }}
          animate={{
            opacity: [flickerIntensity, flickerIntensity * 0.8, flickerIntensity],
          }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
          }}
        />

        {/* Inner flame (white/blue core) */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-4 rounded-full"
          style={{
            background: 'radial-gradient(ellipse at bottom, #fff 0%, #60a5fa 50%, transparent 100%)',
            opacity: flickerIntensity,
          }}
          animate={{
            scaleY: [1, 1.2, 0.9, 1],
            opacity: [flickerIntensity, flickerIntensity * 0.9, flickerIntensity],
          }}
          transition={{
            duration: 0.15,
            repeat: Infinity,
          }}
        />

        {/* Glow effect */}
        <motion.div
          className="absolute -inset-2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)',
            opacity: flickerIntensity * 0.5,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [flickerIntensity * 0.5, flickerIntensity * 0.3, flickerIntensity * 0.5],
          }}
          transition={{
            duration: 0.4,
            repeat: Infinity,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
