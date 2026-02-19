import React, { useEffect, useState } from 'react';
import { Score } from '../types';

export const Leaderboard: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('softplan-puzzle-scores');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Sort by time (asc), then moves (asc)
      const sorted = parsed.sort((a: Score, b: Score) => {
        if (a.time !== b.time) return a.time - b.time;
        return a.moves - b.moves;
      });
      setScores(sorted);
    }
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
        <h2 className="text-2xl font-display font-bold text-softplan-dark mb-2">Ranking de Agentes</h2>
        <p className="text-softplan-muted text-sm">Os pioneiros na transformação digital.</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-bold text-softplan-muted uppercase tracking-wider">
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Agente</th>
              <th className="px-6 py-4">Tempo</th>
              <th className="px-6 py-4">Movimentos</th>
              <th className="px-6 py-4">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {scores.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-softplan-muted">
                  <div className="flex flex-col items-center">
                    <span className="text-4xl mb-3 opacity-30 grayscale">🏆</span>
                    <p>Nenhum registro ainda.</p>
                    <p className="text-sm mt-1 opacity-70">Seja o primeiro a completar o desafio!</p>
                  </div>
                </td>
              </tr>
            ) : (
              scores.map((score, index) => (
                <tr key={score.id} className={`transition-colors hover:bg-gray-50 ${index < 3 ? 'bg-blue-50/40' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {index === 0 && <span className="text-2xl drop-shadow-sm">🥇</span>}
                    {index === 1 && <span className="text-2xl drop-shadow-sm">🥈</span>}
                    {index === 2 && <span className="text-2xl drop-shadow-sm">🥉</span>}
                    {index > 2 && <span className="text-softplan-muted font-mono font-bold text-sm ml-2">{index + 1}</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-softplan-text">
                    {score.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-softplan-blue font-mono font-bold">
                    {formatTime(score.time)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-softplan-muted font-mono">
                    {score.moves}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-softplan-muted text-xs opacity-70">
                    {new Date(score.date).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};