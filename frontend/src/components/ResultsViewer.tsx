// Add props interface
export interface ResultsViewerProps {
  onBack: () => void;
  onStartQuiz: () => void;
}

// Add navigation buttons at the bottom of the component
<div className="flex justify-center pt-6 gap-4">
  <button
    onClick={onBack}
    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-medium"
  >
    Back to Quiz Selector
  </button>
  <button
    onClick={onStartQuiz}
    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition-colors font-medium"
  >
    Start New Quiz
  </button>
</div>;
