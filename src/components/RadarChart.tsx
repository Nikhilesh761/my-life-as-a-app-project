import type { UserStats } from '../types';

interface Props {
  stats: UserStats;
  size?: number;
}

export default function RadarChart({ stats, size = 200 }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38;
  const attributes = [
    { key: 'str', label: 'STR', value: stats.str },
    { key: 'int', label: 'INT', value: stats.int },
    { key: 'agi', label: 'AGI', value: stats.agi },
    { key: 'cha', label: 'CHA', value: stats.cha },
    { key: 'luck', label: 'LCK', value: stats.luck },
  ];
  const n = attributes.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  const getPoint = (index: number, ratio: number) => {
    const angle = startAngle + index * angleStep;
    return {
      x: cx + maxR * ratio * Math.cos(angle),
      y: cy + maxR * ratio * Math.sin(angle),
    };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];

  const dataPoints = attributes.map((attr, i) => getPoint(i, attr.value / 100));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9333EA" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#EC4899" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.6" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {gridLevels.map((level) => {
        const points = Array.from({ length: n }, (_, i) => getPoint(i, level));
        const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';
        return (
          <path
            key={level}
            d={path}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        );
      })}

      {attributes.map((_, i) => {
        const p = getPoint(i, 1);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        );
      })}

      <path d={dataPath} fill="url(#radarFill)" stroke="#EC4899" strokeWidth="2" filter="url(#glow)">
        <animate
          attributeName="opacity"
          values="0.7;1;0.7"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>

      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#EC4899" stroke="#fff" strokeWidth="1.5" filter="url(#glow)" />
      ))}

      {attributes.map((attr, i) => {
        const p = getPoint(i, 1.22);
        return (
          <text
            key={attr.key}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-[10px] font-bold fill-white/70"
          >
            {attr.label}
          </text>
        );
      })}
    </svg>
  );
}
