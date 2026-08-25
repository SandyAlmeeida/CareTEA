import { useMemo, useState } from "react";
import logoCaretea from "../../../assets/logo-caretea.png";
import "./Agenda.css";

/* Menu lateral (mesmo do restante do app, com "agenda" ativo). */
const menu = [
  ["dashboard", "⌂", "Dashboard"],
  ["agenda", "▣", "Agenda"],
  ["medicamentos", "◊", "Medicamentos"],
  ["consultas", "♧", "Consultas"],
  ["exames", "△", "Exames"],
  ["terapias", "♡", "Terapias"],
  ["assistente", "◉", "IA Assistente"],
  ["notificacoes", "♢", "Notificações"],
  ["documentos", "▤", "Documentos"],
  ["relatorios", "▥", "Relatórios"],
  ["perfil", "♙", "Perfil"],
  ["responsaveis", "♧", "Responsáveis"],
  ["configuracoes", "⚙", "Configurações"],
];

/* Tipos de evento pedidos para a agenda. Cada um tem rótulo, ícone e cor. */
const TIPOS = {
  consulta: { label: "Consulta", icon: "▣", cor: "blue" },
  terapia: { label: "Terapia", icon: "♡", cor: "pink" },
  exame: { label: "Exame", icon: "△", cor: "green" },
  compromisso: { label: "Compromisso", icon: "◈", cor: "purple" },
  retorno: { label: "Retorno médico", icon: "↺", cor: "orange" },
  receita: { label: "Renovação de receita", icon: "℞", cor: "red" },
};

const SEMANA_LABEL = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

/* ------------------------ utilidades de data ------------------------ */

/* Zera a hora para comparar dias com segurança. */
function apenasDia(data) {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  return d;
}

/* Converte um Date para a chave "AAAA-MM-DD" (fuso local). */
function paraISO(data) {
  const d = apenasDia(data);
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

function somarDias(data, dias) {
  const d = new Date(data);
  d.setDate(d.getDate() + dias);
  return d;
}

/* Início da semana com segunda-feira como primeiro dia (padrão BR). */
function inicioDaSemana(data) {
  const d = apenasDia(data);
  const desloc = (d.getDay() + 6) % 7; // domingo (0) vira 6
  return somarDias(d, -desloc);
}

/* Matriz de 42 dias (6 semanas) que cobre o mês da data de referência. */
function matrizDoMes(data) {
  const primeiro = new Date(data.getFullYear(), data.getMonth(), 1);
  const inicio = inicioDaSemana(primeiro);
  return Array.from({ length: 42 }, (_, i) => somarDias(inicio, i));
}

function mesmoDia(a, b) {
  return paraISO(a) === paraISO(b);
}

/* Formatadores pt-BR reutilizáveis. */
const fmtMesAno = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });
const fmtDiaLongo = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});
const fmtDiaCurto = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" });

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/* ------------------------ dados de exemplo ------------------------ */
/* Ancorados na data de hoje para sempre aparecerem na demonstração,
   independentemente do mês em que o app for aberto. */
const HOJE = apenasDia(new Date());

function evento(offsetDias, inicio, fim, tipo, titulo, local) {
  return {
    id: `${tipo}-${offsetDias}-${inicio}`,
    dataISO: paraISO(somarDias(HOJE, offsetDias)),
    inicio,
    fim,
    tipo,
    titulo,
    local,
  };
}

