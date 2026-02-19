import React, { useState, useEffect } from 'react';
import { PuzzleBoard } from './components/PuzzleBoard';
import { Leaderboard } from './components/Leaderboard';
import { WinModal } from './components/WinModal';
import { generatePuzzleImage } from './utils/gameLogic';

export default function App() {
  const [currentView, setCurrentView] = useState<'game' | 'leaderboard'>('game');
  const [winData, setWinData] = useState<{ time: number; moves: number } | null>(null);
  const [puzzleImage, setPuzzleImage] = useState<string | null>(null);

  useEffect(() => {
    // Generate the specific Softplan themed image on mount
    // Now async to support logo loading
    generatePuzzleImage("Juntos, pela transformação digital no Setor Público")
      .then(setPuzzleImage);
  }, []);

  const handleGameWin = (time: number, moves: number) => {
    setWinData({ time, moves });
  };

  const handleCloseModal = () => {
    setWinData(null);
    setCurrentView('leaderboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-softplan-bg text-softplan-text font-sans">
      {/* Header - Dark Theme */}
      <header className="bg-slate-900 text-white border-b border-white/5 z-10 sticky top-0 shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Added brightness filter to ensure logo visibility on dark background if transparent */}
            <img 
              src="https://www.softplan.com.br/wp-content/uploads/2025/11/Logo-1.png.webp" 
              alt="Softplan" 
              className="h-8 w-auto object-contain brightness-0 invert"
            />
            <div className="h-5 w-px bg-white/20 hidden sm:block"></div>
            <h1 className="text-lg font-display font-medium text-white tracking-wide uppercase hidden sm:block">
              Puzzle Challenge
            </h1>
          </div>
          <nav className="flex space-x-2">
            <button
              onClick={() => setCurrentView('game')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                currentView === 'game'
                  ? 'bg-softplan-blue text-white shadow-lg shadow-softplan-blue/25'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Jogar
            </button>
            <button
              onClick={() => setCurrentView('leaderboard')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                currentView === 'leaderboard'
                  ? 'bg-softplan-blue text-white shadow-lg shadow-softplan-blue/25'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Ranking
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-200/40 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-200/40 rounded-full blur-[100px]"></div>
        </div>

        {puzzleImage ? (
          <div className="w-full max-w-4xl z-0 animate-fade-in">
            {currentView === 'game' ? (
              <PuzzleBoard 
                imageSrc={puzzleImage} 
                onWin={handleGameWin} 
              />
            ) : (
              <Leaderboard />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 text-softplan-blue min-h-[400px]">
            <div className="animate-spin h-10 w-10 border-4 border-softplan-blue border-t-transparent rounded-full"></div>
            <span className="font-semibold tracking-wide text-lg">Preparando desafio...</span>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-softplan-bg border-t border-gray-200 text-softplan-muted py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm">
          <p>© {new Date().getFullYear()} Softplan Demo. Powered by React, Tailwind & Gemini.</p>
        </div>
      </footer>

      {/* Modals */}
      {winData && (
        <WinModal
          time={winData.time}
          moves={winData.moves}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}