import React, { useState, useEffect } from 'react';
import { Trophy, Play, History, Tally1 as Ball, Star } from 'lucide-react';
import { QuizQuestion } from './components/QuizQuestion';
import { Leaderboard } from './components/Leaderboard';
import { questions } from './data/questions';
import { Score, QuizState, Category } from './types/quiz';

const QUESTION_TIME = 15;
const POINTS_PER_QUESTION = 10;

const initialQuizState: QuizState = {
  currentQuestion: 0,
  score: 0,
  timeLeft: QUESTION_TIME,
  answers: [],
  isComplete: false,
};

function App() {
  const [view, setView] = useState<'home' | 'quiz' | 'complete'>('home');
  const [quizState, setQuizState] = useState<QuizState>(initialQuizState);
  const [scores, setScores] = useState<Score[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('world-cup');

  const filteredQuestions = questions.filter(q => q.category === selectedCategory);

  useEffect(() => {
    let timer: number;
    if (view === 'quiz' && quizState.timeLeft > 0 && !quizState.isComplete) {
      timer = window.setInterval(() => {
        setQuizState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [view, quizState.timeLeft, quizState.isComplete]);

  const startQuiz = () => {
    setQuizState(initialQuizState);
    setView('quiz');
  };

  const handleAnswer = (answerIndex: number) => {
    const currentQuestion = filteredQuestions[quizState.currentQuestion];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    setQuizState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + POINTS_PER_QUESTION : prev.score,
      answers: [...prev.answers, answerIndex],
      currentQuestion: prev.currentQuestion + 1,
      timeLeft: QUESTION_TIME,
      isComplete: prev.currentQuestion + 1 >= filteredQuestions.length,
    }));

    if (quizState.currentQuestion + 1 >= filteredQuestions.length) {
      setView('complete');
    }
  };

  const submitScore = (nickname: string) => {
    const newScore: Score = {
      nickname,
      score: quizState.score,
      timestamp: Date.now(),
    };
    setScores(prev => [...prev, newScore].sort((a, b) => b.score - a.score));
    setView('home');
  };

  return (
    <div className="min-h-screen text-white flex flex-col">
      <div className="flex-grow">
        {view === 'home' && (
          <div className="max-w-6xl mx-auto p-4 sm:p-6">
            <div className="text-center mb-8 sm:mb-12">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4">
                <Ball className="w-8 h-8 sm:w-12 sm:h-12 text-green-400" />
                <h1 className="text-3xl sm:text-5xl font-bold text-white text-center">Football Quiz Challenge</h1>
                <Ball className="w-8 h-8 sm:w-12 sm:h-12 text-green-400 hidden sm:block" />
              </div>
              <p className="text-lg sm:text-xl text-gray-300">Test your football knowledge!</p>
            </div>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-4 sm:space-y-6">
                <div className="glass-morphism rounded-lg shadow-xl p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Select Category</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {['world-cup', 'champions-league', 'players', 'clubs', 'records'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat as Category)}
                        className={`p-3 sm:p-4 rounded-lg transition-all duration-300 ${
                          selectedCategory === cat
                            ? 'bg-[var(--pitch-green)] text-white shadow-lg scale-105'
                            : 'bg-white/80 hover:bg-[var(--grass-light)] hover:text-white text-gray-800'
                        }`}
                      >
                        {cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={startQuiz}
                  className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-[var(--pitch-green)] text-white rounded-lg shadow-xl hover:bg-[var(--grass-light)] transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                  Start Quiz
                </button>
              </div>

              <div className="glass-morphism rounded-lg shadow-xl">
                <Leaderboard scores={scores} preview />
              </div>
            </div>
          </div>
        )}

        {view === 'quiz' && !quizState.isComplete && (
          <div className="max-w-4xl mx-auto p-4 sm:p-6">
            <div className="mb-4 sm:mb-6 flex justify-between items-center glass-morphism rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 text-gray-800">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                <span className="font-semibold text-base sm:text-lg">Score: {quizState.score}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-800">
                <History className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-base sm:text-lg">Question {quizState.currentQuestion + 1}/{filteredQuestions.length}</span>
              </div>
            </div>

            <QuizQuestion
              question={filteredQuestions[quizState.currentQuestion]}
              onAnswer={handleAnswer}
              timeLeft={quizState.timeLeft}
              onTimeUp={() => handleAnswer(-1)}
            />
          </div>
        )}

        {view === 'complete' && (
          <div className="max-w-md mx-auto p-4 sm:p-6">
            <div className="glass-morphism rounded-lg shadow-xl p-6 sm:p-8 text-center">
              <div className="flex justify-center mb-4">
                <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">Quiz Complete!</h2>
              <p className="text-lg sm:text-xl mb-6 text-gray-700">Your score: {quizState.score}</p>
              
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Enter your nickname"
                  className="w-full p-3 border rounded-lg mb-4 bg-white/90"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      submitScore((e.target as HTMLInputElement).value);
                    }
                  }}
                />
                <button
                  onClick={() => submitScore('Anonymous')}
                  className="w-full py-3 px-4 bg-[var(--pitch-green)] text-white rounded-lg hover:bg-[var(--grass-light)] transition-all duration-300"
                >
                  Submit Score
                </button>
              </div>

              <button
                onClick={() => setView('home')}
                className="text-[var(--pitch-green)] hover:text-[var(--grass-light)] hover:underline transition-colors duration-300"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="footer-credit py-3 sm:py-4 px-4 sm:px-6 mt-6 sm:mt-8">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 text-gray-300">
          <Star className="w-4 h-4" />
          <p className="text-sm sm:text-base">Created by Siradj Eddine</p>
          <Star className="w-4 h-4" />
        </div>
      </footer>
    </div>
  );
}

export default App;