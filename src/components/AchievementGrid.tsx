import { motion } from 'framer-motion';
import { Trophy, Lock } from 'lucide-react';
import type { Achievement } from '../types';

interface Props {
  achievements: Achievement[];
}

export default function AchievementGrid({ achievements }: Props) {
  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h2 className="text-lg font-bold text-white">Achievements</h2>
        </div>
        <span className="text-xs text-white/50">
          {unlocked}/{achievements.length} unlocked
        </span>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
        {achievements.map((achievement, i) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            whileHover={{ scale: 1.1, y: -4 }}
            className="group relative"
          >
            <div
              className={`aspect-square rounded-xl flex items-center justify-center text-2xl transition-all ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 shadow-lg shadow-yellow-500/10'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              {achievement.unlocked ? (
                <span>{achievement.icon}</span>
              ) : (
                <Lock className="w-4 h-4 text-white/20" />
              )}
            </div>

            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-gray-900/95 border border-white/10 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <p className="font-bold">{achievement.title}</p>
              <p className="text-white/50">{achievement.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
