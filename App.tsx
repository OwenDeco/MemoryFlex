
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GamePhase, TileData, LevelConfig, GameMode, ThemeColor } from './types';
import { ICONS, LEVELS } from './constants';
import Tile from './components/Tile';
import StatusPanel from './components/StatusPanel';
import { Trophy, RotateCcw, Play, ShieldAlert, Volume2, VolumeX, ArrowRight, AlertTriangle, Zap, Cpu, Layers, Settings, Home, X, Check, Palette } from 'lucide-react';
import { sounds } from './soundUtils';

const App: React.FC = () => {
  const [tiles, setTiles] = useState<TileData[]>([]);
  const [phase, setPhase] = useState<GamePhase>(GamePhase.IDLE);
  const [selectedMode, setSelectedMode] = useState<GameMode>(GameMode.NORMAL);
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [highscore, setHighscore] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [combo, setCombo] = useState(1);
  const [matchesInCycle, setMatchesInCycle] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [matchingGroup, setMatchingGroup] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [showDesync, setShowDesync] = useState(false);
  
  const [isShuffling, setIsShuffling] = useState(false);
  const [isSettling, setIsSettling] = useState(false);
  const [boardRotation, setBoardRotation] = useState({ x: 12, y: 0 });
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [themeColor, setThemeColor] = useState<ThemeColor>('purple');
  
  const phaseTimerRef = useRef<number | null>(null);
  const mainTickRef = useRef<number | null>(null);
  const hasMadeMatchInCycle = useRef<boolean>(false);
  const cycleMatchCounter = useRef<number>(0);

  const level = LEVELS[currentLevelIdx];
  const totalMatchesNeeded = level ? (level.gridSize.rows * level.gridSize.cols) / level.matchCount : 0;

  // Theme configuration
  const themes = {
    purple: {
      primary: 'indigo-600',
      primaryHover: 'indigo-500',
      primaryLight: 'indigo-400',
      accent: 'purple-600',
      text: 'text-indigo-500',
      bgPulse1: 'bg-indigo-600/30',
      bgPulse2: 'bg-purple-600/30',
      border: 'border-indigo-500',
      borderFaint: 'border-indigo-500/20',
      glow: 'shadow-[0_0_30px_rgba(99,102,241,0.2)]',
      glowHeavy: 'shadow-[0_0_50px_rgba(99,102,241,0.3)]',
    },
    blue: {
      primary: 'blue-700',
      primaryHover: 'blue-600',
      primaryLight: 'blue-400',
      accent: 'cyan-600',
      text: 'text-blue-500',
      bgPulse1: 'bg-blue-600/30',
      bgPulse2: 'bg-cyan-600/30',
      border: 'border-blue-500',
      borderFaint: 'border-blue-500/20',
      glow: 'shadow-[0_0_30px_rgba(37,99,235,0.2)]',
      glowHeavy: 'shadow-[0_0_50px_rgba(37,99,235,0.3)]',
    }
  };

  const t = themes[themeColor];

  // Load Highscore & Theme
  useEffect(() => {
    const savedScore = localStorage.getItem('memory_pulse_highscore');
    if (savedScore) setHighscore(parseInt(savedScore, 10));
    
    const savedTheme = localStorage.getItem('memory_pulse_theme') as ThemeColor;
    if (savedTheme && (savedTheme === 'purple' || savedTheme === 'blue')) {
      setThemeColor(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('memory_pulse_theme', themeColor);
  }, [themeColor]);

  // Format Time
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const tenths = Math.floor((ms % 1000) / 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${tenths}`;
  };

  // Music Controller
  useEffect(() => {
    if (isMusicEnabled) {
      if (phase !== GamePhase.IDLE && phase !== GamePhase.GAMEOVER && phase !== GamePhase.WON && phase !== GamePhase.LEVEL_COMPLETE) {
        sounds.startBackgroundMusic(level?.mutators.includes('ANNOYING_AUDIO'));
      } else {
        sounds.stopBackgroundMusic();
      }
    } else {
      sounds.stopBackgroundMusic();
    }
  }, [phase, isMusicEnabled, level?.mutators]);

  // Unified Ticker
  useEffect(() => {
    const isActive = phase === GamePhase.MEMORIZE || phase === GamePhase.PLAY;
    if (isActive) {
      mainTickRef.current = window.setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 100));
        if (gameStartTime) setCurrentTime(Date.now() - gameStartTime);
      }, 100);
    } else {
      if (mainTickRef.current) clearInterval(mainTickRef.current);
    }
    return () => { if (mainTickRef.current) clearInterval(mainTickRef.current); };
  }, [phase, gameStartTime]);

  // Interaction: Mouse Move Tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (phase === GamePhase.IDLE || phase === GamePhase.WON || phase === GamePhase.GAMEOVER) return;
      const x = (e.clientY / window.innerHeight - 0.5) * 12;
      const y = (e.clientX / window.innerWidth - 0.5) * -12;
      setBoardRotation({ x: 12 + x, y });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (phase === GamePhase.IDLE || phase === GamePhase.WON || phase === GamePhase.GAMEOVER) return;
      const touch = e.touches[0];
      const x = (touch.clientY / window.innerHeight - 0.5) * 12;
      const y = (touch.clientX / window.innerWidth - 0.5) * -12;
      setBoardRotation({ x: 12 + x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [phase]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const shuffleBoard = useCallback(() => {
    setIsShuffling(true);
    setIsSettling(false);
    sounds.playShuffle();
    setTimeout(() => {
      setTiles(prev => shuffleArray([...prev]));
      setTimeout(() => {
        setIsShuffling(false);
        setIsSettling(true);
        setTimeout(() => setIsSettling(false), 800);
      }, 500);
    }, 400);
  }, []);

  const triggerDesync = useCallback(() => {
    setShowDesync(true);
    sounds.playMiss();
    setCombo(1);
    setLives(l => {
      const next = l - 1;
      if (next <= 0) {
        if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
        setPhase(GamePhase.GAMEOVER);
        sounds.playGameOver();
      }
      return next;
    });
    setTimeout(() => setShowDesync(false), 1000);
  }, []);

  const startMemorizePhase = useCallback((config: LevelConfig) => {
    setPhase(GamePhase.MEMORIZE);
    setTimeLeft(config.memorizeDuration);
    setSelectedIds([]);
    setMatchingGroup([]);
    hasMadeMatchInCycle.current = false;
    
    setCombo(currentCombo => {
        if (cycleMatchCounter.current < 4) {
            return 1;
        }
        return currentCombo;
    });
    
    setMatchesInCycle(0);
    cycleMatchCounter.current = 0;
    
    shuffleBoard();

    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    phaseTimerRef.current = window.setTimeout(() => {
      setPhase(GamePhase.PLAY);
      setTimeLeft(config.playDuration);
      
      phaseTimerRef.current = window.setTimeout(() => {
        if (!hasMadeMatchInCycle.current) {
          triggerDesync();
        }
        
        setLives(current => {
          if (current > 0) {
            startMemorizePhase(config); 
          }
          return current;
        });
      }, config.playDuration);
    }, config.memorizeDuration);
  }, [shuffleBoard, triggerDesync]);

  const initLevel = useCallback((idx: number) => {
    const config = LEVELS[idx];
    const uniqueIconsCount = (config.gridSize.rows * config.gridSize.cols) / config.matchCount;
    const icons = shuffleArray([...ICONS]).slice(0, uniqueIconsCount);
    
    const initialTiles: TileData[] = [];
    icons.forEach((icon) => {
      for (let i = 0; i < config.matchCount; i++) {
        initialTiles.push({ id: `${icon.value}-${i}`, value: icon.value, isMatched: false, color: icon.color });
      }
    });

    setTiles(shuffleArray(initialTiles));
    setMatchedCount(0);
    setLives(config.lives);
    setSelectedIds([]);
    setMatchingGroup([]);
    cycleMatchCounter.current = 0;
    setMatchesInCycle(0);
    setCombo(1);
    startMemorizePhase(config);
  }, [startMemorizePhase]);

  const initGame = (mode: GameMode = GameMode.NORMAL) => {
    if (mode === GameMode.SPECIAL) {
        alert("Special Mode: Secure Neural Link Required. Access Denied (Under Development).");
        return;
    }
    setCurrentLevelIdx(0);
    setScore(0);
    setGameStartTime(Date.now());
    setCurrentTime(0);
    initLevel(0);
  };

  const handleBackToMenu = () => {
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    if (mainTickRef.current) clearInterval(mainTickRef.current);
    setPhase(GamePhase.IDLE);
    sounds.stopBackgroundMusic();
  };

  const handleTileClick = (id: string) => {
    if (phase !== GamePhase.PLAY || isShuffling) return;
    if (selectedIds.includes(id) || selectedIds.length >= level.matchCount) return;

    sounds.playFlip();
    const newSelected = [...selectedIds, id];
    setSelectedIds(newSelected);

    if (newSelected.length === level.matchCount) {
      const values = newSelected.map(sid => tiles.find(t => t.id === sid)?.value);
      const isMatch = values.every(v => v === values[0]);

      if (isMatch) {
        const currentMatchIds = [...newSelected];
        setMatchingGroup(prev => [...prev, ...currentMatchIds]);
        sounds.playMatch();
        hasMadeMatchInCycle.current = true;
        
        cycleMatchCounter.current += 1;
        setMatchesInCycle(cycleMatchCounter.current);

        setTiles(prev => prev.map(t => currentMatchIds.includes(t.id) ? { ...t, isMatched: true } : t));
        setScore(s => {
          const newScore = s + (100 * level.id * combo);
          if (newScore > highscore) {
            setHighscore(newScore);
            localStorage.setItem('memory_pulse_highscore', newScore.toString());
          }
          return newScore;
        });
        setCombo(c => c + 1);
        
        const currentMatchedCountValue = matchedCount + 1;
        setMatchedCount(currentMatchedCountValue);

        if (currentMatchedCountValue === totalMatchesNeeded) {
          setTimeout(() => {
            if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
            if (currentLevelIdx < LEVELS.length - 1) {
              setPhase(GamePhase.LEVEL_COMPLETE);
            } else {
              setPhase(GamePhase.WON);
              sounds.playWin();
            }
          }, 600);
        }

        setSelectedIds([]);
        setTimeout(() => {
          setMatchingGroup(prev => prev.filter(mid => !currentMatchIds.includes(mid)));
        }, 800);
        
      } else {
        sounds.playMiss();
        setCombo(1);
        setTimeout(() => {
          setLives(l => {
            const next = l - 1;
            if (next <= 0) {
              if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
              setPhase(GamePhase.GAMEOVER);
              sounds.playGameOver();
            }
            return next;
          });
          setSelectedIds([]);
        }, 800);
      }
    }
  };

  const proceedToNextLevel = () => {
    const nextIdx = currentLevelIdx + 1;
    setCurrentLevelIdx(nextIdx);
    initLevel(nextIdx);
  };

  const gridAspectRatio = level?.gridSize ? level.gridSize.cols / level.gridSize.rows : 1;

  return (
    <div className={`fixed inset-0 transition-colors duration-300 ${showDesync ? 'bg-rose-950/40' : 'bg-[#020617]'} text-white flex flex-col items-center justify-between py-4 px-2 overflow-hidden touch-none`}>
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none perspective-2000 opacity-20 z-0">
        <div className={`absolute top-1/4 left-1/4 w-[250px] md:w-[500px] h-[250px] md:h-[500px] ${t.bgPulse1} rounded-full blur-[80px] md:blur-[150px] animate-pulse`} />
        <div className={`absolute bottom-1/4 right-1/4 w-[250px] md:w-[500px] h-[250px] md:h-[500px] ${t.bgPulse2} rounded-full blur-[80px] md:blur-[150px] animate-pulse`} style={{ animationDelay: '2s' }} />
      </div>

      <div className="fixed inset-0 scan-lines opacity-10 z-50 pointer-events-none"></div>

      {showDesync && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none animate-in fade-in zoom-in duration-300">
           <div className="bg-rose-600/20 backdrop-blur-md border-2 border-rose-500 p-6 md:p-8 rounded-3xl flex flex-col items-center gap-4 shadow-[0_0_50px_rgba(244,63,94,0.4)]">
              <AlertTriangle size={window.innerWidth < 768 ? 48 : 64} className="text-rose-500 animate-bounce" />
              <div className="text-2xl md:text-3xl font-black text-rose-500 uppercase tracking-tighter">Neural Desync</div>
              <div className="text-xs md:text-sm font-bold text-rose-300 text-center">Protocol Fault: Link Synchronization Missed</div>
           </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
           <div className={`bg-slate-900 border ${t.border} w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in duration-300`}>
              <div className="p-6 md:p-8 flex justify-between items-center border-b border-slate-800">
                 <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">System Configuration</h3>
                 <button onClick={() => setIsSettingsOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                    <X size={24} />
                 </button>
              </div>
              
              <div className="p-6 md:p-8 space-y-8">
                 {/* Audio Section */}
                 <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest">
                       <Volume2 size={14} /> Audio Output
                    </div>
                    <button 
                      onClick={() => setIsMusicEnabled(!isMusicEnabled)}
                      className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${isMusicEnabled ? `${t.bgPulse1.replace('30', '10')} ${t.border} text-white` : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                    >
                       <div className="flex flex-col items-start">
                          <span className="font-bold">Neural Audio Feed</span>
                          <span className="text-[10px] opacity-70">Atmospheric Link Audio & Mutators</span>
                       </div>
                       <div className={`w-12 h-6 rounded-full relative transition-colors ${isMusicEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isMusicEnabled ? 'left-7' : 'left-1'}`} />
                       </div>
                    </button>
                 </div>

                 {/* Theme Section */}
                 <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest">
                       <Palette size={14} /> Neural Interface Color
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <button 
                         onClick={() => setThemeColor('purple')}
                         className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${themeColor === 'purple' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}
                       >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                             {themeColor === 'purple' && <Check size={20} className="text-white" />}
                          </div>
                          <span className={`text-[10px] font-black uppercase ${themeColor === 'purple' ? 'text-indigo-400' : 'text-slate-600'}`}>Hyper Purple</span>
                       </button>

                       <button 
                         onClick={() => setThemeColor('blue')}
                         className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${themeColor === 'blue' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}
                       >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                             {themeColor === 'blue' && <Check size={20} className="text-white" />}
                          </div>
                          <span className={`text-[10px] font-black uppercase ${themeColor === 'blue' ? 'text-blue-400' : 'text-slate-600'}`}>Deep Blue</span>
                       </button>
                    </div>
                 </div>
              </div>

              <div className="p-6 md:p-8 pt-0">
                 <button 
                   onClick={() => setIsSettingsOpen(false)}
                   className={`w-full py-4 bg-${t.primary} hover:bg-${t.primaryHover} rounded-2xl font-black text-lg transition-all active:scale-[0.98]`}
                 >
                    SAVE CONFIGURATION
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Subtle Exit to Menu Button */}
      {phase !== GamePhase.IDLE && (
        <button 
          onClick={handleBackToMenu}
          className="fixed top-4 left-4 z-50 p-2 md:p-3 bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 text-slate-500 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all active:scale-90 group"
          title="Exit to Main Menu"
        >
          <Home size={20} className="group-hover:scale-110 transition-transform" />
        </button>
      )}

      <header className="flex-none mb-2 text-center relative z-10">
        <h1 className={`text-2xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-600 transition-all duration-1000 ${currentLevelIdx >= 40 && phase !== GamePhase.IDLE ? 'animate-pulse scale-105' : ''}`}>
          MEMORY<span className={currentLevelIdx >= 40 && phase !== GamePhase.IDLE ? 'text-rose-500' : t.text}>{themeColor === 'purple' ? 'PULSE' : 'WAVE'}</span>
        </h1>
      </header>

      {phase === GamePhase.IDLE ? (
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl px-4 relative z-10 animate-in zoom-in duration-500">
           <div className="bg-slate-950/80 backdrop-blur-2xl border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl w-full flex flex-col">
              {/* Header Section */}
              <div className="p-8 pb-4 text-center">
                 <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${t.primary}/10 border ${t.borderFaint} ${t.text} text-[10px] font-black tracking-widest uppercase mb-4`}>
                    <Cpu size={12} /> Neural Interface v2.5
                 </div>
                 <h2 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-tight">System Interface</h2>
                 <p className="text-slate-500 text-sm">Select operational protocol to initiate link.</p>
              </div>

              {/* Menu Content */}
              <div className="p-8 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Normal Mode Selector */}
                <button 
                  onClick={() => setSelectedMode(GameMode.NORMAL)}
                  className={`group relative p-6 rounded-2xl border transition-all text-left overflow-hidden ${selectedMode === GameMode.NORMAL ? `bg-${t.primary}/20 ${t.border} ${t.glow}` : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'}`}
                >
                  <div className={`absolute top-0 right-0 p-4 transition-transform group-hover:translate-x-1 ${selectedMode === GameMode.NORMAL ? t.text : 'text-slate-700'}`}>
                    <Layers size={24} />
                  </div>
                  <div className={`text-sm font-black uppercase tracking-widest mb-1 ${selectedMode === GameMode.NORMAL ? t.text : 'text-slate-500'}`}>Standard</div>
                  <div className="text-xl font-bold text-white mb-2">NORMAL MODE</div>
                  <div className="text-xs text-slate-400 leading-relaxed">The original 50 protocols. Increasing density and lethal synchronization requirements.</div>
                </button>

                {/* Special Mode Selector */}
                <button 
                  onClick={() => setSelectedMode(GameMode.SPECIAL)}
                  className={`group relative p-6 rounded-2xl border transition-all text-left overflow-hidden ${selectedMode === GameMode.SPECIAL ? `bg-rose-600/20 border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.2)]` : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'}`}
                >
                  <div className={`absolute top-0 right-0 p-4 transition-transform group-hover:translate-x-1 ${selectedMode === GameMode.SPECIAL ? 'text-rose-400' : 'text-slate-700'}`}>
                    <Zap size={24} />
                  </div>
                  <div className={`text-sm font-black uppercase tracking-widest mb-1 ${selectedMode === GameMode.SPECIAL ? 'text-rose-400' : 'text-slate-500'}`}>Experimental</div>
                  <div className="text-xl font-bold text-white mb-2">SPECIAL MODE</div>
                  <div className="text-xs text-slate-400 leading-relaxed italic">Restricted Access. Secure neural link required for experimental data patterns.</div>
                  {selectedMode !== GameMode.SPECIAL && <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-slate-700">Under Construction</span>
                  </div>}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="p-8 pt-0 flex flex-col gap-3">
                 <button 
                  onClick={() => initGame(selectedMode)}
                  className={`group relative w-full py-5 bg-${t.primary} rounded-2xl font-black text-xl hover:bg-${t.primaryHover} transition-all shadow-xl active:scale-[0.98] overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="flex items-center justify-center gap-3">
                    <Play size={24} fill="currentColor" />
                    QUICK START
                  </div>
                </button>

                <div className="flex items-center justify-between px-4 mt-4">
                   <div className="flex flex-col">
                      <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Global Best</span>
                      <span className="text-lg font-black text-slate-300">{highscore.toLocaleString()}</span>
                   </div>
                   <button onClick={() => setIsSettingsOpen(true)} className="p-3 text-slate-600 hover:text-slate-400 transition-colors active:scale-90">
                      <Settings size={20} />
                   </button>
                </div>
              </div>
           </div>
           
           <div className="mt-8 flex items-center gap-6 text-slate-700 font-black text-[10px] tracking-[0.4em] uppercase">
              <span className="animate-pulse">System Online</span>
              <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
              <span>Secure Link Established</span>
           </div>
        </div>
      ) : phase === GamePhase.LEVEL_COMPLETE ? (
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm p-4 relative z-10 animate-in fade-in zoom-in">
          <div className={`bg-slate-950 p-8 md:p-12 rounded-[22px] text-center border-2 ${t.border} ${t.glowHeavy} w-full`}>
            <h2 className="text-2xl md:text-4xl font-black mb-2 uppercase">Protocol {level.id} Clear</h2>
            <div className={`${t.text} text-xs md:text-sm font-bold mb-8 italic uppercase tracking-widest`}>Neural integrity synchronized</div>
            <button 
              onClick={proceedToNextLevel}
              className={`w-full py-4 md:py-5 px-8 bg-white text-slate-950 rounded-xl font-black text-lg md:text-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-3 active:scale-95`}
            >
              CONTINUE <ArrowRight size={20} />
            </button>
          </div>
        </div>
      ) : phase === GamePhase.GAMEOVER || phase === GamePhase.WON ? (
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm md:max-w-md p-4 relative z-10 animate-in fade-in zoom-in">
          <div className="bg-slate-950 p-8 md:p-12 rounded-[22px] text-center border border-slate-800 shadow-2xl w-full">
            {phase === GamePhase.WON ? (
               <><Trophy className="text-yellow-400 mx-auto mb-4" size={48} /><h2 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tighter">Gauntlet Master</h2></>
            ) : (
               <><ShieldAlert className="text-rose-500 mx-auto mb-4" size={48} /><h2 className="text-3xl md:text-5xl font-black mb-6 text-rose-500 uppercase tracking-tighter">Pulse Failed</h2></>
            )}
            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8">
               <div className="p-3 md:p-4 bg-slate-900 rounded-xl"><div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Score</div><div className="text-2xl md:text-3xl font-black tabular-nums">{score}</div></div>
               <div className="p-3 md:p-4 bg-slate-900 rounded-xl"><div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Max Lv</div><div className="text-2xl md:text-3xl font-black tabular-nums">{level?.id || 0}</div></div>
            </div>
            <button onClick={() => setPhase(GamePhase.IDLE)} className={`w-full py-4 md:py-5 px-8 bg-${t.primary} rounded-xl font-black text-lg md:text-xl flex items-center justify-center gap-3 active:scale-95 transition-transform`}><RotateCcw size={20} /> REBOOT</button>
          </div>
        </div>
      ) : (
        <main className="flex-1 w-full max-w-4xl flex flex-col items-center justify-between min-h-0 relative z-10 px-2">
          <div className="flex-none w-full">
            <StatusPanel 
              score={score} 
              highscore={highscore}
              combo={combo}
              lives={lives} 
              maxLives={level?.lives || 0}
              phase={phase} 
              timeLeft={timeLeft} 
              maxTime={phase === GamePhase.MEMORIZE ? (level?.memorizeDuration || 1) : (level?.playDuration || 1)}
              totalMatches={totalMatchesNeeded}
              matchedCount={matchedCount}
              currentTimeFormatted={formatTime(currentTime)}
              levelLabel={level?.label || ''}
              matchCount={level?.matchCount || 2}
              themeColor={themeColor}
            />
          </div>

          <div 
            className="flex-1 w-full flex items-center justify-center min-h-0 perspective-2000 my-2"
          >
            <div 
              className={`grid w-full preserve-3d transition-all duration-300 ${isShuffling ? 'opacity-80 animate-board-shake' : 'opacity-100'} ${level?.gridSize?.cols >= 6 ? 'gap-1.5 md:gap-3 lg:gap-4' : 'gap-2 md:gap-4 lg:gap-5'}`}
              style={{ 
                gridTemplateColumns: `repeat(${level?.gridSize?.cols || 1}, minmax(0, 1fr))`,
                aspectRatio: `${gridAspectRatio}`,
                transform: `rotateX(${boardRotation.x}deg) rotateY(${boardRotation.y}deg)`,
                transition: isShuffling ? 'none' : 'transform 0.15s ease-out, opacity 0.3s ease-out',
                maxHeight: '100%',
                maxWidth: 'min(100%, 75vh)' 
              }}
            >
              {tiles.map((tile) => (
                <Tile 
                  key={tile.id}
                  tile={tile}
                  isFlipped={phase === GamePhase.MEMORIZE || selectedIds.includes(tile.id)}
                  onClick={() => handleTileClick(tile.id)}
                  disabled={tile.isMatched || selectedIds.length >= (level?.matchCount || 2) || isShuffling}
                  isShuffling={isShuffling}
                  isSettling={isSettling}
                  isMatchingSuccess={matchingGroup.includes(tile.id)}
                  shouldFlicker={level?.mutators.includes('FLICKER')}
                  themeColor={themeColor}
                />
              ))}
            </div>
          </div>
          
          <div className="flex-none w-full flex flex-col items-center gap-2 mb-2">
              <div className="text-slate-500 font-mono text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center gap-2">
                <div className={`w-1 md:w-1.5 h-1 md:h-1.5 rounded-full ${hasMadeMatchInCycle.current ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                Sync Status: {hasMadeMatchInCycle.current ? 'LINK ACTIVE' : 'AWAITING LINK'}
              </div>

              <div className="flex items-center gap-4 bg-slate-900/40 px-4 py-1.5 rounded-xl border border-slate-800/50 shadow-lg">
                 <div className="flex gap-1">
                    {[1, 2, 3, 4].map((step) => (
                        <div 
                            key={step} 
                            className={`w-2 md:w-3 h-2 md:h-3 rounded-sm rotate-45 transition-all duration-300 ${matchesInCycle >= step ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'bg-slate-800'}`} 
                        />
                    ))}
                 </div>
                 <div className={`text-[8px] md:text-[10px] font-black tracking-widest uppercase transition-colors duration-300 ${matchesInCycle >= 4 ? 'text-amber-400 animate-pulse' : 'text-slate-600'}`}>
                    {matchesInCycle >= 4 ? 'Combo Shield: Active' : `Stability: ${matchesInCycle}/4`}
                 </div>
              </div>
          </div>
        </main>
      )}

      <div className="fixed bottom-4 right-4 z-50">
          <button onClick={() => setIsMusicEnabled(!isMusicEnabled)} className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-2.5 rounded-full text-slate-400 hover:text-white transition-all shadow-2xl active:scale-90">
            {isMusicEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
      </div>
    </div>
  );
};

export default App;
