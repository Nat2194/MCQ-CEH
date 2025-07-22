import { useState } from "react";
import axios from "axios";

interface QuizQuestion {
  question: string;
  options: Record<string, string>;
  correct_answers: string[];
  explanation?: string;
}

interface Quiz {
  data: QuizQuestion[];
  title: string;
}

interface QuizPlayerProps {
  quiz: Quiz;
  onExit: () => void;
}

interface Answers {
  [key: number]: string[];
}

export default function QuizPlayer({ quiz, onExit }: QuizPlayerProps) {
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const handleSelect = (index: number, option: string) => {
    setAnswers((prev) => {
      const currentAnswers = prev[index] || [];
      const isSelected = currentAnswers.includes(option);

      if (isSelected) {
        // Remove the option if it's already selected
        return {
          ...prev,
          [index]: currentAnswers.filter((a) => a !== option),
        };
      } else {
        // Add the option if it's not selected
        return {
          ...prev,
          [index]: [...currentAnswers, option],
        };
      }
    });
  };

  const handleSubmit = () => {
    if (!quiz.data || !Array.isArray(quiz.data)) {
      console.error("Quiz data is invalid:", quiz);
      return;
    }

    const calculatedScore = quiz.data.reduce((acc, q, idx) => {
      const correct = q.correct_answers.sort().join(",");
      const selected = (answers[idx] || []).sort().join(",");
      return acc + (correct === selected ? 1 : 0);
    }, 0);

    setScore(calculatedScore);

    axios.post("/results", {
      title: quiz.title,
      score: calculatedScore,
      total: quiz.data?.length || 0,
      answers,
    });

    setSubmitted(true);
  };

  // Check if a question was answered correctly
  const isCorrect = (questionIndex: number): boolean => {
    const question = quiz.data[questionIndex];
    const correct = question.correct_answers.sort().join(",");
    const selected = (answers[questionIndex] || []).sort().join(",");
    return correct === selected;
  };

  // Get the correct answer text for display
  const getAnswerText = (
    question: QuizQuestion,
    answerKeys: string[]
  ): string => {
    return answerKeys
      .map((key) => `${key}. ${question.options[key]}`)
      .join(", ");
  };

  // Add validation to ensure quiz.data exists and is an array
  if (!quiz || !quiz.data || !Array.isArray(quiz.data)) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center">
        <div className="absolute top-4 left-4 space-x-2">
          <button
            onClick={onExit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
          >
            Exit Quiz
          </button>
        </div>
        <div className="max-w-md w-full mx-4 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
            <h2 className="text-xl font-bold text-red-400 mb-3">Error</h2>
            <p className="text-gray-300 mb-4">
              Invalid quiz data. Please go back and select a quiz.
            </p>
            <button
              onClick={onExit}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    const percentage = Math.round((score / quiz.data.length) * 100);

    return (
      <div className="min-h-screen bg-gray-900 flex justify-center py-8">
        <div className="absolute top-4 left-4 space-x-2">
          <button
            onClick={onExit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
          >
            Exit Quiz
          </button>
        </div>
        <div className="max-w-4xl w-full px-4 space-y-6">
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-2 text-white">
              Quiz Complete: {quiz.title}
            </h2>
            <p className="text-lg text-gray-300">
              Your Score:{" "}
              <span className="font-bold text-blue-400">
                {score} / {quiz.data.length}
              </span>{" "}
              <span className="text-purple-400">({percentage}%)</span>
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">
              Review Your Answers:
            </h3>

            {quiz.data.map((question, idx) => {
              const userAnswers = answers[idx] || [];
              const correct = isCorrect(idx);

              return (
                <div
                  key={idx}
                  className={`border-2 p-6 rounded-lg bg-gray-800 ${
                    correct ? "border-green-500/50" : "border-red-500/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-semibold text-lg text-white">
                      Question {idx + 1}
                    </h4>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        correct
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {correct ? "✓ Correct" : "✗ Incorrect"}
                    </span>
                  </div>

                  <p className="mb-4 text-gray-200">{question.question}</p>

                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-300">
                        Your Answer:{" "}
                      </span>
                      <span
                        className={
                          userAnswers.length > 0
                            ? correct
                              ? "text-green-400"
                              : "text-red-400"
                            : "text-gray-500"
                        }
                      >
                        {userAnswers.length > 0
                          ? getAnswerText(question, userAnswers)
                          : "No answer selected"}
                      </span>
                    </div>

                    <div>
                      <span className="font-medium text-gray-300">
                        Correct Answer:{" "}
                      </span>
                      <span className="text-green-400 font-medium">
                        {getAnswerText(question, question.correct_answers)}
                      </span>
                    </div>
                  </div>

                  {/* Show all options for reference */}
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-400 mb-3">All options:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {Object.entries(question.options).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center space-x-2 text-gray-300"
                        >
                          <span className="font-medium text-gray-400">
                            {key}.
                          </span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Explanation for failed questions */}
                  {!correct && question.explanation && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="font-medium text-gray-300 mb-2">
                        Explanation:
                      </p>
                      <p className="text-gray-400">{question.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-center pt-6">
            <button
              onClick={onExit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-medium"
            >
              Take Another Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center py-8">
      <div className="absolute top-4 left-4 space-x-2">
        <button
          onClick={onExit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
        >
          Exit Quiz
        </button>
      </div>
      <div className="max-w-4xl w-full px-4 space-y-6">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          {quiz.title}
        </h2>

        {quiz.data.map((q, idx) => (
          <div
            key={idx}
            className="bg-gray-800 border border-gray-700 p-6 rounded-lg"
          >
            <p className="font-semibold text-white mb-4">
              Question {idx + 1}: {q.question}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(q.options).map(([key, val]) => (
                <label
                  key={key}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={(answers[idx] || []).includes(key)}
                    onChange={() => handleSelect(idx, key)}
                    className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-gray-300">
                    <span className="font-medium text-gray-200">{key}.</span>{" "}
                    {val}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-center pt-4">
          <button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition-colors font-medium"
          >
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
