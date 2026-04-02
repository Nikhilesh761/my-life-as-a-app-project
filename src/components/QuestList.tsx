import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Scroll, Flame } from 'lucide-react';
import type { Quest, QuestCategory } from '../types';
import QuestCard from './QuestCard';

interface Props {
  quests: Quest[];
  onToggleQuest: (id: string) => void;
  onAddQuest: (quest: Quest) => void;
  onDeleteQuest: (id: string) => void;
}

const categories: QuestCategory[] = ['health', 'work', 'learning', 'social'];

export default function QuestList({ quests, onToggleQuest, onAddQuest, onDeleteQuest }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<QuestCategory>('health');
  const [newXp, setNewXp] = useState(25);
  const [filter, setFilter] = useState<QuestCategory | 'all'>('all');

  const filteredQuests = filter === 'all' ? quests : quests.filter((q) => q.category === filter);
  const completedCount = quests.filter((q) => q.completed).length;
  const progress = quests.length > 0 ? (completedCount / quests.length) * 100 : 0;

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onAddQuest({
      id: Date.now().toString(),
      title: newTitle.trim(),
      category: newCategory,
      completed: false,
      xpReward: newXp,
    });
    setNewTitle('');
    setShowModal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Scroll className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white">Daily Quests</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold hover:from-purple-500 hover:to-pink-500 transition-all hover:shadow-lg hover:shadow-purple-500/25"
        >
          <Plus className="w-3.5 h-3.5" />
          New Quest
        </button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Flame className="w-4 h-4 text-orange-400" />
        <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-yellow-500"
          />
        </div>
        <span className="text-xs text-white/60 font-medium">
          {completedCount}/{quests.length}
        </span>
      </div>

      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        {(['all', ...categories] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              filter === cat
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {filteredQuests.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white/30 text-sm py-8"
            >
              No quests yet. Add one to begin your adventure!
            </motion.p>
          ) : (
            filteredQuests.map((quest) => (
              <div key={quest.id} className="relative group">
                <QuestCard quest={quest} onToggle={onToggleQuest} />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteQuest(quest.id);
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-red-500/20"
                >
                  <X className="w-3 h-3 text-red-400" />
                </button>
              </div>
            ))
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-6 w-full max-w-md border-purple-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">New Quest</h3>
                <button onClick={() => setShowModal(false)} className="text-white/50 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/60 uppercase tracking-wider font-semibold block mb-1">
                    Quest Title
                  </label>
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    placeholder="Enter quest name..."
                    autoFocus
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60 uppercase tracking-wider font-semibold block mb-1">
                    Category
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setNewCategory(cat)}
                        className={`px-2 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                          newCategory === cat
                            ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                            : 'bg-white/5 text-white/50 hover:bg-white/10'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/60 uppercase tracking-wider font-semibold block mb-1">
                    XP Reward: {newXp}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={newXp}
                    onChange={(e) => setNewXp(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                <button
                  onClick={handleAdd}
                  disabled={!newTitle.trim()}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:from-purple-500 hover:to-pink-500 transition-all"
                >
                  Accept Quest
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
