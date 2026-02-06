
import React from 'react';
import { 
  Zap, Flame, Droplets, Ghost, 
  Sun, Moon, Star, Heart, 
  Gem, Anchor, Coffee, Music,
  Binary, Cpu, Database, Cloud,
  Brain, Radio, Wifi, Layers
} from 'lucide-react';
import { LevelConfig } from './types';

export const ICONS = [
  { value: 'zap', component: <Zap size={32} />, color: 'text-yellow-400' },
  { value: 'flame', component: <Flame size={32} />, color: 'text-orange-500' },
  { value: 'droplet', component: <Droplets size={32} />, color: 'text-blue-400' },
  { value: 'ghost', component: <Ghost size={32} />, color: 'text-purple-400' },
  { value: 'sun', component: <Sun size={32} />, color: 'text-amber-400' },
  { value: 'moon', component: <Moon size={32} />, color: 'text-slate-300' },
  { value: 'star', component: <Star size={32} />, color: 'text-yellow-200' },
  { value: 'heart', component: <Heart size={32} />, color: 'text-pink-500' },
  { value: 'gem', component: <Gem size={32} />, color: 'text-cyan-400' },
  { value: 'anchor', component: <Anchor size={32} />, color: 'text-indigo-400' },
  { value: 'coffee', component: <Coffee size={32} />, color: 'text-amber-700' },
  { value: 'music', component: <Music size={32} />, color: 'text-rose-400' },
  { value: 'binary', component: <Binary size={32} />, color: 'text-emerald-400' },
  { value: 'cpu', component: <Cpu size={32} />, color: 'text-gray-400' },
  { value: 'database', component: <Database size={32} />, color: 'text-blue-600' },
  { value: 'cloud', component: <Cloud size={32} />, color: 'text-sky-300' },
  { value: 'brain', component: <Brain size={32} />, color: 'text-pink-300' },
  { value: 'radio', component: <Radio size={32} />, color: 'text-orange-300' },
  { value: 'wifi', component: <Wifi size={32} />, color: 'text-teal-400' },
  { value: 'layers', component: <Layers size={32} />, color: 'text-violet-500' },
];

