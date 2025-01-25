import React from 'react';
import { Trophy, Medal, Star } from 'lucide-react';
import { Score } from '../types/quiz';

interface LeaderboardProps {
  scores: Score[];
  preview?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ scores, preview = false }) => {
  const displayScores = preview ? scores.slice(0, 5) : scores.slice(0, 10);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Leaderboard</h2>
      </div>
      <div className="space-y-2 sm:space-y-3">
        {displayScores.map((score, index) => (
          <div
            key={`${score.nickname}-${score.timestamp}`}
            className={`flex items-center justify-between p-3 sm:p-4 rounded-lg transition-all duration-300 ${
              index === 0
                ? 'bg-yellow-100 text-yellow-900'
                : index === 1
                ? 'bg-gray-200 text-gray-900'
                : index === 2
                ? 'bg-orange-100 text-orange-900'
                : 'bg-white/80 text-gray-800'
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              {index === 0 ? (
                <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              ) : index === 1 ? (
                <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              ) : index === 2 ? (
                <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              ) : (
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--pitch-green)]" />
              )}
              <span className="text-sm sm:text-base truncate max-w-[120px] sm:max-w-[200px]">{score.nickname}</span>
            </div>
            <span className="font-semibold text-sm sm:text-base">{score.score} pts</span>
          </div>
        ))}
        {displayScores.length === 0 && (
          <div className="text-center text-gray-600 py-3 sm:py-4 text-sm sm:text-base">
            No scores yet. Be the first to play!
          </div>
        )}
      </div>
    </div>
  );
};