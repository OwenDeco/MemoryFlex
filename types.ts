
export enum GamePhase {
  IDLE = 'IDLE',
  MEMORIZE = 'MEMORIZE',
  PLAY = 'PLAY',
  LEVEL_COMPLETE = 'LEVEL_COMPLETE',
  GAMEOVER = 'GAMEOVER',
  WON = 'WON'
}

export enum GameMode {
  NORMAL = 'NORMAL',
  SPECIAL = 'SPECIAL'
}

export type ThemeColor = 'purple' | 'blue';

export type Mutator = 'FLICKER' | 'ANNOYING_AUDIO' | 'TRIPLETS';

export interface LevelConfig {
  id: number;
  label: string;
  gridSize: { rows: number; cols: number };
  matchCount: number; // 2 for pairs, 3 for triplets
  memorizeDuration: number;
  playDuration: number;
  lives: number;
  mutators: Mutator[];
}

export interface TileData {
  id: string;
  value: string;
  isMatched: boolean;
  color: string;
}
