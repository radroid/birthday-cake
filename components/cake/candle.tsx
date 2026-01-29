'use client';

import { motion } from 'framer-motion';
import { Flame } from './flame';

interface CandleProps {
  isLit: boolean;
  color?: string;
  intensity?: number;
  delay?: number;
}

const candleColors = [
  'bg-pink-400',
  'bg-blue-400',
  'bg-yellow-400',
  'bg-green-400',
  'bg-purple-400',
  'bg-red-400',
  'bg-orange-400',
  'bg-cyan-400',
  'bg-lime-400',
  'bg-rose-400',
];

export function Candle({ isLit, color, intensity = 0, delay = 0 }: CandleProps) {
  const candleColor = color || candleColors[Math.floor(Math.random() * candleColors.length)];

  return (
    <motion.div
      className="relative flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.3 }}
    >
      {/* Flame */}
      <Flame isLit={isLit} intensity={intensity} />

      {/* Wick */}
      <div className="w-0.5 h-2 bg-gray-800 rounded-t-full" />

      {/* Candle body */}
      <motion.div
        className={`w-3 h-10 ${candleColor} rounded-sm shadow-md relative overflow-hidden`}
        animate={{
          boxShadow: isLit
            ? '0 0 10px rgba(251, 191, 36, 0.5)'
            : '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Wax drip effect */}
        <div className="absolute top-0 left-0 w-1 h-3 bg-white/30 rounded-b-full" />
        <div className="absolute top-1 right-0.5 w-0.5 h-2 bg-white/20 rounded-b-full" />
      </motion.div>
    </motion.div>
  );
}

export { candleColors };
