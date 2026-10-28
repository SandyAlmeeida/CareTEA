import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import PerfilAvatar from "../../components/PerfilAvatar/PerfilAvatar.jsx";
import ModalNotificacoes from "../../components/ModalNotificacoes/ModalNotificacoes.jsx";
import ModalPerfil from "../../components/ModalPerfil/ModalPerfil.jsx";

import {
  getCareteaSession,
  getCareteaProfile,
  clearCareteaSession,
} from "../../utils/careteaSession.js";
import { API_URL } from "../../services/api.js";

import "./Assistente.css";

const LIMITE_PERGUNTA = 2000;

const routeMap = {
  dashboard: "/dashboard",
  agenda: "/agenda",
  medicamentos: "/medicamentos",
  consultas: "/consultas",
  "bem-estar": "/bem-estar",
  "gerenciar-meu-dia": "/gerenciar-meu-dia",
  assistente: "/assistente",
  notificacoes: "/notificacoes",
  documentos: "/documentos",
  relatorios: "/relatorios",
  configuracoes: "/configuracoes",
};

const sugestoes = [
  {
    icon: "♡",
    title: "Bem-estar",
    text: "Como foi meu bem-estar nos últimos 7 dias?",
    tone: "blue",
  },
  {
    icon: "✦",
    title: "Organização",
    text: "Me ajude a organizar uma rotina mais leve com base no meu bem-estar recente.",
    tone: "green",
  },
  {
    icon: "◇",
    title: "Reflexão",
    text: "O que posso observar nos meus registros de bem-estar desta semana?",
    tone: "purple",
  },
  {
    icon: "▣",
    title: "Preparação",
    text: "Com base no meu bem-estar recente, que pontos posso levar para conversar com um profissional?",
    tone: "orange",
  },
];

function formatLocalDateTime(date) {
  const pad = (value) => String(value).padStart(2, "0");

  return (
    `${date.getFullYear()}-` +
    `${pad(date.getMonth() + 1)}-` +
    `${pad(date.getDate())}T` +
    `${pad(date.getHours())}:` +
    `${pad(date.getMinutes())}:` +
    `${pad(date.getSeconds())}`
  );
}

