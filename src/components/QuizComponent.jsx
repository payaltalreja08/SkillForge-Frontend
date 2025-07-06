import React, { useState } from 'react';

const QuizComponent = ({ quizzes, onNext }) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleOption = (option) => setSelected(option);

  const handleNext = () => {
    if (selected === quizzes[current].correctAnswer) {
      setScore(score + 1);
    }
    setSelected('');
    if (current < quizzes.length - 1) {
      setCurrent(current + 1);
    } else {
      setShowResult(true);
    }
  };

  if (!quizzes || quizzes.length === 0) return <div>No quiz available.</div>;

  if (showResult) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold mb-2">Quiz Completed!</h2>
        <p className="mb-4">Your score: {score} / {quizzes.length}</p>
        <button className="bg-purple-600 text-white px-4 py-2 rounded" onClick={onNext}>Next</button>
      </div>
    );
  }

  const quiz = quizzes[current];

  return (
    <div className="p-4">
      <h3 className="font-semibold mb-2">Question {current + 1} of {quizzes.length}</h3>
      <p className="mb-4">{quiz.question}</p>
      <div className="space-y-2 mb-4">
        {quiz.options.map((opt, idx) => (
          <button
            key={idx}
            className={`block w-full text-left px-4 py-2 rounded border ${selected === opt ? 'bg-purple-100 border-purple-500' : 'border-gray-300'} mb-1`}
            onClick={() => handleOption(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded mt-2"
        onClick={handleNext}
        disabled={!selected}
      >
        {current === quizzes.length - 1 ? 'Submit' : 'Next'}
      </button>
    </div>
  );
};

export default QuizComponent; 