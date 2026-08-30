from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Mensagem(BaseModel):
    texto: str


@app.get("/")
def inicio():
    return {"mensagem": "Olá, eu sou a Care!"}


@app.post("/chat")
def chat(mensagem: Mensagem):
    resposta = requests.post(
        "http://localhost:11434/api/chat",
        json={
            "model": "llama3.2:1b",
            "messages": [
                {
                    "role": "system",
                    "content": """
Você é a Care, assistente do CareTEA.
Fale sempre em português.
Seja simples, amigável e natural.
Prefira respostas curtas.
Não invente informações sobre o usuário.
Não dê diagnósticos médicos.
"""
                },
                {
                    "role": "user",
                    "content": mensagem.texto
                }
            ],
            "stream": False
        }
    )

    dados = resposta.json()

    return {
        "resposta": dados["message"]["content"]
    }