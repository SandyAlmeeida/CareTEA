import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import PuzzleStrip from "../../components/PuzzleStrip/PuzzleStrip.jsx";
import PerfilAvatar from "../../components/PerfilAvatar/PerfilAvatar.jsx";
import ModalNotificacoes from "../../components/ModalNotificacoes/ModalNotificacoes.jsx";
import ModalPerfil from "../../components/ModalPerfil/ModalPerfil.jsx";

import {
  getCareteaProfile,
  clearCareteaSession,
} from "../../utils/careteaSession.js";

import "./Assistente.css";

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
    icon: "▣",
    title: "Meu dia",
    text: "Quais são meus compromissos de hoje?",
    tone: "blue",
  },
  {
    icon: "◊",
    title: "Medicamentos",
    text: "Quais medicamentos ainda preciso tomar hoje?",
    tone: "purple",
  },
  {
    icon: "✦",
    title: "Organização",
    text: "Me ajude a organizar minha rotina de hoje.",
    tone: "green",
  },
  {
    icon: "♡",
    title: "Preparação",
    text: "Como posso me preparar para minha próxima consulta?",
    tone: "orange",
  },
];

function gerarResposta(pergunta, profileName) {
  const texto = pergunta.toLowerCase();

  if (
    texto.includes("compromisso") ||
    texto.includes("agenda") ||
    texto.includes("hoje")
  ) {
    return `Posso te ajudar a organizar o dia de ${profileName}. Quando conectarmos a Care ao backend, vou consultar automaticamente medicamentos, consultas, exames e terapias cadastrados para hoje.`;
  }

  if (
    texto.includes("medicamento") ||
    texto.includes("remédio") ||
    texto.includes("remedio")
  ) {
    return `Quando a integração estiver pronta, vou consultar os medicamentos cadastrados de ${profileName}, mostrar os horários e indicar quais ainda estão pendentes.`;
  }

  if (
    texto.includes("rotina") ||
    texto.includes("organizar") ||
    texto.includes("organização")
  ) {
    return "Claro! Podemos dividir o dia em pequenas etapas: compromissos importantes primeiro, medicamentos nos horários definidos e momentos de descanso entre as atividades. Depois vou conseguir montar isso usando os dados reais do CareTEA.";
  }

  if (
    texto.includes("consulta") ||
    texto.includes("médico") ||
    texto.includes("medico")
  ) {
    return "Uma boa preparação é separar documentos, exames recentes, receitas e anotar previamente as principais dúvidas. Quando estiver integrada ao sistema, também poderei consultar os dados já salvos no CareTEA.";
  }

  return "Entendi. Por enquanto esta tela está funcionando como protótipo da Care. Quando conectarmos a IA ao backend, vou poder usar as informações cadastradas no CareTEA para oferecer uma resposta mais útil e personalizada.";
}