const EVENTOS = [
  evento(0, "08:00", "08:30", "receita", "Renovar receita Risperidona", "Farmácia / App"),
  evento(0, "15:00", "16:00", "consulta", "Neurologista - Dr. Almeida", "Clínica Neuro"),
  evento(0, "18:30", "19:15", "terapia", "Terapia ABA", "Espaço Integrar"),
  evento(1, "07:30", "08:00", "exame", "Exame de sangue (jejum)", "Laboratório Vida"),
  evento(1, "14:00", "14:45", "terapia", "Fonoaudiologia", "Sessão online"),
  evento(2, "10:00", "10:40", "retorno", "Retorno - Psiquiatra", "Clínica Mente Leve"),
  evento(3, "09:00", "09:30", "compromisso", "Reunião escola", "Escola Girassol"),
  evento(4, "16:00", "17:00", "consulta", "Nutricionista", "Consultório 302"),
  evento(6, "13:00", "13:45", "terapia", "Terapia ocupacional", "Espaço Integrar"),
  evento(7, "08:00", "08:30", "exame", "Avaliação audiométrica", "Otorrino Center"),
  evento(9, "11:00", "11:40", "retorno", "Retorno - Neurologista", "Clínica Neuro"),
  evento(-2, "15:00", "16:00", "consulta", "Neurologista - Dr. Almeida", "Clínica Neuro"),
  evento(-1, "18:30", "19:15", "terapia", "Terapia ABA", "Espaço Integrar"),
];

/* ------------------------ componente ------------------------ */

