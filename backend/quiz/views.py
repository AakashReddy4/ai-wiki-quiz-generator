import requests
from bs4 import BeautifulSoup

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Quiz


def generate_quiz_with_llm(title, summary):
    """
    Mock AI-style quiz generator.
    Produces realistic, topic-aware questions WITHOUT using an LLM.
    """

    questions = [
        {
            "question": f"What best describes {title}?",
            "options": [
                "A widely used concept with real-world applications",
                "A minor historical reference",
                "An outdated and unused idea",
                "A purely theoretical assumption"
            ],
            "answer": "A widely used concept with real-world applications",
            "difficulty": "easy",
            "explanation": f"The article highlights {title} as an important and commonly used concept."
        },
        {
            "question": f"In which domain is {title} most commonly applied?",
            "options": [
                "Computer Science and Technology",
                "Fine Arts",
                "Sports and Fitness",
                "Political Science"
            ],
            "answer": "Computer Science and Technology",
            "difficulty": "medium",
            "explanation": f"{title} is primarily discussed in technical and computational contexts."
        },
        {
            "question": f"Why is {title} considered important?",
            "options": [
                "It enables flexibility and scalability",
                "It is rarely used today",
                "It replaced all older technologies",
                "It has only academic value"
            ],
            "answer": "It enables flexibility and scalability",
            "difficulty": "medium",
            "explanation": "Its importance comes from adaptability and wide applicability."
        },
        {
            "question": f"Which characteristic is strongly associated with {title}?",
            "options": [
                "Versatility",
                "Fragility",
                "Irrelevance",
                "Limited scope"
            ],
            "answer": "Versatility",
            "difficulty": "hard",
            "explanation": f"{title} is known for being adaptable across multiple use cases."
        },
        {
            "question": f"What is a realistic real-world use of {title}?",
            "options": [
                "Building scalable applications",
                "Designing physical buildings",
                "Conducting medical surgery",
                "Managing sports tournaments"
            ],
            "answer": "Building scalable applications",
            "difficulty": "hard",
            "explanation": "The article refers to practical implementations in real-world systems."
        }
    ]

    related_topics = [
        f"Introduction to {title}",
        f"Applications of {title}",
        f"History of {title}"
    ]

    return {
        "questions": questions,
        "related_topics": related_topics
    }


@api_view(["POST"])
def generate_quiz(request):
    """
    Generate a quiz from a Wikipedia URL,
    store it in the database, and return it.
    """

    url = request.data.get("url")

    if not url:
        return Response(
            {"error": "URL is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # -------- STEP 1: SCRAPE WIKIPEDIA --------
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        title = soup.find("h1").get_text(strip=True)

        summary = ""
        for p in soup.find_all("p"):
            text = p.get_text(strip=True)
            if text:
                summary = text
                break

    except Exception as e:
        return Response(
            {"error": f"Failed to fetch Wikipedia page: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # -------- STEP 2: QUIZ GENERATION (MOCK AI) --------
    quiz_data = generate_quiz_with_llm(title, summary)
    questions = quiz_data["questions"]
    related_topics = quiz_data["related_topics"]

    # -------- STEP 3: SAVE TO DATABASE --------
    quiz = Quiz.objects.create(
        url=url,
        title=title,
        questions=questions
    )

    # -------- STEP 4: RESPONSE --------
    return Response(
        {
            "id": quiz.id,
            "url": quiz.url,
            "title": quiz.title,
            "summary": summary,
            "questions": quiz.questions,
            "related_topics": related_topics,
            "created_at": quiz.created_at
        },
        status=status.HTTP_200_OK
    )


# -------- HISTORY APIs --------

@api_view(["GET"])
def quiz_history(request):
    quizzes = Quiz.objects.all().order_by("-created_at")

    return Response([
        {
            "id": quiz.id,
            "url": quiz.url,
            "title": quiz.title,
            "created_at": quiz.created_at
        }
        for quiz in quizzes
    ])


@api_view(["GET"])
def quiz_detail(request, quiz_id):
    quiz = Quiz.objects.get(id=quiz_id)

    return Response({
        "id": quiz.id,
        "url": quiz.url,
        "title": quiz.title,
        "questions": quiz.questions,
        "created_at": quiz.created_at
    })
