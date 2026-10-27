import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import PageToolbar from "../../components/Pagetoolbar/Pagetoolbar";
import Modal from "../../components/Modal/Modal";
import Toast from "../../components/Toast/Toast";
import Icon from "../../assets/Icons/Icon";
import PuzzleStrip from "../../components/PuzzleStrip/PuzzleStrip";

import { getCareteaUserId } from "../../utils/careteaSession";
import {
    listarCompromissos,
    criarCompromisso,
    atualizarCompromisso,
    excluirCompromisso,
    horaCurta,
} from "../../services/compromissos";

import "./Consultas.css";


const emptyForm = { titulo: "", especialidade: "", dataISO: "", horario: "", local: "", observacoes: "", lembrete: true };


function formatarDataBR(iso) {
    if (!iso) return "";
    const [ano, mes, dia] = iso.split("-");
    return `${dia}/${mes}/${ano}`;
}


function paraConsulta(compromisso) {
    return {
        id: compromisso.id,
        titulo: compromisso.titulo,
        especialidade: compromisso.especialidade || "",
        dataISO: compromisso.data,
        horario: horaCurta(compromisso.horarioInicio),
        local: compromisso.local || "",
        observacoes: compromisso.observacoes || "",
        lembrete: compromisso.lembrete,
    };
}


function paraPayload(consulta) {
    return {
        tipo: "consulta",
        titulo: consulta.titulo.trim(),
        especialidade: consulta.especialidade.trim() || null,
        data: consulta.dataISO,
        horarioInicio: consulta.horario,
        horarioFim: null,
        local: consulta.local.trim() || null,
        observacoes: consulta.observacoes.trim() || null,
        lembrete: consulta.lembrete,
    };
}


function ConsultaCard({ consulta, onEdit, onDelete, onToggleReminder }) {
    return (
        <article className="consulta-card">
            <div className="consulta-card-top">
                <div className="consulta-title-wrap">
                    <div>
                        <span className="consultas-status-pill success">Agendada</span>
                        <h3>{consulta.titulo}</h3>
                        <p>{consulta.especialidade}</p>
                    </div>
                </div>
                <div className="consulta-actions">
                    <button type="button" className="consultas-icon-button" onClick={() => onEdit(consulta)} aria-label={`Editar ${consulta.titulo}`}>
                        <Icon name="edit" size={16} />
                    </button>
                    <button type="button" className="consultas-icon-button" onClick={() => onDelete(consulta.id)} aria-label={`Excluir ${consulta.titulo}`}>
                        <Icon name="trash" size={16} />
                    </button>
                </div>
            </div>

            <div className="consulta-details">
                <div><Icon name="calendar" size={17} /><div><small>Data</small><strong>{formatarDataBR(consulta.dataISO)}</strong></div></div>
                <div><Icon name="clock" size={17} /><div><small>Horário</small><strong>{consulta.horario}</strong></div></div>
                <div className="consulta-detail-wide"><Icon name="pin" size={17} /><div><small>Local</small><strong>{consulta.local || "Não informado"}</strong></div></div>
            </div>

            <div className="consulta-observacoes">
                <Icon name="file" size={17} />
                <div>
                    <small>Observações</small>
                    <p>{consulta.observacoes || "Nenhuma observação adicionada."}</p>
                </div>
            </div>

            <div className="consulta-card-footer">
                <button
                    type="button"
                    className={`reminder-button ${consulta.lembrete ? "enabled" : ""}`}
                    onClick={() => onToggleReminder(consulta)}
                >
                    <Icon name="bell" size={16} /> {consulta.lembrete ? "Lembrete ativado" : "Ativar lembrete"}
                </button>
            </div>
        </article>
    );
}


