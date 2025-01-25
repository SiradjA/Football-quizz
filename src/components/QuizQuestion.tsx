import React, { useState } from 'react';
import { Question } from '../types/quiz';
import { Timer } from './Timer';
import { CheckCircle, XCircle, Tally1 as Ball } from 'lucide-react';

interface QuizQuestionProps {
  question: Question;
  onAnswer: (index: number) => void;
  timeLeft: number;
  onTimeUp: () => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswer,
  timeLeft,
  onTimeUp,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      onAnswer(index);
    }, 1000);
  };

  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="glass-morphism rounded-lg shadow-xl p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Ball className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--pitch-green)]" />
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Question</h2>
        </div>
        <Timer timeLeft={timeLeft} onTimeUp={onTimeUp} />
      </div>
      
      {question.image && (
        <div className="mb-4 sm:mb-6">
          <img
            src={question.image}
            alt="Question"
            className="w-full h-48 sm:h-64 object-cover rounded-lg shadow-lg"
          />
        </div>
      )}
      
      <p className="text-lg sm:text-xl mb-4 sm:mb-6 text-gray-800">{question.text}</p>
      
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !showFeedback && handleAnswer(index)}
            disabled={showFeedback}
            className={`p-3 sm:p-4 text-left rounded-lg transition-all duration-300 ${
              showFeedback
                ? index === question.correctAnswer
                  ? 'bg-green-100 border-green-500 text-green-700'
                  : index === selectedAnswer
                  ? 'bg-red-100 border-red-500 text-red-700'
                  : 'glass-morphism text-gray-800'
                : 'glass-morphism hover:bg-[var(--grass-light)] hover:text-white text-gray-800 hover:scale-102'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-2">
                <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
                <span className="text-sm sm:text-base">{option}</span>
              </div>
              {showFeedback && index === selectedAnswer && (
                <div className="flex-shrink-0">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                  )}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};