export const LEVELS: LevelConfig[] = [
  // 1-10: The Foundation
  { id: 1, label: 'Protocol: Alpha', gridSize: { rows: 3, cols: 4 }, matchCount: 2, memorizeDuration: 4000, playDuration: 12000, lives: 5, mutators: [] },
  { id: 2, label: 'Protocol: Beta', gridSize: { rows: 4, cols: 3 }, matchCount: 2, memorizeDuration: 3500, playDuration: 10000, lives: 5, mutators: [] },
  { id: 3, label: 'Protocol: Gamma', gridSize: { rows: 4, cols: 4 }, matchCount: 2, memorizeDuration: 3500, playDuration: 10000, lives: 4, mutators: [] },
  { id: 4, label: 'Protocol: Delta', gridSize: { rows: 4, cols: 4 }, matchCount: 2, memorizeDuration: 3000, playDuration: 9000, lives: 4, mutators: ['FLICKER'] },
  { id: 5, label: 'Protocol: Epsilon', gridSize: { rows: 4, cols: 3 }, matchCount: 3, memorizeDuration: 4500, playDuration: 12000, lives: 4, mutators: ['TRIPLETS'] },
  { id: 6, label: 'Protocol: Zeta', gridSize: { rows: 3, cols: 4 }, matchCount: 2, memorizeDuration: 2500, playDuration: 8000, lives: 4, mutators: ['ANNOYING_AUDIO'] },
  { id: 7, label: 'Protocol: Eta', gridSize: { rows: 4, cols: 4 }, matchCount: 2, memorizeDuration: 2800, playDuration: 8000, lives: 3, mutators: ['FLICKER'] },
  { id: 8, label: 'Protocol: Theta', gridSize: { rows: 5, cols: 4 }, matchCount: 2, memorizeDuration: 3000, playDuration: 10000, lives: 3, mutators: [] },
  { id: 9, label: 'Protocol: Iota', gridSize: { rows: 5, cols: 4 }, matchCount: 2, memorizeDuration: 2500, playDuration: 9000, lives: 3, mutators: ['FLICKER'] },
  { id: 10, label: 'Protocol: Kappa', gridSize: { rows: 6, cols: 3 }, matchCount: 3, memorizeDuration: 4000, playDuration: 12000, lives: 3, mutators: ['TRIPLETS', 'ANNOYING_AUDIO'] },

  // 11-20: Advanced Linkage
  { id: 11, label: 'Neural Drift', gridSize: { rows: 4, cols: 5 }, matchCount: 2, memorizeDuration: 2800, playDuration: 9000, lives: 3, mutators: ['FLICKER'] },
  { id: 12, label: 'Signal Noise', gridSize: { rows: 5, cols: 4 }, matchCount: 2, memorizeDuration: 2500, playDuration: 8500, lives: 3, mutators: ['ANNOYING_AUDIO'] },
  { id: 13, label: 'Matrix Breach', gridSize: { rows: 4, cols: 6 }, matchCount: 2, memorizeDuration: 3000, playDuration: 10000, lives: 3, mutators: ['FLICKER'] },
  { id: 14, label: 'Vortex Sync', gridSize: { rows: 4, cols: 6 }, matchCount: 3, memorizeDuration: 4000, playDuration: 12000, lives: 4, mutators: ['TRIPLETS'] },
  { id: 15, label: 'Data Fog', gridSize: { rows: 5, cols: 4 }, matchCount: 2, memorizeDuration: 2200, playDuration: 8000, lives: 3, mutators: ['FLICKER', 'ANNOYING_AUDIO'] },
  { id: 16, label: 'Core Pulse', gridSize: { rows: 6, cols: 4 }, matchCount: 2, memorizeDuration: 2800, playDuration: 10000, lives: 3, mutators: [] },
  { id: 17, label: 'Static Link', gridSize: { rows: 6, cols: 4 }, matchCount: 3, memorizeDuration: 3800, playDuration: 11000, lives: 3, mutators: ['TRIPLETS', 'FLICKER'] },
  { id: 18, label: 'Echo Chamber', gridSize: { rows: 4, cols: 6 }, matchCount: 2, memorizeDuration: 2000, playDuration: 7500, lives: 2, mutators: ['ANNOYING_AUDIO'] },
  { id: 19, label: 'Ghost Trace', gridSize: { rows: 5, cols: 6 }, matchCount: 2, memorizeDuration: 2500, playDuration: 10000, lives: 3, mutators: ['FLICKER'] },
  { id: 20, label: 'Binary Wall', gridSize: { rows: 5, cols: 6 }, matchCount: 3, memorizeDuration: 3500, playDuration: 12000, lives: 3, mutators: ['TRIPLETS', 'ANNOYING_AUDIO'] },

  // 21-30: High Density
  { id: 21, label: 'Pattern Collapse', gridSize: { rows: 6, cols: 5 }, matchCount: 2, memorizeDuration: 2200, playDuration: 9000, lives: 3, mutators: ['FLICKER'] },
  { id: 22, label: 'Logic Grind', gridSize: { rows: 6, cols: 5 }, matchCount: 3, memorizeDuration: 3200, playDuration: 11000, lives: 3, mutators: ['TRIPLETS'] },
  { id: 23, label: 'Circuit Overload', gridSize: { rows: 6, cols: 6 }, matchCount: 2, memorizeDuration: 2500, playDuration: 11000, lives: 2, mutators: ['FLICKER', 'ANNOYING_AUDIO'] },
  { id: 24, label: 'Neural Spike', gridSize: { rows: 6, cols: 6 }, matchCount: 3, memorizeDuration: 3000, playDuration: 12000, lives: 3, mutators: ['TRIPLETS'] },
  { id: 25, label: 'System Shock', gridSize: { rows: 4, cols: 6 }, matchCount: 3, memorizeDuration: 2000, playDuration: 8000, lives: 2, mutators: ['TRIPLETS', 'FLICKER'] },
  { id: 26, label: 'Memory Leak', gridSize: { rows: 5, cols: 6 }, matchCount: 2, memorizeDuration: 1800, playDuration: 7500, lives: 2, mutators: ['FLICKER'] },
  { id: 27, label: 'Glitch Stream', gridSize: { rows: 6, cols: 6 }, matchCount: 3, memorizeDuration: 2800, playDuration: 11000, lives: 2, mutators: ['TRIPLETS', 'ANNOYING_AUDIO', 'FLICKER'] },
  { id: 28, label: 'Null Point', gridSize: { rows: 6, cols: 4 }, matchCount: 2, memorizeDuration: 1500, playDuration: 6500, lives: 1, mutators: [] },
  { id: 29, label: 'Void Link', gridSize: { rows: 6, cols: 6 }, matchCount: 3, memorizeDuration: 3000, playDuration: 12000, lives: 2, mutators: ['TRIPLETS', 'FLICKER'] },
  { id: 30, label: 'Titan Protocol', gridSize: { rows: 6, cols: 6 }, matchCount: 2, memorizeDuration: 2200, playDuration: 10000, lives: 2, mutators: ['ANNOYING_AUDIO', 'FLICKER'] },

  // 31-40: Near Singularity
  { id: 31, label: 'Zenith Link', gridSize: { rows: 5, cols: 6 }, matchCount: 3, memorizeDuration: 2500, playDuration: 10000, lives: 2, mutators: ['TRIPLETS', 'FLICKER'] },
  { id: 32, label: 'Apex Sync', gridSize: { rows: 6, cols: 6 }, matchCount: 3, memorizeDuration: 2400, playDuration: 9500, lives: 2, mutators: ['TRIPLETS', 'ANNOYING_AUDIO'] },
  { id: 33, label: 'Total Recall', gridSize: { rows: 6, cols: 6 }, matchCount: 2, memorizeDuration: 1500, playDuration: 7000, lives: 2, mutators: ['FLICKER'] },
  { id: 34, label: 'Quantum Fog', gridSize: { rows: 6, cols: 6 }, matchCount: 3, memorizeDuration: 2300, playDuration: 9000, lives: 2, mutators: ['TRIPLETS', 'FLICKER', 'ANNOYING_AUDIO'] },
  { id: 35, label: 'Dark Matter', gridSize: { rows: 6, cols: 6 }, matchCount: 3, memorizeDuration: 2200, playDuration: 8500, lives: 2, mutators: ['TRIPLETS'] },
  { id: 36, label: 'Blackout', gridSize: { rows: 6, cols: 6 }, matchCount: 2, memorizeDuration: 1200, playDuration: 6000, lives: 1, mutators: ['FLICKER'] },
  { id: 37, label: 'Chaos Theory', gridSize: { rows: 6, cols: 6 }, matchCount: 3, memorizeDuration: 2100, playDuration: 8000, lives: 2, mutators: ['TRIPLETS', 'FLICKER', 'ANNOYING_AUDIO'] },
  { id: 38, label: 'Event Horizon', gridSize: { rows: 6, cols: 6 }, matchCount: 3, memorizeDuration: 2000, playDuration: 7500, lives: 2, mutators: ['TRIPLETS'] },
  { id: 39, label: 'Zero State', gridSize: { rows: 6, cols: 6 }, matchCount: 3, memorizeDuration: 1900, playDuration: 7000, lives: 1, mutators: ['TRIPLETS', 'FLICKER'] },
  { id: 40, label: 'The Threshold', gridSize: { rows: 6, cols: 6 }, matchCount: 3, memorizeDuration: 1800, playDuration: 6500, lives: 1, mutators: ['TRIPLETS', 'ANNOYING_AUDIO', 'FLICKER'] },

  // 41-50: Singularity (INSANE MODE)
  { id: 41, label: 'Singularity: 01', gridSize: { rows: 6, cols: 6 }, matchCount: 3, memorizeDuration: 1800, playDuration: 7000, lives: 2, mutators: ['TRIPLETS', 'ANNOYING_AUDIO', 'FLICKER'] },
  { id: 42, label: 'Singularity: 02', gridSize: { rows: 6, cols: 6 }, matchCount: 3, memorizeDuration: 1750, playDuration: 6800, lives: 1, mutators: ['TRIPLETS', 'ANNOYING_AUDIO', 'FLICKER'] },
  { id: 43, label: 'Singularity: 03', gridSize: { rows: 6, cols: 6 }, matchCount: 3, memorizeDuration: 1700, playDuration: 6600, lives: 1, mutators: ['TRIPLETS', 'ANNOYING_AUDIO', 'FLICKER'] },
  { id: 44, label: 'Singularity: 04', gridSize: { rows: 6, cols: 6 }, matchCount: 3, memorizeDuration: 1650, playDuration: 6400, lives: 1, mutators: ['TRIPLETS', 'ANNOYING_AUDIO', 'FLICKER'] },
  { id: 45, label: 'Singularity: 05', gridSize: { rows: 6, cols: 6 }, matchCount: 3, memorizeDuration: 1600, playDuration: 6200, lives: 1, mutators: ['TRIPLETS', 'ANNOYING_AUDIO', 'FLICKER'] },
  { id: 46, label: 'Singularity: 06', gridSize: { rows: 6, cols: 6 }, matchCount: 3, memorizeDuration: 1550, playDuration: 6000, lives: 1, mutators: ['TRIPLETS', 'ANNOYING_AUDIO', 'FLICKER'] },
  { id: 47, label: 'Singularity: 07', gridSize: { rows: 6, cols: 6 }, matchCount: 3, memorizeDuration: 1500, playDuration: 5800, lives: 1, mutators: ['TRIPLETS', 'ANNOYING_AUDIO', 'FLICKER'] },
  { id: 48, label: 'Singularity: 08', gridSize: { rows: 6, cols: 6 }, matchCount: 3, memorizeDuration: 1450, playDuration: 5600, lives: 1, mutators: ['TRIPLETS', 'ANNOYING_AUDIO', 'FLICKER'] },
  { id: 49, label: 'Singularity: 09', gridSize: { rows: 6, cols: 6 }, matchCount: 3, memorizeDuration: 1400, playDuration: 5400, lives: 1, mutators: ['TRIPLETS', 'ANNOYING_AUDIO', 'FLICKER'] },
  { id: 50, label: 'Omega Singularity', gridSize: { rows: 6, cols: 6 }, matchCount: 3, memorizeDuration: 1200, playDuration: 5000, lives: 1, mutators: ['TRIPLETS', 'ANNOYING_AUDIO', 'FLICKER'] },
];
