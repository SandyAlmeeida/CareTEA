import { useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import Topbar from "../../components/Topbar/Topbar.jsx";
import "./Notificacoes.css";


const CORES_RODAPE = [
  "#2e70db",
  "#765bd9",
  "#ffbf2d",
  "#7cc66d",
  "#fa5d61",
  "#2e70db",
  "#765bd9",
  "#ffbf2d",
  "#7cc66d",
  "#fa5d61",
  "#2e70db",
  "#765bd9",
  "#ffbf2d",
  "#7cc66d",
  "#fa5d61",
  "#2e70db",
  "#765bd9",
  "#ffbf2d",
];

const TIPOS = {
  medicamento: { label: "Medicamentos", icon: "💊", cor: "purple" },
  consulta: { label: "Consultas", icon: "🩺", cor: "blue" },
  exame: { label: "Exames", icon: "🧪", cor: "green" },
  agenda: { label: "Agenda", icon: "🗓️", cor: "orange" },
  sistema: { label: "Sistema", icon: "⚙️", cor: "slate" },
};

const AGORA = Date.now();
const MIN = 60 * 1000;
const HORA = 60 * MIN;
const DIA = 24 * HORA;
const em = (offset) => new Date(AGORA - offset).toISOString();

const NOTIFICACOES_INICIAIS = [
  { id: 1, tipo: "medicamento", titulo: "Hora do medicamento", texto: "Risperidona 1mg às 08:00.", quando: em(10 * MIN), lida: false },
  { id: 2, tipo: "consulta", titulo: "Consulta amanhã", texto: "Neurologista - Dr. Almeida às 15:00.", quando: em(2 * HORA), lida: false },
  { id: 3, tipo: "agenda", titulo: "Novo compromisso na agenda", texto: "Reunião escola foi adicionada para sexta.", quando: em(5 * HORA), lida: false },
  { id: 4, tipo: "agenda", titulo: "Lembrete de terapia", texto: "Terapia ABA hoje às 18:30.", quando: em(3 * HORA), lida: true },
  { id: 5, tipo: "exame", titulo: "Resultado disponível", texto: "Hemograma completo já pode ser visualizado.", quando: em(1 * DIA), lida: true },
  { id: 6, tipo: "medicamento", titulo: "Medicamento confirmado", texto: "Você confirmou Metilfenidato 10mg.", quando: em(1 * DIA - 3 * HORA), lida: true },
  { id: 7, tipo: "consulta", titulo: "Consulta remarcada", texto: "Nutricionista movida para quinta às 16:00.", quando: em(2 * DIA), lida: true },
  { id: 8, tipo: "sistema", titulo: "Bem-vindo ao CareTEA", texto: "Configure suas preferências de notificação.", quando: em(3 * DIA), lida: true },
];

const fmtHora = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });
const fmtDataCompleta = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

function formatarQuando(iso) {
  const d = new Date(iso);
  const hoje = new Date();
  const ontem = new Date();
  ontem.setDate(hoje.getDate() - 1);
  const hora = fmtHora.format(d);
  if (d.toDateString() === hoje.toDateString()) return `Hoje, ${hora}`;
  if (d.toDateString() === ontem.toDateString()) return `Ontem, ${hora}`;
  return `${fmtDataCompleta.format(d)}, ${hora}`;
}

