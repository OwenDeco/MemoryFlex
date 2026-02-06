import React from 'react';
import { Heart, Timer, Trophy, Target } from 'lucide-react';
import { GamePhase, ThemeColor } from '../types';

type StatusPanelProps = {
  score: number;
  highscore: number;
  combo: number;
  lives: number;
  maxLives: number;
  phase: GamePhase;
  timeLeft: number;
  maxTime: number;
  totalMatches: number;
  matchedCount: number;
  currentTimeFormatted: string;
  levelLabel: string;
  matchCount: number;
  themeColor: ThemeColor;
};

const themeMap: Record<ThemeColor, { text: string; bar: string }> = {
  purple: { text: 'text-violet-300', bar: 'bg-violet-500' },
  blue: { text: 'text-sky-300', bar: 'bg-sky-500' },
};

const StatusPanel: React.FC<StatusPanelProps> = ({
  score,
  highscore,
  combo,
  lives,
  maxLives,
  phase,
  timeLeft,
  maxTime,
  totalMatches,
  matchedCount,
  currentTimeFormatted,
  levelLabel,
  matchCount,
  themeColor,
}) => {
  const pct = Math.max(0, Math.min(100, (timeLeft / Math.max(1, maxTime)) * 100));
  const theme = themeMap[themeColor];

  return (
    <section className="bg-slate-950/70 backdrop-blur-md border border-slate-800 rounded-2xl p-3 md:p-4 shadow-xl">
      <div className="flex items-center justify-between gap-3 text-[10px] md:text-xs uppercase tracking-wider text-slate-400">
        <span>{levelLabel}</span>
        <span className={theme.text}>{phase}</span>
      </div>

      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs md:text-sm">
        <div className="rounded-lg bg-slate-900/70 p-2"><Trophy className="inline mr-1" size={14} />{score}</div>
        <div className="rounded-lg bg-slate-900/70 p-2">Best: {highscore}</div>
        <div className="rounded-lg bg-slate-900/70 p-2">Combo x{combo}</div>
        <div className="rounded-lg bg-slate-900/70 p-2"><Target className="inline mr-1" size={14} />{matchedCount}/{totalMatches}</div>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-1"><Timer size={14} /> {Math.ceil(timeLeft / 1000)}s ({currentTimeFormatted})</div>
        <div>{matchCount}-match mode</div>
      </div>

      <div className="mt-2 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
        <div className={`h-full ${theme.bar} transition-all`} style={{ width: `${pct}%` }} />
      </div>

      <div className="mt-2 flex gap-1">
        {Array.from({ length: maxLives }).map((_, idx) => (
          <Heart key={idx} size={14} className={idx < lives ? 'text-rose-500' : 'text-slate-700'} fill={idx < lives ? 'currentColor' : 'none'} />
        ))}
      </div>
    </section>
  );
};

export default StatusPanel;
