import { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Quest, UserStats, MoodEntry, Achievement } from './types';
import ProfileHeader from './components/ProfileHeader';
import QuestList from './components/QuestList';
import MoodTracker from './components/MoodTracker';
import AchievementGrid from './components/AchievementGrid';

const defaultStats: UserStats = {
  name: 'Adventurer',
  level: 1,
  xp: 0,
  maxXp: 100,
  str: 30,
  int: 45,
  agi: 25,
  cha: 50,
  luck: 35,
};

const defaultQuests: Quest[] = [
  { id: '1', title: 'Morning workout — 30 min', category: 'health', completed: false, xpReward: 30 },
  { id: '2', title: 'Read 20 pages', category: 'learning', completed: false, xpReward: 25 },
  { id: '3', title: 'Complete project milestone', category: 'work', completed: false, xpReward: 50 },
  { id: '4', title: 'Call a friend', category: 'social', completed: false, xpReward: 20 },
  { id: '5', title: 'Drink 8 glasses of water', category: 'health', completed: false, xpReward: 15 },
  { id: '6', title: 'Practice a new skill for 1 hour', category: 'learning', completed: false, xpReward: 40 },
];

const defaultMood: MoodEntry = { mood: 'happy', energy: 70, date: new Date().toISOString() };

const defaultAchievements: Achievement[] = [
  { id: 'a1', title: 'First Steps', description: 'Complete your first quest', icon: '🌟', unlocked: false },
  { id: 'a2', title: 'On a Roll', description: 'Complete 5 quests', icon: '🔥', unlocked: false },
  { id: 'a3', title: 'Level Up!', description: 'Reach level 2', icon: '⚡', unlocked: false },
  { id: 'a4', title: 'Scholar', description: 'Complete 3 learning quests', icon: '📚', unlocked: false },
  { id: 'a5', title: 'Warrior', description: 'Complete 3 health quests', icon: '⚔️', unlocked: false },
  { id: 'a6', title: 'Socialite', description: 'Complete 3 social quests', icon: '💬', unlocked: false },
  { id: 'a7', title: 'Workaholic', description: 'Complete 3 work quests', icon: '💼', unlocked: false },
  { id: 'a8', title: 'Centurion', description: 'Earn 100 XP total', icon: '💎', unlocked: false },
  { id: 'a9', title: 'Unstoppable', description: 'Complete 10 quests', icon: '🏆', unlocked: false },
  { id: 'a10', title: 'Legend', description: 'Reach level 5', icon: '👑', unlocked: false },
];

const statBoosts: Record<string, keyof Omit<UserStats, 'name' | 'level' | 'xp' | 'maxXp'>> = {
  health: 'str',
  learning: 'int',
  work: 'agi',
  social: 'cha',
};

function checkAchievements(
  stats: UserStats,
  quests: Quest[],
  totalCompleted: number,
  achievements: Achievement[]
): Achievement[] {
  const updated = [...achievements];
  const completed = quests.filter((q) => q.completed);
  const byCat = (cat: string) => completed.filter((q) => q.category === cat).length;

  const rules: Record<string, boolean> = {
    a1: totalCompleted >= 1,
    a2: totalCompleted >= 5,
    a3: stats.level >= 2,
    a4: byCat('learning') >= 3,
    a5: byCat('health') >= 3,
    a6: byCat('social') >= 3,
    a7: byCat('work') >= 3,
    a8: stats.xp + (stats.level - 1) * 100 >= 100,
    a9: totalCompleted >= 10,
    a10: stats.level >= 5,
  };

  for (const a of updated) {
    if (!a.unlocked && rules[a.id]) {
      a.unlocked = true;
    }
  }
  return updated;
}

