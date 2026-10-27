import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import Topbar from "../../components/Topbar/Topbar.jsx";
import PageToolbar from "../../components/Pagetoolbar/Pagetoolbar.jsx";
import Modal from "../../components/Modal/Modal.jsx";
import Toast from "../../components/Toast/Toast.jsx";
import PuzzleStrip from "../../components/PuzzleStrip/PuzzleStrip.jsx";
import Icon from "../../assets/Icons/Icon.jsx";

import { getCareteaProfile, getCareteaUserId } from "../../utils/careteaSession.js";
import {
  listarMedicamentos,
  criarMedicamento,
  atualizarMedicamento,
  excluirMedicamento,
  registrarMedicamentoTomado,
  listarHistoricoMedicamentos,
} from "../../services/medicamentos.js";

import "./Medicamentos.css";

const STATUS = {
  tomado: { label: "Tomado", tone: "success" },
  pendente: { label: "Pendente", tone: "pending" },
  naoTomado: { label: "Não tomado", tone: "danger" },
};

function horaCurta(hora) {
  return hora ? String(hora).slice(0, 5) : "";
}

function dataLocalISO(data = new Date()) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function calcularStatus(medicamento, idsTomadosHoje) {
  if (idsTomadosHoje.has(medicamento.id)) return "tomado";

  const agora = new Date();
  const [hora, minuto] = horaCurta(medicamento.horario).split(":").map(Number);
  const horarioDaDose = new Date();
  horarioDaDose.setHours(hora, minuto, 0, 0);

  return agora > horarioDaDose ? "naoTomado" : "pendente";
}

function formatarDataHora(valor) {
  if (!valor) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(valor));
}

function MedicationCard({ medication, onTaken, onEdit, onDelete, disabled }) {
  const status = STATUS[medication.status];

  return (
    <article className="medication-card">
      <div className="medication-card-top">
        <div className="medication-heading">
          <div className="medication-name-row">
            <h3>{medication.nome}</h3>
            <span className={`medicamentos-status-pill ${status.tone}`}>
              {status.label}
            </span>
          </div>

          <div className="medication-meta">
            <span><Icon name="clock" size={17} /> {horaCurta(medication.horario)}</span>
            <span>{medication.dose}</span>
          </div>

          {medication.observacoes && (
            <p className="medication-instructions">{medication.observacoes}</p>
          )}
        </div>

        <div className="medication-actions">
          <button type="button" className="medicamentos-icon-button"
            onClick={() => onEdit(medication)} aria-label={`Editar ${medication.nome}`}>
            <Icon name="edit" size={16} />
          </button>
          <button type="button" className="medicamentos-icon-button"
            onClick={() => onDelete(medication)} aria-label={`Excluir ${medication.nome}`}>
            <Icon name="trash" size={16} />
          </button>
        </div>
      </div>

      <div className="medication-card-footer">
        <button
          type="button"
          className="medicamentos-btn medicamentos-btn-primary medicamentos-taken-button"
          onClick={() => onTaken(medication)}
          disabled={disabled || medication.status === "tomado"}
        >
          <Icon name="check" size={17} />
          {medication.status === "tomado" ? "Tomado" : "Marcar como tomado"}
        </button>
      </div>
    </article>
  );
}

