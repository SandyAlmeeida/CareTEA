
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logoCaretea from "../../assets/logo-caretea.png";
import PuzzleStrip from "../../components/PuzzleStrip/PuzzleStrip.jsx";
import PerfilAvatar from "../../components/PerfilAvatar/PerfilAvatar.jsx";
import ModalNotificacoes from "../../components/ModalNotificacoes/ModalNotificacoes.jsx";
import ModalPerfil from "../../components/ModalPerfil/ModalPerfil.jsx";

import {
  getCareteaProfile,
  clearCareteaSession,
} from "../../utils/careteaSession.js";

import "./Dashboard.css";

const menuItems = [
  {
    id: "dashboard",
    icon: "⌂",
    label: "Dashboard",
  },
  {
    id: "agenda",
    icon: "▣",
    label: "Agenda",
  },
  {
    id: "medicamentos",
    icon: "◊",
    label: "Medicamentos",
  },
  {
    id: "consultas",
    icon: "♧",
    label: "Consultas",
  },
  {
    id: "bem-estar",
    icon: "♡",
    label: "Bem-estar",
    onlyFor: "autista-nivel-1",
  },
  {
    id: "gerenciar-meu-dia",
    icon: "▦",
    label: "Acesso da Pessoa Autista",
    onlyFor: "responsavel-nivel-2",
  },
  {
    id: "assistente",
    icon: "◉",
    label: "IA Assistente",
  },
  {
    id: "notificacoes",
    icon: "♢",
    label: "Notificações",
  },
  {
    id: "documentos",
    icon: "▤",
    label: "Documentos",
  },
  {
    id: "relatorios",
    icon: "▥",
    label: "Relatórios",
  },
  {
    id: "configuracoes",
    icon: "⚙",
    label: "Configurações",
  },
];

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

const stats = [
  {
    icon: "◊",
    value: "3",
    title: "Medicamentos",
    subtitle: "Hoje",
    tone: "purple",
    route: "medicamentos",
  },
  {
    icon: "▣",
    value: "1",
    title: "Consulta",
    subtitle: "Hoje",
    tone: "blue",
    route: "consultas",
  },
  {
    icon: "△",
    value: "1",
    title: "Exame",
    subtitle: "Próximo",
    tone: "green",
    route: "consultas",
  },
  {
    icon: "♡",
    value: "1",
    title: "Terapia",
    subtitle: "Esta semana",
    tone: "orange",
    route: "consultas",
  },
];

const schedule = [
  {
    time: "08:00",
    icon: "◊",
    title: "Risperidona 1mg",
    subtitle: "1 comprimido",
    status: "Tomado",
    tone: "green",
    dot: "purple",
  },
  {
    time: "12:00",
    icon: "◇",
    title: "Metilfenidato 10mg",
    subtitle: "1 comprimido",
    status: "Pendente",
    tone: "orange",
    dot: "yellow",
  },
  {
    time: "15:00",
    icon: "♧",
    title: "Consulta - Neurologista",
    subtitle: "Clínica Neuro",
    status: "Em 2h",
    tone: "blue",
    dot: "blue",
  },
  {
    time: "18:30",
    icon: "♡",
    title: "Terapia - Fonoaudiologia",
    subtitle: "Sessão online",
    status: "Em 5h 30min",
    tone: "purple",
    dot: "pink",
  },
];

const moods = [
  ["🙂", "Ótimo", "otimo", "green"],
  ["😐", "Bem", "bem", "yellow"],
  ["😮", "Mais ou menos", "medio", "orange"],
  ["🙁", "Mal", "mal", "red"],
  ["😣", "Muito mal", "muito-mal", "purple"],
];

