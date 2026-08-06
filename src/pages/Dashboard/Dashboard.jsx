import { useMemo, useState } from "react";
import logoCaretea from "../../assets/logo-caretea.png";
import "./Dashboard.css";

const menuItems = [
  ["dashboard", "⌂", "Dashboard"],
  ["agenda", "▣", "Agenda"],
  ["medicamentos", "◊", "Medicamentos"],
  ["consultas", "♧", "Consultas"],
  ["exames", "△", "Exames"],
  ["assistente", "◉", "IA Assistente"],
  ["notificacoes", "♢", "Notificações"],
  ["documentos", "▤", "Documentos"],
  ["relatorios", "▥", "Relatórios"],
  ["configuracoes", "⚙", "Configurações"],
];

const stats = [
  { icon: "◊", value: "3", title: "Medicamentos", subtitle: "Hoje", tone: "purple" },
  { icon: "▣", value: "1", title: "Consulta", subtitle: "Hoje", tone: "blue" },
  { icon: "△", value: "1", title: "Exame", subtitle: "Próximo", tone: "green" },
];

const schedule = [
  { time: "08:00", icon: "◊", title: "Risperidona 1mg", subtitle: "1 comprimido", status: "Tomado", tone: "green", dot: "purple" },
  { time: "12:00", icon: "◇", title: "Metilfenidato 10mg", subtitle: "1 comprimido", status: "Pendente", tone: "orange", dot: "yellow" },
  { time: "15:00", icon: "♧", title: "Consulta - Neurologista", subtitle: "Clínica Neuro", status: "Em 2h", tone: "blue", dot: "blue" },
];

const moods = [
  ["🙂", "Ótimo", "otimo", "green"],
  ["😐", "Bem", "bem", "yellow"],
  ["😮", "Mais ou menos", "medio", "orange"],
  ["🙁", "Mal", "mal", "red"],
  ["😣", "Muito mal", "muito-mal", "purple"],
];

