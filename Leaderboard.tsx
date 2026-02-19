import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Tile, GameState } from '../types';
import { GRID_SIZE, createSolvedTiles, shuffleTiles } from '../utils/gameLogic';
import { TileComponent } from './Tile';

interface PuzzleBoardProps {
  imageSrc: string;
  onWin: (time: number, moves: number) => void;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ imageSrc, onWin }) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [emptyPos, setEmptyPos] = useState<number>(GRID_SIZE * GRID_SIZE - 1);
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Initialize game
  useEffect(() => {
    resetGame();
    return () => stopTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startTimer = () => {
    if (timerRef.current) return;
    timerRef.current = window.setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetGame = () => {
    stopTimer();
    setTime(0);
    setMoves(0);
    setGameState(GameState.IDLE);
    const solved = createSolvedTiles();
    setTiles(solved);
    setEmptyPos(GRID_SIZE * GRID_SIZE - 1);
  };

  const startGame = () => {
    const { tiles: shuffled, emptyPos: newEmpty } = shuffleTiles(createSolvedTiles());
    setTiles(shuffled);
    setEmptyPos(newEmpty);
    setGameState(GameState.PLAYING);
    setMoves(0);
    setTime(0);
    startTimer();
  };

  const checkWin = (currentTiles: Tile[]) => {
    const isWin = currentTiles.every((tile) => tile.currentPos === tile.correctPos);
    if (isWin) {
      stopTimer();
      setGameState(GameState.WON);
      onWin(time, moves + 1); // +1 because state updates after this function
    }
  };

  const handleTileClick = (clickedTile: Tile) => {
    if (gameState !== GameState.PLAYING) return;

    const { currentPos } = clickedTile;
    
    // Check adjacency
    const row = Math.floor(currentPos / GRID_SIZE);
    const col = currentPos % GRID_SIZE;
    const emptyRow = Math.floor(emptyPos / GRID_SIZE);
    const emptyCol = emptyPos % GRID_SIZE;

    const isAdjacent = 
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      const newTiles = tiles.map(t => {
        if (t.id === clickedTile.id) {
          return { ...t, currentPos: emptyPos };
        }
        return t;
      });

      setTiles(newTiles);
      setEmptyPos(currentPos);
      setMoves(m => m + 1);
      
      // Check win after move
      // Note: We pass the updated state manually because 'tiles' isn't updated yet in this scope
      const isWin = newTiles.every((tile) => tile.currentPos === tile.correctPos);
      if (isWin) {
        stopTimer();
        setGameState(GameState.WON);
        onWin(time, moves + 1); 
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* HUD */}
      <div className="w-full flex justify-between items-center mb-8 bg-white p-5 rounded-2xl shadow-xl border border-gray-100 backdrop-blur-sm">
        <div className="flex flex-col items-center min-w-[80px]">
            <span className="text-[10px] font-bold text-softplan-muted uppercase tracking-widest mb-1">Tempo</span>
            <span className="text-2xl font-mono text-softplan-blue font-bold">{formatTime(time)}</span>
        </div>
        
        {gameState === GameState.IDLE || gameState === GameState.WON ? (
            <button 
                onClick={startGame}
                className="bg-softplan-blue hover:bg-indigo-600 text-white font-display font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-softplan-blue/30"
            >
                {gameState === GameState.WON ? 'Jogar Novamente' : 'Iniciar Desafio'}
            </button>
        ) : (
             <button 
                onClick={resetGame}
                className="text-red-500 hover:text-red-700 font-semibold text-sm px-6 py-2 border border-red-200 hover:bg-red-50 rounded-full transition-colors"
            >
                Desistir
            </button>
        )}

        <div className="flex flex-col items-center min-w-[80px]">
            <span className="text-[10px] font-bold text-softplan-muted uppercase tracking-widest mb-1">Movimentos</span>
            <span className="text-2xl font-mono text-softplan-blue font-bold">{moves}</span>
        </div>
      </div>

      {/* Board */}
      <div 
        className="relative bg-white border-4 border-white shadow-2xl rounded-xl overflow-hidden ring-1 ring-black/5"
        style={{
            width: '100%',
            maxWidth: '500px',
            aspectRatio: '1/1'
        }}
      >
        {gameState === GameState.IDLE && (
           <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm text-gray-800 p-8 text-center animate-fade-in">
              <h2 className="text-3xl font-display font-bold mb-3 text-softplan-dark">Desafio Digital</h2>
              <p className="mb-6 text-gray-600 text-lg font-light leading-relaxed">
                Organize as peças para revelar a visão de transformação da Softplan.
              </p>
              <div 
                className="w-40 h-40 opacity-90 mb-6 rounded-lg border-2 border-white shadow-xl transform rotate-3"
                style={{ backgroundImage: `url(${imageSrc})`, backgroundSize: 'cover' }}
              />
              <span className="text-sm font-semibold text-softplan-blue uppercase tracking-wider animate-pulse">
                Pressione "Iniciar Desafio" acima
              </span>
           </div>
        )}

        {tiles.map((tile) => (
          <TileComponent
            key={tile.id}
            {...tile}
            imageSrc={imageSrc}
            onClick={() => handleTileClick(tile)}
            sizePercentage={100 / GRID_SIZE}
          />
        ))}
      </div>
    </div>
  );
};