function Dashboard({
  onNavigate,
  onLogout,
}) {
  const routerNavigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [selectedMood, setSelectedMood] = useState("bem");
  const [notificacoesAbertas, setNotificacoesAbertas] =
    useState(false);

  const [perfilAberto, setPerfilAberto] =
    useState(false);

  const [
    quantidadeNotificacoes,
    setQuantidadeNotificacoes,
  ] = useState(3);

  const profile = getCareteaProfile();

  const accountType = profile?.accountType;
  const autismLevel = profile?.autismLevel;
  const isResponsible = profile?.isResponsible === true;

  const userName =
    profile?.userName || "Usuário";

  const profileName =
    profile?.profileName || "";

  const userLevel =
    profile?.userLevel || "";

  const dashboardSubtitle =
    isResponsible && profileName
      ? `Acompanhando a rotina de ${profileName}.`
      : isResponsible
        ? "Acompanhe a rotina e os cuidados em um só lugar."
        : "Sua rotina, cuidados e compromissos em um só lugar.";

  const organizedDayTitle =
    isResponsible && profileName
      ? `Rotina de ${profileName}`
      : isResponsible
        ? "Rotina acompanhada"
        : "Seu dia, organizado";

  const agendaTitle =
    isResponsible && profileName
      ? `Agenda de ${profileName}`
      : isResponsible
        ? "Agenda acompanhada"
        : "Agenda do dia";

  const moodTitle =
    isResponsible && profileName
      ? `Como ${profileName} está hoje?`
      : isResponsible
        ? "Como está a pessoa acompanhada hoje?"
        : "Como você está hoje?";

  const visibleMenuItems =
    menuItems.filter((item) => {
      if (
        item.onlyFor === "autista-nivel-1" &&
        !(
          accountType === "autista" &&
          autismLevel === 1
        )
      ) {
        return false;
      }

      if (
        item.onlyFor === "responsavel-nivel-2" &&
        !(
          accountType === "responsavel" &&
          autismLevel === 2
        )
      ) {
        return false;
      }

      return true;
    });

  function navigateTo(id) {
    setActiveMenu(id);
    setNotificacoesAbertas(false);
    setPerfilAberto(false);

    if (onNavigate) {
      onNavigate(id);
      return;
    }

    const path = routeMap[id];

    if (path) {
      routerNavigate(path);
    }
  }

  function handleLogout() {
    clearCareteaSession();

    setPerfilAberto(false);
    setNotificacoesAbertas(false);

    if (onLogout) {
      onLogout();
      return;
    }

    routerNavigate("/login");
  }

  function toggleNotifications() {
    setPerfilAberto(false);

    setNotificacoesAbertas(
      (aberto) => !aberto,
    );
  }

  function toggleProfile() {
    setNotificacoesAbertas(false);

    setPerfilAberto(
      (aberto) => !aberto,
    );
  }

  return (
    <div className="caretea-dashboard">
      <aside className="dashboard-sidebar">
        <img
          src={logoCaretea}
          alt="CareTEA"
          className="sidebar-logo"
        />

        <nav
          className="sidebar-nav"
          aria-label="Menu principal"
        >
          {visibleMenuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`sidebar-item ${
                activeMenu === item.id
                  ? "sidebar-item-active"
                  : ""
              }`}
              onClick={() =>
                navigateTo(item.id)
              }
            >
              <span className="sidebar-icon">
                {item.icon}
              </span>

              <span>{item.label}</span>

              {item.id === "notificacoes" &&
                quantidadeNotificacoes > 0 && (
                  <span className="sidebar-badge">
                    {quantidadeNotificacoes}
                  </span>
                )}
            </button>
          ))}
        </nav>

        <div className="sidebar-help-card">
          <div className="help-illustration">
            🧩
          </div>

          <strong>
            Precisa de ajuda?
          </strong>

          <p>
            Nossa IA está aqui para te apoiar
            sempre que precisar.
          </p>

          <button
            type="button"
            onClick={() =>
              navigateTo("assistente")
            }
          >
            Conversar com IA
          </button>
        </div>

        <button
          className="sidebar-item"
          type="button"
          onClick={handleLogout}
        >
          <span className="sidebar-icon">
            ↪
          </span>

          <span>Sair</span>
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <h1>
              Olá, {userName}! 👋
            </h1>

            <p>
              {dashboardSubtitle}
            </p>
          </div>

          <div className="topbar-actions">
            <button
              className="notification-button"
              type="button"
              aria-label="Abrir notificações"
              aria-expanded={notificacoesAbertas}
              onClick={toggleNotifications}
            >
              ♢

              {quantidadeNotificacoes > 0 && (
                <span>
                  {quantidadeNotificacoes}
                </span>
              )}
            </button>

            <button
              className="profile-button"
              type="button"
              aria-label="Abrir menu do perfil"
              aria-expanded={perfilAberto}
              onClick={toggleProfile}
            >
              <PerfilAvatar />

              <span className="profile-copy">
                <strong>
                  {userName}
                </strong>

                {userLevel && (
                  <small>
                    {userLevel}
                  </small>
                )}
              </span>

              <span>
                {perfilAberto
                  ? "⌃"
                  : "⌄"}
              </span>
            </button>
          </div>
        </header>

        <section className="quick-actions">
          <button
            type="button"
            onClick={() =>
              navigateTo("agenda")
            }
          >
            <span>＋</span>
            Novo lembrete
          </button>

          <button
            type="button"
            onClick={() =>
              navigateTo("consultas")
            }
          >
            <span>▣</span>
            Nova consulta
          </button>

          <button
            type="button"
            onClick={() =>
              navigateTo("documentos")
            }
          >
            <span>▤</span>
            Enviar documento
          </button>
        </section>

        <section className="dashboard-layout">
          <div className="dashboard-center">
            <section className="stats-grid">
              {stats.map((stat) => (
                <article
                  className="stat-card"
                  key={stat.title}
                >
                  <span
                    className={`stat-icon stat-icon-${stat.tone}`}
                  >
                    {stat.icon}
                  </span>

                  <div className="stat-copy">
                    <strong>
                      {stat.value}
                    </strong>

                    <span>
                      {stat.title}
                    </span>

                    <small>
                      {stat.subtitle}
                    </small>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigateTo(stat.route)
                    }
                  >
                    Ver todos →
                  </button>
                </article>
              ))}
            </section>

            <section className="dashboard-panel organized-day-panel">
              <div className="panel-header">
                <h2>
                  {organizedDayTitle}
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    navigateTo("agenda")
                  }
                >
                  Ver agenda completa
                </button>
              </div>

              <div className="timeline">
                {schedule.map((item) => (
                  <article
                    className="timeline-row"
                    key={`${item.time}-${item.title}`}
                  >
                    <div className="timeline-time">
                      <span
                        className={`timeline-dot timeline-dot-${item.dot}`}
                      />

                      <time>
                        {item.time}
                      </time>
                    </div>

                    <div
                      className={`timeline-icon timeline-icon-${item.dot}`}
                    >
                      {item.icon}
                    </div>

                    <div className="timeline-copy">
                      <strong>
                        {item.title}
                      </strong>

                      <small>
                        {item.subtitle}
                      </small>
                    </div>

                    <span
                      className={`status-pill status-pill-${item.tone}`}
                    >
                      {item.status}

                      <b>
                        {item.tone === "green"
                          ? "✓"
                          : "◷"}
                      </b>
                    </span>
                  </article>
                ))}
              </div>
            </section>

          </div>

          <aside className="dashboard-right">
            <section className="dashboard-panel calendar-panel">
              <div className="panel-header">
                <h2>
                  {agendaTitle}
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    navigateTo("agenda")
                  }
                >
                  Ver calendário
                </button>
              </div>

              <div className="calendar-toolbar">
                <button type="button">
                  ‹
                </button>

                <strong>
                  Maio 2025
                </strong>

                <button type="button">
                  ›
                </button>
              </div>

              <div className="calendar-week">
                {[
                  "Seg",
                  "Ter",
                  "Qua",
                  "Qui",
                  "Sex",
                  "Sáb",
                  "Dom",
                ].map((day) => (
                  <span key={day}>
                    {day}
                  </span>
                ))}

                {[
                  12,
                  13,
                  14,
                  15,
                  16,
                  17,
                  18,
                ].map((date) => (
                  <button
                    type="button"
                    key={date}
                    className={
                      date === 12
                        ? "calendar-selected"
                        : ""
                    }
                  >
                    {date}
                  </button>
                ))}
              </div>

              <div className="agenda-list">
                {[
                  [
                    "08:00",
                    "Risperidona 1mg",
                    "1 comprimido",
                    "green",
                    "✓",
                  ],
                  [
                    "15:00",
                    "Consulta - Neurologista",
                    "Clínica Neuro",
                    "purple",
                    "›",
                  ],
                  [
                    "18:30",
                    "Terapia - Fonoaudiologia",
                    "Sessão online",
                    "orange",
                    "›",
                  ],
                ].map(
                  ([
                    time,
                    title,
                    subtitle,
                    tone,
                    action,
                  ]) => (
                    <article
                      key={`${time}-${title}`}
                    >
                      <time>
                        {time}
                      </time>

                      <span
                        className={`agenda-line agenda-line-${tone}`}
                      />

                      <div>
                        <strong>
                          {title}
                        </strong>

                        <small>
                          {subtitle}
                        </small>
                      </div>

                      <b
                        className={`agenda-action agenda-action-${tone}`}
                      >
                        {action}
                      </b>
                    </article>
                  ),
                )}
              </div>
            </section>

            <section className="dashboard-panel quick-info-panel">
              <div className="panel-header compact">
                <h2>
                  Informações rápidas
                </h2>
              </div>

              <div className="quick-info-list">
                {[
                  [
                    "▣",
                    "Próxima consulta",
                    "20/05/2025 - Terça, 15:00",
                    "Neurologista",
                    "purple",
                  ],
                  [
                    "△",
                    "Próximo exame",
                    "22/05/2025 - 07:30",
                    "Exame de Sangue",
                    "blue",
                  ],
                  [
                    "♡",
                    "Próxima terapia",
                    "13/05/2025 - 18:30",
                    "Fonoaudiologia",
                    "pink",
                  ],
                ].map(
                  ([
                    icon,
                    title,
                    detail,
                    tag,
                    tone,
                  ]) => (
                    <article
                      key={title}
                    >
                      <span
                        className={`quick-info-icon quick-info-${tone}`}
                      >
                        {icon}
                      </span>

                      <div>
                        <strong>
                          {title}
                        </strong>

                        <small>
                          {detail}
                        </small>
                      </div>

                      <span>
                        {tag}
                      </span>

                      <b>
                        ♙
                      </b>
                    </article>
                  ),
                )}
              </div>

              <button
                className="view-all-button"
                type="button"
                onClick={() =>
                  navigateTo("agenda")
                }
              >
                Ver todos os compromissos →
              </button>
            </section>
          </aside>
        </section>

        <div className="dashboard-puzzle-strip">
          <PuzzleStrip />
        </div>

        <ModalNotificacoes
          aberto={notificacoesAbertas}
          onClose={() =>
            setNotificacoesAbertas(false)
          }
          onQuantidadeAlterada={
            setQuantidadeNotificacoes
          }
          onVerTodas={() =>
            navigateTo("notificacoes")
          }
        />

        <ModalPerfil
          aberto={perfilAberto}
          onClose={() =>
            setPerfilAberto(false)
          }
          onNavigate={navigateTo}
          onLogout={handleLogout}
        />
      </main>

    </div>
  );
}

export default Dashboard;