function Agenda({ userName = "Sandy", onNavigate, onLogout }) {
  const [view, setView] = useState("mes"); // "dia" | "semana" | "mes"
  const [ref, setRef] = useState(HOJE); // data de referência da navegação
  const [tiposAtivos, setTiposAtivos] = useState(() => new Set(Object.keys(TIPOS)));
  const [selecionado, setSelecionado] = useState(null); // evento no modal

  /* Índice dataISO -> eventos, filtrando pelos tipos ativos. */
  const porDia = useMemo(() => {
    const mapa = new Map();
    for (const ev of EVENTOS) {
      if (!tiposAtivos.has(ev.tipo)) continue;
      const lista = mapa.get(ev.dataISO) ?? [];
      lista.push(ev);
      mapa.set(ev.dataISO, lista);
    }
    for (const lista of mapa.values()) lista.sort((a, b) => a.inicio.localeCompare(b.inicio));
    return mapa;
  }, [tiposAtivos]);

  function eventosDe(data) {
    return porDia.get(paraISO(data)) ?? [];
  }

  /* Navegação anterior/próximo respeitando a visualização atual. */
  function navegar(direcao) {
    if (view === "dia") setRef((r) => somarDias(r, direcao));
    else if (view === "semana") setRef((r) => somarDias(r, direcao * 7));
    else setRef((r) => new Date(r.getFullYear(), r.getMonth() + direcao, 1));
  }

  function alternarTipo(chave) {
    setTiposAtivos((prev) => {
      const proximo = new Set(prev);
      proximo.has(chave) ? proximo.delete(chave) : proximo.add(chave);
      return proximo;
    });
  }

  /* Título dinâmico do período conforme a visualização. */
  const titulo = useMemo(() => {
    if (view === "dia") return capitalizar(fmtDiaLongo.format(ref));
    if (view === "semana") {
      const ini = inicioDaSemana(ref);
      const fim = somarDias(ini, 6);
      return `${fmtDiaCurto.format(ini)} a ${fmtDiaCurto.format(fim)} de ${ref.getFullYear()}`;
    }
    return capitalizar(fmtMesAno.format(ref));
  }, [view, ref]);

  return (
    <div className="agenda-page">
      <main className="agenda-main">
        <header className="agenda-topbar">
          <div>
            <h1>Agenda</h1>
            <p>Consultas, terapias, exames e compromissos em um só lugar.</p>
          </div>

          <div className="profile-area">
            <button className="bell" type="button" aria-label="Notificações">
              ♢ <span>3</span>
            </button>
            <button className="profile" type="button">
              <span className="avatar">👩🏻</span>
              <span>
                <strong>{userName}</strong>
                <small>Nível 2 - Assistida</small>
              </span>
              <i>⌄</i>
            </button>
            {onLogout && (
              <button className="logout" type="button" onClick={onLogout}>
                Sair
              </button>
            )}
          </div>
        </header>

        {/* Barra de controle: navegação, período, troca de visualização, novo evento. */}
        <section className="agenda-toolbar">
          <div className="toolbar-nav">
            <button type="button" className="nav-btn" onClick={() => navegar(-1)} aria-label="Anterior">
              ‹
            </button>
            <button type="button" className="today-btn" onClick={() => setRef(HOJE)}>
              Hoje
            </button>
            <button type="button" className="nav-btn" onClick={() => navegar(1)} aria-label="Próximo">
              ›
            </button>
            <strong className="toolbar-title">{titulo}</strong>
          </div>

          <div className="toolbar-right">
            <div className="view-switch" role="group" aria-label="Visualização">
              {[
                ["dia", "Dia"],
                ["semana", "Semana"],
                ["mes", "Mês"],
              ].map(([chave, rotulo]) => (
                <button
                  key={chave}
                  type="button"
                  className={view === chave ? "active" : ""}
                  aria-pressed={view === chave}
                  onClick={() => setView(chave)}
                >
                  {rotulo}
                </button>
              ))}
            </div>
            <button type="button" className="new-btn">
              ＋ Novo compromisso
            </button>
          </div>
        </section>

        {/* Legenda e filtro por tipo. Clique liga/desliga o tipo. */}
        <section className="agenda-legend" aria-label="Filtrar por tipo">
          {Object.entries(TIPOS).map(([chave, t]) => (
            <button
              key={chave}
              type="button"
              className={`legend-chip chip-${t.cor} ${tiposAtivos.has(chave) ? "" : "off"}`}
              aria-pressed={tiposAtivos.has(chave)}
              onClick={() => alternarTipo(chave)}
            >
              <span className="chip-dot" />
              <span className="chip-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </section>

        {/* Área da visualização escolhida. */}
        {view === "mes" && (
          <VisaoMes ref={ref} eventosDe={eventosDe} aoAbrir={setSelecionado} aoEscolherDia={(d) => { setRef(d); setView("dia"); }} />
        )}
        {view === "semana" && (
          <VisaoSemana ref={ref} eventosDe={eventosDe} aoAbrir={setSelecionado} aoEscolherDia={(d) => { setRef(d); setView("dia"); }} />
        )}
        {view === "dia" && <VisaoDia ref={ref} eventos={eventosDe(ref)} aoAbrir={setSelecionado} />}
      </main>

      {selecionado && <DetalheEvento evento={selecionado} aoFechar={() => setSelecionado(null)} />}
    </div>
  );
}

/* ------------------------ visualização: Mês ------------------------ */

function VisaoMes({ ref, eventosDe, aoAbrir, aoEscolherDia }) {
  const dias = useMemo(() => matrizDoMes(ref), [ref]);
  const mesAtual = ref.getMonth();

  return (
    <section className="cal-month">
      <div className="month-head">
        {SEMANA_LABEL.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="month-grid">
        {dias.map((dia) => {
          const eventos = eventosDe(dia);
          const foraDoMes = dia.getMonth() !== mesAtual;
          const ehHoje = mesmoDia(dia, HOJE);
          return (
            <div key={paraISO(dia)} className={`month-cell ${foraDoMes ? "muted" : ""} ${ehHoje ? "today" : ""}`}>
              <button
                type="button"
                className="cell-day"
                onClick={() => aoEscolherDia(dia)}
                aria-label={`Ver ${fmtDiaLongo.format(dia)}`}
              >
                {dia.getDate()}
              </button>
              <div className="cell-events">
                {eventos.slice(0, 3).map((ev) => (
                  <button
                    key={ev.id}
                    type="button"
                    className={`ev-pill ev-${TIPOS[ev.tipo].cor}`}
                    onClick={() => aoAbrir(ev)}
                    title={`${ev.inicio} ${ev.titulo}`}
                  >
                    <span className="ev-icon">{TIPOS[ev.tipo].icon}</span>
                    <time>{ev.inicio}</time>
                    <span className="ev-title">{ev.titulo}</span>
                  </button>
                ))}
                {eventos.length > 3 && (
                  <button type="button" className="ev-more" onClick={() => aoEscolherDia(dia)}>
                    + {eventos.length - 3} mais
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------ visualização: Semana ------------------------ */

function VisaoSemana({ ref, eventosDe, aoAbrir, aoEscolherDia }) {
  const dias = useMemo(() => {
    const ini = inicioDaSemana(ref);
    return Array.from({ length: 7 }, (_, i) => somarDias(ini, i));
  }, [ref]);

  return (
    <section className="cal-week">
      {dias.map((dia, i) => {
        const eventos = eventosDe(dia);
        const ehHoje = mesmoDia(dia, HOJE);
        return (
          <div key={paraISO(dia)} className={`week-col ${ehHoje ? "today" : ""}`}>
            <button type="button" className="week-col-head" onClick={() => aoEscolherDia(dia)}>
              <small>{SEMANA_LABEL[i]}</small>
              <strong>{dia.getDate()}</strong>
            </button>
            <div className="week-col-body">
              {eventos.length === 0 && <p className="empty-mini">Sem compromissos</p>}
              {eventos.map((ev) => (
                <button
                  key={ev.id}
                  type="button"
                  className={`week-ev ev-${TIPOS[ev.tipo].cor}`}
                  onClick={() => aoAbrir(ev)}
                >
                  <time>{ev.inicio}</time>
                  <span className="week-ev-title">
                    <span className="ev-icon">{TIPOS[ev.tipo].icon}</span>
                    {ev.titulo}
                  </span>
                  {ev.local && <small>{ev.local}</small>}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

/* ------------------------ visualização: Dia ------------------------ */

function VisaoDia({ ref, eventos, aoAbrir }) {
  return (
    <section className="cal-day">
      <div className="day-head">
        <strong>{capitalizar(fmtDiaLongo.format(ref))}</strong>
        <span>
          {eventos.length} {eventos.length === 1 ? "compromisso" : "compromissos"}
        </span>
      </div>

      {eventos.length === 0 ? (
        <div className="day-empty">
          <span>🧩</span>
          <strong>Nenhum compromisso neste dia</strong>
          <p>Aproveite para descansar ou registrar algo novo.</p>
        </div>
      ) : (
        <div className="day-timeline">
          {eventos.map((ev) => (
            <article key={ev.id} className={`day-row row-${TIPOS[ev.tipo].cor}`}>
              <div className="day-time">
                <time>{ev.inicio}</time>
                <small>{ev.fim}</small>
              </div>
              <span className={`day-bar bar-${TIPOS[ev.tipo].cor}`} />
              <button type="button" className="day-card" onClick={() => aoAbrir(ev)}>
                <div className="day-card-top">
                  <span className={`day-icon icon-${TIPOS[ev.tipo].cor}`}>{TIPOS[ev.tipo].icon}</span>
                  <strong>{ev.titulo}</strong>
                  <span className={`type-tag tag-${TIPOS[ev.tipo].cor}`}>{TIPOS[ev.tipo].label}</span>
                </div>
                {ev.local && <small>📍 {ev.local}</small>}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

/* ------------------------ modal de detalhe ------------------------ */

function DetalheEvento({ evento, aoFechar }) {
  const t = TIPOS[evento.tipo];
  const dataLonga = capitalizar(fmtDiaLongo.format(new Date(`${evento.dataISO}T00:00:00`)));

  return (
    <div className="ag-overlay" role="dialog" aria-modal="true" onClick={aoFechar}>
      <div className={`ag-modal modal-${t.cor}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <span className={`modal-icon icon-${t.cor}`}>{t.icon}</span>
          <div>
            <span className={`type-tag tag-${t.cor}`}>{t.label}</span>
            <h3>{evento.titulo}</h3>
          </div>
          <button type="button" className="modal-close" onClick={aoFechar} aria-label="Fechar">
            ✕
          </button>
        </div>

        <ul className="modal-info">
          <li>
            <span>🗓️</span> {dataLonga}
          </li>
          <li>
            <span>⏰</span> {evento.inicio} às {evento.fim}
          </li>
          {evento.local && (
            <li>
              <span>📍</span> {evento.local}
            </li>
          )}
        </ul>

        <div className="modal-actions">
          <button type="button" className="btn-ghost">Editar</button>
          <button type="button" className="btn-solid">Marcar como concluído</button>
        </div>
      </div>
    </div>
  );
}

export default Agenda;
