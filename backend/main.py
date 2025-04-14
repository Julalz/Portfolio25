import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import openai
import os
from dotenv import load_dotenv
import json
from supabase.client import create_client
from datetime import datetime
import asyncio
import pathlib

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase = None

try:
    if not supabase_url or not supabase_key:
        print("Error: SUPABASE_URL o SUPABASE_KEY no están configurados")
    else:
        supabase = create_client(supabase_url, supabase_key)
        print("Conexión exitosa con Supabase")
except Exception as e:
    print(f"Error al conectar con Supabase: {str(e)}")

app = FastAPI()

ALLOWED_ORIGINS = [
    "https://julianalzateportfolio.vercel.app",
    "http://localhost:5174",
    "http://localhost:5173",
    "https://portfolio25-git-main-julalzs-projects.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = pathlib.Path(__file__).parent.absolute()
PUBLIC_DIR = BASE_DIR / "public"
EXPORT_JSON_PATH = BASE_DIR / "export.json"

# Crear el directorio public si no existe
# try:
#     PUBLIC_DIR.mkdir(exist_ok=True)
#     print(f"Directorio public creado/verificado en: {PUBLIC_DIR}")
# except Exception as e:
#     print(f"Error al crear el directorio public: {str(e)}")

if PUBLIC_DIR.exists():
    app.mount("/backend/public", StaticFiles(directory=str(PUBLIC_DIR)), name="public")
    print(f"Archivos estáticos montados en /backend/public desde: {PUBLIC_DIR}")
else:
    print(
        f"Advertencia: El directorio {PUBLIC_DIR} no existe. Los archivos estáticos no estarán disponibles."
    )

openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    print("Error: OPENAI_API_KEY no está configurada")


async def increment_cv_downloads(from_chat: bool = False):
    try:
        data = {"cv_downloads": True, "from_chat": str(from_chat)}

        try:
            result = supabase.table("cv_counts").insert(data).execute()
            print(f"Descarga de CV registrada exitosamente: {result}")
            return result
        except Exception as insert_error:
            print(f"Error al insertar en cv_counts: {str(insert_error)}")
            return None
    except Exception as e:
        print(f"Error general en increment_cv_downloads: {str(e)}")
        return None


class CVManager:
    def __init__(self):
        self.cv_data = self._load_cv_data()
        self.embeddings = self._create_embeddings()
        self.question_count = 0

    def _load_cv_data(self) -> dict:
        try:
            with open(EXPORT_JSON_PATH, "r", encoding="utf-8") as file:
                data = json.load(file)
                print("CV cargado exitosamente")
                return data
        except FileNotFoundError:
            print(f"Archivo export.json no encontrado en: {EXPORT_JSON_PATH}")
            return {
                "experiencia": [],
                "habilidades": [],
                "educacion": [],
                "proyectos": [],
                "idiomas": [],
            }
        except json.JSONDecodeError as e:
            print(f"Error al decodificar el archivo JSON: {str(e)}")
            return self._get_default_data()
        except Exception as e:
            print(f"Error inesperado al cargar el CV: {str(e)}")
            return self._get_default_data()

    def _get_default_data(self) -> dict:
        return {
            "experiencia": [],
            "habilidades": [],
            "educacion": [],
            "proyectos": [],
            "idiomas": [],
        }

    def _create_embeddings(self) -> dict:
        return self.cv_data

    def _find_relevant_context(self, query: str) -> str:
        query_lower = query.lower()

        category_keywords = {
            "idioma": "idiomas",
            "lengua": "idiomas",
            "habla": "idiomas",
            "experiencia": "experiencia",
            "trabajo": "experiencia",
            "laboral": "experiencia",
            "habilidad": "habilidades",
            "skill": "habilidades",
            "educación": "educacion",
            "estudio": "educacion",
            "formación": "educacion",
            "proyecto": "proyectos",
            "trabajo": "proyectos",
            "lugares": "lugares donde ha vivido",
            "vivido": "lugares donde ha vivido",
            "residencia": "lugares donde ha vivido",
            "nacimiento": "lugar",
            "ciudad": "lugar",
            "preferencia": "preferencias",
            "intereses": "intereses",
            "link": "links",
            "linkedin": "links",
            "github": "links",
            "ubicación": "lugar",
            "domicilio": "lugar",
            "madrid": "lugares donde ha vivido",
            "vigo": "lugares donde ha vivido",
            "manchester": "lugares donde ha vivido",
            "las palmas": "lugares donde ha vivido",
            "español": "idiomas",
            "inglés": "idiomas",
            "portugués": "idiomas",
        }

        relevant_category = None
        for keyword, category in category_keywords.items():
            if keyword in query_lower:
                relevant_category = category
                break

        if relevant_category and relevant_category in self.embeddings:
            items = self.embeddings[relevant_category]
            if items:
                return f"{relevant_category.capitalize()}:\n" + "\n".join(items)

        relevant_context = []
        for category, items in self.embeddings.items():
            for item in items:
                if query_lower in item.lower():
                    relevant_context.append(f"{category.capitalize()}: {item}")

        if relevant_context:
            return "\n".join(relevant_context)

        return "\n".join(
            [
                f"{category.capitalize()}:\n" + "\n".join(items)
                for category, items in self.embeddings.items()
                if items
            ]
        )

    async def save_interaction(self, query: str, response: str, category: str = None):
        try:
            data = {
                "query": query,
                "response": response,
                "category": category if category else "general",
                "timestamp": datetime.utcnow().isoformat(),
                "session_id": "web",
            }

            if supabase:
                result = supabase.table("cv_chats").insert(data).execute()
                print("chat guardado en Supabase")
                return result
            else:
                print(
                    "No se pudo guardar la interacción porque no se conectó a Supabase"
                )
                return None
        except Exception as e:
            print(f"Error al guardar la interacción: {str(e)}")
            return None

    def get_response(self, query: str) -> str:
        self.question_count += 1

        if self.question_count > 2 and query.strip() == "2":
            asyncio.create_task(increment_cv_downloads(from_chat=True))
            return "¡Perfecto! El CV se descargará en un momento. ¿Hay algo más en lo que pueda ayudarte?"

        context = self._find_relevant_context(query)

        if not context:
            context = (
                "No se encontró información específica en el CV sobre esta pregunta."
            )

        prompt = f"""
        Eres un asistente virtual que representa a Julian Alzate, actuas como si fuera él.
        Basándote EXCLUSIVAMENTE en la siguiente información del CV:

        {context}

        Responde de manera profesional, concisa y directa a la siguiente pregunta:
        {query}

        Si la pregunta está relacionada con idiomas, experiencia, habilidades, educación o proyectos, responde usando SOLO la información proporcionada.
        Si la pregunta no está relacionada con estos temas, responde cortésmente indicando que solo puedes responder preguntas relacionadas con el CV de Julian y que fuiste programada para ayudar al Recruiter.
        """

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "Eres un asistente virtual profesional que representa a Julian Alzate.",
                },
                {"role": "user", "content": prompt},
            ],
            max_tokens=100,
        )

        base_response = response.choices[0].message.content

        category = None
        query_lower = query.lower()
        for keyword, cat in self.embeddings.items():
            if keyword in query_lower:
                category = keyword
                break

        asyncio.create_task(self.save_interaction(query, base_response, category))

        if self.question_count >= 2:
            additional_options = "\n\n¿Te gustaría:\n1. Hablar directamente con Julian\n2. Descargar el CV completo en PDF"
            return base_response + additional_options

        return base_response


cv_manager = CVManager()


class Message(BaseModel):
    message: str


@app.get("/")
def read_root():
    return {"Hello": "CV Jul-IA-n "}


@app.post("/api/chat")
async def chat(message: Message):
    try:
        if not message.message or not message.message.strip():
            raise HTTPException(
                status_code=400, detail="El mensaje no puede estar vacío"
            )

        response = cv_manager.get_response(message.message)
        print(f"Respuesta generada: {response}")
        return {"response": response}
    except Exception as e:
        print(f"Error en el endpoint /api/chat: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error interno del servidor: {str(e)}"
        )


@app.get("/api/download-cv")
async def download_cv():
    try:
        pdf_filename = "cv_julian_dev_ia.pdf"
        file_path = os.path.join("public", pdf_filename)
        return FileResponse(
            path=file_path,
            filename="CV_Julian_Alzate.pdf",
            media_type="application/pdf",
        )
    except FileNotFoundError as e:
        print(f"FileNotFoundError: {str(e)}")
        raise HTTPException(status_code=404, detail=f"Archivo no encontrado: {str(e)}")
    except Exception as e:
        print(f"Error al intentar descargar el archivo: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port, reload=False)