function WeeklyChart({ quests }: { quests: Quest[] }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;
  const completed = quests.filter((q) => q.completed).length;
  const data = days.map((_, i) => (i === todayIdx ? completed : Math.floor(Math.random() * 4) + 1));
  const max = Math.max(...data, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Gamepad2 className="w-5 h-5 text-cyan-400" />
        <h2 className="text-lg font-bold text-white">Weekly Activity</h2>
      </div>
      <div className="flex items-end justify-between gap-2 h-32">
        {days.map((day, i) => {
          const height = (data[i] / max) * 100;
          const isToday = i === todayIdx;
          return (
            <div key={day} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-[10px] text-white/50 font-medium">{data[i]}</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className={`w-full max-w-[32px] rounded-t-lg ${
                  isToday
                    ? 'bg-gradient-to-t from-purple-600 to-pink-500 shadow-lg shadow-purple-500/30'
                    : 'bg-white/10'
                }`}
              />
              <span
                className={`text-[10px] font-semibold ${
                  isToday ? 'text-pink-400' : 'text-white/40'
                }`}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function Particles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 8}s`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [stats, setStats] = useLocalStorage<UserStats>('life-app-stats', defaultStats);
  const [quests, setQuests] = useLocalStorage<Quest[]>('life-app-quests', defaultQuests);
  const [mood, setMood] = useLocalStorage<MoodEntry>('life-app-mood', defaultMood);
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>(
    'life-app-achievements',
    defaultAchievements
  );
  const [totalCompleted, setTotalCompleted] = useLocalStorage<number>('life-app-total-completed', 0);

  const handleToggleQuest = useCallback(
    (id: string) => {
      const quest = quests.find((q) => q.id === id);
      if (!quest) return;

      const updated = quests.map((q) => (q.id === id ? { ...q, completed: !q.completed } : q));
      setQuests(updated);

      if (!quest.completed) {
        const newTotal = totalCompleted + 1;
        setTotalCompleted(newTotal);

        let newXp = stats.xp + quest.xpReward;
        let newLevel = stats.level;
        let newMaxXp = stats.maxXp;
        while (newXp >= newMaxXp) {
          newXp -= newMaxXp;
          newLevel++;
          newMaxXp = Math.floor(newMaxXp * 1.5);
        }
        const boostKey = statBoosts[quest.category];
        const newStats: UserStats = {
          ...stats,
          xp: newXp,
          level: newLevel,
          maxXp: newMaxXp,
          ...(boostKey ? { [boostKey]: Math.min(stats[boostKey] + 2, 100) } : {}),
          luck: Math.min(stats.luck + 1, 100),
        };
        setStats(newStats);
        setAchievements((a) => checkAchievements(newStats, updated, newTotal, a));
      }
    },
    [quests, stats, totalCompleted, setQuests, setStats, setAchievements, setTotalCompleted]
  );

  const handleAddQuest = useCallback(
    (quest: Quest) => setQuests((prev) => [...prev, quest]),
    [setQuests]
  );

  const handleDeleteQuest = useCallback(
    (id: string) => setQuests((prev) => prev.filter((q) => q.id !== id)),
    [setQuests]
  );

  const streaks = useMemo(() => {
    const cats = ['health', 'work', 'learning', 'social'] as const;
    return cats.map((cat) => ({
      category: cat,
      count: quests.filter((q) => q.category === cat && q.completed).length,
    }));
  }, [quests]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white animated-bg">
      <Particles />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 md:py-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              My Life as an App
            </span>
          </h1>
          <p className="text-white/40 text-sm mt-1 tracking-wide">~ RPG Life Dashboard ~</p>
        </motion.header>

        <div className="space-y-6">
          <ProfileHeader stats={stats} onUpdateStats={setStats} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <QuestList
              quests={quests}
              onToggleQuest={handleToggleQuest}
              onAddQuest={handleAddQuest}
              onDeleteQuest={handleDeleteQuest}
            />

            <div className="space-y-6">
              <WeeklyChart quests={quests} />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="glass-card p-6"
              >
                <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-3">
                  Quest Streaks
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {streaks.map((s) => (
                    <div
                      key={s.category}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <span className="text-xl">
                        {s.category === 'health'
                          ? '💪'
                          : s.category === 'work'
                            ? '⚔️'
                            : s.category === 'learning'
                              ? '📖'
                              : '🤝'}
                      </span>
                      <div>
                        <p className="text-xs text-white/50 capitalize">{s.category}</p>
                        <p className="text-lg font-bold text-white">{s.count}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MoodTracker mood={mood} onUpdateMood={setMood} />
            <AchievementGrid achievements={achievements} />
          </div>
        </div>

        <footer className="text-center mt-10 pb-6">
          <p className="text-white/20 text-xs tracking-widest uppercase">
            My Life as an App &middot; Level up every day
          </p>
        </footer>
      </div>
    </div>
  );
}
