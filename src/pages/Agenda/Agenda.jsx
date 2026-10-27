import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import PuzzleStrip from "../../components/PuzzleStrip/PuzzleStrip.jsx";
import PerfilAvatar from "../../components/PerfilAvatar/PerfilAvatar.jsx";
import ModalNotificacoes from "../../components/ModalNotificacoes/ModalNotificacoes.jsx";
import ModalPerfil from "../../components/ModalPerfil/ModalPerfil.jsx";

import {
  getCareteaProfile,
  getCareteaUserId,
  clearCareteaSession,
} from "../../utils/careteaSession.js";

import {
  listarCompromissos,
  criarCompromisso,
  atualizarCompromisso,
  excluirCompromisso,
  paraEvento,
} from "../../services/compromissos.js";

import "./Agenda.css";

const TIPOS = {
  consulta: { label: "Consulta", icon: "▣", cor: "blue" },
  terapia: { label: "Terapia", icon: "♡", cor: "pink" },
  exame: { label: "Exame", icon: "△", cor: "green" },
  compromisso: { label: "Compromisso", icon: "◈", cor: "purple" },
  retorno: { label: "Retorno médico", icon: "↺", cor: "orange" },
  receita: { label: "Renovação de receita", icon: "℞", cor: "red" },
};

const SEMANA_LABEL = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

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

function apenasDia(data) {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  return d;
}

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

function inicioDaSemana(data) {
  const d = apenasDia(data);
  const desloc = (d.getDay() + 6) % 7;
  return somarDias(d, -desloc);
}

function matrizDoMes(data) {
  const primeiro = new Date(data.getFullYear(), data.getMonth(), 1);
  const inicio = inicioDaSemana(primeiro);
  return Array.from({ length: 42 }, (_, i) => somarDias(inicio, i));
}

function mesmoDia(a, b) {
  return paraISO(a) === paraISO(b);
}

const fmtMesAno = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
});

const fmtDiaLongo = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const fmtDiaCurto = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
});

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

const HOJE = apenasDia(new Date());

// Calcula o intervalo [inicio, fim] em ISO que cobre exatamente o que cada
// visão renderiza, para buscar no backend só o necessário.
function intervaloDaVisao(view, ref) {
  if (view === "dia") {
    const iso = paraISO(ref);
    return { inicio: iso, fim: iso };
  }

  if (view === "semana") {
    const ini = inicioDaSemana(ref);
    return { inicio: paraISO(ini), fim: paraISO(somarDias(ini, 6)) };
  }

  // mês: cobre as 6 semanas (42 células) exibidas na grade.
  const dias = matrizDoMes(ref);
  return { inicio: paraISO(dias[0]), fim: paraISO(dias[dias.length - 1]) };
}

const formVazio = {
  tipo: "consulta",
  titulo: "",
  especialidade: "",
  dataISO: paraISO(HOJE),
  inicio: "08:00",
  fim: "",
  local: "",
  observacoes: "",
  lembrete: true,
};