function Assistente() {
  const navigate = useNavigate();
  const profile = getCareteaProfile();

  const userName = profile?.userName || "Usuário";
  const profileName = profile?.profileName || userName;
  const userLevel = profile?.userLevel || "";

  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);
  const [perfilAberto, setPerfilAberto] = useState(false);
  const [quantidadeNotificacoes, setQuantidadeNotificacoes] = useState(3);

  const [mensagens, setMensagens] = useState([
    {
      id: 1,
      autor: "ia",
      texto: `Olá, ${userName}! 👋 Eu sou a Care, sua assistente do CareTEA. Como posso ajudar você hoje?`,
    },
  ]);

  const [mensagem, setMensagem] = useState("");
  const [digitando, setDigitando] = useState(false);

  function enviarMensagem(textoRecebido) {
    const texto = textoRecebido.trim();

    if (!texto || digitando) {
      return;
    }

    const novaMensagem = {
      id: Date.now(),
      autor: "usuario",
      texto,
    };

    setMensagens((atuais) => [...atuais, novaMensagem]);
    setMensagem("");
    setDigitando(true);

    window.setTimeout(() => {
      const resposta = {
        id: Date.now() + 1,
        autor: "ia",
        texto: gerarResposta(texto, profileName),
      };

      setMensagens((atuais) => [...atuais, resposta]);
      setDigitando(false);
    }, 650);
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
  }

  function navegarPagina(id) {
    setPerfilAberto(false);
    setNotificacoesAbertas(false);

    const path = routeMap[id];

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
    setNotificacoesAbertas((aberto) => !aberto);
  }

  function abrirPerfil() {
    setNotificacoesAbertas(false);
    setPerfilAberto((aberto) => !aberto);
  }

  return (
    <div className="assistente-page">
      <Sidebar />

      <main className="assistente-main">
        <header className="assistente-topbar">
          <div>
            <span className="assistente-eyebrow">Assistente inteligente</span>

            <h1>
              Converse com a Care <span>✦</span>
            </h1>

            <p>
              Tire dúvidas e organize sua rotina com ajuda da assistente do
              CareTEA.
            </p>
          </div>

          <div className="assistente-profile-area">
            <button
              className="assistente-notification"
              type="button"
              aria-label="Notificações"
              aria-expanded={notificacoesAbertas}
              onClick={abrirNotificacoes}
            >
              ♢
              {quantidadeNotificacoes > 0 && (
                <span>{quantidadeNotificacoes}</span>
              )}
            </button>

            <div
              className="assistente-user"
              role="button"
              tabIndex={0}
              aria-label="Abrir menu do perfil"
              aria-expanded={perfilAberto}
              onClick={abrirPerfil}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  abrirPerfil();
                }
              }}
            >
              <PerfilAvatar />

              <div>
                <strong>{userName}</strong>
                <small>{userLevel || "CareTEA"}</small>
              </div>
            </div>

          </div>
        </header>

        <section className="assistente-intro">
          <div className="assistente-intro-icon">
            <span>✦</span>
          </div>

          <div>
            <small>CARE · ASSISTENTE IA</small>
            <h2>Um apoio para deixar sua rotina mais simples.</h2>

            <p>
              Pergunte sobre medicamentos, compromissos, organização da rotina
              e informações registradas no CareTEA.
            </p>
          </div>

          <div className="assistente-status">
            <span />
            Assistente disponível
          </div>
        </section>

        <section className="assistente-layout">
          <div className="assistente-chat-card">
            <header className="assistente-chat-header">
              <div className="assistente-chat-person">
                <span className="care-avatar">✦</span>

                <div>
                  <strong>Care</strong>
                  <small>
                    <span />
                    Online agora
                  </small>
                </div>
              </div>

              <button type="button" onClick={limparConversa}>
                ♲ Limpar conversa
              </button>
            </header>

            <div className="assistente-messages" aria-live="polite">
              <div className="assistente-date">
                <span>Hoje</span>
              </div>

              {mensagens.map((item) => (
                <div
                  key={item.id}
                  className={`assistente-message-row ${
                    item.autor === "usuario"
                      ? "assistente-message-user"
                      : "assistente-message-ai"
                  }`}
                >
                  {item.autor === "ia" && (
                    <span className="message-avatar">✦</span>
                  )}

                  <div>
                    <article className="message-bubble">{item.texto}</article>

                    <small>{item.autor === "ia" ? "Care" : "Você"}</small>
                  </div>
                </div>
              ))}

              {digitando && (
                <div className="assistente-message-row assistente-message-ai">
                  <span className="message-avatar">✦</span>

                  <div>
                    <article className="message-bubble typing-bubble">
                      <span />
                      <span />
                      <span />
                    </article>

                    <small>Care está digitando...</small>
                  </div>
                </div>
              )}
            </div>

            <div className="assistente-quick-questions">
              <span>Sugestões rápidas</span>

              <div>
                {sugestoes.slice(0, 3).map((item) => (
                  <button
                    key={item.text}
                    type="button"
                    onClick={() => enviarMensagem(item.text)}
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            </div>

            <form className="assistente-form" onSubmit={handleSubmit}>
              <div className="assistente-input-wrapper">
                <span>✦</span>

                <textarea
                  rows="1"
                  value={mensagem}
                  onChange={(event) => setMensagem(event.target.value)}
                  placeholder="Pergunte alguma coisa para a Care..."
                  aria-label="Mensagem para a Care"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      enviarMensagem(mensagem);
                    }
                  }}
                />

                <button
                  type="submit"
                  disabled={!mensagem.trim() || digitando}
                  aria-label="Enviar mensagem"
                >
                  ➤
                </button>
              </div>

              <p>
                A Care pode cometer erros. Informações médicas importantes
                devem ser confirmadas com um profissional.
              </p>
            </form>
          </div>

          <aside className="assistente-side">
            <section className="assistente-side-card">
              <div className="assistente-side-heading">
                <span>✦</span>

                <div>
                  <small>Comece por aqui</small>
                  <h3>Como posso ajudar?</h3>
                </div>
              </div>

              <div className="assistente-suggestions">
                {sugestoes.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => enviarMensagem(item.text)}
                  >
                    <span
                      className={`suggestion-icon suggestion-${item.tone}`}
                    >
                      {item.icon}
                    </span>

                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.text}</small>
                    </span>

                    <b>›</b>
                  </button>
                ))}
              </div>
            </section>

            <section className="assistente-warning-card">
              <span>♡</span>

              <div>
                <strong>Apoio, não diagnóstico</strong>

                <p>
                  A Care ajuda na organização e no acesso às informações, mas
                  não substitui acompanhamento médico ou profissional.
                </p>
              </div>
            </section>
          </aside>
        </section>

        <div className="assistente-puzzle-strip">
          <PuzzleStrip />
        </div>

        <ModalNotificacoes
          aberto={notificacoesAbertas}
          onClose={() => setNotificacoesAbertas(false)}
          onQuantidadeAlterada={setQuantidadeNotificacoes}
          onVerTodas={() => navegarPagina("notificacoes")}
        />

        <ModalPerfil
          aberto={perfilAberto}
          onClose={() => setPerfilAberto(false)}
          onNavigate={navegarPagina}
          onLogout={handleLogout}
        />
      </main>

    </div>
  );
}

export default Assistente;