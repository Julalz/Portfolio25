from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración de OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

class Message(BaseModel):
    message: str

@app.post("/api/chat")
async def chat(message: Message):
    try:
        # Aquí puedes personalizar el prompt según tu perfil
        prompt = f"""
        Eres un asistente virtual que representa a Julian Alzate, un Developer Full Stack y IA Engineer.
        Responde de manera profesional y concisa a las preguntas sobre su experiencia y habilidades.
        Pregunta: {message.message}
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Eres un asistente virtual profesional que representa a Julian Alzate."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150
        )
        
        return {"response": response.choices[0].message.content}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 