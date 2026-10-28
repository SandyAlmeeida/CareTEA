# CareTEA 💙

O **CareTEA** é uma aplicação web desenvolvida para auxiliar pessoas com Transtorno do Espectro Autista (TEA) e seus responsáveis na organização da rotina, saúde e bem-estar.

O sistema reúne recursos como agenda, medicamentos, documentos, relatórios, notificações, acompanhamento de bem-estar, integração com WhatsApp e assistente com Inteligência Artificial.

## Tecnologias utilizadas

### Frontend
- React
- Vite
- React Router
- CSS
- Google OAuth

### Backend
- Java 21
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- PostgreSQL

### Inteligência Artificial
- Python
- FastAPI

### Integrações
- Google Login
- WhatsApp Cloud API (Meta)
- API de IA do CareTEA

## Principais funcionalidades

- Cadastro e autenticação de usuários
- Login com Google
- Perfis para pessoa autista e responsável
- Regras específicas para níveis de suporte 1, 2 e 3
- Dashboard personalizado
- Agenda de consultas, exames e compromissos
- Cadastro e acompanhamento de medicamentos
- Central de documentos
- Relatórios
- Registro e acompanhamento de bem-estar
- Central de notificações
- Preferências de notificações
- Envio automático de lembretes pelo WhatsApp
- Pedido de ajuda para o responsável
- Área "Meu Dia"
- Assistente com Inteligência Artificial
- Relatórios e análises de bem-estar

## Estrutura do projeto

```text
CareTEA/
├── backend/        # API Spring Boot
├── caretea-ai/     # Serviço de IA em FastAPI
├── src/            # Frontend React
├── public/
├── package.json
└── README.md
```

## Executando o frontend

Na raiz do projeto:

```bash
npm install
npm run dev
```

O Vite normalmente disponibilizará a aplicação em:

```text
http://localhost:5173
```

## Executando o backend

Entre na pasta:

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

O backend utiliza PostgreSQL e variáveis de ambiente para configurações sensíveis.

Consulte os arquivos `.env.example` e `backend/.env.example` para verificar as variáveis necessárias.

## Executando o serviço de IA

Entre na pasta:

```bash
cd caretea-ai
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Execute o serviço FastAPI conforme a configuração do projeto.

## Variáveis de ambiente

Por segurança, credenciais e tokens não são armazenados diretamente no repositório.

Entre as configurações utilizadas pelo projeto estão:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
GOOGLE_CLIENT_ID
WHATSAPP_TOKEN
WHATSAPP_PHONE_NUMBER_ID
```

Outras variáveis podem ser necessárias de acordo com o ambiente de execução.

Nunca envie arquivos `.env` ou credenciais reais para o repositório.

## Branches

O projeto utiliza principalmente:

- `main` — versão estável do projeto
- `development` — integração e desenvolvimento das funcionalidades
- `feat-*` — branches destinadas ao desenvolvimento de funcionalidades específicas

## Projeto acadêmico

O CareTEA foi desenvolvido como projeto Full Stack com o objetivo de aplicar conhecimentos de desenvolvimento frontend, backend, banco de dados, APIs externas, autenticação, segurança e Inteligência Artificial.

## Equipe

Projeto desenvolvido pela equipe CareTEA.
