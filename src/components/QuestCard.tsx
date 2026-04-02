import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Swords, Brain, Footprints, Users } from 'lucide-react';
import type { Quest } from '../types';

interface Props {
  quest: Quest;
  onToggle: (id: string) => void;
}

const categoryConfig = {
  health: { icon: Footprints, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30' },
  work: { icon: Swords, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' },
  learning: { icon: Brain, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/30' },
  social: { icon: Users, color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-400/30' },
};

export default function QuestCard({ quest, onToggle }: Props) {
  const config = categoryConfig[quest.category];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onToggle(quest.id)}
      className={`flex items-center gap-3 p-3 md:p-4 rounded-xl cursor-pointer transition-all border ${
        quest.completed
          ? 'bg-white/5 border-white/10 opacity-60'
          : `${config.bg} ${config.border}`
      }`}
    >
      <motion.div
        animate={quest.completed ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {quest.completed ? (
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
        ) : (
          <Circle className={`w-5 h-5 ${config.color} shrink-0`} />
        )}
      </motion.div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${quest.completed ? 'line-through text-white/40' : 'text-white'}`}>
          {quest.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <Icon className={`w-3 h-3 ${config.color}`} />
          <span className={`text-[10px] uppercase tracking-wider font-semibold ${config.color}`}>
            {quest.category}
          </span>
        </div>
      </div>

      <div className="shrink-0">
        <span className="text-xs font-bold text-yellow-400/80">+{quest.xpReward} XP</span>
      </div>
    </motion.div>
  );
}
