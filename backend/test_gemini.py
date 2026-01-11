import os
import google.generativeai as genai

genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash")

response = model.generate_content("Say hello in one short sentence.")
print(response.text)
