import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Star } from 'lucide-react';
import type { UserStats } from '../types';
import StatBar from './StatBar';
import RadarChart from './RadarChart';

interface Props {
  stats: UserStats;
  onUpdateStats: (stats: UserStats) => void;
}

export default function ProfileHeader({ stats, onUpdateStats }: Props) {
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(stats.name);
  const xpPercent = (stats.xp / stats.maxXp) * 100;

  const handleSave = () => {
    onUpdateStats({ ...stats, name: nameInput });
    setEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card p-6 md:p-8"
    >
      <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative shrink-0"
        >
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-400 p-1">
            <div className="w-full h-full rounded-full bg-purple-950 flex items-center justify-center overflow-hidden">
              <span className="text-5xl md:text-6xl select-none">🧙</span>
            </div>
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1"
          >
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
          </motion.div>
        </motion.div>

        <div className="flex-1 w-full text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
            {editing ? (
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                onBlur={handleSave}
                autoFocus
                className="bg-white/10 border border-white/30 rounded-lg px-3 py-1 text-2xl font-bold text-white outline-none focus:border-pink-400"
              />
            ) : (
              <>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
                  {stats.name}
                </h1>
                <button
                  onClick={() => setEditing(true)}
                  className="text-white/50 hover:text-pink-400 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-xs font-bold text-white tracking-wider uppercase">
              Lv. {stats.level}
            </span>
            <span className="text-sm text-white/60">
              {stats.xp} / {stats.maxXp} XP
            </span>
          </div>

          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="h-3 rounded-full bg-white/10 overflow-hidden border border-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-xp-shimmer" />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="hidden xl:block shrink-0">
          <RadarChart stats={stats} size={180} />
        </div>
      </div>

      <div className="xl:hidden mt-6 flex justify-center">
        <RadarChart stats={stats} size={200} />
      </div>

      <div className="grid grid-cols-5 gap-3 mt-6">
        {([
          ['STR', stats.str, 'from-red-500 to-orange-500'],
          ['INT', stats.int, 'from-blue-500 to-cyan-500'],
          ['AGI', stats.agi, 'from-green-500 to-emerald-500'],
          ['CHA', stats.cha, 'from-pink-500 to-rose-500'],
          ['LCK', stats.luck, 'from-yellow-500 to-amber-500'],
        ] as const).map(([label, value, gradient]) => (
          <StatBar key={label} label={label} value={value} maxValue={100} gradient={gradient} />
        ))}
      </div>
    </motion.div>
  );
}