function MedicationModal({ medication, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    nome: medication?.nome || "",
    horario: horaCurta(medication?.horario) || "08:00",
    dose: medication?.dose || "",
    observacoes: medication?.observacoes || "",
    lembreteMinutos: medication?.lembreteMinutos ?? 15,
    responsavelMinutos: medication?.responsavelMinutos ?? 30,
  }));
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  function atualizarCampo(event) {
    const { name, value } = event.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  }

  async function enviar(event) {
    event.preventDefault();

    if (!form.nome.trim() || !form.horario || !form.dose.trim()) {
      setErro("Preencha nome, horário e dose.");
      return;
    }

    if (Number(form.responsavelMinutos) <= Number(form.lembreteMinutos)) {
      setErro("O aviso ao responsável deve ocorrer depois do lembrete ao paciente.");
      return;
    }

    setErro("");
    setSalvando(true);

    try {
      await onSave({
        nome: form.nome.trim(),
        horario: form.horario,
        dose: form.dose.trim(),
        observacoes: form.observacoes.trim() || null,
        lembreteMinutos: Number(form.lembreteMinutos),
        responsavelMinutos: Number(form.responsavelMinutos),
      });
    } catch (e) {
      setErro(e.message || "Não foi possível salvar o medicamento.");
      setSalvando(false);
    }
  }

  return (
    <Modal
      kicker="Medicamentos"
      title={medication ? "Editar medicamento" : "Adicionar medicamento"}
      description="Informe o medicamento, horário e dose da rotina."
      onClose={onClose}
    >
      <form onSubmit={enviar}>
        {erro && <p className="medicamentos-form-error" role="alert">{erro}</p>}

        <div className="medicamentos-form-grid">
          <label className="medicamentos-field medicamentos-field-full">
            <span>Nome do medicamento *</span>
            <input name="nome" value={form.nome} onChange={atualizarCampo}
              placeholder="Ex.: Risperidona" autoFocus />
          </label>

          <label className="medicamentos-field">
            <span>Horário *</span>
            <input type="time" name="horario" value={form.horario} onChange={atualizarCampo} />
          </label>

          <label className="medicamentos-field">
            <span>Dose *</span>
            <input name="dose" value={form.dose} onChange={atualizarCampo}
              placeholder="Ex.: 1 comprimido (1 mg)" />
          </label>

          <label className="medicamentos-field medicamentos-field-full">
            <span>Orientação / observação</span>
            <input name="observacoes" value={form.observacoes} onChange={atualizarCampo}
              placeholder="Ex.: Tomar após a refeição" />
          </label>
        </div>

        <div className="medicamentos-reminder-config">
          <div className="medicamentos-reminder-config-title">
            <Icon name="bell" size={19} />
            <div>
              <strong>Configuração de lembretes</strong>
              <span>Os tempos ficam salvos para a futura integração de notificações.</span>
            </div>
          </div>

          <div className="medicamentos-form-grid medicamentos-form-grid-small">
            <label className="medicamentos-field">
              <span>Lembrar após</span>
              <select name="lembreteMinutos" value={form.lembreteMinutos} onChange={atualizarCampo}>
                {[5, 10, 15, 20, 30].map((n) => <option key={n} value={n}>{n} minutos</option>)}
              </select>
            </label>

            <label className="medicamentos-field">
              <span>Avisar responsável após</span>
              <select name="responsavelMinutos" value={form.responsavelMinutos} onChange={atualizarCampo}>
                {[15, 30, 45, 60].map((n) => <option key={n} value={n}>{n} minutos</option>)}
              </select>
            </label>
          </div>
        </div>

        <div className="app-modal-actions">
          <button className="medicamentos-btn medicamentos-btn-secondary" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="medicamentos-btn medicamentos-btn-primary" type="submit" disabled={salvando}>
            {salvando ? "Salvando..." : medication ? "Salvar alterações" : "Adicionar medicamento"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Medicamentos({ onLogout }) {
  const usuarioId = getCareteaUserId();
  const profile = getCareteaProfile();
  const userName = profile?.userName || "Usuário";
  const userLevel = profile?.userLevel || "";

  const [medicamentos, setMedicamentos] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [processandoId, setProcessandoId] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const [lista, registros] = await Promise.all([
        listarMedicamentos(usuarioId),
        listarHistoricoMedicamentos(usuarioId),
      ]);

      setMedicamentos(lista);
      setHistorico(registros);
    } catch (e) {
      setErro(e.message || "Não foi possível carregar os medicamentos.");
    } finally {
      setCarregando(false);
    }
  }, [usuarioId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  useEffect(() => () => window.clearTimeout(toastTimerRef.current), []);

  function mostrarToast(message, type = "success") {
    setToast({ message, type });
    window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 4200);
  }

  const idsTomadosHoje = useMemo(() => {
    const hoje = dataLocalISO();
    return new Set(
      historico
        .filter((registro) => registro.dataReferencia === hoje)
        .map((registro) => registro.medicamento?.id)
        .filter(Boolean),
    );
  }, [historico]);

  const dosesDeHoje = useMemo(() => medicamentos.map((medicamento) => ({
    ...medicamento,
    status: calcularStatus(medicamento, idsTomadosHoje),
  })), [medicamentos, idsTomadosHoje]);

  const concluidas = dosesDeHoje.filter((m) => m.status === "tomado").length;
  const resumo = `${concluidas} de ${dosesDeHoje.length} doses de hoje concluídas`;

  function abrirNovo() {
    setEditando(null);
    setModalAberto(true);
  }

  function abrirEdicao(medicamento) {
    setEditando(medicamento);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setEditando(null);
  }

  async function salvar(dados) {
    if (editando) {
      await atualizarMedicamento(usuarioId, editando.id, dados);
      mostrarToast("Medicamento atualizado com sucesso.");
    } else {
      await criarMedicamento(usuarioId, dados);
      mostrarToast("Medicamento adicionado à rotina.");
    }

    fecharModal();
    await carregar();
  }

  async function excluir(medicamento) {
    if (!window.confirm(`Excluir "${medicamento.nome}"? O histórico desse medicamento também será removido.`)) {
      return;
    }

    try {
      await excluirMedicamento(usuarioId, medicamento.id);
      mostrarToast("Medicamento excluído.");
      await carregar();
    } catch (e) {
      setErro(e.message || "Não foi possível excluir o medicamento.");
    }
  }

  async function marcarTomado(medicamento) {
    setProcessandoId(medicamento.id);
    setErro("");

    try {
      await registrarMedicamentoTomado(usuarioId, medicamento.id);
      mostrarToast(`${medicamento.nome} marcado como tomado.`);
      await carregar();
    } catch (e) {
      setErro(e.message || "Não foi possível confirmar a dose.");
    } finally {
      setProcessandoId(null);
    }
  }

  return (
    <div className="medicamentos-page">
      <Sidebar />

      <main className="medicamentos-main">
        <Topbar
          title="Medicamentos"
          subtitle="Organize os horários, doses e acompanhe as confirmações do dia."
          userName={userName}
          userLevel={userLevel}
          notifications={3}
          onLogout={onLogout}
        />

        <PageToolbar icon="pill" title="Meus medicamentos" description={resumo}>
          <button className="medicamentos-btn medicamentos-btn-primary" type="button" onClick={abrirNovo}>
            <Icon name="plus" size={18} /> Adicionar medicamento
          </button>
        </PageToolbar>

        {erro && <p className="medicamentos-error" role="alert">{erro}</p>}
        {carregando && <p className="medicamentos-loading">Carregando medicamentos...</p>}

        <div className="medicamentos-content">
          <section className="medicamentos-list-section" aria-labelledby="today-medications-title">
            <div className="app-section-heading-simple">
              <h2 id="today-medications-title">Doses de hoje</h2>
            </div>

            <div className="medication-list">
              {!carregando && dosesDeHoje.map((medication) => (
                <MedicationCard
                  key={medication.id}
                  medication={medication}
                  onTaken={marcarTomado}
                  onEdit={abrirEdicao}
                  onDelete={excluir}
                  disabled={processandoId === medication.id}
                />
              ))}

              {!carregando && dosesDeHoje.length === 0 && (
                <div className="medicamentos-empty">
                  <Icon name="pill" size={30} />
                  <h3>Nenhum medicamento cadastrado</h3>
                  <p>Adicione o primeiro medicamento para começar a organizar a rotina.</p>
                  <button className="medicamentos-btn medicamentos-btn-primary" type="button" onClick={abrirNovo}>
                    Adicionar medicamento
                  </button>
                </div>
              )}
            </div>
          </section>

          <aside className="medicamentos-sidebar">
            <section className="medicamentos-card medicamentos-status-card">
              <div className="medicamentos-card-title">
                <span className="medicamentos-card-title-icon"><Icon name="clock" size={20} /></span>
                <div>
                  <h2>Status de hoje</h2>
                  <p>O status é calculado pelo horário e pelas confirmações registradas hoje.</p>
                </div>
              </div>

              <div className="medicamentos-status-summary">
                {Object.entries(STATUS).map(([chave, item]) => (
                  <div key={chave}>
                    <span className={`medicamentos-status-dot ${item.tone}`} />
                    <span>{item.label}</span>
                    <strong>{dosesDeHoje.filter((m) => m.status === chave).length}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="medicamentos-card medicamentos-history-card">
              <div className="medicamentos-card-title">
                <span className="medicamentos-card-title-icon"><Icon name="history" size={20} /></span>
                <div>
                  <h2>Histórico</h2>
                  <p>Últimas confirmações registradas.</p>
                </div>
              </div>

              <div className="medicamentos-history-list">
                {historico.length === 0 ? (
                  <p className="medicamentos-history-empty">Nenhuma dose confirmada ainda.</p>
                ) : historico.map((registro) => (
                  <article className="medicamentos-history-item" key={registro.id}>
                    <strong>{registro.medicamento?.nome} · {horaCurta(registro.medicamento?.horario)}</strong>
                    <span>Tomado em {formatarDataHora(registro.tomadoEm)}</span>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <div className="medicamentos-strip"><PuzzleStrip /></div>
      </main>

      {modalAberto && (
        <MedicationModal medication={editando} onClose={fecharModal} onSave={salvar} />
      )}

      <Toast toast={toast} />
    </div>
  );
}

export default Medicamentos;