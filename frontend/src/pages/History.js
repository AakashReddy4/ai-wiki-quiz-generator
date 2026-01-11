import { useState, useEffect } from 'react';
import './History.css';

function History({ onReattempt }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [isLoadingQuizDetails, setIsLoadingQuizDetails] = useState(false);
  const [quizDetailsError, setQuizDetailsError] = useState(null);
  const [showExplanations, setShowExplanations] = useState({});
  
  // Mock user answers for each quiz (simulating previous attempts)
  // Note: This is still mock data as backend doesn't store user answers
  const mockUserAnswers = {};

  const shortenUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.replace('/wiki/', '');
    } catch {
      return url.length > 50 ? url.substring(0, 50) + '...' : url;
    }
  };

  // Fetch quiz history on component mount
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/history/', {
          method: 'GET',
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch quiz history');
        }

        const data = await response.json();
        setHistory(data);
      } catch (err) {
        console.error('Error fetching history:', err);
        setHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewDetails = async (quiz) => {
    // Open modal immediately with loading state
    setSelectedQuizId(quiz.id);
    setSelectedQuiz(null);
    setQuizDetailsError(null);
    setIsLoadingQuizDetails(true);
    setShowExplanations({});

    try {
      // Fetch full quiz details for the modal
      const response = await fetch(`http://localhost:8000/api/history/${quiz.id}/`, {
        method: 'GET',
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quiz details');
      }

      const data = await response.json();
      // Map backend response to match expected format
      const fullQuiz = {
        ...data,
        dateGenerated: data.created_at
      };
      setSelectedQuiz(fullQuiz);
      setQuizDetailsError(null);
    } catch (err) {
      console.error('Error fetching quiz details:', err);
      setQuizDetailsError(err.message || 'An error occurred while loading quiz details. Please try again.');
      setSelectedQuiz(null);
    } finally {
      setIsLoadingQuizDetails(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedQuiz(null);
    setSelectedQuizId(null);
    setShowExplanations({});
    setQuizDetailsError(null);
    setIsLoadingQuizDetails(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const toggleExplanation = (questionId) => {
    setShowExplanations({
      ...showExplanations,
      [questionId]: !showExplanations[questionId]
    });
  };

  const getDifficultyClass = (difficulty) => {
    return `difficulty-badge difficulty-${difficulty}`;
  };

  // Calculate score for selected quiz
  const calculateScore = (quiz) => {
    if (!quiz || !quiz.questions || quiz.questions.length === 0) return { correct: 0, total: 0 };
    const userAnswers = mockUserAnswers[quiz.id] || {};
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      // Use index as fallback if question.id doesn't exist
      const questionKey = question.id !== undefined ? question.id : index;
      if (userAnswers[questionKey] === question.answer) {
        correct++;
      }
    });
    return { correct, total: quiz.questions.length };
  };

  // Get score percentage
  const getScorePercentage = (quiz) => {
    const { correct, total } = calculateScore(quiz);
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  };

  // Get motivational message based on score (same logic as GenerateQuiz)
  const getMotivationalMessage = (score) => {
    if (score >= 80) return "Excellent work! 🎉";
    if (score >= 50) return "Good job! You're getting there 👍";
    return "Nice try! Reattempt to improve 💪";
  };

  // Check if user's answer was correct
  const isUserAnswerCorrect = (quiz, question) => {
    const userAnswers = mockUserAnswers[quiz.id] || {};
    return userAnswers[question.id] === question.answer;
  };

  // Get user's selected answer
  const getUserAnswer = (quiz, question, questionIndex) => {
    const userAnswers = mockUserAnswers[quiz.id] || {};
    // Use index as fallback if question.id doesn't exist
    const questionKey = question.id !== undefined ? question.id : questionIndex;
    return userAnswers[questionKey];
  };

  const handleReattempt = () => {
    if (selectedQuiz && onReattempt) {
      onReattempt(selectedQuiz);
      handleCloseModal();
    }
  };
  

  return (
    <div className="history-container">
      <h2 className="history-title">Past Quizzes</h2>
      
      {isLoading ? (
        <div className="empty-state">
          <p>Loading quiz history...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="empty-state">
          <p>No quizzes generated yet. Create your first quiz to see it here!</p>
        </div>
      ) : (
        <div className="history-cards">
          {history.map((quiz) => (
            <article key={quiz.id} className="history-card">
              <div className="history-card-content">
                <h3 className="history-card-title">{quiz.title}</h3>
                <p className="history-card-url">{shortenUrl(quiz.url)}</p>
                <p className="history-card-date">Generated: {formatDate(quiz.created_at)}</p>
              </div>
              <button
                type="button"
                onClick={() => handleViewDetails(quiz)}
                className="view-details-button"
              >
                View Details
              </button>
            </article>
          ))}
        </div>
      )}

      {/* Modal for viewing quiz details */}
      {selectedQuizId && (
        <div
          className="modal-backdrop"
          onClick={handleBackdropClick}
        >
          <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {selectedQuiz ? selectedQuiz.title : 'Loading Quiz Details...'}
              </h2>
              <button
                type="button"
                onClick={handleCloseModal}
                className="modal-close-button"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {isLoadingQuizDetails && (
              <div className="modal-loading">
                <p>Loading quiz details...</p>
              </div>
            )}

            {quizDetailsError && (
              <div className="modal-error">
                <p>{quizDetailsError}</p>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="modal-error-close"
                >
                  Close
                </button>
              </div>
            )}

            {selectedQuiz && !isLoadingQuizDetails && !quizDetailsError && (
              <>
                <div className="modal-quiz-info">
                  <p className="modal-url">URL: {selectedQuiz.url}</p>
                  <p className="modal-date">Generated: {formatDate(selectedQuiz.dateGenerated)}</p>
                </div>

                <div className="modal-info-note">
                  <p>
                    <strong>Correct Answers Reference</strong><br />
                    This view shows the correct answers generated for this quiz.
                  </p>
                </div>


                <div className="modal-quiz-cards">
                  {selectedQuiz.questions && selectedQuiz.questions.length > 0 ? (
                    selectedQuiz.questions.map((question, questionIndex) => {
                      // Use index as key fallback if question.id doesn't exist
                      const questionKey = question.id !== undefined ? question.id : questionIndex;
                      const isCorrectAnswer = (option) => option === question.answer;
                      
                      return (
                        <article key={questionKey} className="quiz-card">
                          <div className="quiz-header">
                            <h3 className="quiz-question">{question.question}</h3>
                            {question.difficulty && (
                              <span className={getDifficultyClass(question.difficulty)}>
                                {question.difficulty}
                              </span>
                            )}
                          </div>

                          {question.options && question.options.length > 0 && (
                            <div className="quiz-options">
                              {question.options.map((option, optionIndex) => {
                                const isCorrect = isCorrectAnswer(option);
                                
                                return (
                                  <label 
                                    key={optionIndex} 
                                    className={`option-label ${isCorrect ? 'option-correct' : ''}`}
                                  >
                                    <input
                                      type="radio"
                                      name={`modal-question-${questionKey}`}
                                      value={option}
                                      checked={isCorrect}
                                      readOnly
                                      disabled
                                      className="option-radio"
                                    />
                                    <span>{option}</span>
                                    {isCorrect && (
                                      <span className="answer-indicator correct-indicator">✓ Correct Answer</span>
                                    )}
                                  </label>
                                );
                              })}
                            </div>
                          )}

                          {question.explanation && (
                            <>
                              <button
                                type="button"
                                onClick={() => toggleExplanation(questionKey)}
                                className="explanation-button"
                              >
                                {showExplanations[questionKey] ? 'Hide Explanation' : 'Show Explanation'}
                              </button>

                              {showExplanations[questionKey] && (
                                <div className="explanation-text">
                                  {question.explanation}
                                </div>
                              )}
                            </>
                          )}
                        </article>
                      );
                    })
                  ) : (
                    <div className="modal-empty">
                      <p>No questions available for this quiz.</p>
                    </div>
                  )}
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={handleReattempt}
                    className="reattempt-button"
                  >
                    Reattempt Quiz
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default History;
