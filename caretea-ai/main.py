from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI

from datetime import date, datetime
from typing import Optional
import json
import os


load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise RuntimeError(
        "A variável OPENAI_API_KEY não foi encontrada."
    )

client = OpenAI(
    api_key=OPENAI_API_KEY
)

MODELO_IA = os.getenv(
    "OPENAI_MODEL",
    "gpt-6-luna"
)


app = FastAPI(
    title="CareTEA IA",
    description="Microserviço de inteligência artificial do CareTEA",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Mensagem(BaseModel):
    texto: str


class EvolucaoBemEstar(BaseModel):
    data: date

    mediaHumor: Optional[float] = None
    humorPredominante: Optional[str] = None

    mediaAnsiedade: Optional[float] = None
    mediaEnergia: Optional[float] = None

    mediaQualidadeSono: Optional[float] = None
    mediaHorasSono: Optional[float] = None

    mediaSobrecargaSensorial: Optional[float] = None

    totalRegistros: int


class ContextoBemEstar(BaseModel):
    inicio: datetime
    fim: datetime

    totalRegistros: int

    mediaHumor: Optional[float] = None
    humorPredominante: Optional[str] = None

    mediaAnsiedade: Optional[float] = None
    mediaEnergia: Optional[float] = None

    mediaQualidadeSono: Optional[float] = None
    mediaHorasSono: Optional[float] = None

    mediaSobrecargaSensorial: Optional[float] = None

    tendenciaHumor: Optional[str] = None
    tendenciaAnsiedade: Optional[str] = None
    tendenciaEnergia: Optional[str] = None
    tendenciaSono: Optional[str] = None
    tendenciaSobrecargaSensorial: Optional[str] = None

    evolucao: list[EvolucaoBemEstar]


class AnaliseBemEstarIA(BaseModel):
    resumo: str
    pontosPositivos: list[str]
    pontosAtencao: list[str]
    recomendacoes: list[str]


@app.get("/")
def inicio():
    return {
        "mensagem": "Olá, eu sou a Care!",
        "servico": "CareTEA IA",
        "modelo": MODELO_IA
    }


@app.post("/chat")
def chat(mensagem: Mensagem):

    try:
        resposta = client.responses.create(
            model=MODELO_IA,

            instructions="""
Você é a Care, assistente virtual do CareTEA.

Fale sempre em português do Brasil.

Seu estilo deve ser:
- simples
- amigável
- acolhedor
- natural
- objetivo

Prefira respostas curtas e fáceis de entender.

O CareTEA é uma plataforma de apoio à rotina e ao bem-estar
de pessoas autistas e seus responsáveis.

Regras importantes:

- Não invente informações sobre o usuário.
- Não invente dados que não foram fornecidos.
- Não dê diagnósticos médicos.
- Não afirme que uma pessoa possui uma doença ou condição.
- Quando falar sobre saúde ou bem-estar, deixe claro quando
  uma avaliação profissional pode ser necessária.
- Não substitua médicos, psicólogos ou outros profissionais.
""",

            input=mensagem.texto,
            store=False
        )

        return {
            "resposta": resposta.output_text
        }

    except Exception as erro:

        print(
            "Erro ao comunicar com a OpenAI:",
            erro
        )

        raise HTTPException(
            status_code=500,
            detail="Não foi possível gerar uma resposta da Care."
        )


@app.post(
    "/analisar-bem-estar",
    response_model=AnaliseBemEstarIA
)
def analisar_bem_estar(
        contexto: ContextoBemEstar
):

    if contexto.totalRegistros == 0:

        return AnaliseBemEstarIA(
            resumo=(
                "Ainda não existem registros suficientes "
                "para realizar uma análise do bem-estar."
            ),

            pontosPositivos=[],

            pontosAtencao=[],

            recomendacoes=[
                (
                    "Continue registrando o bem-estar "
                    "para que a Care possa identificar "
                    "padrões ao longo do tempo."
                )
            ]
        )

    try:
        dados_contexto = contexto.model_dump(
            mode="json"
        )

        contexto_json = json.dumps(
            dados_contexto,
            ensure_ascii=False,
            indent=2
        )

        resposta = client.responses.create(
            model=MODELO_IA,

            instructions="""
Você é a Care, assistente de bem-estar do CareTEA.

Você receberá dados já calculados pelo backend do CareTEA.

Sua função é INTERPRETAR os dados.
Você NÃO deve recalcular médias ou tendências.

As tendências recebidas do backend são consideradas a fonte
correta e devem ser respeitadas.

Analise somente as informações fornecidas.

Você pode identificar relações aparentes, por exemplo:

- ansiedade aumentando ao mesmo tempo que o sono piora;
- aumento de energia junto com melhora do humor;
- redução da sobrecarga sensorial;
- estabilidade dos indicadores.

Mas nunca diga que um indicador CAUSOU outro.

Use expressões como:

- "os registros mostram"
- "parece haver uma relação"
- "vale observar"
- "os dados indicam"
- "foi observado no período"

Nunca use afirmações como:

- "isso significa que você tem..."
- "você possui..."
- "isso prova que..."
- "isso foi causado por..."

REGRAS DE SAÚDE:

- Não faça diagnósticos médicos.
- Não faça diagnósticos psicológicos.
- Não sugira medicamentos.
- Não altere tratamentos.
- Não invente sintomas.
- Não invente acontecimentos.
- Não assuste o usuário.
- Não transforme oscilações normais em doenças.

As recomendações devem ser simples e de baixo risco,
como observar a rotina, manter registros, fazer pausas,
organizar o sono ou conversar com um responsável ou
profissional quando algo persistir ou causar sofrimento.

Escreva sempre em português do Brasil.

O resumo deve ser curto, amigável e fácil de entender.

Pontos positivos devem conter somente aspectos realmente
positivos presentes nos dados.

Pontos de atenção devem conter somente aspectos que realmente
mereçam observação.

Não invente um ponto apenas para preencher uma lista.
""",

            input=(
                "Analise os seguintes dados de bem-estar "
                "registrados no CareTEA:\n\n"
                + contexto_json
            ),

            text={
                "format": {
                    "type": "json_schema",
                    "name": "analise_bem_estar_caretea",
                    "strict": True,

                    "schema": {
                        "type": "object",

                        "properties": {
                            "resumo": {
                                "type": "string"
                            },

                            "pontosPositivos": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            },

                            "pontosAtencao": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            },

                            "recomendacoes": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            }
                        },

                        "required": [
                            "resumo",
                            "pontosPositivos",
                            "pontosAtencao",
                            "recomendacoes"
                        ],

                        "additionalProperties": False
                    }
                }
            },

            store=False
        )

        dados_resposta = json.loads(
            resposta.output_text
        )

        return AnaliseBemEstarIA(
            **dados_resposta
        )

    except Exception as erro:

        print(
            "Erro ao analisar bem-estar:",
            erro
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Não foi possível gerar "
                "a análise de bem-estar."
            )
        )