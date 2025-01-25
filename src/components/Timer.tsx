import React, { useEffect } from 'react';
import { Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  timeLeft: number;
  onTimeUp: () => void;
}

export const Timer: React.FC<TimerProps> = ({ timeLeft, onTimeUp }) => {
  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  return (
    <div className={`flex items-center gap-2 text-lg font-semibold ${
      timeLeft <= 5 ? 'text-red-600' : 'text-gray-800'
    }`}>
      <TimerIcon className="w-6 h-6" />
      <span>{timeLeft}s</span>
    </div>
  );
};