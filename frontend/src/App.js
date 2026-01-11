import { useState, useEffect } from 'react';
import './App.css';

import Header from './components/Header';
import GenerateQuiz from './pages/GenerateQuiz';
import History from './pages/History';

function App() {
  const [activeTab, setActiveTab] = useState('generate');
  const [theme, setTheme] = useState('light');

  // 🔹 NEW: holds quiz selected for reattempt
  const [reattemptQuiz, setReattemptQuiz] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="app-container">
      <Header theme={theme} toggleTheme={toggleTheme} />

      <div className="tabs">
        <button
          className={activeTab === 'generate' ? 'active' : ''}
          onClick={() => setActiveTab('generate')}
        >
          Generate Quiz
        </button>

        <button
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          Past Quizzes
        </button>
      </div>

      <div className="content">
        {activeTab === 'generate' && (
          <GenerateQuiz
            reattemptQuiz={reattemptQuiz}
            clearReattempt={() => setReattemptQuiz(null)}
          />
        )}

        {activeTab === 'history' && (
          <History
            onReattempt={(quiz) => {
              setReattemptQuiz(quiz);
              setActiveTab('generate');
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
