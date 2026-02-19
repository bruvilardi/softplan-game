import React, { useState, useEffect } from 'react';
import { getTransformationInsight } from '../services/geminiService';
import { Score } from '../types';

interface WinModalProps {
  time: number;
  moves: number;
  onClose: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({ time, moves, onClose }) => {
  const [name, setName] = useState('');
  const [insight, setInsight] = useState<string>('Gerando insight de IA...');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch insight from Gemini when modal opens
    getTransformationInsight(time).then(setInsight);
  }, [time]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    
    const newScore: Score = {
      id: Date.now().toString(),
      name: name.trim(),
      time,
      moves,
      date: new Date().toISOString()
    };

    const existingScores = localStorage.getItem('softplan-puzzle-scores');
    const scores = existingScores ? JSON.parse(existingScores) : [];
    scores.push(newScore);
    localStorage.setItem('softplan-puzzle-scores', JSON.stringify(scores));

    // Small delay for UX
    setTimeout(() => {
        setIsSubmitting(false);
        onClose();
    }, 500);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100">
        <div className="bg-gradient-to-br from-softplan-blue to-softplan-dark p-8 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-inner">
            <span className="text-3xl">🎉</span>
          </div>
          <h3 className="text-2xl font-display font-bold text-white mb-1">Desafio Concluído!</h3>
          <p className="text-blue-100 text-sm font-light">Você montou o futuro do setor público.</p>
        </div>

        <div className="p-8">
          <div className="flex justify-center space-x-12 mb-8">
            <div className="text-center">
              <span className="block text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Tempo</span>
              <span className="text-3xl font-mono font-bold text-softplan-text">{formatTime(time)}</span>
            </div>
            <div className="text-center">
              <span className="block text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Movimentos</span>
              <span className="text-3xl font-mono font-bold text-softplan-text">{moves}</span>
            </div>
          </div>

          <div className="bg-blue-50 p-5 rounded-xl mb-8 border border-blue-100 relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-1 h-full bg-softplan-blue"></div>
            <div className="flex items-start relative z-10">
               <span className="text-xl mr-3">🤖</span>
               <p className="text-sm text-gray-600 italic leading-relaxed">
                 "{insight}"
               </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Digite seu nome para o Ranking
              </label>
              <input
                type="text"
                id="name"
                required
                maxLength={20}
                placeholder="Ex: Agente Inovador"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-softplan-blue focus:border-transparent outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-softplan-blue hover:bg-indigo-600 text-white font-bold py-3.5 rounded-lg transition-all duration-300 shadow-lg shadow-softplan-blue/20 flex justify-center items-center group"
            >
              {isSubmitting ? (
                 <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              ) : (
                <span className="group-hover:scale-105 transition-transform">Salvar Resultado</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};