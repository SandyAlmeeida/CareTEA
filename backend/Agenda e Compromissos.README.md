# Agenda + Consultas + Exames + Terapias

Requisito da agenda unificada. Um mesmo recurso (`Compromisso`) representa
consultas, exames, terapias e demais compromissos, diferenciados pelo campo
`tipo`, seguindo o modelo de eventos já usado no front (`Agenda.jsx`).

## Modelo

| Campo           | Tipo (JSON)        | Obrigatório | Observação                                             |
|-----------------|--------------------|-------------|--------------------------------------------------------|
| `id`            | number             | (gerado)    | Identificador                                          |
| `tipo`          | string             | sim         | `consulta`, `terapia`, `exame`, `compromisso`, `retorno`, `receita` |
| `titulo`        | string             | sim         | Ex.: "Neurologista - Dr. Almeida"                      |
| `especialidade` | string             | não         | Ex.: "Neurologia"                                      |
| `data`          | string (YYYY-MM-DD)| sim         | Data do compromisso                                    |
| `horarioInicio` | string (HH:mm)     | sim         | Início                                                 |
| `horarioFim`    | string (HH:mm)     | não         | Fim                                                    |
| `local`         | string             | não         | Ex.: "Clínica Neuro"                                   |
| `observacoes`   | string             | não         | Até 1000 caracteres                                    |
| `lembrete`      | boolean            | não         | Padrão `true`                                          |

Cada compromisso pertence a um usuário. Base da rota:
`/usuarios/{usuarioId}/compromissos`.

## Endpoints

### Criar
`POST /usuarios/{usuarioId}/compromissos` → **201 Created**
```json
{
  "tipo": "consulta",
  "titulo": "Neurologista - Dr. Almeida",
  "especialidade": "Neurologia",
  "data": "2026-09-21",
  "horarioInicio": "15:00",
  "horarioFim": "16:00",
  "local": "Clínica Neuro",
  "observacoes": "Levar exames anteriores.",
  "lembrete": true
}
```

### Editar
`PUT /usuarios/{usuarioId}/compromissos/{id}` → **200 OK** (mesmo corpo do POST)

### Excluir
`DELETE /usuarios/{usuarioId}/compromissos/{id}` → **204 No Content**

### Detalhar
`GET /usuarios/{usuarioId}/compromissos/{id}` → **200 OK**

### Buscar por dia, semana e mês
`GET /usuarios/{usuarioId}/compromissos` → **200 OK** (lista ordenada por data e horário)

| Parâmetro | Exemplo        | Efeito                                                        |
|-----------|----------------|--------------------------------------------------------------|
| `periodo` | `dia`          | Só a data de referência                                       |
| `periodo` | `semana`       | Semana da referência (segunda a domingo)                     |
| `periodo` | `mes`          | Mês inteiro da referência                                     |
| `data`    | `2026-09-21`   | Data de referência do período (padrão: hoje)                 |
| `inicio` / `fim` | `2026-09-01` / `2026-09-30` | Intervalo livre (alternativa a `periodo`) |

Exemplos:
- Dia: `GET /usuarios/1/compromissos?periodo=dia&data=2026-09-21`
- Semana: `GET /usuarios/1/compromissos?periodo=semana&data=2026-09-21`
- Mês: `GET /usuarios/1/compromissos?periodo=mes&data=2026-09-21`
- Intervalo: `GET /usuarios/1/compromissos?inicio=2026-09-01&fim=2026-09-30`
- Tudo: `GET /usuarios/1/compromissos`

## Erros
- **400** — validação (campos obrigatórios, tipo/período inválido, corpo mal formatado)
- **404** — usuário ou compromisso inexistente para o usuário informado

## Arquivos (backend)
- `model/TipoCompromisso.java` — enum dos tipos (JSON em minúsculo)
- `model/Compromisso.java` — entidade JPA
- `repository/CompromissoRepository.java` — buscas por usuário, tipo e intervalo
- `service/CompromissoService.java` — CRUD e cálculo dos períodos
- `controller/CompromissoController.java` — API REST
- `exception/RecursoNaoEncontradoException.java`, `exception/GlobalExceptionHandler.java`
- `config/CorsConfig.java` — libera o front (Vite) a acessar a API
- `Mapeamento Compromissos SQL.README.md` — DDL da tabela

## Frontend (integração)
- `src/services/api.js` — cliente HTTP base (URL via `VITE_API_URL`)
- `src/services/compromissos.js` — chamadas da agenda + mapeamentos backend↔front
- `src/utils/careteaSession.js` — `getCareteaUserId()` resolve o usuário das chamadas
- `src/pages/Agenda/Agenda.jsx` — agenda com busca por dia/semana/mês e CRUD
- `src/pages/Consultas/Consultas.jsx` — lista de consultas (tipo=consulta) com CRUD
- `.env.example` — variáveis do front (`VITE_API_URL`, `VITE_DEFAULT_USER_ID`)

## Como rodar (ponta a ponta)
1. Banco: rode o DDL de `Mapeamento Compromissos SQL.README.md` no Postgres `caretea`.
2. Backend: na pasta `backend/`, `./mvnw spring-boot:run` (porta 8080).
   - CORS já libera `http://localhost:5173`. Para outras origens, defina
     `caretea.cors.origins` (separadas por vírgula) no `application.properties`.
3. Front: na raiz, copie `.env.example` para `.env`, `npm install` e `npm run dev`.
4. Enquanto o login não gravar o `userId` na sessão, o front usa
   `VITE_DEFAULT_USER_ID` (padrão 1). Garanta que exista um usuário com esse id
   na tabela `usuarios` (o FK `usuario_id` aponta para ele).
