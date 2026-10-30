# CareTEA 💙

O **CareTEA** é uma aplicação web Full Stack desenvolvida para auxiliar pessoas com Transtorno do Espectro Autista (TEA) e seus responsáveis na organização da rotina, saúde, bem-estar e acompanhamento diário.

O sistema reúne recursos como agenda, medicamentos, documentos, relatórios, notificações, acompanhamento de bem-estar, integração com WhatsApp, área **Meu Dia** e assistente com Inteligência Artificial.

---

## 🌐 Aplicação em produção

O projeto está disponível nos seguintes endereços:

### Frontend
https://care-tea-seven.vercel.app

### Backend / API
https://caretea-backend.onrender.com

### Swagger / OpenAPI
https://caretea-backend.onrender.com/swagger-ui.html

### Serviço de Inteligência Artificial
https://caretea-ai.onrender.com

### Repositório GitHub
https://github.com/SandyAlmeeida/CareTEA

---

## 🛠️ Tecnologias utilizadas

### Frontend

- React
- Vite
- React Router
- JavaScript
- CSS
- Google OAuth

### Backend

- Java 21
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- PostgreSQL
- Maven
- Swagger / OpenAPI

### Inteligência Artificial

- Python
- FastAPI
- OpenAI API

### Infraestrutura e Deploy

- Vercel — Frontend
- Render — Backend
- Render — Serviço de IA
- PostgreSQL no Render — Banco de dados
- Docker — Containerização do backend

### Integrações

- Google Login
- WhatsApp Cloud API — Meta
- OpenAI API
- Swagger / OpenAPI

---

## ✨ Principais funcionalidades

- Cadastro e autenticação de usuários
- Login tradicional com JWT
- Login com Google
- Perfis para pessoa autista e responsável
- Regras específicas para níveis de suporte 1, 2 e 3
- Dashboard personalizado
- Agenda de consultas, exames e compromissos
- Cadastro e acompanhamento de medicamentos
- Histórico de medicamentos
- Central de documentos
- Relatórios
- Registro e acompanhamento de bem-estar
- Análises de bem-estar
- Central de notificações
- Preferências de notificações
- Envio automático de lembretes pelo WhatsApp
- Pedido de ajuda ao responsável
- Área **Meu Dia**
- Assistente com Inteligência Artificial
- Integração com serviço FastAPI
- Documentação interativa da API com Swagger

---

## 🧩 Regras de acesso por nível de suporte

O CareTEA considera diferentes necessidades de apoio.

### Nível 1

A pessoa autista pode possuir acesso próprio ao sistema e receber notificações diretamente, conforme suas preferências.

### Nível 2

As notificações e avisos principais são direcionados ao responsável.

### Nível 3

O cadastro e gerenciamento são realizados pelo responsável, sem necessidade de uma conta própria para a pessoa autista.

---

## 📁 Estrutura do projeto

```text
CareTEA/
├── backend/             # API Spring Boot
│   ├── src/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── pom.xml
│
├── caretea-ai/          # Serviço de IA em FastAPI
│   ├── main.py
│   └── requirements.txt
│
├── src/                 # Frontend React
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── utils/
│
├── public/
├── package.json
├── vercel.json
└── README.md
```

---

## ▶️ Executando o frontend localmente

Na raiz do projeto:

```bash
npm install
npm run dev
```

O Vite normalmente disponibiliza a aplicação em:

```text
http://localhost:5173
```

Para gerar a versão de produção:

```bash
npm run build
```

---

## ☕ Executando o backend localmente

Entre na pasta do backend:

```bash
cd backend
```

No Windows:

```bash
mvnw.cmd spring-boot:run
```

Ou, caso o Maven esteja instalado globalmente:

```bash
mvn spring-boot:run
```

Por padrão, o backend é executado em:

```text
http://localhost:8080
```

O backend utiliza PostgreSQL e depende de variáveis de ambiente para credenciais e configurações sensíveis.

---

## 🤖 Executando o serviço de IA

Entre na pasta:

```bash
cd caretea-ai
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Execute o FastAPI com:

```bash
uvicorn main:app --reload
```

Por padrão, o serviço pode ser executado em:

```text
http://localhost:8000
```

---

## 🐳 Docker

O backend possui configuração Docker para facilitar a criação de um ambiente reproduzível e o deploy.

Arquivos principais:

```text
backend/Dockerfile
backend/.dockerignore
```

O Dockerfile utiliza:

- Java 21
- Maven
- Build multi-stage
- Imagem de runtime Java otimizada

O backend publicado no Render utiliza essa configuração Docker.

---

## 📚 Swagger / OpenAPI

A API possui documentação interativa utilizando Swagger/OpenAPI.

### Swagger UI

https://caretea-backend.onrender.com/swagger-ui.html

### OpenAPI JSON

https://caretea-backend.onrender.com/v3/api-docs

A documentação permite visualizar os endpoints disponíveis e utilizar autenticação JWT através do botão **Authorize**.

Os endpoints protegidos continuam exigindo autenticação.

---

## 🔐 Variáveis de ambiente

Por segurança, credenciais, senhas e tokens reais não são armazenados diretamente no repositório.

### Frontend

```text
VITE_API_URL
VITE_GOOGLE_CLIENT_ID
```

### Backend

```text
DB_URL
DB_USERNAME
DB_PASSWORD