function Notificacoes({ onNavigate, onLogout }) {
  const [notificacoes, setNotificacoes] = useState(NOTIFICACOES_INICIAIS);
  const [filtroTipo, setFiltroTipo] = useState("todas");
  const [somenteNaoLidas, setSomenteNaoLidas] = useState(false);
  const [abrirPrefs, setAbrirPrefs] = useState(false);

  const naoLidas = useMemo(() => notificacoes.filter((n) => !n.lida).length, [notificacoes]);

  const lista = useMemo(() => {
    return notificacoes
      .filter((n) => (filtroTipo === "todas" || n.tipo === filtroTipo) && (!somenteNaoLidas || !n.lida))
      .sort((a, b) => new Date(b.quando) - new Date(a.quando));
  }, [notificacoes, filtroTipo, somenteNaoLidas]);

  function alternarLida(id) {
    setNotificacoes((atual) => atual.map((n) => (n.id === id ? { ...n, lida: !n.lida } : n)));
  }

  function marcarTodasComoLidas() {
    setNotificacoes((atual) => atual.map((n) => ({ ...n, lida: true })));
  }

  function dispensar(id) {
    setNotificacoes((atual) => atual.filter((n) => n.id !== id));
  }

  return (
    <div className="notif-page">
      <Sidebar />

      <main className="notif-main">
        <Topbar
          title="Notificações"
          subtitle="Acompanhe lembretes de medicamentos, consultas, exames e agenda."
          notifications={naoLidas}
          onLogout={onLogout}
        />

        <section className="notif-head">
          <div className="notif-head-copy">
            <h2>Central de notificações</h2>
            <p>
              {naoLidas > 0
                ? `Você tem ${naoLidas} ${naoLidas === 1 ? "notificação não lida" : "notificações não lidas"}.`
                : "Tudo em dia, nenhuma notificação pendente."}
            </p>
          </div>
          <div className="notif-head-actions">
            <button
              type="button"
              className="mark-all-btn"
              onClick={marcarTodasComoLidas}
              disabled={naoLidas === 0}
            >
              ✓ Marcar todas como lidas
            </button>
            <button type="button" className="prefs-btn" onClick={() => setAbrirPrefs(true)}>
              ⚙ Preferências
            </button>
          </div>
        </section>

        <section className="notif-filters">
          <div className="filter-chips" role="group" aria-label="Filtrar por tipo">
            <button
              type="button"
              className={`filter-chip ${filtroTipo === "todas" ? "active" : ""}`}
              aria-pressed={filtroTipo === "todas"}
              onClick={() => setFiltroTipo("todas")}
            >
              Todas
            </button>
            {Object.entries(TIPOS).map(([chave, t]) => (
              <button
                key={chave}
                type="button"
                className={`filter-chip chip-${t.cor} ${filtroTipo === chave ? "active" : ""}`}
                aria-pressed={filtroTipo === chave}
                onClick={() => setFiltroTipo(chave)}
              >
                <span className="chip-icon">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          <label className="only-unread">
            <input
              type="checkbox"
              checked={somenteNaoLidas}
              onChange={(e) => setSomenteNaoLidas(e.target.checked)}
            />
            <span className="switch" aria-hidden="true" />
            Somente não lidas
          </label>
        </section>

        {lista.length === 0 ? (
          <section className="notif-empty">
            <span className="empty-icon">🔔</span>
            <strong>Nenhuma notificação por aqui</strong>
            <p>Quando houver lembretes ou avisos, eles aparecerão nesta lista.</p>
          </section>
        ) : (
          <section className="notif-list">
            {lista.map((n) => {
              const t = TIPOS[n.tipo];
              return (
                <article key={n.id} className={`notif-item item-${t.cor} ${n.lida ? "lida" : "nao-lida"}`}>
                  <span className={`notif-icon icon-${t.cor}`}>{t.icon}</span>

                  <div className="notif-body">
                    <div className="notif-line">
                      {!n.lida && <span className="unread-dot" aria-label="Não lida" />}
                      <strong>{n.titulo}</strong>
                      <span className={`type-tag tag-${t.cor}`}>{t.label}</span>
                    </div>
                    <p>{n.texto}</p>
                    <time dateTime={n.quando}>🕒 {formatarQuando(n.quando)}</time>
                  </div>

                  <div className="notif-actions">
                    <button type="button" className="read-btn" onClick={() => alternarLida(n.id)}>
                      {n.lida ? "Marcar como não lida" : "Marcar como lida"}
                    </button>
                    <button
                      type="button"
                      className="dismiss-btn"
                      onClick={() => dispensar(n.id)}
                      aria-label="Dispensar notificação"
                    >
                      ✕
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}


        <div
          aria-hidden="true"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${CORES_RODAPE.length}, 1fr)`,
            width: "100%",
            height: "24px",
            marginTop: "28px",
            overflow: "hidden",
            borderRadius: "8px",
          }}
        >
          {CORES_RODAPE.map((cor, index) => (
            <span
              key={`${cor}-${index}`}
              style={{
                position: "relative",
                display: "block",
                height: "24px",
                background: cor,
              }}
            >
              {index < CORES_RODAPE.length - 1 && (
                <span
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "-6px",
                    zIndex: 2,
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: cor,
                    transform: "translateY(-50%)",
                  }}
                />
              )}
            </span>
          ))}
        </div>

      </main>

      {abrirPrefs && <ModalPreferencias onFechar={() => setAbrirPrefs(false)} />}
    </div>
  );
}

function ModalPreferencias({ onFechar }) {
  const [canais, setCanais] = useState({ push: true, email: false, whatsapp: true });
  const [tipos, setTipos] = useState({
    medicamento: true,
    consulta: true,
    exame: true,
    agenda: true,
    sistema: true,
  });
  const [naoPerturbe, setNaoPerturbe] = useState(false);

  const toggleCanal = (k) => setCanais((c) => ({ ...c, [k]: !c[k] }));
  const toggleTipo = (k) => setTipos((t) => ({ ...t, [k]: !t[k] }));

  return (
    <div className="notif-overlay" role="dialog" aria-modal="true" onClick={onFechar}>
      <div className="notif-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Preferências de notificação</h3>
          <button type="button" className="modal-close" onClick={onFechar} aria-label="Fechar">
            ✕
          </button>
        </div>

        <div className="modal-content">
          <div className="prefs-group">
            <h4>Canais</h4>
            {[
              ["push", "🔔", "Notificações push"],
              ["email", "✉️", "E-mail"],
              ["whatsapp", "💬", "WhatsApp"],
            ].map(([chave, icon, label]) => (
              <label key={chave} className="pref-row">
                <span className="pref-label">
                  <span className="pref-icon">{icon}</span>
                  {label}
                </span>
                <input type="checkbox" checked={canais[chave]} onChange={() => toggleCanal(chave)} />
                <span className="switch" aria-hidden="true" />
              </label>
            ))}
          </div>

          <div className="prefs-group">
            <h4>Tipos de notificação</h4>
            {Object.entries(TIPOS).map(([chave, t]) => (
              <label key={chave} className="pref-row">
                <span className="pref-label">
                  <span className="pref-icon">{t.icon}</span>
                  {t.label}
                </span>
                <input type="checkbox" checked={tipos[chave]} onChange={() => toggleTipo(chave)} />
                <span className="switch" aria-hidden="true" />
              </label>
            ))}
          </div>

          <div className="prefs-group">
            <h4>Silêncio</h4>
            <label className="pref-row">
              <span className="pref-label">
                <span className="pref-icon">🌙</span>
                Não perturbe (22h às 07h)
              </span>
              <input type="checkbox" checked={naoPerturbe} onChange={() => setNaoPerturbe((v) => !v)} />
              <span className="switch" aria-hidden="true" />
            </label>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={onFechar}>
            Cancelar
          </button>
          <button type="button" className="btn-solid" onClick={onFechar}>
            Salvar preferências
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notificacoes;