function Dashboard({ userName = "Sandy", onNavigate, onLogout }) {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [selectedMood, setSelectedMood] = useState("bem");
  const [message, setMessage] = useState("");
  const weekBars = useMemo(() => [["Seg",100],["Ter",80],["Qua",100],["Sex",100],["Sex",80],["Dom",100]], []);

  function navigate(id) {
    setActiveMenu(id);
    onNavigate?.(id);
  }

  function sendMessage(event) {
    event.preventDefault();
    if (!message.trim()) return;
    console.log("Pergunta para IA:", message.trim());
    setMessage("");
  }

  return (
    <div className="caretea-dashboard">
      <aside className="dashboard-sidebar">
        <img src={logoCaretea} alt="CareTEA" className="sidebar-logo" />

        <nav className="sidebar-nav" aria-label="Menu principal">
          {menuItems.map(([id, icon, label]) => (
            <button
              key={id}
              type="button"
              className={`sidebar-item ${activeMenu === id ? "sidebar-item-active" : ""}`}
              onClick={() => navigate(id)}
            >
              <span className="sidebar-icon">{icon}</span>
              <span>{label}</span>
              {id === "notificacoes" && <span className="sidebar-badge">3</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-help-card">
          <div className="help-illustration">🧩</div>
          <strong>Precisa de ajuda?</strong>
          <p>Nossa IA está aqui para te apoiar sempre que precisar.</p>
          <button type="button">Conversar com IA</button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <h1>Olá, {userName}! 👋</h1>
            <p>Vamos juntos tornar o dia de hoje mais leve e organizado.</p>
          </div>

          <div className="topbar-actions">
            <button className="notification-button" type="button">♢<span>3</span></button>
            <button className="profile-button" type="button">
              <span className="profile-avatar">👩🏻</span>
              <span className="profile-copy"><strong>{userName}</strong><small>Nível 2 - Assistida</small></span>
              <span>⌄</span>
            </button>
            {onLogout && <button className="logout-button" onClick={onLogout}>Sair</button>}
          </div>
        </header>

        <section className="quick-actions">
          <button type="button"><span>＋</span>Novo lembrete</button>
          <button type="button"><span>▣</span>Nova consulta</button>
          <button type="button"><span>▤</span>Enviar documento</button>
        </section>

        <section className="dashboard-layout">
          <div className="dashboard-center">
            <section className="stats-grid">
              {stats.map((stat) => (
                <article className="stat-card" key={stat.title}>
                  <span className={`stat-icon stat-icon-${stat.tone}`}>{stat.icon}</span>
                  <div className="stat-copy"><strong>{stat.value}</strong><span>{stat.title}</span><small>{stat.subtitle}</small></div>
                  <button type="button">Ver todos →</button>
                </article>
              ))}
            </section>

            <section className="dashboard-panel organized-day-panel">
              <div className="panel-header"><h2>Seu dia, organizado</h2><button type="button">Ver agenda completa</button></div>
              <div className="timeline">
                {schedule.map((item) => (
                  <article className="timeline-row" key={`${item.time}-${item.title}`}>
                    <div className="timeline-time"><span className={`timeline-dot timeline-dot-${item.dot}`} /><time>{item.time}</time></div>
                    <div className={`timeline-icon timeline-icon-${item.dot}`}>{item.icon}</div>
                    <div className="timeline-copy"><strong>{item.title}</strong><small>{item.subtitle}</small></div>
                    <span className={`status-pill status-pill-${item.tone}`}>{item.status}<b>{item.tone === "green" ? "✓" : "◷"}</b></span>
                  </article>
                ))}
              </div>
            </section>

            <section className="bottom-grid">
              <article className="dashboard-panel adherence-panel">
                <div className="panel-header compact"><h2>Adesão aos medicamentos</h2><button type="button">Esta semana⌄</button></div>
                <div className="adherence-summary">
                  <div className="progress-ring"><span>92%</span></div>
                  <div><strong>Excelente!</strong><p>Você está indo muito bem com seus medicamentos.</p></div>
                </div>
                <div className="bar-chart">
                  {weekBars.map(([day, value], index) => (
                    <div className="bar-column" key={`${day}-${index}`}><small>{value}%</small><span style={{ height: `${value * 0.76}px` }} /><b>{day}</b></div>
                  ))}
                </div>
              </article>

              <article className="dashboard-panel streak-panel">
                <div className="panel-header compact"><h2>Sequência de cuidados</h2></div>
                <div className="streak-number"><span>🔥</span><strong>14</strong><p>dias consecutivos</p></div>
                <p className="streak-caption">Continue assim!</p>
                <div className="streak-days">
                  {["S","T","Q","Q","S","S","D"].map((day, index) => (
                    <div key={`${day}-${index}`}><span className={index === 6 ? "today" : ""}>{index === 6 ? "★" : "✓"}</span><small>{day}</small></div>
                  ))}
                </div>
              </article>

              <article className="dashboard-panel assistant-panel">
                <div className="panel-header compact"><h2>IA Assistente</h2><button type="button">Ver histórico</button></div>
                <div className="assistant-card">
                  <div className="assistant-greeting"><span>🤖</span><div><strong>Olá, {userName}! 👋</strong><p>Como posso te ajudar hoje?</p></div></div>
                  <button type="button">Quais são meus compromissos de hoje?</button>
                  <button type="button">Me lembre dos medicamentos da tarde</button>
                  <button type="button">Dicas para organizar minha rotina</button>
                  <form onSubmit={sendMessage}><input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Digite sua pergunta..." /><button type="submit">➤</button></form>
                </div>
              </article>
            </section>
          </div>

          <aside className="dashboard-right">
            <section className="dashboard-panel calendar-panel">
              <div className="panel-header"><h2>Agenda do dia</h2><button type="button">Ver calendário</button></div>
              <div className="calendar-toolbar"><button type="button">‹</button><strong>Maio 2025</strong><button type="button">›</button></div>
              <div className="calendar-week">
                {["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"].map((day) => <span key={day}>{day}</span>)}
                {[12,13,14,15,16,17,18].map((date) => <button key={date} className={date === 12 ? "calendar-selected" : ""}>{date}</button>)}
              </div>
              <div className="agenda-list">
                {[
                  ["08:00","Risperidona 1mg","1 comprimido","green","✓"],
                  ["15:00","Consulta - Neurologista","Clínica Neuro","purple","›"],
                ].map(([time,title,subtitle,tone,action]) => (
                  <article key={`${time}-${title}`}><time>{time}</time><span className={`agenda-line agenda-line-${tone}`} /><div><strong>{title}</strong><small>{subtitle}</small></div><b className={`agenda-action agenda-action-${tone}`}>{action}</b></article>
                ))}
              </div>
            </section>

            <section className="dashboard-panel mood-panel">
              <div className="panel-header"><h2>Como você está hoje?</h2><button type="button">Atualizar</button></div>
              <div className="mood-options">
                {moods.map(([emoji,label,value,tone]) => (
                  <button key={value} className={selectedMood === value ? "mood-selected" : ""} onClick={() => setSelectedMood(value)}>
                    <span className={`mood-face mood-face-${tone}`}>{emoji}</span><small>{label}</small>
                  </button>
                ))}
              </div>
            </section>

            <section className="dashboard-panel quick-info-panel">
              <div className="panel-header compact"><h2>Informações rápidas</h2></div>
              <div className="quick-info-list">
                {[
                  ["▣","Próxima consulta","20/05/2025 - Terça, 15:00","Neurologista","purple"],
                  ["△","Próximo exame","22/05/2025 - 07:30","Exame de Sangue","blue"],
                ].map(([icon,title,detail,tag,tone]) => (
                  <article key={title}><span className={`quick-info-icon quick-info-${tone}`}>{icon}</span><div><strong>{title}</strong><small>{detail}</small></div><span>{tag}</span><b>♙</b></article>
                ))}
              </div>
              <button className="view-all-button" type="button">Ver todos os compromissos →</button>
            </section>
          </aside>
        </section>

        <div className="dashboard-puzzle-strip" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => <span key={index} className={`puzzle-color puzzle-color-${index % 6}`} />)}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;