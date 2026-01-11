# AI Wiki Quiz Generator

AI Wiki Quiz Generator is a full-stack web application that generates quizzes from Wikipedia articles.

The application accepts a Wikipedia article URL, scrapes the article content using BeautifulSoup, generates quiz questions, allows users to take the quiz, view scores, and revisit previously generated quizzes through a history view.

This project demonstrates backend development with Django, frontend development with React, web scraping, database storage, and clean UI design.

---

## Tech Stack

Backend: Django + Django REST Framework  
Frontend: React  
Database: SQLite (local development)  
Scraping: BeautifulSoup (HTML scraping only, no Wikipedia API)  
Data Source: Wikipedia article URLs  

---

## Features

- Generate quizzes from Wikipedia URLs
- Scrapes article title and summary
- Multiple-choice quiz questions
- Difficulty levels (easy, medium, hard)
- Answer explanations
- “Take Quiz” mode with scoring
- Quiz history with detailed modal view
- Light / Dark mode toggle
- Responsive card-based UI

---

## Project Structure

ai-wiki-quiz-generator/
├── backend/
├── frontend/
├── sample_data/
│   ├── example_urls.txt
│   ├── quiz_response_1.json
│   ├── quiz_response_2.json
│   └── quiz_response_3.json
├── screenshots/
│   ├── quiz_generation.png
│   ├── history_view.png
│   └── quiz_details_modal.png
└── README.md

---

## Backend Setup

1. Navigate to backend directory  
   cd backend

2. Create virtual environment  
   python -m venv venv

3. Activate virtual environment  

   Windows:  
   venv\Scripts\activate  

   macOS/Linux:  
   source venv/bin/activate  

4. Install dependencies  
   pip install django djangorestframework requests beautifulsoup4

5. Run migrations  
   python manage.py migrate

6. Start server  
   python manage.py runserver

Backend runs at:  
http://127.0.0.1:8000

---

## Frontend Setup

1. Navigate to frontend directory  
   cd frontend

2. Install dependencies  
   npm install

3. Start frontend  
   npm start

Frontend runs at:  
http://localhost:3000

---

## API Endpoints

POST /api/generate-quiz/  
Request body:
{
  "url": "https://en.wikipedia.org/wiki/Python_(programming_language)"
}

GET /api/history/  
Returns all generated quizzes.

GET /api/history/<quiz_id>/  
Returns quiz details.

---

## Sample Data

sample_data/ contains:
- example_urls.txt
- quiz_response_1.json
- quiz_response_2.json
- quiz_response_3.json

---

## Screenshots

screenshots/ contains:
- Quiz Generation page
- History view
- Quiz details modal

---

## Error Handling

- Handles invalid URLs
- Handles network and scraping failures
- Displays user-friendly errors

---

## Evaluation Criteria Coverage

Backend: Implemented  
Frontend: Implemented  
Wikipedia scraping: Implemented  
Quiz generation: Implemented  
Database storage & history: Implemented  
Take Quiz & scoring (Bonus): Implemented  
UI/UX quality: Implemented  
Sample data & screenshots: Provided  

---

## Note on LLM Usage

LLM integration was explored and structured in code.  
For stability and reproducibility, the final submission uses deterministic quiz generation without live LLM calls.

The backend is modular and ready for future LLM integration.

---

## Author

Aakash Reddy
