import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import Topbar from "../../components/Topbar/Topbar.jsx";
import StatCard from "../../components/StatCard/StatCard.jsx";
import PuzzleStrip from "../../components/PuzzleStrip/PuzzleStrip.jsx";

import "./Dashboard.css";

const stats = [
  {
    icon: "◊",
    value: "3",
    label: "Medicamentos",
    description: "Hoje",
    variant: "purple",
  },
  {
    icon: "▣",
    value: "1",
    label: "Consulta",
    description: "Hoje",
    variant: "blue",
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
];



function Dashboard({
  accountType,
  userName,
  profileName,
  autismLevel,
  onLogout,
}) {
  const navigate = useNavigate();

  function readStoredSession() {
    const rawSession =
      sessionStorage.getItem("careteaSession") ||
      localStorage.getItem("careteaSession");

    if (!rawSession) {
      return null;
    }

    try {
      return JSON.parse(rawSession);
    } catch {
      sessionStorage.removeItem("careteaSession");
      localStorage.removeItem("careteaSession");
      return null;
    }
  }

  const storedSession = readStoredSession();

  const resolvedAccountType =
    accountType ?? storedSession?.accountType ?? "responsavel";

  const resolvedAutismLevel =
    autismLevel ??
    storedSession?.autismLevel ??
    (resolvedAccountType === "autista" ? 1 : 2);

  const isResponsible = resolvedAccountType === "responsavel";

  const resolvedUserName =
    userName ??
    storedSession?.userName ??
    (isResponsible ? "Adriana" : "Lucas");

  const resolvedProfileName =
    profileName ??
    storedSession?.profileName ??
    (isResponsible ? "Evellyn" : resolvedUserName);

  const topbarSubtitle = isResponsible
    ? `Acompanhando a rotina de ${resolvedProfileName}.`
    : "Sua rotina, cuidados e compromissos em um só lugar.";

  const topbarLevel = isResponsible
    ? `Responsável · Nível ${resolvedAutismLevel}`
    : `Nível ${resolvedAutismLevel} · Autonomia`;

  function handleLogout() {
    sessionStorage.removeItem("careteaSession");
    localStorage.removeItem("careteaSession");

    if (onLogout) {
      onLogout();
      return;
    }

    navigate("/login");
  }

  return (
    <div className="caretea-dashboard">
      <Sidebar
        hideExames
        accountType={resolvedAccountType}
        autismLevel={resolvedAutismLevel}
      />

      <main className="dashboard-main">
        <Topbar
          title={`Olá, ${resolvedUserName}! 👋`}
          subtitle={topbarSubtitle}
          userName={resolvedUserName}
          userLevel={topbarLevel}
          notifications={3}
          onLogout={handleLogout}
        />

        <section className="quick-actions">
          <button type="button" onClick={() => navigate("/agenda")}>
            <span>＋</span>
            Novo lembrete
          </button>

          <button type="button" onClick={() => navigate("/consultas")}>
            <span>▣</span>
            Nova consulta
          </button>

          <button type="button" onClick={() => navigate("/documentos")}>
            <span>▤</span>
            Enviar documento
          </button>
        </section>

        <section className="dashboard-layout">
          <div className="dashboard-center">
            <section className="stats-grid">
              {stats.map((stat) => (
                <StatCard
                  key={stat.label}
                  icon={stat.icon}
                  value={stat.value}
                  label={stat.label}
                  description={stat.description}
                  variant={stat.variant}
                />
              ))}
            </section>

            <section className="dashboard-panel organized-day-panel">
              <div className="panel-header">
                <h2>
                  {isResponsible
                    ? `Rotina de ${resolvedProfileName}`
                    : "Seu dia, organizado"}
                </h2>

                <button type="button" onClick={() => navigate("/agenda")}>
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

                      <time>{item.time}</time>
                    </div>

                    <div
                      className={`timeline-icon timeline-icon-${item.dot}`}
                    >
                      {item.icon}
                    </div>

                    <div className="timeline-copy">
                      <strong>{item.title}</strong>
                      <small>{item.subtitle}</small>
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
                  {isResponsible
                    ? `Agenda de ${resolvedProfileName}`
                    : "Agenda do dia"}
                </h2>

                <button type="button" onClick={() => navigate("/agenda")}>
                  Ver calendário
                </button>
              </div>

              <div className="calendar-toolbar">
                <button type="button">
                  ‹
                </button>

                <strong>Maio 2025</strong>

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
                      <time>{time}</time>

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
                  )
                )}
              </div>
            </section>

            <section className="dashboard-panel quick-info-panel">
              <div className="panel-header compact">
                <h2>Informações rápidas</h2>
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
                ].map(
                  ([
                    icon,
                    title,
                    detail,
                    tag,
                    tone,
                  ]) => (
                    <article key={title}>
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

                      <b>♙</b>
                    </article>
                  )
                )}
              </div>

              <button
                className="view-all-button"
                type="button"
                onClick={() => navigate("/agenda")}
              >
                Ver todos os compromissos →
              </button>
            </section>
          </aside>
        </section>

        <div className="dashboard-puzzle-strip">
          <PuzzleStrip />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;