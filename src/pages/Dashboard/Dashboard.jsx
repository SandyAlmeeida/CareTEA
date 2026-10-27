import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoCaretea from "../../assets/logo-caretea.png";
import PuzzleStrip from "../../components/PuzzleStrip/PuzzleStrip.jsx";
import PerfilAvatar from "../../components/PerfilAvatar/PerfilAvatar.jsx";
import ModalNotificacoes from "../../components/ModalNotificacoes/ModalNotificacoes.jsx";
import ModalPerfil from "../../components/ModalPerfil/ModalPerfil.jsx";
import {
  getCareteaSession,
  getCareteaProfile,
  clearCareteaSession,
} from "../../utils/careteaSession.js";
import "./Dashboard.css";

const API_URL = "http://localhost:8080";

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

const humorBackendParaFrontend = {
  MUITO_BEM: "otimo",
  BEM: "bem",
  NEUTRO: "medio",
  MAL: "mal",
  MUITO_MAL: "muito-mal",
};
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
  { icon: "◇", title: "Medicamentos", tone: "purple", route: "medicamentos" },
  { icon: "▣", title: "Consulta", tone: "blue", route: "consultas" },
  { icon: "△", title: "Exame", tone: "green", route: "consultas" },
  { icon: "♡", title: "Terapia", tone: "orange", route: "consultas" },
];
const reminderTypes = {
  MEDICAMENTO: { label: "Lembrete de medicamento", icon: "◇", tone: "purple" },
  CONSULTA: { label: "Lembrete de consulta", icon: "♧", tone: "blue" },
  EXAME: { label: "Lembrete de exame", icon: "△", tone: "green" },
  LEMBRETE: { label: "Lembrete geral", icon: "▣", tone: "orange" },
  SISTEMA: { label: "Aviso do sistema", icon: "♢", tone: "purple" },
};

function reminderPresentation(item) {
  return reminderTypes[item.tipo] || {
    label: "Lembrete", icon: "▣", tone: "blue",
  };
}

function sameDay(first, second) {
  return first.getFullYear() === second.getFullYear()
    && first.getMonth() === second.getMonth()
    && first.getDate() === second.getDate();
}

