import { useState } from "react";
import QuizSelector from "./components/QuizSelector";
import QuizPlayer from "./components/QuizPlayer";

// Define types for better type safety
interface QuizQuestion {
  question: string;
  options: Record<string, string>;
  correct_answers: string[];
}

interface Quiz {
  data: QuizQuestion[];
  title: string;
}

function App() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  const handleStart = (data: QuizQuestion[], title: string) => {
    setQuiz({ data, title });
  };

  return (
    <div className="min-h-screen">
      {!quiz ? (
        <QuizSelector onStart={handleStart} />
      ) : (
        <QuizPlayer quiz={quiz} onExit={() => setQuiz(null)} />
      )}
    </div>
  );
}

export default App;
