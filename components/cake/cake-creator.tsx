'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { generateCakeUrl, type CakeData } from '@/lib/cake-encoding';

const cakeStyles: { value: CakeData['style']; label: string; emoji: string }[] = [
  { value: 'chocolate', label: 'Chocolate', emoji: '🍫' },
  { value: 'vanilla', label: 'Vanilla', emoji: '🍦' },
  { value: 'strawberry', label: 'Strawberry', emoji: '🍓' },
  { value: 'rainbow', label: 'Rainbow', emoji: '🌈' },
];

export function CakeCreator() {
  const [message, setMessage] = useState('');
  const [age, setAge] = useState(25);
  const [style, setStyle] = useState<CakeData['style']>('chocolate');
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const cakeData: CakeData = {
      message: message.trim(),
      age,
      style,
    };

    const path = generateCakeUrl(cakeData);
    const fullUrl = `${window.location.origin}${path}`;
    setGeneratedUrl(fullUrl);
  };

  const handleCopy = async () => {
    if (!generatedUrl) return;

    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleReset = () => {
    setGeneratedUrl(null);
    setMessage('');
    setAge(25);
    setStyle('chocolate');
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.div
          className="inline-block text-6xl mb-4"
          animate={{
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          🎂
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-2">
          Birthday Cake Maker
        </h1>
        <p className="text-gray-600">
          Create a virtual birthday cake and send it to someone special!
        </p>
      </motion.div>

      {!generatedUrl ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-pink-500" />
              Create Your Cake
            </CardTitle>
            <CardDescription>
              Fill in the details to create a personalized birthday cake
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Birthday Message *
                </label>
                <Textarea
                  id="message"
                  placeholder="Happy Birthday! Wishing you all the best..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={200}
                  rows={3}
                  required
                />
                <p className="text-xs text-gray-500">
                  {message.length}/200 characters
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="age" className="text-sm font-medium">
                  Age (Number of Candles): {age}
                </label>
                <input
                  id="age"
                  type="range"
                  min="1"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1</span>
                  <span>100</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Cake Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {cakeStyles.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setStyle(s.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        style === s.value
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl">{s.emoji}</span>
                      <span className="block text-sm mt-1">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={!message.trim()}
              >
                <Sparkles className="w-4 h-4" />
                Create Birthday Cake
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Check className="w-5 h-5" />
                Cake Created!
              </CardTitle>
              <CardDescription>
                Share this link so they can blow out the candles!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={generatedUrl}
                  className="bg-white font-mono text-sm"
                />
                <Button onClick={handleCopy} variant="secondary" className="gap-2">
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => window.open(generatedUrl, '_blank')}
                  variant="outline"
                  className="flex-1"
                >
                  Preview Cake
                </Button>
                <Button onClick={handleReset} variant="ghost" className="flex-1">
                  Create Another
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