function ConsultaModal({ consulta, onClose, onSave }) {
    const [form, setForm] = useState(() => (consulta ? { ...consulta } : emptyForm));
    const [error, setError] = useState("");
    const [salvando, setSalvando] = useState(false);

    function updateField(event) {
        const { name, value, type, checked } = event.target;
        setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!form.titulo || !form.especialidade || !form.dataISO || !form.horario) {
            setError("Preencha título, especialidade, data e horário.");
            return;
        }
        setError("");
        setSalvando(true);
        try {
            await onSave(form);
        } catch (e) {
            setError(e.message || "Não foi possível salvar a consulta.");
            setSalvando(false);
        }
    }

    return (
        <Modal
            kicker={consulta ? "Editar" : "Cadastro"}
            title={consulta ? "Editar consulta" : "Nova consulta"}
            description="Preencha as informações do compromisso."
            onClose={onClose}
        >
            <form onSubmit={handleSubmit}>
                <div className="consultas-form-grid">
                    <label className="consultas-field">
                        <span>Título *</span>
                        <input name="titulo" value={form.titulo} onChange={updateField} placeholder="Ex.: Consulta - Neurologista" autoFocus />
                    </label>
                    <label className="consultas-field">
                        <span>Especialidade *</span>
                        <input name="especialidade" value={form.especialidade} onChange={updateField} placeholder="Ex.: Neurologia" />
                    </label>
                    <label className="consultas-field">
                        <span>Data *</span>
                        <input type="date" name="dataISO" value={form.dataISO} onChange={updateField} />
                    </label>
                    <label className="consultas-field">
                        <span>Horário *</span>
                        <input type="time" name="horario" value={form.horario} onChange={updateField} />
                    </label>
                    <label className="consultas-field consultas-field-full">
                        <span>Local</span>
                        <input name="local" value={form.local} onChange={updateField} placeholder="Clínica, hospital ou endereço" />
                    </label>
                    <label className="consultas-field consultas-field-full">
                        <span>Observações</span>
                        <textarea name="observacoes" value={form.observacoes} onChange={updateField} rows="3" placeholder="Exames, documentos, orientações..." />
                    </label>
                </div>

                {error && <p className="consulta-form-error">{error}</p>}

                <label className="consultas-toggle-check">
                    <input type="checkbox" name="lembrete" checked={form.lembrete} onChange={updateField} />
                    <span><strong>Ativar lembrete</strong><small>Receber aviso antes da consulta.</small></span>
                </label>

                <div className="app-modal-actions">
                    <button type="button" className="consultas-btn consultas-btn-secondary" onClick={onClose}>Cancelar</button>
                    <button type="submit" className="consultas-btn consultas-btn-primary" disabled={salvando}>
                        {salvando ? "Salvando..." : consulta ? "Salvar alterações" : "Cadastrar consulta"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}


function Consultas({ userName = "Evellyn", onLogout }) {
    const usuarioId = getCareteaUserId();

    const [consultas, setConsultas] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("todas");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingConsulta, setEditingConsulta] = useState(null);
    const [toast, setToast] = useState(null);

    function showToast(message, type = "success") {
        setToast({ message, type });
        window.clearTimeout(showToast.timer);
        showToast.timer = window.setTimeout(() => setToast(null), 2800);
    }

    const carregar = useCallback(async () => {
        setCarregando(true);
        try {
            const dados = await listarCompromissos(usuarioId, { tipo: "consulta" });
            setConsultas(dados.map(paraConsulta));
        } catch (e) {
            showToast(e.message || "Não foi possível carregar as consultas.", "error");
            setConsultas([]);
        } finally {
            setCarregando(false);
        }
    }, [usuarioId]);

    useEffect(() => {
        carregar();
    }, [carregar]);

    const filteredConsultas = useMemo(() => {
        const term = search.trim().toLowerCase();
        return consultas.filter((c) => {
            const matchesSearch = !term || [c.titulo, c.especialidade, c.local].join(" ").toLowerCase().includes(term);
            const matchesFilter = filter === "todas" || (filter === "lembretes" && c.lembrete) || (filter === "sem-lembrete" && !c.lembrete);
            return matchesSearch && matchesFilter;
        });
    }, [consultas, search, filter]);

    function openCreate() { setEditingConsulta(null); setModalOpen(true); }
    function openEdit(consulta) { setEditingConsulta(consulta); setModalOpen(true); }
    function closeModal() { setModalOpen(false); setEditingConsulta(null); }

    async function saveConsulta(form) {
        if (editingConsulta) {
            await atualizarCompromisso(usuarioId, editingConsulta.id, paraPayload(form));
            showToast("Consulta atualizada com sucesso.");
        } else {
            await criarCompromisso(usuarioId, paraPayload(form));
            showToast("Consulta cadastrada com sucesso.");
        }
        closeModal();
        await carregar();
    }

    async function deleteConsulta(id) {
        const consulta = consultas.find((item) => item.id === id);
        if (!consulta || !window.confirm(`Excluir "${consulta.titulo}"?`)) return;
        try {
            await excluirCompromisso(usuarioId, id);
            showToast("Consulta excluída.");
            await carregar();
        } catch (e) {
            showToast(e.message || "Não foi possível excluir.", "error");
        }
    }

    async function toggleReminder(consulta) {
        try {
            await atualizarCompromisso(usuarioId, consulta.id, paraPayload({ ...consulta, lembrete: !consulta.lembrete }));
            showToast("Configuração de lembrete atualizada.");
            await carregar();
        } catch (e) {
            showToast(e.message || "Não foi possível atualizar o lembrete.", "error");
        }
    }

    return (
        <div className="consultas-page">
            <Sidebar />

            <main className="consultas-main">
                <Topbar
                    title={`Consultas`}
                    subtitle="Vamos juntos tornar o dia de hoje mais leve e organizado."
                    userName={userName}
                    userLevel="Nível 2 - Assistida"
                    notifications={3}
                    onLogout={onLogout}
                />

                <PageToolbar icon="activity" title="Minhas consultas" description="Confira consultas agendadas, lembretes e informações importantes.">
                    <button className="consultas-btn consultas-btn-primary" type="button" onClick={openCreate}>
                        <Icon name="plus" size={18} /> Nova consulta
                    </button>
                </PageToolbar>

                <section className="consultas-filters">
                    <label className="consultas-search">
                        <Icon name="search" size={18} />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar consulta, especialidade ou local..." />
                    </label>
                    <label className="consultas-select">
                        <Icon name="filter" size={16} />
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="todas">Todas as consultas</option>
                            <option value="lembretes">Com lembrete</option>
                            <option value="sem-lembrete">Sem lembrete</option>
                        </select>
                    </label>
                    <span className="consultas-count">{filteredConsultas.length} {filteredConsultas.length === 1 ? "consulta" : "consultas"}</span>
                </section>

                <section className="consultas-section">
                    <div className="consultas-section-heading">
                        <div><h2>Próximas consultas</h2><p>Seus próximos compromissos de saúde.</p></div>
                        <span>Atualizado hoje</span>
                    </div>

                    {carregando ? (
                        <div className="consultas-empty">
                            <Icon name="inbox" size={32} />
                            <strong>Carregando consultas...</strong>
                        </div>
                    ) : filteredConsultas.length === 0 ? (
                        <div className="consultas-empty">
                            <Icon name="inbox" size={32} />
                            <strong>Nenhuma consulta encontrada</strong>
                            <p>Tente alterar os filtros ou cadastre uma nova consulta.</p>
                            <button className="consultas-btn consultas-btn-tint" type="button" onClick={openCreate}>Cadastrar consulta</button>
                        </div>
                    ) : (
                        <div className="consultas-grid">
                            {filteredConsultas.map((consulta) => (
                                <ConsultaCard
                                    key={consulta.id}
                                    consulta={consulta}
                                    onEdit={openEdit}
                                    onDelete={deleteConsulta}
                                    onToggleReminder={toggleReminder}
                                />
                            ))}
                        </div>
                    )}
                </section>

                <section className="consultas-info-grid">
                    <article className="consultas-info-card">
                        <span className="consultas-info-icon purple"><Icon name="activity" size={22} /></span>
                        <div><strong>{consultas.length}</strong><h3>Consultas cadastradas</h3><p>Compromissos registrados no CareTEA.</p></div>
                    </article>
                    <article className="consultas-info-card">
                        <span className="consultas-info-icon blue"><Icon name="bell" size={22} /></span>
                        <div><strong>{consultas.filter((c) => c.lembrete).length}</strong><h3>Com lembrete</h3><p>Consultas com lembrete configurado.</p></div>
                    </article>
                    <article className="consultas-info-card">
                        <span className="consultas-info-icon green"><Icon name="check" size={22} /></span>
                        <div><strong>24h</strong><h3>Antecedência</h3><p>O projeto prevê alertas antes da consulta.</p></div>
                    </article>
                </section>

                <div className="consultas-strip" aria-hidden="true">{Array.from({ length: 18 }, (_, i) => <span key={i} className={`strip-${i % 6}`} />)}</div>

                <div>
                    <PuzzleStrip />
                </div>
            </main>

            {modalOpen && <ConsultaModal consulta={editingConsulta} onClose={closeModal} onSave={saveConsulta} />}
            <Toast toast={toast} />
        </div>
    );
}

export default Consultas;
