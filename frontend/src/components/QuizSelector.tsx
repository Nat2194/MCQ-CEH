import { useEffect, useState } from "react";
import axios from "axios";

interface QuizQuestion {
  question: string;
  options: Record<string, string>;
  correct_answers: string[];
}

interface QuizSelectorProps {
  onStart: (data: QuizQuestion[], title: string) => void;
}

export default function QuizSelector({ onStart }: QuizSelectorProps) {
  const [files, setFiles] = useState<string[]>([]);
  const [count, setCount] = useState<number>(5);

  useEffect(() => {
    axios
      .get<string[]>("/quiz/list")
      .then((res) => {
        // Ensure we have an array, fallback to empty array if not
        const fileList = Array.isArray(res.data) ? res.data : [];
        setFiles(fileList);
      })
      .catch((err) => {
        console.error("Error loading quiz list:", err);
        setFiles([]); // Set empty array on error
      });
  }, []);

  const loadQuiz = async (filename: string) => {
    try {
      const res = await axios.get<QuizQuestion[]>(`/quiz/load/${filename}`);
      console.log("Quiz API response:", res.data); // Debug log

      // The API returns the quiz data directly as an array
      if (Array.isArray(res.data)) {
        onStart(res.data, filename);
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
      const res = await axios.get<QuizQuestion[]>(
        `/quiz/combined?count=${count}`
      );
      console.log("Combined quiz API response:", res.data); // Debug log

      // The API returns the quiz data directly as an array
      if (Array.isArray(res.data)) {
        onStart(res.data, `Combined-${count}`);
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
    setCount(Number(e.target.value));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-8">
      <div className="max-w-md w-full mx-4">
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Select a Quiz
          </h2>

          <div className="space-y-3 mb-6">
            {files.map((file) => (
              <button
                key={file}
                onClick={() => loadQuiz(file)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors font-medium"
              >
                {file}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Combined Quiz
            </h3>
            <div className="flex items-center space-x-3 mb-4">
              <label className="text-gray-300 font-medium">Questions:</label>
              <input
                type="number"
                className="bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-20"
                value={count}
                onChange={handleCountChange}
                min="1"
                max="50"
              />
            </div>
            <button
              onClick={loadCombined}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors font-medium"
            >
              Start Combined Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
