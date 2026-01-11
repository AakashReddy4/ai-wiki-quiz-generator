import { useState } from 'react';
import { FaGithub, FaBookOpen } from 'react-icons/fa';
import { FiInfo, FiMoon, FiSun } from 'react-icons/fi';

import './Header.css';


function Header({ theme, toggleTheme }) {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <header className="header">
      <div className="logo">
        <FaBookOpen className="logo-icon" />
        <span>WikiQuiz</span>
      </div>


        <div className="header-actions">
        {/* GitHub link */}
        <a
            href="https://github.com/your-username/your-repo-name"
            target="_blank"
            rel="noreferrer"
            className="icon-button"
            title="View GitHub Repository"
        >
            <FaGithub />
        </a>

        {/* About button */}
        <button
            className="icon-button"
            onClick={() => setShowAbout(true)}
            title="About this project"
        >
            <FiInfo />
        </button>

        {/* Theme toggle */}
        <button
            className="icon-button"
            onClick={toggleTheme}
            title="Toggle theme"
        >
            {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>
        </div>

      </header>

      {/* About Modal */}
      {showAbout && (
        <div
          className="modal-backdrop"
          onClick={() => setShowAbout(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>AI Wiki Quiz Generator</h2>

            <p><strong>Built using:</strong></p>
            <ul>
              <li>React</li>
              <li>Django REST Framework</li>
              <li>BeautifulSoup (Wikipedia scraping)</li>
              <li>SQLite / PostgreSQL</li>
              <li>LLM (Gemini – planned)</li>
            </ul>

            <p>
              This project generates quizzes automatically from
              Wikipedia articles as part of an internship assignment.
            </p>

            <button
              className="close-btn"
              onClick={() => setShowAbout(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
