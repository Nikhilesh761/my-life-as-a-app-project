import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Zap, Sparkles } from 'lucide-react';
import type { MoodEntry } from '../types';

interface Props {
  mood: MoodEntry;
  onUpdateMood: (mood: MoodEntry) => void;
}

const moods = [
  { key: 'ecstatic' as const, emoji: '✨', label: 'Ecstatic' },
  { key: 'happy' as const, emoji: '😊', label: 'Happy' },
  { key: 'neutral' as const, emoji: '😐', label: 'Neutral' },
  { key: 'tired' as const, emoji: '😴', label: 'Tired' },
  { key: 'stressed' as const, emoji: '😤', label: 'Stressed' },
];

const affirmations = [
  'Every quest completed makes you stronger!',
  'Your potential is limitless, adventurer.',
  'Today is another chance to level up!',
  'Even heroes need rest. Take your time.',
  'Small steps lead to legendary achievements.',
  'You are the protagonist of your own story.',
  'Keep going — your next level-up is near!',
  'The grind is worth it. Trust the process.',
];

export default function MoodTracker({ mood, onUpdateMood }: Props) {
  const [quote] = useState(() => affirmations[Math.floor(Math.random() * affirmations.length)]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-pink-400" />
        <h2 className="text-lg font-bold text-white">Mood & Energy</h2>
      </div>

      <div className="mb-5">
        <label className="text-xs text-white/60 uppercase tracking-wider font-semibold block mb-2">
          How are you feeling?
        </label>
        <div className="flex gap-2 justify-between">
          {moods.map((m) => (
            <motion.button
              key={m.key}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onUpdateMood({ ...mood, mood: m.key, date: new Date().toISOString() })}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all flex-1 ${
                mood.mood === m.key
                  ? 'bg-pink-500/20 ring-2 ring-pink-500/50 shadow-lg shadow-pink-500/10'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-[9px] text-white/50 font-medium">{m.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-yellow-400" />
            <label className="text-xs text-white/60 uppercase tracking-wider font-semibold">
              Energy Level
            </label>
          </div>
          <span className="text-sm font-bold text-yellow-400">{mood.energy}%</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            value={mood.energy}
            onChange={(e) =>
              onUpdateMood({ ...mood, energy: Number(e.target.value), date: new Date().toISOString() })
            }
            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10 accent-yellow-400 slider-energy"
          />
          <div
            className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 pointer-events-none"
            style={{ width: `${mood.energy}%` }}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="p-4 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/20"
      >
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <p className="text-sm text-white/70 italic leading-relaxed">{quote}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
