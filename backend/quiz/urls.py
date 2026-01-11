from django.urls import path
from .views import generate_quiz, quiz_history, quiz_detail

urlpatterns = [
    path('generate-quiz/', generate_quiz),
    path('history/', quiz_history),
    path('history/<int:quiz_id>/', quiz_detail),
]