function reminderTime(item) {
  return new Date(item.dataHora).toLocaleTimeString("pt-BR", {
    hour: "2-digit", minute: "2-digit",
  });
}

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
  const [selectedMood, setSelectedMood] = useState(null);
  const [notificacoesAbertas, setNotificacoesAbertas] =
    useState(false);
  const [perfilAberto, setPerfilAberto] =
    useState(false);
  const [
    quantidadeNotificacoes,
    setQuantidadeNotificacoes,
  ] = useState(0);
  const session = getCareteaSession();
  const [wellbeingSummary, setWellbeingSummary] = useState(null);
  const [loadingWellbeing, setLoadingWellbeing] = useState(true);
  const [wellbeingError, setWellbeingError] = useState("");
  const [reminders, setReminders] = useState([]);
  const [loadingReminders, setLoadingReminders] = useState(true);
  const [remindersError, setRemindersError] = useState("");
  const [calendarDate, setCalendarDate] = useState(() => new Date());
  const today = new Date();
  const weekStart = new Date(calendarDate);
  weekStart.setDate(weekStart.getDate() - (weekStart.getDay() + 6) % 7);
  const calendarDays = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(weekStart);
    day.setDate(day.getDate() + index);
    return day;
  });
  const schedule = reminders.filter((item) => sameDay(new Date(item.dataHora), today));
  const agenda = reminders.filter((item) => sameDay(new Date(item.dataHora), calendarDate));
  const upcomingReminders = reminders
    .filter((item) => new Date(item.dataHora) >= today)
    .slice(0, 3);
  const reminderState = loadingReminders
    ? "Carregando lembretes..."
    : remindersError;
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

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function carregarLembretes() {
      setLoadingReminders(true);
      setRemindersError("");
      setReminders([]);

      try {
        if (!session?.token || !session?.userId) {
          throw new Error("Sessão não encontrada.");
        }

        const response = await fetch(
          `${API_URL}/lembretes/usuario/${session.userId}`,
          {
            headers: { Authorization: `Bearer ${session.token}` },
            signal: controller.signal,
          },
        );
        if (!response.ok) {
          throw new Error("Não foi possível carregar os lembretes.");
        }

        const data = await response.json();
        if (!Array.isArray(data) || data.some((item) =>
          !item || !item.dataHora || Number.isNaN(new Date(item.dataHora).getTime())
        )) {
          throw new Error("Resposta de lembretes inválida.");
        }

        if (active) {
          setReminders(data
            .filter((item) => item.ativo)
            .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora)));
        }
      } catch (error) {
        if (active) {
          setRemindersError("Não foi possível carregar os lembretes.");
          console.error("Erro ao carregar lembretes:", error);
        }
      } finally {
        if (active) setLoadingReminders(false);
      }
    }

    carregarLembretes();
    return () => {
      active = false;
      controller.abort();
    };
  }, [session?.token, session?.userId]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function carregarBemEstar() {
      setLoadingWellbeing(true);
      setWellbeingError("");
      setWellbeingSummary(null);
      setSelectedMood(null);
      if (!session?.token || !session?.userId) {
        setWellbeingError("Não foi possível carregar o bem-estar.");
        setLoadingWellbeing(false);
        return;
      }

      try {
        const fim = new Date();
        const inicio = new Date();

        inicio.setDate(inicio.getDate() - 7);

        const response = await fetch(
          `${API_URL}/dashboard/bem-estar/usuario/${session.userId}` +
            `?inicio=${encodeURIComponent(formatLocalDateTime(inicio))}` +
            `&fim=${encodeURIComponent(formatLocalDateTime(fim))}`,
          {
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(
            "Não foi possível carregar o bem-estar.",
          );
        }

        const dados = await response.json();

        if (!dados || !Number.isInteger(dados.totalRegistros) || dados.totalRegistros < 0) {
          throw new Error("Resposta de bem-estar inválida.");
        }
        if (!active) return;
        setWellbeingSummary(dados);

        const humorConvertido =
          humorBackendParaFrontend[dados.humorPredominante];

        if (humorConvertido) {
          setSelectedMood(humorConvertido);
        }
      } catch (error) {
        if (!active) return;
        setWellbeingError("Não foi possível carregar o bem-estar.");
        console.error(
          "Erro ao carregar bem-estar:",
          error,
        );
      } finally {
        if (active) setLoadingWellbeing(false);
      }
    }

    carregarBemEstar();
    return () => {
      active = false;
      controller.abort();
    };
  }, [session?.token, session?.userId]);
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
  const moodTitle = "Bem-estar nos últimos 7 dias";
  function changeCalendarWeek(offset) {
    setCalendarDate((current) => {
      const next = new Date(current);
      next.setDate(next.getDate() + offset * 7);
      return next;
    });
  }
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
                      —
                    </strong>
                    <span>
                      {stat.title}
                    </span>
                    <small>
                      Dados indisponíveis
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
                {reminderState ? (
                  <p role={remindersError ? "alert" : undefined}>{reminderState}</p>
                ) : schedule.length === 0 ? (
                  <p>Nenhum lembrete para hoje.</p>
                ) : schedule.map((item) => {
                  const presentation = reminderPresentation(item);
                  return (
                    <article className="timeline-row" key={item.id}>
                      <div className="timeline-time">
                        <span className={`timeline-dot timeline-dot-${presentation.tone}`} />
                        <time dateTime={item.dataHora}>{reminderTime(item)}</time>
                      </div>
                      <div className={`timeline-icon timeline-icon-${presentation.tone}`}>
                        {presentation.icon}
                      </div>
                      <div className="timeline-copy">
                        <strong>{item.titulo}</strong>
                        <small>{item.mensagem}</small>
                      </div>
                      <span className={`status-pill status-pill-${presentation.tone}`}>
                        {presentation.label}
                      </span>
                    </article>
                  );
                })}
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
                <button type="button" aria-label="Semana anterior" onClick={() => changeCalendarWeek(-1)}>
                  ‹
                </button>
                <strong>
                  {calendarDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                </strong>
                <button type="button" aria-label="Próxima semana" onClick={() => changeCalendarWeek(1)}>
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
                {calendarDays.map((date) => (
                  <button
                    type="button"
                    key={formatLocalDateTime(date).slice(0, 10)}
                    className={sameDay(date, calendarDate) ? "calendar-selected" : ""}
                    onClick={() => setCalendarDate(date)}
                    aria-label={date.toLocaleDateString("pt-BR")}
                    aria-pressed={sameDay(date, calendarDate)}
                  >
                    {date.getDate()}
                  </button>
                ))}
              </div>
              <div className="agenda-list">
                {reminderState ? (
                  <p role={remindersError ? "alert" : undefined}>{reminderState}</p>
                ) : agenda.length === 0 ? (
                  <p>Nenhum lembrete para esta data.</p>
                ) : agenda.map((item) => {
                  const presentation = reminderPresentation(item);
                  return (
                    <article key={item.id}>
                      <time dateTime={item.dataHora}>{reminderTime(item)}</time>
                      <span className={`agenda-line agenda-line-${presentation.tone}`} />
                      <div>
                        <strong>{item.titulo}</strong>
                        <small>{presentation.label} · {item.mensagem}</small>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
            {accountType === "autista" && autismLevel === 1 && (
              <section className="dashboard-panel mood-panel">
                <div className="panel-header">
                  <h2>{moodTitle}</h2>

                  <button
                    type="button"
                    onClick={() => navigateTo("bem-estar")}
                  >
                    Ver detalhes
                  </button>
                </div>

                {loadingWellbeing ? (
                  <p className="streak-caption">
                    Carregando bem-estar...
                  </p>
                ) : wellbeingError ? (
                  <p className="streak-caption" role="alert">{wellbeingError}</p>
                ) : wellbeingSummary?.totalRegistros > 0 ? (
                  <>
                    <div className="mood-options">
                      {moods.map(
                        ([emoji, label, value, tone]) => (
                          <button
                            key={value}
                            type="button"
                            className={
                              selectedMood === value
                                ? "mood-selected"
                                : ""
                            }
                            onClick={() =>
                              navigateTo("bem-estar")
                            }
                          >
                            <span
                              className={`mood-face mood-face-${tone}`}
                            >
                              {emoji}
                            </span>

                            <small>{label}</small>
                          </button>
                        ),
                      )}
                    </div>

                    <p className="streak-caption">
                      Baseado em {wellbeingSummary.totalRegistros}{" "}
                      registro(s) dos últimos 7 dias.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="streak-caption">
                      Você ainda não possui registros de bem-estar
                      nos últimos 7 dias.
                    </p>

                    <button
                      className="view-all-button"
                      type="button"
                      onClick={() => navigateTo("bem-estar")}
                    >
                      Registrar como estou →
                    </button>
                  </>
                )}
              </section>
            )}

            <section className="dashboard-panel quick-info-panel">
              <div className="panel-header compact">
                <h2>
                  Informações rápidas
                </h2>
              </div>
              <div className="quick-info-list">
                {reminderState ? (
                  <p role={remindersError ? "alert" : undefined}>{reminderState}</p>
                ) : upcomingReminders.length === 0 ? (
                  <p>Nenhum próximo lembrete.</p>
                ) : upcomingReminders.map((item) => {
                  const presentation = reminderPresentation(item);
                  return (
                    <article key={item.id}>
                      <span className={`quick-info-icon quick-info-${presentation.tone}`}>
                        {presentation.icon}
                      </span>
                      <div>
                        <strong>{item.titulo}</strong>
                        <small>
                          {new Date(item.dataHora).toLocaleString("pt-BR", {
                            day: "2-digit", month: "2-digit", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </small>
                      </div>
                      <span>{presentation.label}</span>
                    </article>
                  );
                })}
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
