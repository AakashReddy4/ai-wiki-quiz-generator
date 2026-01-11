from django.db import models

class Quiz(models.Model):
    url = models.URLField()
    title = models.CharField(max_length=255)
    questions = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
