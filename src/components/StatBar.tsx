import { motion } from 'framer-motion';

interface Props {
  label: string;
  value: number;
  maxValue: number;
  gradient: string;
}

export default function StatBar({ label, value, maxValue, gradient }: Props) {
  const percent = Math.min((value / maxValue) * 100, 100);

  return (
    <div className="text-center">
      <span className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-widest">
        {label}
      </span>
      <div className="mt-1 h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
        />
      </div>
      <span className="text-[10px] md:text-xs text-white/50 mt-1 block">{value}</span>
    </div>
  );
}
