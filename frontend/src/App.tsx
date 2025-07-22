// App.tsx
import { useState } from "react";
import QuizSelector from "./components/QuizSelector";
import QuizPlayer from "./components/QuizPlayer";
//import ResultsViewer from "./components/ResultsViewer";

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

type AppView = "selector" | "quiz" | "results";

function App() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentView, setCurrentView] = useState<AppView>("selector");

  const handleStart = (data: QuizQuestion[], title: string) => {
    setQuiz({ data, title });
    setCurrentView("quiz");
  };

  const handleExitQuiz = () => {
    setQuiz(null);
    setCurrentView("selector");
  };

  /*const showResults = () => {
    setCurrentView("results");
  };*/

  return (
    <div className="min-h-screen">
      {currentView === "selector" && (
        <QuizSelector
          onStart={handleStart}
          onViewResults={() => setCurrentView("results")}
        />
      )}
      {currentView === "quiz" && quiz && (
        <QuizPlayer quiz={quiz} onExit={handleExitQuiz} />
      )}
    </div>
  );
}

export default App;