JWT_SECRET

GOOGLE_CLIENT_ID

WHATSAPP_TOKEN
WHATSAPP_PHONE_NUMBER_ID
WHATSAPP_API_VERSION
WHATSAPP_VERIFY_TOKEN
WHATSAPP_APP_SECRET

FRONTEND_URL
CARETEA_AI_URL
```

### Serviço de IA

```text
OPENAI_API_KEY
OPENAI_MODEL
```

Os arquivos `.env.example` disponíveis no projeto podem ser utilizados como referência.

> Nunca envie arquivos `.env`, senhas, tokens ou outras credenciais reais para o repositório.

---

## 🔐 Autenticação e segurança

O backend utiliza **Spring Security + JWT**.

Entre os recursos implementados estão:

- autenticação stateless;
- geração e validação de JWT;
- proteção de endpoints;
- autenticação com Google;
- configuração de CORS;
- armazenamento de configurações sensíveis em variáveis de ambiente.

---

## 💬 Integração com WhatsApp

O CareTEA utiliza a **WhatsApp Cloud API da Meta**.

A integração permite:

- envio de lembretes de medicamentos;
- envio de avisos de consultas;
- envio de avisos de exames;
- pedidos de ajuda;
- recebimento de mensagens através de webhook;
- respostas automáticas.

O webhook de produção utiliza o backend publicado no Render.

---

## 🧠 Inteligência Artificial

O projeto possui um serviço independente de IA desenvolvido em **Python + FastAPI**.

Esse serviço é utilizado pelo backend para funcionalidades relacionadas ao assistente e análise de bem-estar.

A comunicação segue a arquitetura:

```text
Frontend
   ↓
Backend Spring Boot
   ↓
Serviço FastAPI
   ↓
OpenAI API
```

---

## 🌿 Estratégia de branches

O projeto utilizou uma estratégia baseada em branches para permitir desenvolvimento paralelo e integração controlada.

### Principais branches

- `main` — versão estável e utilizada em produção
- `development` — integração das funcionalidades durante o desenvolvimento
- `feat-*` — desenvolvimento de novas funcionalidades
- `fix/*` — correções específicas
- `chore/*` — ajustes técnicos, documentação e infraestrutura

As funcionalidades foram integradas através de commits, merges e Pull Requests, mantendo o histórico de desenvolvimento disponível no GitHub.

---

## 📝 Histórico e versionamento

O repositório contém o histórico de:

- commits;
- branches;
- Pull Requests;
- merges;
- correções;
- integrações;
- preparação para deploy;
- documentação;
- configuração Docker;
- implementação do Swagger/OpenAPI.

Isso permite acompanhar a evolução do projeto e a participação da equipe durante o desenvolvimento.

---

## 🚀 Deploy

A arquitetura de produção está organizada da seguinte forma:

```text
Usuário
   ↓
Vercel
Frontend React
   ↓
Render
Backend Spring Boot + Docker
   ↓
PostgreSQL no Render

Backend
   ↓
Render
FastAPI / IA
   ↓
OpenAI API

Backend
   ↓
WhatsApp Cloud API / Meta
```

---

## ✅ Status do projeto

**Projeto concluído e disponível em produção.**

Principais componentes validados:

- Frontend em produção ✅
- Backend em produção ✅
- PostgreSQL em produção ✅
- Serviço de IA em produção ✅
- Autenticação JWT ✅
- Login com Google ✅
- Integração com WhatsApp ✅
- Webhook da Meta ✅
- Docker ✅
- Swagger / OpenAPI ✅
- Rotas protegidas ✅
- CORS de produção ✅
- Testes funcionais finais ✅

---

## 🎓 Projeto acadêmico

O CareTEA foi desenvolvido como projeto Full Stack com o objetivo de aplicar, de forma integrada, conhecimentos de:

- Desenvolvimento Frontend
- Desenvolvimento Backend
- Banco de Dados
- APIs REST
- Autenticação e Segurança
- Integração com APIs externas
- Inteligência Artificial
- Versionamento com Git e GitHub
- Docker
- Deploy e infraestrutura
- Documentação de APIs

---

## 👥 Equipe

Projeto desenvolvido pela equipe **CareTEA**.