function Agenda({ onNavigate, onLogout }) {
  const routerNavigate = useNavigate();

  const profile = getCareteaProfile();
  const userName = profile?.userName || "Usuário";
  const userLevel = profile?.userLevel || "";
  const usuarioId = getCareteaUserId();

  const [view, setView] = useState("mes");
  const [ref, setRef] = useState(HOJE);

  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const [tiposAtivos, setTiposAtivos] = useState(
    () => new Set(Object.keys(TIPOS)),
  );

  const [selecionado, setSelecionado] = useState(null);
  const [formAberto, setFormAberto] = useState(false);
  const [editando, setEditando] = useState(null);

  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);
  const [perfilAberto, setPerfilAberto] = useState(false);
  const [quantidadeNotificacoes, setQuantidadeNotificacoes] = useState(3);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const intervalo = intervaloDaVisao(view, ref);
      const dados = await listarCompromissos(usuarioId, intervalo);
      setEventos(dados.map(paraEvento));
    } catch (e) {
      setErro(e.message || "Não foi possível carregar a agenda.");
      setEventos([]);
    } finally {
      setCarregando(false);
    }
  }, [usuarioId, view, ref]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const porDia = useMemo(() => {
    const mapa = new Map();

    for (const ev of eventos) {
      if (!tiposAtivos.has(ev.tipo)) {
        continue;
      }

      const lista = mapa.get(ev.dataISO) ?? [];
      lista.push(ev);
      mapa.set(ev.dataISO, lista);
    }

    for (const lista of mapa.values()) {
      lista.sort((a, b) => a.inicio.localeCompare(b.inicio));
    }

    return mapa;
  }, [eventos, tiposAtivos]);

  function eventosDe(data) {
    return porDia.get(paraISO(data)) ?? [];
  }

  function navegarPeriodo(direcao) {
    if (view === "dia") {
      setRef((r) => somarDias(r, direcao));
      return;
    }

    if (view === "semana") {
      setRef((r) => somarDias(r, direcao * 7));
      return;
    }

    setRef((r) => new Date(r.getFullYear(), r.getMonth() + direcao, 1));
  }

  function alternarTipo(chave) {
    setTiposAtivos((prev) => {
      const proximo = new Set(prev);

      if (proximo.has(chave)) {
        proximo.delete(chave);
      } else {
        proximo.add(chave);
      }

      return proximo;
    });
  }

  const titulo = useMemo(() => {
    if (view === "dia") {
      return capitalizar(fmtDiaLongo.format(ref));
    }

    if (view === "semana") {
      const ini = inicioDaSemana(ref);
      const fim = somarDias(ini, 6);
      return `${fmtDiaCurto.format(ini)} a ${fmtDiaCurto.format(
        fim,
      )} de ${ref.getFullYear()}`;
    }

    return capitalizar(fmtMesAno.format(ref));
  }, [view, ref]);

  function abrirNovo() {
    setEditando(null);
    setSelecionado(null);
    setFormAberto(true);
  }

  function abrirEdicao(evento) {
    setEditando(evento);
    setSelecionado(null);
    setFormAberto(true);
  }

  async function salvar(dados) {
    const payload = {
      tipo: dados.tipo,
      titulo: dados.titulo.trim(),
      especialidade: dados.especialidade.trim() || null,
      data: dados.dataISO,
      horarioInicio: dados.inicio,
      horarioFim: dados.fim || null,
      local: dados.local.trim() || null,
      observacoes: dados.observacoes.trim() || null,
      lembrete: dados.lembrete,
    };

    if (editando) {
      await atualizarCompromisso(usuarioId, editando.id, payload);
    } else {
      await criarCompromisso(usuarioId, payload);
    }

    setFormAberto(false);
    setEditando(null);
    await carregar();
  }

  async function excluir(evento) {
    if (!window.confirm(`Excluir "${evento.titulo}"?`)) {
      return;
    }

    try {
      await excluirCompromisso(usuarioId, evento.id);
      setSelecionado(null);
      await carregar();
    } catch (e) {
      setErro(e.message || "Não foi possível excluir o compromisso.");
    }
  }

  function navegarPagina(id) {
    setPerfilAberto(false);
    setNotificacoesAbertas(false);

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
    setNotificacoesAbertas((aberto) => !aberto);
  }

  function toggleProfile() {
    setNotificacoesAbertas(false);
    setPerfilAberto((aberto) => !aberto);
  }

  return (
    <div className="agenda-page">
      <Sidebar />

      <main className="agenda-main">
        <header className="agenda-topbar">
          <div>
            <h1>Agenda</h1>
            <p>Consultas, terapias, exames e compromissos em um só lugar.</p>
          </div>

          <div className="profile-area">
            <button
              className="bell"
              type="button"
              aria-label="Notificações"
              aria-expanded={notificacoesAbertas}
              onClick={toggleNotifications}
            >
              ♢
              {quantidadeNotificacoes > 0 && (
                <span>{quantidadeNotificacoes}</span>
              )}
            </button>

            <button
              className="profile"
              type="button"
              aria-label="Abrir menu do perfil"
              aria-expanded={perfilAberto}
              onClick={toggleProfile}
            >
              <PerfilAvatar />

              <span>
                <strong>{userName}</strong>
                {userLevel && <small>{userLevel}</small>}
              </span>

              <i>{perfilAberto ? "⌃" : "⌄"}</i>
            </button>
          </div>
        </header>

        <section className="agenda-toolbar">
          <div className="toolbar-nav">
            <button
              type="button"
              className="nav-btn"
              onClick={() => navegarPeriodo(-1)}
              aria-label="Anterior"
            >
              ‹
            </button>

            <button
              type="button"
              className="today-btn"
              onClick={() => setRef(HOJE)}
            >
              Hoje
            </button>

            <button
              type="button"
              className="nav-btn"
              onClick={() => navegarPeriodo(1)}
              aria-label="Próximo"
            >
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

            <button type="button" className="new-btn" onClick={abrirNovo}>
              ＋ Novo compromisso
            </button>
          </div>
        </section>

        <section className="agenda-legend" aria-label="Filtrar por tipo">
          {Object.entries(TIPOS).map(([chave, t]) => (
            <button
              key={chave}
              type="button"
              className={`legend-chip chip-${t.cor} ${
                tiposAtivos.has(chave) ? "" : "off"
              }`}
              aria-pressed={tiposAtivos.has(chave)}
              onClick={() => alternarTipo(chave)}
            >
              <span className="chip-dot" />
              <span className="chip-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </section>

        {erro && <p className="agenda-erro" role="alert">{erro}</p>}
        {carregando && <p className="agenda-status">Carregando agenda...</p>}

        {view === "mes" && (
          <VisaoMes
            ref={ref}
            eventosDe={eventosDe}
            aoAbrir={setSelecionado}
            aoEscolherDia={(d) => {
              setRef(d);
              setView("dia");
            }}
          />
        )}

        {view === "semana" && (
          <VisaoSemana
            ref={ref}
            eventosDe={eventosDe}
            aoAbrir={setSelecionado}
            aoEscolherDia={(d) => {
              setRef(d);
              setView("dia");
            }}
          />
        )}

        {view === "dia" && (
          <VisaoDia ref={ref} eventos={eventosDe(ref)} aoAbrir={setSelecionado} />
        )}

        <div className="agenda-puzzle-strip">
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

      {selecionado && (
        <DetalheEvento
          evento={selecionado}
          aoFechar={() => setSelecionado(null)}
          aoEditar={abrirEdicao}
          aoExcluir={excluir}
        />
      )}

      {formAberto && (
        <FormCompromisso
          evento={editando}
          aoFechar={() => {
            setFormAberto(false);
            setEditando(null);
          }}
          aoSalvar={salvar}
        />
      )}
    </div>
  );
}

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
            <div
              key={paraISO(dia)}
              className={`month-cell ${foraDoMes ? "muted" : ""} ${
                ehHoje ? "today" : ""
              }`}
            >
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
                  <button
                    type="button"
                    className="ev-more"
                    onClick={() => aoEscolherDia(dia)}
                  >
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
            <button
              type="button"
              className="week-col-head"
              onClick={() => aoEscolherDia(dia)}
            >
              <small>{SEMANA_LABEL[i]}</small>
              <strong>{dia.getDate()}</strong>
            </button>

            <div className="week-col-body">
              {eventos.length === 0 && (
                <p className="empty-mini">Sem compromissos</p>
              )}

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

function VisaoDia({ ref, eventos, aoAbrir }) {
  return (
    <section className="cal-day">
      <div className="day-head">
        <strong>{capitalizar(fmtDiaLongo.format(ref))}</strong>
        <span>
          {eventos.length}{" "}
          {eventos.length === 1 ? "compromisso" : "compromissos"}
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

              <button
                type="button"
                className="day-card"
                onClick={() => aoAbrir(ev)}
              >
                <div className="day-card-top">
                  <span className={`day-icon icon-${TIPOS[ev.tipo].cor}`}>
                    {TIPOS[ev.tipo].icon}
                  </span>
                  <strong>{ev.titulo}</strong>
                  <span className={`type-tag tag-${TIPOS[ev.tipo].cor}`}>
                    {TIPOS[ev.tipo].label}
                  </span>
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

function DetalheEvento({ evento, aoFechar, aoEditar, aoExcluir }) {
  const t = TIPOS[evento.tipo];

  const dataLonga = capitalizar(
    fmtDiaLongo.format(new Date(`${evento.dataISO}T00:00:00`)),
  );

  return (
    <div className="ag-overlay" role="dialog" aria-modal="true" onClick={aoFechar}>
      <div
        className={`ag-modal modal-${t.cor}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <span className={`modal-icon icon-${t.cor}`}>{t.icon}</span>

          <div>
            <span className={`type-tag tag-${t.cor}`}>{t.label}</span>
            <h3>{evento.titulo}</h3>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={aoFechar}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <ul className="modal-info">
          <li>
            <span>🗓️</span> {dataLonga}
          </li>

          <li>
            <span>⏰</span> {evento.inicio}
            {evento.fim ? ` às ${evento.fim}` : ""}
          </li>

          {evento.especialidade && (
            <li>
              <span>🩺</span> {evento.especialidade}
            </li>
          )}

          {evento.local && (
            <li>
              <span>📍</span> {evento.local}
            </li>
          )}

          {evento.observacoes && (
            <li>
              <span>📝</span> {evento.observacoes}
            </li>
          )}
        </ul>

        <div className="modal-actions">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => aoEditar(evento)}
          >
            Editar
          </button>

          <button
            type="button"
            className="btn-solid"
            onClick={() => aoExcluir(evento)}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

function FormCompromisso({ evento, aoFechar, aoSalvar }) {
  const [form, setForm] = useState(() =>
    evento ? { ...formVazio, ...evento } : formVazio,
  );
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  function atualizarCampo(event) {
    const { name, value, type, checked } = event.target;
    setForm((atual) => ({
      ...atual,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function enviar(event) {
    event.preventDefault();

    if (!form.titulo.trim() || !form.dataISO || !form.inicio) {
      setErro("Preencha título, data e horário de início.");
      return;
    }

    if (form.fim && form.fim < form.inicio) {
      setErro("O horário de fim não pode ser anterior ao início.");
      return;
    }

    setErro("");
    setSalvando(true);

    try {
      await aoSalvar(form);
    } catch (e) {
      setErro(e.message || "Não foi possível salvar o compromisso.");
      setSalvando(false);
    }
  }

  const t = TIPOS[form.tipo] || TIPOS.consulta;

  return (
    <div className="ag-overlay" role="dialog" aria-modal="true" onClick={aoFechar}>
      <div
        className={`ag-modal modal-${t.cor}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <span className={`modal-icon icon-${t.cor}`}>{t.icon}</span>

          <div>
            <span className={`type-tag tag-${t.cor}`}>{t.label}</span>
            <h3>{evento ? "Editar compromisso" : "Novo compromisso"}</h3>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={aoFechar}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <form className="ag-form" onSubmit={enviar}>
          <div className="ag-form-grid">
            <label className="ag-field">
              <span>Tipo *</span>
              <select name="tipo" value={form.tipo} onChange={atualizarCampo}>
                {Object.entries(TIPOS).map(([chave, tipo]) => (
                  <option key={chave} value={chave}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="ag-field">
              <span>Especialidade</span>
              <input
                name="especialidade"
                value={form.especialidade}
                onChange={atualizarCampo}
                placeholder="Ex.: Neurologia"
              />
            </label>

            <label className="ag-field ag-field-full">
              <span>Título *</span>
              <input
                name="titulo"
                value={form.titulo}
                onChange={atualizarCampo}
                placeholder="Ex.: Neurologista - Dr. Almeida"
                autoFocus
              />
            </label>

            <label className="ag-field">
              <span>Data *</span>
              <input
                type="date"
                name="dataISO"
                value={form.dataISO}
                onChange={atualizarCampo}
              />
            </label>

            <label className="ag-field">
              <span>Início *</span>
              <input
                type="time"
                name="inicio"
                value={form.inicio}
                onChange={atualizarCampo}
              />
            </label>

            <label className="ag-field">
              <span>Fim</span>
              <input
                type="time"
                name="fim"
                value={form.fim}
                onChange={atualizarCampo}
              />
            </label>

            <label className="ag-field ag-field-full">
              <span>Local</span>
              <input
                name="local"
                value={form.local}
                onChange={atualizarCampo}
                placeholder="Clínica, hospital ou endereço"
              />
            </label>

            <label className="ag-field ag-field-full">
              <span>Observações</span>
              <textarea
                name="observacoes"
                value={form.observacoes}
                onChange={atualizarCampo}
                rows="3"
                placeholder="Exames, documentos, orientações..."
              />
            </label>
          </div>

          <label className="ag-check">
            <input
              type="checkbox"
              name="lembrete"
              checked={form.lembrete}
              onChange={atualizarCampo}
            />
            <span>Ativar lembrete</span>
          </label>

          {erro && <p className="ag-form-error">{erro}</p>}

          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={aoFechar}>
              Cancelar
            </button>
            <button type="submit" className="btn-solid" disabled={salvando}>
              {salvando ? "Salvando..." : evento ? "Salvar alterações" : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Agenda;
