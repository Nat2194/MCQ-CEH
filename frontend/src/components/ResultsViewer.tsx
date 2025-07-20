import { useEffect, useState } from "react";
import axios from "axios";

interface Result {
  title: string;
  date: string;
  score: number;
  total: number;
}

export default function ResultsViewer() {
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    axios.get<Result[]>("/results").then((res) => setResults(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Previous Results
        </h2>

        <div className="space-y-4">
          {results.length > 0 ? (
            results.map((res, idx) => (
              <div
                key={idx}
                className="bg-gray-800 border border-gray-700 p-6 rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white text-lg">{res.title}</h3>
                  <span className="text-gray-400 text-sm">{res.date}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300">Score:</span>
                  <span className="font-bold text-blue-400">
                    {res.score} / {res.total}
                  </span>
                  <span className="text-purple-400">
                    ({Math.round((res.score / res.total) * 100)}%)
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg text-center">
              <p className="text-gray-400">No quiz results found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
