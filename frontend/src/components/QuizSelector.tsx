import { useEffect, useState } from "react";
import axios from "axios";

interface QuizQuestion {
  question: string;
  options: Record<string, string>;
  correct_answers: string[];
}

export interface QuizSelectorProps {
  onStart: (data: QuizQuestion[], title: string) => void;
  onViewResults: () => void;
}

export default function QuizSelector({
  onStart,
  onViewResults,
}: QuizSelectorProps) {
  const [modules, setModules] = useState<string[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [quizzes, setQuizzes] = useState<string[]>([]);
  const [count, setCount] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await axios.get<string[]>("/quiz/modules");
        setModules(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading modules:", err);
        setModules([]);
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  useEffect(() => {
    if (selectedModule) {
      const fetchQuizzes = async () => {
        try {
          const res = await axios.get<string[]>(`/quiz/list/${selectedModule}`);
          setQuizzes(res.data);
        } catch (err) {
          console.error("Error loading quizzes:", err);
          setQuizzes([]);
        }
      };

      fetchQuizzes();
    } else {
      setQuizzes([]);
    }
  }, [selectedModule]);

  const loadQuiz = async (filename: string) => {
    try {
      const res = await axios.get<QuizQuestion[]>(
        `/quiz/load/${filename}?module=${selectedModule}`
      );

      if (Array.isArray(res.data)) {
        onStart(res.data, `${selectedModule}/${filename}`);
      } else {
        console.error("Expected array but got:", res.data);
        alert("Unexpected quiz data format received.");
      }
    } catch (err) {
      console.error("Error loading quiz:", err);
      alert("Failed to load quiz. Please try again.");
    }
  };

  const loadCombined = async () => {
    try {
      const endpoint = selectedModule
        ? `/quiz/combined?count=${count}&module=${selectedModule}`
        : `/quiz/combined?count=${count}`;

      const res = await axios.get<QuizQuestion[]>(endpoint);

      if (Array.isArray(res.data)) {
        const title = selectedModule
          ? `Combined-${selectedModule}-${count}`
          : `Combined-All-${count}`;
        onStart(res.data, title);
      } else {
        console.error("Expected array but got:", res.data);
        alert("Unexpected combined quiz data format received.");
      }
    } catch (err) {
      console.error("Error loading combined quiz:", err);
      alert("Failed to load combined quiz. Please try again.");
    }
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Math.max(1, Number(e.target.value)), 1000);
    setCount(value);
  };

  const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModule(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading modules...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-8">
      <div className="max-w-md w-full mx-4">
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg space-y-6">
          <h2 className="text-2xl font-bold text-white text-center">
            Select a Quiz
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Module:
              </label>
              <select
                value={selectedModule}
                onChange={handleModuleChange}
                className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Modules</option>
                {modules.map((module) => (
                  <option key={module} value={module}>
                    {module}
                  </option>
                ))}
              </select>
            </div>

            {selectedModule && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">
                  Module Quizzes:
                </h3>
                {quizzes.length > 0 ? (
                  quizzes.map((quiz) => (
                    <button
                      key={quiz}
                      onClick={() => loadQuiz(quiz)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors font-medium"
                    >
                      {quiz}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-400">
                    No quizzes found in this module
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-gray-700 pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Combined Quiz</h3>
            <div className="flex items-center space-x-3">
              <label className="text-gray-300 font-medium">Questions:</label>
              <input
                type="number"
                className="bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-20"
                value={count}
                onChange={handleCountChange}
                min="1"
                max="1000"
              />
            </div>
            <button
              onClick={loadCombined}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors font-medium"
            >
              {selectedModule
                ? `Start Combined ${selectedModule} Quiz`
                : "Start Combined All Modules Quiz"}
            </button>
            <div className="flex justify-center pt-4">
              <button
                onClick={onViewResults}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition-colors font-medium"
              >
                View Previous Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
