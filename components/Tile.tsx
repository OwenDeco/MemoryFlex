import React from 'react';
import { ICONS } from '../constants';
import { ThemeColor, TileData } from '../types';

type TileProps = {
  tile: TileData;
  isFlipped: boolean;
  onClick: () => void;
  disabled: boolean;
  isShuffling: boolean;
  isSettling: boolean;
  isMatchingSuccess: boolean;
  shouldFlicker?: boolean;
  themeColor: ThemeColor;
};

const themeMap: Record<ThemeColor, { border: string; glow: string }> = {
  purple: { border: 'border-violet-500/50', glow: 'shadow-[0_0_20px_rgba(139,92,246,0.25)]' },
  blue: { border: 'border-sky-500/50', glow: 'shadow-[0_0_20px_rgba(14,165,233,0.25)]' },
};

const Tile: React.FC<TileProps> = ({
  tile,
  isFlipped,
  onClick,
  disabled,
  isShuffling,
  isSettling,
  isMatchingSuccess,
  shouldFlicker,
  themeColor,
}) => {
  const iconDef = ICONS.find((icon) => icon.value === tile.value);
  const theme = themeMap[themeColor];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative aspect-square rounded-xl md:rounded-2xl transition-transform duration-200 active:scale-95 ${
        disabled ? 'cursor-default' : 'cursor-pointer'
      }`}
      aria-label={`Tile ${tile.value}`}
    >
      <div
        className={`w-full h-full preserve-3d physical-flip ${
          isFlipped || tile.isMatched ? 'rotate-y-180' : ''
        } ${isShuffling ? 'animate-shuffle-active' : ''} ${isSettling ? 'animate-pulse' : ''}`}
      >
        <div className="absolute inset-0 backface-hidden rounded-xl md:rounded-2xl bg-slate-900 border border-slate-700" />

        <div
          className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl md:rounded-2xl border-2 bg-slate-900/90 flex items-center justify-center ${theme.border} ${theme.glow} ${
            isMatchingSuccess ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950' : ''
          } ${shouldFlicker ? 'animate-glitch' : ''}`}
        >
          <div className={`${iconDef?.color ?? 'text-white'} scale-90 md:scale-100`}>{iconDef?.component}</div>
        </div>
      </div>
    </button>
  );
};

export default Tile;
