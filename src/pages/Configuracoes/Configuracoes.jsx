import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import Topbar from "../../components/Topbar/Topbar.jsx";
import "./Configuracoes.css";

const puzzleColors = [
  "blue", "purple", "yellow", "green", "red", "blue",
  "purple", "yellow", "green", "red", "blue", "purple",
  "yellow", "green", "red", "blue", "purple", "yellow",
];

function readCareteaSession() {
  const rawSession =
    sessionStorage.getItem("careteaSession") ||
    localStorage.getItem("careteaSession");

  if (!rawSession) return null;

  try {
    return JSON.parse(rawSession);
  } catch {
    sessionStorage.removeItem("careteaSession");
    localStorage.removeItem("careteaSession");
    return null;
  }
}

function Switch({ checked, onChange, label }) {
  return (
    <button
      className={`config-switch ${checked ? "config-switch-active" : ""}`}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled = false,
  helper,
}) {
  return (
    <label className="config-field">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
      {helper && <small>{helper}</small>}
    </label>
  );
}

function Configuracoes() {
  const navigate = useNavigate();
  const session = readCareteaSession();

  const accountType = session?.accountType ?? "responsavel";
  const autismLevel =
    Number(session?.autismLevel) || (accountType === "autista" ? 1 : 2);

  const isResponsible = accountType === "responsavel";

  const defaultUserName =
    session?.userName ?? (isResponsible ? "Adriana" : "Lucas");

  const defaultProfileName =
    session?.profileName ?? (isResponsible ? "Evellyn" : defaultUserName);

  const defaultEmail =
    session?.email ??
    (isResponsible
      ? `responsavel${autismLevel}@caretea.com`
      : "autista@caretea.com");

  const profileStorageKey =
    `careteaProfile:${accountType}:${autismLevel}:${defaultUserName}`;

  const settingsStorageKey =
    `careteaSettings:${accountType}:${autismLevel}:${defaultUserName}`;

  const defaultProfile = {
    userName: defaultUserName,
    email: defaultEmail,
    responsibleWhatsapp: session?.responsibleWhatsapp ?? "",
    autisticPersonName: defaultProfileName,
    autisticWhatsapp: session?.autisticWhatsapp ?? "",
    trustedContactName: session?.trustedContactName ?? "",
    trustedWhatsapp: session?.trustedWhatsapp ?? "",
  };

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(profileStorageKey);
      return saved
        ? { ...defaultProfile, ...JSON.parse(saved) }
        : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const defaultSettings = {
    medicationReminders: true,
    appointmentReminders: true,
    inAppNotifications: true,
    whatsappNotifications: true,
    notifyResponsibleMedication: !isResponsible,
    notifyResponsibleAppointments: !isResponsible,
    missedMedicationAlerts: isResponsible,
    quietHours: false,
    quietStart: "22:00",
    quietEnd: "07:00",
    largerText: false,
    simpleLanguage: true,
    reduceMotion: false,
    highContrast: false,
    soundAlerts: true,
    loginAlerts: true,
    allowReportSharing: true,
    language: "pt-BR",
  };

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(settingsStorageKey);
      return saved
        ? { ...defaultSettings, ...JSON.parse(saved) }
        : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [editingProfile, setEditingProfile] = useState(false);
  const [feedback, setFeedback] = useState("");

  const userName = profile.userName || defaultUserName;
  const profileName = isResponsible
    ? profile.autisticPersonName || defaultProfileName
    : userName;

  const userLevel = isResponsible
    ? `Responsável · Nível ${autismLevel}`
    : `Nível ${autismLevel} · Autonomia`;

  const subtitle = isResponsible
    ? `Gerencie sua conta e as preferências de acompanhamento de ${profileName}.`
    : "Gerencie seus dados, contatos, lembretes, acessibilidade e privacidade.";

  function updateProfile(event) {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));

    setFeedback("");
  }

  function updateSetting(key, value) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setFeedback("");
  }

  function updateSettingInput(event) {
    const { name, value } = event.target;

    setSettings((current) => ({
      ...current,
      [name]: value,
    }));

    setFeedback("");
  }

  function saveProfile() {
    localStorage.setItem(profileStorageKey, JSON.stringify(profile));

    const currentSession = readCareteaSession() ?? {};
    const updatedSession = {
      ...currentSession,
      userName: profile.userName,
      email: profile.email,
      profileName: isResponsible
        ? profile.autisticPersonName
        : profile.userName,
      responsibleWhatsapp: isResponsible
        ? profile.responsibleWhatsapp
        : profile.trustedWhatsapp,
      autisticWhatsapp: isResponsible
        ? profile.autisticWhatsapp
        : profile.autisticWhatsapp,
      trustedContactName: !isResponsible
        ? profile.trustedContactName
        : undefined,
      trustedWhatsapp: !isResponsible
        ? profile.trustedWhatsapp
        : undefined,
    };

    if (sessionStorage.getItem("careteaSession")) {
      sessionStorage.setItem("careteaSession", JSON.stringify(updatedSession));
    }

    if (localStorage.getItem("careteaSession")) {
      localStorage.setItem("careteaSession", JSON.stringify(updatedSession));
    }

    setEditingProfile(false);
    setFeedback("Dados do perfil salvos.");
  }

  function saveSettings() {
    localStorage.setItem(settingsStorageKey, JSON.stringify(settings));
    setFeedback("Configurações salvas.");
  }

  function resetSettings() {
    setSettings(defaultSettings);
    localStorage.removeItem(settingsStorageKey);
    setFeedback("Configurações restauradas para o padrão.");
  }

  function handlePasswordChange() {
    navigate("/reset-password");
  }

  function handleLogout() {
    sessionStorage.removeItem("careteaSession");
    localStorage.removeItem("careteaSession");
    navigate("/login");
  }

  function handleDeleteAccount() {
    setFeedback(
      "A exclusão da conta exige confirmação de identidade antes de ser concluída.",
    );
  }

  return (
    <div className="configuracoes-page">
      <Sidebar />

      <div className="configuracoes-content">
        <main className="configuracoes-main">
          <Topbar
            title="Configurações"
            subtitle={subtitle}
            userName={userName}
            userLevel={userLevel}
            notifications={3}
            onLogout={handleLogout}
          />

          <section className="configuracoes-hero">
            <div className="configuracoes-hero-icon" aria-hidden="true">
              ⚙
            </div>

            <div>
              <span>Conta e preferências</span>
              <h1>Central de configurações</h1>
              <p>
                Edite seus dados, números de WhatsApp, notificações,
                acessibilidade, privacidade e segurança da conta.
              </p>
            </div>
          </section>

          <section className="config-card config-profile-card">
            <header className="config-card-header config-card-header-between">
              <div className="config-card-heading">
                <div className="config-card-icon config-card-icon-green">♙</div>
                <div>
                  <span>Perfil e contatos</span>
                  <h2>
                    {isResponsible
                      ? "Dados do responsável e da pessoa autista"
                      : "Seus dados e contato de confiança"}
                  </h2>
                </div>
              </div>

              <button
                className="config-edit-button"
                type="button"
                onClick={() => {
                  setEditingProfile((current) => !current);
                  setFeedback("");
                }}
              >
                {editingProfile ? "Cancelar edição" : "Editar perfil"}
              </button>
            </header>

            <div className="config-profile-summary">
              <div className="config-profile-avatar" aria-hidden="true">
                {isResponsible ? "👩🏻" : "🙂"}
              </div>

              <div>
                <strong>{userName}</strong>
                <span>
                  {isResponsible
                    ? `Responsável por ${profileName}`
                    : "Pessoa autista · conta própria"}
                </span>
                <small>{userLevel}</small>
              </div>
            </div>

            <div className="config-fields-grid">
              <Field
                label={isResponsible ? "Nome do responsável" : "Nome completo"}
                name="userName"
                value={profile.userName}
                onChange={updateProfile}
                disabled={!editingProfile}
                placeholder="Digite o nome completo"
              />

              <Field
                label="E-mail da conta"
                name="email"
                type="email"
                value={profile.email}
                onChange={updateProfile}
                disabled={!editingProfile}
                placeholder="email@exemplo.com"
              />

              {isResponsible ? (
                <>
                  <Field
                    label="WhatsApp do responsável"
                    name="responsibleWhatsapp"
                    value={profile.responsibleWhatsapp}
                    onChange={updateProfile}
                    disabled={!editingProfile}
                    placeholder="(51) 99999-9999"
                    helper="Número usado para avisos e notificações do CareTEA."
                  />

                  <Field
                    label="Nome da pessoa autista"
                    name="autisticPersonName"
                    value={profile.autisticPersonName}
                    onChange={updateProfile}
                    disabled={!editingProfile}
                    placeholder="Nome da pessoa autista"
                  />

                  <Field
                    label="WhatsApp da pessoa autista"
                    name="autisticWhatsapp"
                    value={profile.autisticWhatsapp}
                    onChange={updateProfile}
                    disabled={!editingProfile}
                    placeholder="(51) 99999-9999"
                    helper={
                      autismLevel === 2
                        ? "Pode ser usado no acesso assistido e em lembretes da Minha Rotina."
                        : "Preencha caso a pessoa autista possua um número próprio."
                    }
                  />

                  <div className="config-field config-field-readonly">
                    <span>Nível de suporte</span>
                    <div className="config-readonly-value">
                      Nível {autismLevel}
                    </div>
                    <small>
                      O nível de suporte não é alterado diretamente nesta tela.
                    </small>
                  </div>
                </>
              ) : (
                <>
                  <Field
                    label="Seu WhatsApp"
                    name="autisticWhatsapp"
                    value={profile.autisticWhatsapp}
                    onChange={updateProfile}
                    disabled={!editingProfile}
                    placeholder="(51) 99999-9999"
                    helper="Número principal para seus lembretes e avisos."
                  />

                  <Field
                    label="Nome do responsável ou contato de confiança"
                    name="trustedContactName"
                    value={profile.trustedContactName}
                    onChange={updateProfile}
                    disabled={!editingProfile}
                    placeholder="Nome do contato"
                  />

                  <Field
                    label="WhatsApp do responsável ou contato de confiança"
                    name="trustedWhatsapp"
                    value={profile.trustedWhatsapp}
                    onChange={updateProfile}
                    disabled={!editingProfile}
                    placeholder="(51) 99999-9999"
                    helper="Usado apenas para os avisos que você autorizar."
                  />

                  <div className="config-field config-field-readonly">
                    <span>Nível de suporte</span>
                    <div className="config-readonly-value">
                      Nível {autismLevel}
                    </div>
                    <small>Seu perfil utiliza a experiência completa.</small>
                  </div>
                </>
              )}
            </div>

            {editingProfile && (
              <div className="config-profile-actions">
                <button
                  className="config-primary-button"
                  type="button"
                  onClick={saveProfile}
                >
                  Salvar dados do perfil
                </button>
              </div>
            )}
          </section>

          <div className="configuracoes-grid">
            <section className="config-card">
              <header className="config-card-header">
                <div className="config-card-icon config-card-icon-purple">♢</div>
                <div>
                  <span>Notificações</span>
                  <h2>Avisos, lembretes e WhatsApp</h2>
                </div>
              </header>

              <div className="config-list">
                <div className="config-row">
                  <div>
                    <strong>Notificações no CareTEA</strong>
                    <p>Mostrar avisos importantes dentro do sistema.</p>
                  </div>
                  <Switch
                    checked={settings.inAppNotifications}
                    onChange={(value) =>
                      updateSetting("inAppNotifications", value)
                    }
                    label="Notificações no CareTEA"
                  />
                </div>

                <div className="config-row">
                  <div>
                    <strong>Lembretes de medicamentos</strong>
                    <p>Avisar nos horários dos medicamentos cadastrados.</p>
                  </div>
                  <Switch
                    checked={settings.medicationReminders}
                    onChange={(value) =>
                      updateSetting("medicationReminders", value)
                    }
                    label="Lembretes de medicamentos"
                  />
                </div>

                <div className="config-row">
                  <div>
                    <strong>Consultas e compromissos</strong>
                    <p>Receber lembretes da agenda e compromissos de saúde.</p>
                  </div>
                  <Switch
                    checked={settings.appointmentReminders}
                    onChange={(value) =>
                      updateSetting("appointmentReminders", value)
                    }
                    label="Consultas e compromissos"
                  />
                </div>

                <div className="config-row">
                  <div>
                    <strong>Notificações por WhatsApp</strong>
                    <p>
                      Enviar também pelo WhatsApp quando esse tipo de aviso
                      estiver habilitado.
                    </p>
                  </div>
                  <Switch
                    checked={settings.whatsappNotifications}
                    onChange={(value) =>
                      updateSetting("whatsappNotifications", value)
                    }
                    label="Notificações por WhatsApp"
                  />
                </div>

                {isResponsible ? (
                  <div className="config-row">
                    <div>
                      <strong>Alerta de medicamento não confirmado</strong>
                      <p>
                        Avisar o responsável quando um medicamento esperado não
                        for confirmado.
                      </p>
                    </div>
                    <Switch
                      checked={settings.missedMedicationAlerts}
                      onChange={(value) =>
                        updateSetting("missedMedicationAlerts", value)
                      }
                      label="Alerta de medicamento não confirmado"
                    />
                  </div>
                ) : (
                  <>
                    <div className="config-row">
                      <div>
                        <strong>Avisar contato sobre medicamentos</strong>
                        <p>
                          Enviar confirmação ou alerta ao contato de confiança.
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifyResponsibleMedication}
                        onChange={(value) =>
                          updateSetting("notifyResponsibleMedication", value)
                        }
                        label="Avisar contato sobre medicamentos"
                      />
                    </div>

                    <div className="config-row">
                      <div>
                        <strong>Avisar contato sobre consultas</strong>
                        <p>
                          Compartilhar lembretes de consultas com o contato
                          autorizado.
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifyResponsibleAppointments}
                        onChange={(value) =>
                          updateSetting("notifyResponsibleAppointments", value)
                        }
                        label="Avisar contato sobre consultas"
                      />
                    </div>
                  </>
                )}

                <div className="config-row">
                  <div>
                    <strong>Som nos avisos</strong>
                    <p>Reproduzir som junto das notificações importantes.</p>
                  </div>
                  <Switch
                    checked={settings.soundAlerts}
                    onChange={(value) =>
                      updateSetting("soundAlerts", value)
                    }
                    label="Som nos avisos"
                  />
                </div>
              </div>
            </section>

            <section className="config-card">
              <header className="config-card-header">
                <div className="config-card-icon config-card-icon-blue">◇</div>
                <div>
                  <span>Acessibilidade</span>
                  <h2>Conforto visual e linguagem</h2>
                </div>
              </header>

              <div className="config-list">
                <div className="config-row">
                  <div>
                    <strong>Texto maior</strong>
                    <p>Aumentar o tamanho dos textos principais.</p>
                  </div>
                  <Switch
                    checked={settings.largerText}
                    onChange={(value) =>
                      updateSetting("largerText", value)
                    }
                    label="Texto maior"
                  />
                </div>

                <div className="config-row">
                  <div>
                    <strong>Linguagem mais simples</strong>
                    <p>Priorizar frases curtas e instruções diretas.</p>
                  </div>
                  <Switch
                    checked={settings.simpleLanguage}
                    onChange={(value) =>
                      updateSetting("simpleLanguage", value)
                    }
                    label="Linguagem mais simples"
                  />
                </div>

                <div className="config-row">
                  <div>
                    <strong>Reduzir animações</strong>
                    <p>Diminuir movimentos e transições nas telas.</p>
                  </div>
                  <Switch
                    checked={settings.reduceMotion}
                    onChange={(value) =>
                      updateSetting("reduceMotion", value)
                    }
                    label="Reduzir animações"
                  />
                </div>

                <div className="config-row">
                  <div>
                    <strong>Alto contraste</strong>
                    <p>Reforçar contraste de textos, botões e cartões.</p>
                  </div>
                  <Switch
                    checked={settings.highContrast}
                    onChange={(value) =>
                      updateSetting("highContrast", value)
                    }
                    label="Alto contraste"
                  />
                </div>

                <label className="config-select-row">
                  <div>
                    <strong>Idioma</strong>
                    <p>Idioma principal da interface.</p>
                  </div>

                  <select
                    name="language"
                    value={settings.language}
                    onChange={updateSettingInput}
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                  </select>
                </label>
              </div>
            </section>

            <section className="config-card">
              <header className="config-card-header">
                <div className="config-card-icon config-card-icon-yellow">☾</div>
                <div>
                  <span>Horário silencioso</span>
                  <h2>Controle quando receber avisos</h2>
                </div>
              </header>

              <div className="config-list">
                <div className="config-row">
                  <div>
                    <strong>Ativar horário silencioso</strong>
                    <p>
                      Evitar avisos sonoros durante o período escolhido.
                    </p>
                  </div>
                  <Switch
                    checked={settings.quietHours}
                    onChange={(value) =>
                      updateSetting("quietHours", value)
                    }
                    label="Ativar horário silencioso"
                  />
                </div>

                <div className="config-time-grid">
                  <label className="config-field">
                    <span>Início</span>
                    <input
                      name="quietStart"
                      type="time"
                      value={settings.quietStart}
                      onChange={updateSettingInput}
                      disabled={!settings.quietHours}
                    />
                  </label>

                  <label className="config-field">
                    <span>Fim</span>
                    <input
                      name="quietEnd"
                      type="time"
                      value={settings.quietEnd}
                      onChange={updateSettingInput}
                      disabled={!settings.quietHours}
                    />
                  </label>
                </div>

                <p className="config-card-note">
                  Alertas considerados urgentes podem continuar aparecendo na
                  tela, mesmo durante o horário silencioso.
                </p>
              </div>
            </section>

            <section className="config-card">
              <header className="config-card-header">
                <div className="config-card-icon config-card-icon-red">⌾</div>
                <div>
                  <span>Privacidade e segurança</span>
                  <h2>Proteção da conta e dos dados</h2>
                </div>
              </header>

              <div className="config-list">
                <div className="config-row">
                  <div>
                    <strong>Alertas de novo acesso</strong>
                    <p>
                      Avisar quando a conta for acessada em um novo dispositivo.
                    </p>
                  </div>
                  <Switch
                    checked={settings.loginAlerts}
                    onChange={(value) =>
                      updateSetting("loginAlerts", value)
                    }
                    label="Alertas de novo acesso"
                  />
                </div>

                <div className="config-row">
                  <div>
                    <strong>Compartilhamento de relatórios</strong>
                    <p>
                      Permitir o compartilhamento de relatórios quando você
                      solicitar.
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowReportSharing}
                    onChange={(value) =>
                      updateSetting("allowReportSharing", value)
                    }
                    label="Compartilhamento de relatórios"
                  />
                </div>
              </div>

              <div className="config-security-actions">
                <button type="button" onClick={handlePasswordChange}>
                  Alterar senha
                </button>
              </div>
            </section>
          </div>

          <section className="config-card config-account-card">
            <header className="config-card-header">
              <div className="config-card-icon config-card-icon-red">⚠</div>
              <div>
                <span>Conta</span>
                <h2>Sessão e gerenciamento da conta</h2>
              </div>
            </header>

            <div className="config-account-options">
              <div>
                <strong>Sair da conta</strong>
                <p>Encerra a sessão atual neste dispositivo.</p>
                <button
                  className="config-secondary-button"
                  type="button"
                  onClick={handleLogout}
                >
                  Sair
                </button>
              </div>

              <div className="config-danger-zone">
                <strong>Excluir conta</strong>
                <p>
                  Remove a conta e os dados vinculados após confirmação de
                  identidade.
                </p>
                <button
                  className="config-danger-button"
                  type="button"
                  onClick={handleDeleteAccount}
                >
                  Solicitar exclusão
                </button>
              </div>
            </div>
          </section>

          <section className="configuracoes-actions">
            <button
              className="config-reset-button"
              type="button"
              onClick={resetSettings}
            >
              Restaurar preferências
            </button>

            <button
              className="config-primary-button"
              type="button"
              onClick={saveSettings}
            >
              Salvar configurações
            </button>
          </section>

          {feedback && (
            <div className="config-feedback" role="status">
              <span>✓</span>
              <p>{feedback}</p>
            </div>
          )}

          <div className="config-caretea-footer">
            <div className="config-puzzle-strip" aria-hidden="true">
              {puzzleColors.map((color, index) => (
                <span className={color} key={`${color}-${index}`} />
              ))}
            </div>

            <footer className="config-page-footer">
              <span className="config-security">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                Seus dados estão protegidos conosco.
              </span>

              <span className="config-footer-divider" />
              <a href="#politica-de-privacidade">Política de Privacidade</a>
              <a href="#termos-de-uso">Termos de Uso</a>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Configuracoes;
