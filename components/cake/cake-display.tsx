'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Candle, candleColors } from './candle';
import { BlowDetector } from '../audio/blow-detector';
import { Mic, Hand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CakeData } from '@/lib/cake-encoding';

interface CakeDisplayProps {
  data: CakeData;
}

const cakeStyles = {
  chocolate: {
    base: 'bg-amber-900',
    frosting: 'bg-amber-700',
    accent: 'bg-amber-600',
    drip: 'bg-amber-800',
  },
  vanilla: {
    base: 'bg-amber-100',
    frosting: 'bg-yellow-50',
    accent: 'bg-pink-200',
    drip: 'bg-pink-100',
  },
  strawberry: {
    base: 'bg-pink-300',
    frosting: 'bg-pink-200',
    accent: 'bg-pink-400',
    drip: 'bg-pink-100',
  },
  rainbow: {
    base: 'bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400',
    frosting: 'bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200',
    accent: 'bg-white',
    drip: 'bg-gradient-to-b from-pink-200 to-purple-200',
  },
};

export function CakeDisplay({ data }: CakeDisplayProps) {
  const [litCandles, setLitCandles] = useState<boolean[]>(
    Array(data.candles).fill(true)
  );
  const [blowIntensity, setBlowIntensity] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [candleColorIndices] = useState(() =>
    Array(data.candles)
      .fill(0)
      .map((_, i) => i % candleColors.length)
  );
  const [isBlowDetectorActive, setIsBlowDetectorActive] = useState(false);

  const style = cakeStyles[data.style];
  const allBlownOut = litCandles.every((lit) => !lit);

  useEffect(() => {
    if (allBlownOut && !showCelebration) {
      setShowCelebration(true);
    }
  }, [allBlownOut, showCelebration]);

  const blowOutCandle = useCallback(() => {
    setLitCandles((prev) => {
      const litIndices = prev
        .map((lit, i) => (lit ? i : -1))
        .filter((i) => i !== -1);
      if (litIndices.length === 0) return prev;

      const randomIndex = litIndices[Math.floor(Math.random() * litIndices.length)];
      const newState = [...prev];
      newState[randomIndex] = false;
      return newState;
    });
  }, []);

  const handleBlow = useCallback(
    (intensity: number) => {
      setBlowIntensity(intensity);

      if (intensity > 0.2 && Math.random() < intensity * 0.5) {
        blowOutCandle();
      }
    },
    [blowOutCandle]
  );

  const handleBlowEnd = useCallback(() => {
    setBlowIntensity(0);
  }, []);

  const handleTapToBlowOut = useCallback(() => {
    blowOutCandle();
  }, [blowOutCandle]);

  const handleBlowOutAll = useCallback(() => {
    setLitCandles(Array(data.candles).fill(false));
  }, [data.candles]);

  const handleReset = useCallback(() => {
    setLitCandles(Array(data.candles).fill(true));
    setShowCelebration(false);
  }, [data.candles]);

  return (
    <div className="flex flex-col items-center gap-8 p-4">
      {/* Recipient name and message */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-2">
          Happy Birthday, {data.name}!
        </h1>
        {data.message && (
          <p className="text-lg text-gray-600 max-w-md">{data.message}</p>
        )}
      </motion.div>

      {/* Cake */}
      <motion.div
        className="relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
      >
        {/* Candles container */}
        <div className="flex justify-center gap-4 mb-2 relative z-10">
          {litCandles.map((isLit, index) => (
            <Candle
              key={index}
              isLit={isLit}
              color={candleColors[candleColorIndices[index]]}
              intensity={blowIntensity}
              delay={index}
            />
          ))}
        </div>

        {/* Cake body */}
        <div className="relative">
          {/* Frosting drips */}
          <div className="absolute -top-2 left-0 right-0 flex justify-around z-10">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`w-4 h-6 ${style.drip} rounded-b-full`}
                style={{ height: `${12 + Math.random() * 8}px` }}
              />
            ))}
          </div>

          {/* Top layer (frosting) */}
          <div
            className={`w-64 md:w-80 h-12 ${style.frosting} rounded-t-lg shadow-inner relative`}
          >
            {/* Decorative dots */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-around px-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 ${style.accent} rounded-full`}
                />
              ))}
            </div>
          </div>

          {/* Middle layer */}
          <div className={`w-64 md:w-80 h-16 ${style.base} shadow-md relative`}>
            <div className="absolute top-2 left-0 right-0 flex justify-around px-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 ${style.accent} rounded-full opacity-50`}
                />
              ))}
            </div>
          </div>

          {/* Bottom layer */}
          <div
            className={`w-64 md:w-80 h-12 ${style.base} rounded-b-lg shadow-lg`}
          />

          {/* Cake plate */}
          <div className="w-72 md:w-96 h-4 bg-gray-200 rounded-full mx-auto -mt-1 shadow-md" />
        </div>
      </motion.div>

      {/* Blow detector and controls */}
      {!allBlownOut && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          {isBlowDetectorActive ? (
            <BlowDetector onBlow={handleBlow} onBlowEnd={handleBlowEnd} />
          ) : (
            <Button
              onClick={() => setIsBlowDetectorActive(true)}
              variant="outline"
              className="gap-2"
            >
              <Mic className="w-4 h-4" />
              Enable microphone to blow out candles
            </Button>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleTapToBlowOut}
              variant="secondary"
              size="sm"
              className="gap-2"
            >
              <Hand className="w-4 h-4" />
              Tap to blow
            </Button>
            <Button
              onClick={handleBlowOutAll}
              variant="ghost"
              size="sm"
            >
              Blow out all
            </Button>
          </div>

          {blowIntensity > 0 && (
            <motion.div
              className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="h-full bg-blue-400"
                animate={{ width: `${blowIntensity * 100}%` }}
              />
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Celebration */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            onClick={handleReset}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-sm mx-4"
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                🎉
              </motion.div>
              <h2 className="text-2xl font-bold text-pink-600 mb-2">
                Make a wish!
              </h2>
              <p className="text-gray-600 mb-4">
                All candles are blown out! Close your eyes and make a wish, {data.name}!
              </p>

              {/* Confetti */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: ['#f472b6', '#60a5fa', '#fbbf24', '#34d399', '#a78bfa'][
                        i % 5
                      ],
                      left: `${Math.random() * 100}%`,
                    }}
                    initial={{ y: -20, opacity: 1 }}
                    animate={{
                      y: 400,
                      opacity: 0,
                      rotate: Math.random() * 360,
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              <Button onClick={handleReset} className="mt-4">
                Light candles again
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
