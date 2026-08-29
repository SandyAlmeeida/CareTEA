import { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import PageToolbar from "../../components/Pagetoolbar/Pagetoolbar";
import Modal from "../../components/Modal/Modal";
import Toast from "../../components/Toast/Toast";
import Icon from "../../assets/Icons/Icon";
import "./Medicamentos.css";
import PuzzleStrip from "../../components/PuzzleStrip/PuzzleStrip";

/* Exemplos de medicamentos cadastrados */

const sampleMedications = [
    {
        id: 1,
        name: "Risperidona",
        time: "08:00",
        dose: "1 comprimido (1 mg)",
        instructions: "Tomar após a refeição",
        status: "overdue",
        delay: 312,
        reminderMinutes: 15,
        responsibleMinutes: 30,
    },
    {
        id: 2,
        name: "Vitamina D",
        time: "09:00",
        dose: "2 gotas",
        instructions: "",
        status: "overdue",
        delay: 252,
        reminderMinutes: 15,
        responsibleMinutes: 30,
    },
    {
        id: 3,
        name: "Risperidona",
        time: "20:00",
        dose: "1 comprimido (1 mg)",
        instructions: "Tomar após a refeição",
        status: "scheduled",
        delay: 0,
        reminderMinutes: 15,
        responsibleMinutes: 30,
    },
    {
        id: 4,
        name: "Melatonina",
        time: "21:30",
        dose: "5 gotas",
        instructions: "30 min antes de dormir",
        status: "scheduled",
        delay: 0,
        reminderMinutes: 15,
        responsibleMinutes: 30,
    },
];

/* Histórico e Status */

const sampleHistory = [
    { id: 1, medication: "Vitamina D", time: "09:00", date: "07/08", detail: "Responsável avisado — 07/08, 13:12" },
    { id: 2, medication: "Risperidona", time: "08:00", date: "07/08", detail: "Responsável avisado — 07/08, 13:12" },
];

const STATUS_LABEL = { overdue: (delay) => `Atrasado ${delay} min`, scheduled: () => "Agendado", taken: () => "Tomado" };
const STATUS_TONE = { overdue: "warning", scheduled: "pending", taken: "success" };

function formatHistoryDate(date) {
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(date);
}

/* Cards de medicamentos */

function MedicationCard({ medication, onTaken, onRemindLater, onEdit, onDelete }) {
    return (
        <article className="medication-card">
            <div className="medication-card-top">
                <div className="medication-heading">
                    <div className="medication-name-row">
                        <h3>{medication.name}</h3>
                        <span className={`medicamentos-status-pill ${STATUS_TONE[medication.status]}`}>{STATUS_LABEL[medication.status](medication.delay)}</span>
                    </div>
                    <div className="medication-meta">
                        <span><Icon name="clock" size={17} /> {medication.time}</span>
                        <span>{medication.dose}</span>
                    </div>
                    {medication.instructions && <p className="medication-instructions">{medication.instructions}</p>}
                </div>

                <div className="medication-actions">
                    <button type="button" className="medicamentos-icon-button" onClick={() => onEdit(medication)} aria-label={`Editar ${medication.name}`}>
                        <Icon name="edit" size={16} />
                    </button>
                    <button type="button" className="medicamentos-icon-button" onClick={() => onDelete(medication.id)} aria-label={`Excluir ${medication.name}`}>
                        <Icon name="trash" size={16} />
                    </button>
                </div>
            </div>

            <div className="medication-card-footer">
                <button type="button" className="medicamentos-btn medicamentos-btn-primary medicamentos-taken-button" onClick={() => onTaken(medication)}>
                    <Icon name="check" size={17} /> Tomei
                </button>
                <button type="button" className="medicamentos-btn medicamentos-btn-secondary medicamentos-remind-button" onClick={() => onRemindLater(medication)}>
                    <Icon name="bell" size={17} /> Lembrar depois
                </button>
            </div>
        </article>
    );
}

/* Modal para cadastrar / editar medicamentos */

function MedicationModal({ medication, onClose, onSave }) {
    const [formData, setFormData] = useState(() => ({
        name: medication?.name || "",
        time: medication?.time || "08:00",
        dose: medication?.dose || "",
        instructions: medication?.instructions || "",
        reminderMinutes: medication?.reminderMinutes ?? 15,
        responsibleMinutes: medication?.responsibleMinutes ?? 30,
    }));

    function updateField(event) {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (!formData.name.trim() || !formData.dose.trim() || !formData.time) return;

        onSave({
            ...formData,
            name: formData.name.trim(),
            dose: formData.dose.trim(),
            instructions: formData.instructions.trim(),
            reminderMinutes: Number(formData.reminderMinutes),
            responsibleMinutes: Number(formData.responsibleMinutes),
        });
    }

    return (
        <Modal
            kicker="Medicamentos"
            title={medication ? "Editar medicamento" : "Adicionar medicamento"}
            description="Configure o horário, dose e os lembretes de segurança."
            onClose={onClose}
        >
            <form onSubmit={handleSubmit}>
                <div className="medicamentos-form-grid">
                    <label className="medicamentos-field medicamentos-field-full">
                        <span>Nome do medicamento</span>
                        <input name="name" value={formData.name} onChange={updateField} placeholder="Ex.: Risperidona" required autoFocus />
                    </label>

                    <label className="medicamentos-field">
                        <span>Horário</span>
                        <input name="time" type="time" value={formData.time} onChange={updateField} required />
                    </label>

                    <label className="medicamentos-field">
                        <span>Dose</span>
                        <input name="dose" value={formData.dose} onChange={updateField} placeholder="Ex.: 1 comprimido (1 mg)" required />
                    </label>

                    <label className="medicamentos-field medicamentos-field-full">
                        <span>Orientação / observação</span>
                        <input name="instructions" value={formData.instructions} onChange={updateField} placeholder="Ex.: Tomar após a refeição" />
                    </label>
                </div>

                <div className="medicamentos-reminder-config">
                    <div className="medicamentos-reminder-config-title">
                        <Icon name="whatsapp" size={19} />
                        <div>
                            <strong>Escalonamento de lembretes</strong>
                            <span>Usado para a demonstração do fluxo de WhatsApp.</span>
                        </div>
                    </div>
                    <div className="medicamentos-form-grid medicamentos-form-grid-small">
                        <label className="medicamentos-field">
                            <span>Lembrar paciente após</span>
                            <select name="reminderMinutes" value={formData.reminderMinutes} onChange={updateField}>
                                <option value="5">5 minutos</option>
                                <option value="10">10 minutos</option>
                                <option value="15">15 minutos</option>
                                <option value="20">20 minutos</option>
                                <option value="30">30 minutos</option>
                            </select>
                        </label>
                        <label className="medicamentos-field">
                            <span>Avisar responsável após</span>
                            <select name="responsibleMinutes" value={formData.responsibleMinutes} onChange={updateField}>
                                <option value="15">15 minutos</option>
                                <option value="30">30 minutos</option>
                                <option value="45">45 minutos</option>
                                <option value="60">60 minutos</option>
                            </select>
                        </label>
                    </div>
                </div>

                <div className="app-modal-actions">
                    <button className="medicamentos-btn medicamentos-btn-secondary" type="button" onClick={onClose}>Cancelar</button>
                    <button className="medicamentos-btn medicamentos-btn-primary" type="submit">{medication ? "Salvar alterações" : "Adicionar medicamento"}</button>
                </div>
            </form>
        </Modal>
    );
}

/* Página de medicamentos */

function Medicamentos({ initialMedications = sampleMedications, initialHistory = sampleHistory, onLogout, onAddMedication, onUpdateMedication, onDeleteMedication, userName = "Evellyn" }) {
    const [medications, setMedications] = useState(initialMedications);
    const [history, setHistory] = useState(initialHistory);
    const [modalMedication, setModalMedication] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [whatsappPatient, setWhatsappPatient] = useState("+55 11 99999-0000");
    const [whatsappResponsible, setWhatsappResponsible] = useState("+55 11 98888-0000");
    const escalationTimersRef = useRef({});
    const toastTimerRef = useRef(null);

    const completedToday = medications.filter((medication) => medication.status === "taken").length;

    const summary = useMemo(() => `${completedToday} de ${medications.length} doses de hoje concluídas`, [completedToday, medications.length]);

    useEffect(() => {
        return () => {
            Object.values(escalationTimersRef.current).forEach((timer) => window.clearTimeout(timer));
            window.clearTimeout(toastTimerRef.current);
        };
    }, []);

    function showToast(message, type = "success") {
        setToast({ message, type });
        window.clearTimeout(toastTimerRef.current);
        toastTimerRef.current = window.setTimeout(() => setToast(null), 4200);
    }

    function openAddModal() { setModalMedication(null); setIsModalOpen(true); }
    function openEditModal(medication) { setModalMedication(medication); setIsModalOpen(true); }

    async function saveMedication(formData) {
        if (modalMedication) {
            const updated = { ...modalMedication, ...formData };
            setMedications((current) => current.map((item) => (item.id === updated.id ? updated : item)));
            await onUpdateMedication?.(updated);
            showToast("Medicamento atualizado com sucesso.");
        } else {
            const created = { id: Date.now(), ...formData, status: "scheduled", delay: 0 };
            setMedications((current) => [...current, created].sort((a, b) => a.time.localeCompare(b.time)));
            await onAddMedication?.(created);
            showToast("Medicamento adicionado à rotina.");
        }
        setIsModalOpen(false);
        setModalMedication(null);
    }

    async function deleteMedication(id) {
        const medication = medications.find((item) => item.id === id);
        if (!medication) return;
        if (!window.confirm(`Excluir ${medication.name} das doses de hoje?`)) return;

        setMedications((current) => current.filter((item) => item.id !== id));
        await onDeleteMedication?.(id);
        showToast("Medicamento removido da lista.");
    }

    function clearEscalationTimer(id) {
        const timer = escalationTimersRef.current[id];
        if (timer) window.clearTimeout(timer);
        delete escalationTimersRef.current[id];
    }

    function handleTaken(medication) {
        clearEscalationTimer(medication.id);
        setMedications((current) => current.map((item) => (item.id === medication.id ? { ...item, status: "taken", delay: 0 } : item)));
        setHistory((current) => [
            { id: Date.now(), medication: medication.name, time: medication.time, date: "Hoje", detail: `Tomado — ${formatHistoryDate(new Date())}` },
            ...current,
        ].slice(0, 8));
        showToast(`${medication.name} confirmado como tomado.`);
    }

    function handleRemindLater(medication) {
        setMedications((current) => current.map((item) => (item.id === medication.id ? { ...item, status: "scheduled" } : item)));
        showToast(`Novo lembrete de ${medication.name} agendado.`);
    }

    function startEscalationDemo(medication) {
        clearEscalationTimer(medication.id);

        const patientDelay = Math.max(1000, medication.reminderMinutes * 1000);
        const responsibleDelay = Math.max(patientDelay + 1000, medication.responsibleMinutes * 1000);

        const firstTimer = window.setTimeout(() => {
            showToast(`WhatsApp enviado ao paciente (${whatsappPatient}) sobre ${medication.name}.`, "whatsapp");
        }, patientDelay);

        const secondTimer = window.setTimeout(() => {
            showToast(`Responsável avisado pelo WhatsApp (${whatsappResponsible}) sobre ${medication.name}.`, "warning");
            setHistory((current) => [
                { id: Date.now(), medication: medication.name, time: medication.time, date: "Hoje", detail: `Responsável avisado — ${formatHistoryDate(new Date())}` },
                ...current,
            ].slice(0, 8));
        }, responsibleDelay);

        escalationTimersRef.current[medication.id] = firstTimer;
        showToast("Fluxo de lembrete iniciado. Nesta demonstração, os minutos viram segundos.", "info");

        window.setTimeout(() => {
            delete escalationTimersRef.current[medication.id];
            escalationTimersRef.current[medication.id] = secondTimer;
        }, patientDelay);
    }

    return (
        <div className="medicamentos-page">
            <Sidebar />

            <main className="medicamentos-main">
                <Topbar
                    title={`Medicamentos`}
                    subtitle="Vamos juntos tornar o dia de hoje mais leve e organizado."
                    userName={userName}
                    userLevel="Nível 2 - Assistida"
                    notifications={3}
                    onLogout={onLogout}
                />

                <PageToolbar icon="pill" title="Meus medicamentos" description={summary}>
                    <button className="medicamentos-btn medicamentos-btn-primary" type="button" onClick={openAddModal}>
                        <Icon name="plus" size={18} /> Adicionar medicamento
                    </button>
                </PageToolbar>

                <div className="medicamentos-content">
                    <section className="medicamentos-list-section" aria-labelledby="today-medications-title">
                        <div className="app-section-heading-simple">
                            <h2 id="today-medications-title">Doses de hoje</h2>
                        </div>

                        <div className="medication-list">
                            {medications.map((medication) => (
                                <MedicationCard
                                    key={medication.id}
                                    medication={medication}
                                    onTaken={handleTaken}
                                    onRemindLater={(item) => { handleRemindLater(item); startEscalationDemo(item); }}
                                    onEdit={openEditModal}
                                    onDelete={deleteMedication}
                                />
                            ))}

                            {medications.length === 0 && (
                                <div className="medicamentos-empty">
                                    <Icon name="pill" size={30} />
                                    <h3>Nenhum medicamento cadastrado</h3>
                                    <p>Adicione o primeiro medicamento para começar a organizar a rotina.</p>
                                    <button className="medicamentos-btn medicamentos-btn-primary" type="button" onClick={openAddModal}>Adicionar medicamento</button>
                                </div>
                            )}
                        </div>
                    </section>

                    <aside className="medicamentos-sidebar">
                        <section className="medicamentos-card medicamentos-whatsapp-card">
                            <div className="medicamentos-card-title">
                                <span className="medicamentos-card-title-icon"><Icon name="whatsapp" size={20} /></span>
                                <div>
                                    <h2>Lembretes por WhatsApp</h2>
                                    <p>Após 15 min sem confirmação enviamos o lembrete; após 30 min avisamos o responsável.</p>
                                </div>
                            </div>

                            <label className="medicamentos-field">
                                <span>WhatsApp do paciente</span>
                                <input value={whatsappPatient} onChange={(event) => setWhatsappPatient(event.target.value)} placeholder="+55 11 99999-0000" />
                            </label>
                            <label className="medicamentos-field">
                                <span>WhatsApp do responsável</span>
                                <input value={whatsappResponsible} onChange={(event) => setWhatsappResponsible(event.target.value)} placeholder="+55 11 98888-0000" />
                            </label>
                        </section>

                        <section className="medicamentos-card medicamentos-history-card">
                            <div className="medicamentos-card-title">
                                <span className="medicamentos-card-title-icon"><Icon name="history" size={20} /></span>
                                <h2>Histórico</h2>
                            </div>
                            <div className="medicamentos-history-list">
                                {history.length === 0 ? (
                                    <p className="medicamentos-history-empty">Nenhum registro ainda.</p>
                                ) : history.map((entry) => (
                                    <article className="medicamentos-history-item" key={entry.id}>
                                        <strong>{entry.medication} · {entry.time}</strong>
                                        <span>{entry.detail}</span>
                                    </article>
                                ))}
                            </div>
                        </section>
                    </aside>
                </div>
                
                <div className="medicamentos-strip">
                    <PuzzleStrip />
                </div>
            </main>

            {isModalOpen && (
                <MedicationModal
                    medication={modalMedication}
                    onClose={() => { setIsModalOpen(false); setModalMedication(null); }}
                    onSave={saveMedication}
                />
            )}
            <Toast toast={toast} />
        </div>
    );
}

export default Medicamentos;