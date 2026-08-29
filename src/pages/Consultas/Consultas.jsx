import { useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import PageToolbar from "../../components/Pagetoolbar/Pagetoolbar";
import Modal from "../../components/Modal/Modal";
import Toast from "../../components/Toast/Toast";
import Icon from "../../assets/Icons/Icon";
import PuzzleStrip from "../../components/PuzzleStrip/PuzzleStrip";
import "./Consultas.css";

/* Exemplos de consultas cadastradas */

const sampleConsultas = [
    {
        id: 1,
        titulo: "Consulta - Neurologista",
        especialidade: "Neurologia",
        data: "20/05/2025",
        horario: "15:00",
        local: "Clínica Neuro",
        observacoes: "Levar exames anteriores e lista atualizada de medicamentos.",
        lembrete: true,
    },
    {
        id: 2,
        titulo: "Consulta - Psicólogo",
        especialidade: "Psicologia",
        data: "27/05/2025",
        horario: "10:30",
        local: "Espaço Cuidar",
        observacoes: "Sessão de acompanhamento e avaliação da rotina.",
        lembrete: true,
    },
    {
        id: 3,
        titulo: "Consulta - Nutricionista",
        especialidade: "Nutrição",
        data: "03/06/2025",
        horario: "14:00",
        local: "Clínica Bem-Estar",
        observacoes: "Levar registro alimentar da última semana.",
        lembrete: false,
    },
];

/* Formulário vazio para novas consultas */

const emptyForm = { titulo: "", especialidade: "", data: "", horario: "", local: "", observacoes: "", lembrete: true };

/* Cards de consultas */

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
                <div><Icon name="calendar" size={17} /><div><small>Data</small><strong>{consulta.data}</strong></div></div>
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
                    onClick={() => onToggleReminder(consulta.id)}
                >
                    <Icon name="bell" size={16} /> {consulta.lembrete ? "Lembrete ativado" : "Ativar lembrete"}
                </button>
            </div>
        </article>
    );
}

/* Modal para cadastrar / editar consultas */

function ConsultaModal({ consulta, onClose, onSave }) {
    const [form, setForm] = useState(() => (consulta ? { ...consulta } : emptyForm));
    const [error, setError] = useState("");

    function updateField(event) {
        const { name, value, type, checked } = event.target;
        setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (!form.titulo || !form.especialidade || !form.data || !form.horario) {
            setError("Preencha título, especialidade, data e horário.");
            return;
        }
        onSave(form);
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
                        <input name="data" value={form.data} onChange={updateField} placeholder="20/05/2025" />
                    </label>
                    <label className="consultas-field">
                        <span>Horário *</span>
                        <input name="horario" value={form.horario} onChange={updateField} placeholder="15:00" />
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
                    <button type="submit" className="consultas-btn consultas-btn-primary">{consulta ? "Salvar alterações" : "Cadastrar consulta"}</button>
                </div>
            </form>
        </Modal>
    );
}

/* Página de consultas */

function Consultas({ userName = "Sandy", onLogout }) {
    const [consultas, setConsultas] = useState(sampleConsultas);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("todas");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingConsulta, setEditingConsulta] = useState(null);
    const [toast, setToast] = useState(null);

    const filteredConsultas = useMemo(() => {
        const term = search.trim().toLowerCase();
        return consultas.filter((c) => {
            const matchesSearch = !term || [c.titulo, c.especialidade, c.local].join(" ").toLowerCase().includes(term);
            const matchesFilter = filter === "todas" || (filter === "lembretes" && c.lembrete) || (filter === "sem-lembrete" && !c.lembrete);
            return matchesSearch && matchesFilter;
        });
    }, [consultas, search, filter]);

    function showToast(message, type = "success") {
        setToast({ message, type });
        window.clearTimeout(showToast.timer);
        showToast.timer = window.setTimeout(() => setToast(null), 2800);
    }

    function openCreate() { setEditingConsulta(null); setModalOpen(true); }
    function openEdit(consulta) { setEditingConsulta(consulta); setModalOpen(true); }
    function closeModal() { setModalOpen(false); setEditingConsulta(null); }

    function saveConsulta(form) {
        if (editingConsulta) {
            setConsultas((current) => current.map((c) => (c.id === editingConsulta.id ? { ...form, id: editingConsulta.id } : c)));
            showToast("Consulta atualizada com sucesso.");
        } else {
            setConsultas((current) => [...current, { ...form, id: Date.now() }]);
            showToast("Consulta cadastrada com sucesso.");
        }
        closeModal();
    }

    function deleteConsulta(id) {
        const consulta = consultas.find((item) => item.id === id);
        if (!consulta || !window.confirm(`Excluir "${consulta.titulo}"?`)) return;
        setConsultas((current) => current.filter((item) => item.id !== id));
        showToast("Consulta excluída.");
    }

    function toggleReminder(id) {
        setConsultas((current) => current.map((c) => (c.id === id ? { ...c, lembrete: !c.lembrete } : c)));
        showToast("Configuração de lembrete atualizada.");
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

                    {filteredConsultas.length === 0 ? (
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