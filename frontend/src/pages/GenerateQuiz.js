import { useState, useRef, useEffect } from 'react';
import './GenerateQuiz.css';

function GenerateQuiz({ reattemptQuiz, clearReattempt }) {
  const [url, setUrl] = useState('');
  const scoreCardRef = useRef(null);
  
  // State for quiz data from API
  const [questions, setQuestions] = useState([]);
  const [quizTitle, setQuizTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // State for selected answers
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showExplanations, setShowExplanations] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  // Scroll to score card when quiz is submitted
  useEffect(() => {
    if (isSubmitted && scoreCardRef.current) {
      scoreCardRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isSubmitted]);

  // ✅ NEW: Load quiz when reattempting from History
  useEffect(() => {
    if (reattemptQuiz) {
      setQuestions(reattemptQuiz.questions || []);
      setQuizTitle(reattemptQuiz.title || '');

      setSelectedAnswers({});
      setShowExplanations({});
      setIsSubmitted(false);
      setScore(null);
      setError('');

      if (clearReattempt) {
        clearReattempt();
      }
    }
  }, [reattemptQuiz]);

  const handleAnswerChange = (questionIndex, option) => {
    if (!isSubmitted) {
      setSelectedAnswers({
        ...selectedAnswers,
        [questionIndex]: option
      });
    }
  };

  const toggleExplanation = (questionIndex) => {
    setShowExplanations({
      ...showExplanations,
      [questionIndex]: !showExplanations[questionIndex]
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setIsLoading(true);
    setQuestions([]);
    setQuizTitle('');
    setSelectedAnswers({});
    setShowExplanations({});
    setIsSubmitted(false);
    setScore(null);

    try {
      const response = await fetch('http://localhost:8000/api/generate-quiz/', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const data = await response.json();

      if (data.questions) {
        setQuestions(data.questions);
      }

      if (data.title) {
        setQuizTitle(data.title);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while generating the quiz.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizSubmit = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.answer) {
        correct++;
      }
    });
    setScore(Math.round((correct / questions.length) * 100));
    setIsSubmitted(true);
  };

  const handleReattempt = () => {
    setIsSubmitted(false);
    setSelectedAnswers({});
    setShowExplanations({});
    setScore(null);
  };

  const getMotivationalMessage = () => {
    if (score === null) return '';
    if (score >= 80) return "Excellent work! 🎉";
    if (score >= 50) return "Good job! You're getting there 👍";
    return "Nice try! Reattempt to improve 💪";
  };

  const isCorrect = (question, option, questionIndex) =>
    isSubmitted && option === question.answer;

  const isWrong = (question, option, questionIndex) =>
    isSubmitted &&
    selectedAnswers[questionIndex] === option &&
    option !== question.answer;

  const getDifficultyClass = (difficulty) =>
    `difficulty-badge difficulty-${difficulty}`;

  const getOptionClass = (question, option, questionIndex) => {
    let className = 'option-label';
    if (isSubmitted) className += ' disabled';
    if (isCorrect(question, option, questionIndex)) className += ' option-correct';
    else if (isWrong(question, option, questionIndex)) className += ' option-wrong';
    return className;
  };

  return (
    <div className="generate-quiz-container">
      <div className="quiz-form-card">
        <form onSubmit={handleFormSubmit} className="quiz-form">
          <label htmlFor="wiki-url">Wikipedia Article URL</label>
          <input
            id="wiki-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://en.wikipedia.org/wiki/..."
            className="url-input"
          />
          <button type="submit" className="generate-button" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Quiz'}
          </button>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>

      {quizTitle && (
        <div className="quiz-title-card">
          <h2 className="quiz-title">{quizTitle}</h2>
        </div>
      )}

      {questions.length > 0 && (
        <>
          {isSubmitted && (
            <div ref={scoreCardRef} className="score-summary-card">
              <div className="score-display">
                <span className="score-label">Your Score:</span>
                <span className="score-value">{score}%</span>
              </div>
              <div className="motivational-message">
                {getMotivationalMessage()}
              </div>
            </div>
          )}

          <div className="quiz-cards-container">
            {questions.map((question, questionIndex) => (
              <article key={questionIndex} className="quiz-card">
                <div className="quiz-header">
                  <h3 className="quiz-question">{question.question}</h3>
                  <span className={getDifficultyClass(question.difficulty)}>
                    {question.difficulty}
                  </span>
                </div>

                <div className="quiz-options">
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className={getOptionClass(question, option, questionIndex)}
                    >
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        value={option}
                        checked={selectedAnswers[questionIndex] === option}
                        onChange={() => handleAnswerChange(questionIndex, option)}
                        disabled={isSubmitted}
                        className="option-radio"
                      />
                      <span>{option}</span>
                      {isCorrect(question, option, questionIndex) && (
                        <span className="answer-indicator correct-indicator">✓ Correct</span>
                      )}
                      {isWrong(question, option, questionIndex) && (
                        <span className="answer-indicator wrong-indicator">✗ Wrong</span>
                      )}
                    </label>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => toggleExplanation(questionIndex)}
                  className="explanation-button"
                >
                  {showExplanations[questionIndex] ? 'Hide Explanation' : 'Show Explanation'}
                </button>

                {showExplanations[questionIndex] && (
                  <div className="explanation-text">
                    {question.explanation}
                  </div>
                )}
              </article>
            ))}
          </div>

          <div className="quiz-actions">
            {!isSubmitted ? (
              <button type="button" onClick={handleQuizSubmit} className="submit-button">
                Submit Quiz
              </button>
            ) : (
              <button type="button" onClick={handleReattempt} className="reattempt-button">
                Reattempt Quiz
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default GenerateQuiz;
