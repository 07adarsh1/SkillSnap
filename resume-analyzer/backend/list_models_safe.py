import google.generativeai as genai
import os
import sys
from dotenv import load_dotenv

# Force UTF-8 for stdout
sys.stdout.reconfigure(encoding='utf-8')

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("ERROR: GEMINI_API_KEY not found")
    exit(1)

genai.configure(api_key=api_key)

print("Listing available models...", file=sys.stderr)

try:
    with open("available_models.txt", "w", encoding="utf-8") as f:
        f.write("Available Gemini Models:\n")
        f.write("-" * 50 + "\n")
        
        for model in genai.list_models():
            if 'generateContent' in model.supported_generation_methods:
                f.write(f"Name: {model.name}\n")
                f.write(f"Display Name: {model.display_name}\n")
                f.write("-" * 20 + "\n")
                
    print("Successfully wrote models to available_models.txt")

except Exception as e:
    print(f"Error listing models: {e}")
