import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface HealthScoreRingProps {
  score: number;
  size?: number;
}

const HealthScoreRing = ({ score, size = 180 }: HealthScoreRingProps) => {
  const { color, label } = useMemo(() => {
    if (score >= 70) return { color: 'hsl(155, 100%, 50%)', label: 'Excellent' };
    if (score >= 40) return { color: 'hsl(38, 100%, 50%)', label: 'Fair' };
    return { color: 'hsl(0, 72%, 51%)', label: 'Needs Work' };
  }, [score]);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="hsl(222, 30%, 14%)"
            strokeWidth="8"
          />
          <motion.circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="stat-value text-3xl"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-muted-foreground mt-1">/ 100</span>
        </div>
      </div>
      <div className="text-center">
        <span className="text-sm font-medium" style={{ color }}>{label}</span>
        <p className="text-xs text-muted-foreground mt-0.5">Money Health Score</p>
      </div>
    </div>
  );
};

export default HealthScoreRing;