function Assistente() {
  const navigate = useNavigate();
  const session = getCareteaSession();
  const profile = getCareteaProfile();

  const userName =
    profile?.userName ||
    session?.userName ||
    "Usuário";

  const profileName =
    profile?.profileName ||
    session?.profileName ||
    userName;

  const userLevel =
    profile?.userLevel || "";

  const [notificacoesAbertas, setNotificacoesAbertas] =
    useState(false);

  const [perfilAberto, setPerfilAberto] =
    useState(false);

  const [
    quantidadeNotificacoes,
    setQuantidadeNotificacoes,
  ] = useState(0);

  const [mensagens, setMensagens] = useState([
    {
      id: 1,
      autor: "ia",
      texto: `Olá, ${userName}! 👋 Eu sou a Care, sua assistente do CareTEA. Como posso ajudar você hoje?`,
    },
  ]);

  const [mensagem, setMensagem] =
    useState("");

  const [digitando, setDigitando] =
    useState(false);

  const [erroChat, setErroChat] =
    useState("");

  async function buscarResumoBemEstar() {
    if (!session?.token || !session?.userId) {
      return {
        status: "indisponivel",
        dados: null,
      };
    }

    try {
      const fim = new Date();
      const inicio = new Date();

      inicio.setDate(
        inicio.getDate() - 7,
      );

      const response = await fetch(
        `${API_URL}/dashboard/bem-estar/usuario/${session.userId}` +
          `?inicio=${encodeURIComponent(
            formatLocalDateTime(inicio),
          )}` +
          `&fim=${encodeURIComponent(
            formatLocalDateTime(fim),
          )}`,
        {
          headers: {
            Authorization:
              `Bearer ${session.token}`,
          },
        },
      );

      if (!response.ok) {
        console.error(
          "Não foi possível carregar o resumo de bem-estar para a Care.",
          response.status,
        );

        return {
          status: "indisponivel",
          dados: null,
        };
      }

      const dados =
        await response.json();

      if (
        !dados ||
        !dados.totalRegistros
      ) {
        return {
          status: "vazio",
          dados,
        };
      }

      return {
        status: "ok",
        dados,
      };
    } catch (error) {
      console.error(
        "Erro ao carregar bem-estar para a Care:",
        error,
      );

      return {
        status: "indisponivel",
        dados: null,
      };
    }
  }

  function montarContextoBemEstar(resultado) {
    if (
      !resultado ||
      resultado.status === "indisponivel"
    ) {
      return (
        "Os dados de bem-estar estão temporariamente indisponíveis. " +
        "Não conclua que não existem registros."
      );
    }

    if (
      resultado.status === "vazio"
    ) {
      return "Não há registros de bem-estar nos últimos 7 dias.";
    }

    const resumo =
      resultado.dados;

    const partes = [
      `Total de registros: ${resumo.totalRegistros}`,

      resumo.humorPredominante
        ? `Humor predominante: ${resumo.humorPredominante}`
        : null,

      resumo.mediaAnsiedade !== null &&
      resumo.mediaAnsiedade !== undefined
        ? `Ansiedade média: ${Number(
            resumo.mediaAnsiedade,
          ).toFixed(1)}/10`
        : null,

      resumo.mediaEnergia !== null &&
      resumo.mediaEnergia !== undefined
        ? `Energia média: ${Number(
            resumo.mediaEnergia,
          ).toFixed(1)}/10`
        : null,

      resumo.mediaQualidadeSono !== null &&
      resumo.mediaQualidadeSono !== undefined
        ? `Qualidade média do sono: ${Number(
            resumo.mediaQualidadeSono,
          ).toFixed(1)}/10`
        : null,

      resumo.mediaHorasSono !== null &&
      resumo.mediaHorasSono !== undefined
        ? `Média de horas de sono: ${Number(
            resumo.mediaHorasSono,
          ).toFixed(1)} horas`
        : null,

      resumo.mediaSobrecargaSensorial !== null &&
      resumo.mediaSobrecargaSensorial !== undefined
        ? `Sobrecarga sensorial média: ${Number(
            resumo.mediaSobrecargaSensorial,
          ).toFixed(1)}/10`
        : null,
    ].filter(Boolean);

    return partes.join("\n");
  }

  function montarHistoricoConversa() {
    const historico =
      mensagens
        .filter(
          (item) => item.id !== 1,
        )
        .slice(-8);

    if (!historico.length) {
      return "Ainda não há mensagens anteriores nesta conversa.";
    }

    return historico
      .map((item) =>
        item.autor === "usuario"
          ? `Usuário: ${item.texto}`
          : `Care: ${item.texto}`,
      )
      .join("\n");
  }

  async function montarMensagemParaIA(
    texto,
  ) {
    const resumoBemEstar =
      await buscarResumoBemEstar();

    const contextoBemEstar =
      montarContextoBemEstar(
        resumoBemEstar,
      );

    const historico =
      montarHistoricoConversa();

    return `
Você é a Care, assistente do CareTEA.

Use os dados abaixo apenas quando forem relevantes para responder à pergunta atual.

Não invente medicamentos, horários, compromissos, consultas, exames, diagnósticos ou outros dados que não estejam disponíveis no contexto.

Se a pessoa perguntar sobre informações do CareTEA que não estejam disponíveis no contexto atual, diga claramente que você não possui esses dados no momento.

Se uma fonte estiver marcada como indisponível, não diga que não existem registros. Informe apenas que não foi possível consultar essa informação.

PERFIL
Nome da conta: ${userName}
Perfil acompanhado: ${profileName}
Tipo de conta: ${session?.accountType || "não informado"}
Nível de suporte/autonomia: ${session?.autismLevel || "não informado"}

BEM-ESTAR DOS ÚLTIMOS 7 DIAS
${contextoBemEstar}

HISTÓRICO RECENTE DA CONVERSA
${historico}

PERGUNTA ATUAL
${texto}
`.trim();
  }

  async function enviarMensagem(
    textoRecebido,
  ) {
    const texto =
      textoRecebido.trim();

    if (!texto || digitando) {
      return;
    }

    if (
      texto.length >
      LIMITE_PERGUNTA
    ) {
      setErroChat(
        `A mensagem pode ter no máximo ${LIMITE_PERGUNTA} caracteres.`,
      );

      return;
    }

    setErroChat("");

    const novaMensagem = {
      id: Date.now(),
      autor: "usuario",
      texto,
    };

    setMensagens(
      (atuais) => [
        ...atuais,
        novaMensagem,
      ],
    );

    setMensagem("");
    setDigitando(true);

    try {
      if (!session?.token) {
        throw new Error(
          "Sua sessão não foi encontrada. Entre novamente.",
        );
      }

      const textoComContexto =
        await montarMensagemParaIA(
          texto,
        );

      const response =
        await fetch(
          `${API_URL}/assistente/chat`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${session.token}`,
            },

            body: JSON.stringify({
              texto: textoComContexto,
            }),
          },
        );

      if (response.status === 400) {
        throw new Error(
          "A mensagem não pôde ser enviada. Verifique o texto e tente novamente.",
        );
      }

      if (response.status === 401) {
        throw new Error(
          "Sua sessão expirou. Entre novamente.",
        );
      }

      if (response.status === 403) {
        throw new Error(
          "Você não tem permissão para usar a Care.",
        );
      }

      if (response.status === 503) {
        throw new Error(
          "A Care está temporariamente indisponível. Tente novamente em alguns instantes.",
        );
      }

      if (!response.ok) {
        throw new Error(
          "Não foi possível obter uma resposta da Care. Tente novamente.",
        );
      }

      const dados =
        await response.json();

      if (
        !dados?.resposta ||
        !String(
          dados.resposta,
        ).trim()
      ) {
        throw new Error(
          "A Care não conseguiu gerar uma resposta agora. Tente novamente em alguns instantes.",
        );
      }

      const resposta = {
        id: Date.now() + 1,
        autor: "ia",
        texto: dados.resposta,
      };

      setMensagens(
        (atuais) => [
          ...atuais,
          resposta,
        ],
      );

      setErroChat("");
    } catch (error) {
      console.error(
        "Erro ao conversar com a Care:",
        error,
      );

      setErroChat(
        error.message ||
          "Não foi possível conversar com a Care agora. Tente novamente em alguns instantes.",
      );
    } finally {
      setDigitando(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    enviarMensagem(mensagem);
  }

  function limparConversa() {
    setMensagens([
      {
        id: Date.now(),
        autor: "ia",
        texto: `Conversa limpa. Estou aqui quando precisar, ${userName}. 💜`,
      },
    ]);

    setErroChat("");
  }

  function navegarPagina(id) {
    setPerfilAberto(false);
    setNotificacoesAbertas(false);

    const path =
      routeMap[id];

    if (path) {
      navigate(path);
    }
  }

  function handleLogout() {
    clearCareteaSession();

    setPerfilAberto(false);
    setNotificacoesAbertas(false);

    navigate("/login");
  }

  function abrirNotificacoes() {
    setPerfilAberto(false);

    setNotificacoesAbertas(
      (aberto) => !aberto,
    );
  }

  function abrirPerfil() {
    setNotificacoesAbertas(false);

    setPerfilAberto(
      (aberto) => !aberto,
    );
  }

  return (
    <div className="assistente-page">
      <Sidebar />

      <main className="assistente-main">
        <header className="assistente-topbar">
          <div>
            <span className="assistente-eyebrow">
              Assistente inteligente
            </span>

            <h1>
              Converse com a Care{" "}
              <span>✦</span>
            </h1>

            <p>
              Tire dúvidas e organize
              sua rotina com ajuda da
              assistente do CareTEA.
            </p>
          </div>

          <div className="assistente-profile-area">
            <button
              className="assistente-notification"
              type="button"
              aria-label="Notificações"
              aria-expanded={
                notificacoesAbertas
              }
              onClick={
                abrirNotificacoes
              }
            >
              ♢

              {quantidadeNotificacoes >
                0 && (
                <span>
                  {
                    quantidadeNotificacoes
                  }
                </span>
              )}
            </button>

            <div
              className="assistente-user"
              role="button"
              tabIndex={0}
              aria-label="Abrir menu do perfil"
              aria-expanded={
                perfilAberto
              }
              onClick={abrirPerfil}
              onKeyDown={(event) => {
                if (
                  event.key ===
                    "Enter" ||
                  event.key === " "
                ) {
                  event.preventDefault();
                  abrirPerfil();
                }
              }}
            >
              <PerfilAvatar />

              <div>
                <strong>
                  {userName}
                </strong>

                <small>
                  {userLevel ||
                    "CareTEA"}
                </small>
              </div>
            </div>

            <button
              className="assistente-logout"
              type="button"
              onClick={handleLogout}
            >
              Sair
            </button>
          </div>
        </header>

        <section className="assistente-intro">
          <div className="assistente-intro-icon">
            <span>✦</span>
          </div>

          <div>
            <small>
              CARE · ASSISTENTE IA
            </small>

            <h2>
              Um apoio para deixar sua
              rotina mais simples.
            </h2>

            <p>
              Pergunte sobre bem-estar,
              organização da rotina e
              informações disponíveis
              no CareTEA.
            </p>
          </div>

          <div className="assistente-status">
            <span />
            Assistente CareTEA
          </div>
        </section>

        <section className="assistente-layout">
          <div className="assistente-chat-card">
            <header className="assistente-chat-header">
              <div className="assistente-chat-person">
                <span className="care-avatar">
                  ✦
                </span>

                <div>
                  <strong>
                    Care
                  </strong>

                  <small>
                    Assistente CareTEA
                  </small>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  limparConversa
                }
              >
                ♲ Limpar conversa
              </button>
            </header>

            <div
              className="assistente-messages"
              aria-live="polite"
            >
              <div className="assistente-date">
                <span>Hoje</span>
              </div>

              {mensagens.map(
                (item) => (
                  <div
                    key={item.id}
                    className={`assistente-message-row ${
                      item.autor ===
                      "usuario"
                        ? "assistente-message-user"
                        : "assistente-message-ai"
                    }`}
                  >
                    {item.autor ===
                      "ia" && (
                      <span className="message-avatar">
                        ✦
                      </span>
                    )}

                    <div>
                      <article className="message-bubble">
                        {item.texto}
                      </article>

                      <small>
                        {item.autor ===
                        "ia"
                          ? "Care"
                          : "Você"}
                      </small>
                    </div>
                  </div>
                ),
              )}

              {digitando && (
                <div className="assistente-message-row assistente-message-ai">
                  <span className="message-avatar">
                    ✦
                  </span>

                  <div>
                    <article className="message-bubble typing-bubble">
                      <span />
                      <span />
                      <span />
                    </article>

                    <small>
                      Care está
                      digitando...
                    </small>
                  </div>
                </div>
              )}
            </div>

            <div className="assistente-quick-questions">
              <span>
                Sugestões rápidas
              </span>

              <div>
                {sugestoes
                  .slice(0, 3)
                  .map((item) => (
                    <button
                      key={
                        item.text
                      }
                      type="button"
                      disabled={
                        digitando
                      }
                      onClick={() =>
                        enviarMensagem(
                          item.text,
                        )
                      }
                    >
                      {item.text}
                    </button>
                  ))}
              </div>
            </div>

            <form
              className="assistente-form"
              onSubmit={
                handleSubmit
              }
            >
              <div className="assistente-input-wrapper">
                <span>✦</span>

                <textarea
                  rows="1"
                  value={mensagem}
                  maxLength={
                    LIMITE_PERGUNTA
                  }
                  onChange={(
                    event,
                  ) => {
                    setMensagem(
                      event.target
                        .value,
                    );

                    if (
                      erroChat
                    ) {
                      setErroChat(
                        "",
                      );
                    }
                  }}
                  placeholder="Pergunte alguma coisa para a Care..."
                  aria-label="Mensagem para a Care"
                  onKeyDown={(
                    event,
                  ) => {
                    if (
                      event.key ===
                        "Enter" &&
                      !event.shiftKey
                    ) {
                      event.preventDefault();

                      enviarMensagem(
                        mensagem,
                      );
                    }
                  }}
                />

                <button
                  type="submit"
                  disabled={
                    !mensagem.trim() ||
                    digitando
                  }
                  aria-label="Enviar mensagem"
                >
                  ➤
                </button>
              </div>

              {erroChat && (
                <p
                  role="alert"
                  aria-live="assertive"
                >
                  {erroChat}
                </p>
              )}

              <p>
                A Care pode cometer
                erros. Informações
                médicas importantes
                devem ser confirmadas
                com um profissional.
              </p>
            </form>
          </div>

          <aside className="assistente-side">
            <section className="assistente-side-card">
              <div className="assistente-side-heading">
                <span>✦</span>

                <div>
                  <small>
                    Comece por aqui
                  </small>

                  <h3>
                    Como posso ajudar?
                  </h3>
                </div>
              </div>

              <div className="assistente-suggestions">
                {sugestoes.map(
                  (item) => (
                    <button
                      key={
                        item.title
                      }
                      type="button"
                      disabled={
                        digitando
                      }
                      onClick={() =>
                        enviarMensagem(
                          item.text,
                        )
                      }
                    >
                      <span
                        className={`suggestion-icon suggestion-${item.tone}`}
                      >
                        {
                          item.icon
                        }
                      </span>

                      <span>
                        <strong>
                          {
                            item.title
                          }
                        </strong>

                        <small>
                          {
                            item.text
                          }
                        </small>
                      </span>

                      <b>›</b>
                    </button>
                  ),
                )}
              </div>
            </section>

            <section className="assistente-warning-card">
              <span>♡</span>

              <div>
                <strong>
                  Apoio, não
                  diagnóstico
                </strong>

                <p>
                  A Care ajuda na
                  organização e no
                  acesso às
                  informações, mas não
                  substitui
                  acompanhamento
                  médico ou
                  profissional.
                </p>
              </div>
            </section>
          </aside>
        </section>

        <div
          className="assistente-puzzle-strip"
          aria-hidden="true"
        >
          {Array.from(
            { length: 18 },
            (_, index) => (
              <span
                key={index}
                className={`assistente-puzzle-color assistente-puzzle-${
                  index % 6
                }`}
              />
            ),
          )}
        </div>

        <ModalNotificacoes
          aberto={
            notificacoesAbertas
          }
          onClose={() =>
            setNotificacoesAbertas(
              false,
            )
          }
          onQuantidadeAlterada={
            setQuantidadeNotificacoes
          }
          onVerTodas={() =>
            navegarPagina(
              "notificacoes",
            )
          }
        />

        <ModalPerfil
          aberto={perfilAberto}
          onClose={() =>
            setPerfilAberto(false)
          }
          onNavigate={
            navegarPagina
          }
          onLogout={
            handleLogout
          }
        />
      </main>
    </div>
  );
}

export default Assistente;