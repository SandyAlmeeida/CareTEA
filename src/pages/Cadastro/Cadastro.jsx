import { useState } from "react";
import { Link } from "react-router-dom";
import logoCaretea from "../../assets/logo-caretea.png";
import familiaCaretea from "../../assets/familia-caretea.png";
import Footer from "../../components/Footer/Footer";
import "./Cadastro.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ResponsibleAvatar() {
  return (
    <svg viewBox="0 0 96 96" aria-hidden="true">
      <circle cx="48" cy="48" r="46" fill="#edf2ff" />
      <circle cx="34" cy="35" r="12" fill="#ffbf9d" />
      <path d="M20 69c1-14 8-22 14-22s13 8 14 22" fill="#2871ca" />
      <path d="M24 32c1-11 19-15 23-1-5-2-8-1-12-6-1 5-6 7-11 7Z" fill="#132a55" />
      <circle cx="62" cy="35" r="12" fill="#ffbf9d" />
      <path d="M48 69c1-14 8-22 14-22s13 8 14 22" fill="#233f8f" />
      <path d="M52 31c2-12 20-13 23 1-6-1-8-3-12-6-2 4-6 6-11 5Z" fill="#14284d" />
      <circle cx="48" cy="52" r="10" fill="#ffc19d" />
      <path d="M36 76c1-12 6-18 12-18s11 6 12 18" fill="#f25b50" />
      <path d="M39 49c2-10 15-11 19 0-5 0-7-3-10-5-2 3-5 5-9 5Z" fill="#1a2d55" />
    </svg>
  );
}

function AutisticAvatar() {
  return (
    <svg viewBox="0 0 96 96" aria-hidden="true">
      <circle cx="48" cy="48" r="46" fill="#edf2ff" />
      <circle cx="48" cy="36" r="16" fill="#ffc19d" />
      <path d="M25 83c1-20 10-31 23-31s22 11 23 31" fill="#2375c7" />
      <path d="M32 34c1-17 28-21 33-1-8-2-12-6-17-10-3 6-9 10-16 11Z" fill="#14284d" />
    </svg>
  );
}

function EyeIcon({ closed = false }) {
  if (closed) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m3 3 18 18M10.6 6.2A9 9 0 0 1 12 6c6 0 9.5 6 9.5 6a15 15 0 0 1-2.2 2.8M6.2 6.2C3.8 8 2.5 12 2.5 12s3.5 6 9.5 6a10 10 0 0 0 3.2-.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.7" />
    </svg>
  );
}

function Cadastro({ onSubmit, onGoogleRegister }) {
  const [formData, setFormData] = useState({
    accountType: "responsavel",
    fullName: "",
    autisticPersonName: "",
    email: "",
    whatsapp: "",
    trustedWhatsapp: "",
    relationship: "",
    autismLevel: "",
    notifyMedication: true,
    notifyAppointments: true,
    password: "",
    confirmPassword: "",
    acceptedTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isResponsible = formData.accountType === "responsavel";
  const isAutisticLevelOne =
    formData.accountType === "autista" && formData.autismLevel === "1";
  const isResponsibleLevelTwo =
    formData.accountType === "responsavel" && formData.autismLevel === "2";

  function clearMessage() {
    if (message.text) {
      setMessage({ text: "", type: "" });
    }
  }

  function formatWhatsapp(value) {
    const numbers = value.replace(/\D/g, "").slice(0, 11);

    if (numbers.length <= 2) {
      return numbers;
    }

    if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    }

    if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }

    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  }

  function whatsappIsValid(value) {
    const numbers = value.replace(/\D/g, "");
    return numbers.length === 10 || numbers.length === 11;
  }

  function updateField(event) {
    const { name, value, checked, type } = event.target;
    const nextValue =
      name === "whatsapp" || name === "trustedWhatsapp"
        ? formatWhatsapp(value)
        : type === "checkbox"
          ? checked
          : value;

    setFormData((current) => ({
      ...current,
      [name]: nextValue,
    }));

    clearMessage();
  }

  function selectAccountType(accountType) {
    setFormData((current) => ({
      ...current,
      accountType,
      autismLevel:
        accountType === "autista"
          ? current.autismLevel === "1"
            ? "1"
            : ""
          : current.autismLevel === "2" || current.autismLevel === "3"
            ? current.autismLevel
            : "",
      autisticPersonName:
        accountType === "responsavel" ? current.autisticPersonName : "",
      relationship:
        accountType === "responsavel" ? current.relationship : "",
      trustedWhatsapp:
        accountType === "autista" ? current.trustedWhatsapp : "",
    }));

    clearMessage();
  }

  function selectAutismLevel(autismLevel) {
    if (formData.accountType === "autista" && autismLevel !== "1") {
      return;
    }

    setFormData((current) => ({
      ...current,
      autismLevel,
    }));

    clearMessage();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const fullName = formData.fullName.trim();
    const autisticPersonName = formData.autisticPersonName.trim();
    const email = formData.email.trim();

    if (!formData.autismLevel) {
      setMessage({
        text: isResponsible
          ? "Selecione o nível de suporte da pessoa autista."
          : "Para cadastro próprio, selecione o Nível 1.",
        type: "error",
      });
      return;
    }

    if (!isResponsible && formData.autismLevel !== "1") {
      setMessage({
        text: "Os Níveis 2 e 3 devem ser cadastrados por um responsável.",
        type: "error",
      });
      return;
    }

    if (fullName.length < 3) {
      setMessage({
        text: isResponsible
          ? "Digite o nome completo do responsável."
          : "Digite seu nome completo.",
        type: "error",
      });
      return;
    }

    if (isResponsible && autisticPersonName.length < 3) {
      setMessage({
        text: "Digite o nome completo da pessoa autista.",
        type: "error",
      });
      return;
    }

    if (!EMAIL_PATTERN.test(email)) {
      setMessage({
        text: "Digite um endereço de e-mail válido.",
        type: "error",
      });
      return;
    }

    if (!whatsappIsValid(formData.whatsapp)) {
      setMessage({
        text: isResponsible
          ? "Digite um WhatsApp válido do responsável."
          : "Digite um WhatsApp válido.",
        type: "error",
      });
      return;
    }

    if (isAutisticLevelOne && formData.trustedWhatsapp) {
      if (!whatsappIsValid(formData.trustedWhatsapp)) {
        setMessage({
          text: "Digite um WhatsApp válido para o contato de confiança ou deixe o campo vazio.",
          type: "error",
        });
        return;
      }
    }

    if (isResponsible && !formData.relationship) {
      setMessage({
        text: "Informe o vínculo do responsável com a pessoa autista.",
        type: "error",
      });
      return;
    }

    if (formData.password.length < 6) {
      setMessage({
        text: "A senha deve possuir pelo menos 6 caracteres.",
        type: "error",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({
        text: "As senhas não coincidem.",
        type: "error",
      });
      return;
    }

    if (!formData.acceptedTerms) {
      setMessage({
        text: "Aceite os Termos de Uso e a Política de Privacidade.",
        type: "error",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage({ text: "", type: "" });

      await onSubmit?.({
        accountType: formData.accountType,
        fullName,
        autisticPersonName: isResponsible ? autisticPersonName : fullName,
        email,
        whatsapp: formData.whatsapp.replace(/\D/g, ""),
        trustedWhatsapp:
          isAutisticLevelOne && formData.trustedWhatsapp
            ? formData.trustedWhatsapp.replace(/\D/g, "")
            : null,
        relationship: isResponsible ? formData.relationship : null,
        autismLevel: Number(formData.autismLevel),
        interfaceType: isResponsible ? "RESPONSAVEL" : "COMPLETA",
        assistedAccess: isResponsibleLevelTwo,
        assistedAccessMethod: isResponsibleLevelTwo
          ? "LINK_CODE_QR"
          : null,
        notifyMedication:
          isAutisticLevelOne && formData.trustedWhatsapp
            ? formData.notifyMedication
            : null,
        notifyAppointments:
          isAutisticLevelOne && formData.trustedWhatsapp
            ? formData.notifyAppointments
            : null,
        password: formData.password,
      });

      setMessage({
        text: isResponsibleLevelTwo
          ? "Cadastro validado. Depois de salvar no backend, o CareTEA poderá gerar o acesso para a Minha Rotina."
          : "Cadastro validado. Agora conecte o formulário ao backend.",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      setMessage({
        text: "Não foi possível finalizar o cadastro. Tente novamente.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleGoogleRegister() {
    if (onGoogleRegister) {
      onGoogleRegister();
      return;
    }

    setMessage({
      text: "Aqui será adicionada a autenticação do Google.",
      type: "success",
    });
  }

  return (
    <div className="caretea-cadastro-page">
      <main className="cadastro-shell">
        <svg
          className="cadastro-decorative-puzzle cadastro-puzzle-blue"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <path d="M10 20a8 8 0 0 1 8-8h24c-2 4-2 8 0 12 3 7 12 9 18 5 6-3 8-11 5-17h17a8 8 0 0 1 8 8v22c-7-3-15 0-18 6-3 7 0 15 7 18 4 2 8 2 11 0v16a8 8 0 0 1-8 8H60c3-7 0-15-7-18-7-3-15 0-18 7-2 4-2 8 0 11H18a8 8 0 0 1-8-8V60c7 3 15 0 18-7 3-7 0-15-7-18-4-2-8-2-11 0V20Z" />
        </svg>

        <svg
          className="cadastro-decorative-puzzle cadastro-puzzle-yellow"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <path d="M10 20a8 8 0 0 1 8-8h24c-2 4-2 8 0 12 3 7 12 9 18 5 6-3 8-11 5-17h17a8 8 0 0 1 8 8v22c-7-3-15 0-18 6-3 7 0 15 7 18 4 2 8 2 11 0v16a8 8 0 0 1-8 8H60c3-7 0-15-7-18-7-3-15 0-18 7-2 4-2 8 0 11H18a8 8 0 0 1-8-8V60c7 3 15 0 18-7 3-7 0-15-7-18-4-2-8-2-11 0V20Z" />
        </svg>

        <section className="cadastro-content-grid">
          <section
            className="cadastro-presentation"
            aria-labelledby="cadastro-caretea-title"
          >
            <img
              className="cadastro-brand-logo"
              src={logoCaretea}
              alt="CareTEA"
            />

            <div className="cadastro-presentation-text">
              <h1 id="cadastro-caretea-title">
                Organizando cuidados,
                <br />
                promovendo <span>autonomia.</span>
              </h1>

              <p className="cadastro-description">
                Uma experiência adaptada para diferentes necessidades de suporte,
                conectando autonomia, rotina e acompanhamento em um só lugar.
              </p>
            </div>

            <div className="cadastro-features" aria-label="Benefícios da plataforma">
              <article className="cadastro-feature">
                <span className="cadastro-feature-icon cadastro-feature-blue">♡</span>
                <p>Cuidado com empatia</p>
              </article>

              <article className="cadastro-feature">
                <span className="cadastro-feature-icon cadastro-feature-green">▣</span>
                <p>Rotinas organizadas</p>
              </article>

              <article className="cadastro-feature">
                <span className="cadastro-feature-icon cadastro-feature-yellow">◷</span>
                <p>Lembretes claros</p>
              </article>

              <article className="cadastro-feature">
                <span className="cadastro-feature-icon cadastro-feature-red">✦</span>
                <p>Autonomia com apoio</p>
              </article>
            </div>

            <div className="cadastro-illustration-wrap">
              <img
                src={familiaCaretea}
                alt="Responsável ajudando uma pessoa a utilizar um tablet"
              />
            </div>
          </section>

          <section className="cadastro-form-side">
            <aside className="cadastro-inclusion-note">
              <div className="cadastro-note-symbol" aria-hidden="true">🧩</div>
              <div>
                <strong>Uma experiência para cada necessidade</strong>
                <span>O CareTEA adapta o acesso conforme o nível de suporte.</span>
              </div>
            </aside>

            <section className="cadastro-card" aria-labelledby="cadastro-title">
              <header className="cadastro-header">
                <span className="cadastro-eyebrow">Criar conta</span>
                <h2 id="cadastro-title">Cadastro CareTEA</h2>
                <p>Preencha por etapas. As opções mudam conforme o tipo de acesso.</p>
              </header>

              <form onSubmit={handleSubmit} noValidate>
                <section className="cadastro-form-section">
                  <div className="cadastro-section-heading">
                    <span className="cadastro-step-number">1</span>
                    <div>
                      <strong>Quem está criando a conta?</strong>
                      <p>Escolha quem terá acesso principal ao CareTEA.</p>
                    </div>
                  </div>

                  <div className="cadastro-account-types" aria-label="Tipo de conta">
                    <button
                      className={`cadastro-account-card ${
                        isResponsible ? "cadastro-account-card-active" : ""
                      }`}
                      type="button"
                      aria-pressed={isResponsible}
                      onClick={() => selectAccountType("responsavel")}
                    >
                      <span className="cadastro-avatar">
                        <ResponsibleAvatar />
                      </span>
                      <span className="cadastro-account-copy">
                        <strong>Sou responsável</strong>
                        <small>Pai, mãe, tutor ou cuidador responsável</small>
                        <p>Crio e administro o perfil da pessoa autista.</p>
                      </span>
                    </button>

                    <button
                      className={`cadastro-account-card ${
                        !isResponsible ? "cadastro-account-card-active" : ""
                      }`}
                      type="button"
                      aria-pressed={!isResponsible}
                      onClick={() => selectAccountType("autista")}
                    >
                      <span className="cadastro-avatar">
                        <AutisticAvatar />
                      </span>
                      <span className="cadastro-account-copy">
                        <strong>Sou autista</strong>
                        <small>Cadastro próprio para Nível 1</small>
                        <p>Crio minha própria conta e uso o CareTEA completo.</p>
                      </span>
                    </button>
                  </div>

                  <div
                    className={`cadastro-account-guidance ${
                      !isResponsible ? "cadastro-account-guidance-autista" : ""
                    }`}
                  >
                    <span aria-hidden="true">{isResponsible ? "✓" : "i"}</span>
                    <div>
                      <strong>
                        {isResponsible
                          ? "O responsável cria os acessos dos Níveis 2 e 3"
                          : "Cadastro próprio disponível para Nível 1"}
                      </strong>
                      <p>
                        {isResponsible
                          ? "No Nível 2, você cadastra a pessoa autista e depois gera um acesso para abrir a Minha Rotina no celular dela."
                          : "Se você precisa de suporte Nível 2 ou 3, o cadastro deve ser iniciado pelo responsável."}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="cadastro-form-section">
                  <div className="cadastro-section-heading">
                    <span className="cadastro-step-number">2</span>
                    <div>
                      <strong>Qual é o nível de suporte?</strong>
                      <p>Isso define como o CareTEA será utilizado.</p>
                    </div>
                  </div>

                  <div className="cadastro-level-options">
                    {!isResponsible ? (

                    <button
                      type="button"
                      className={`cadastro-level-card cadastro-level-one ${
                        formData.autismLevel === "1"
                          ? "cadastro-level-card-active"
                          : ""
                      }`}
                      aria-pressed={formData.autismLevel === "1"}
                      onClick={() => selectAutismLevel("1")}
                    >
                      <span className="cadastro-level-number">1</span>
                      <span className="cadastro-level-copy">
                        <strong>Nível 1</strong>
                        <small>Mais autonomia</small>
                        <p>Acesso ao CareTEA completo.</p>
                      </span>
                    </button>
                    ) : null}

                    {isResponsible ? (
                      <>
                    <button
                      type="button"
                      className={`cadastro-level-card cadastro-level-two ${
                        formData.autismLevel === "2"
                          ? "cadastro-level-card-active"
                          : ""
                      }`}
                      aria-pressed={formData.autismLevel === "2"}
                      onClick={() => selectAutismLevel("2")}
                    >
                      <span className="cadastro-level-number">2</span>
                      <span className="cadastro-level-copy">
                        <strong>Nível 2</strong>
                        <small>{isResponsible ? "Autonomia assistida" : "Cadastro pelo responsável"}</small>
                        <p>
                          {isResponsible
                            ? "Responsável gerencia; Minha Rotina funciona no celular da pessoa autista."
                            : "O responsável precisa criar este perfil."}
                        </p>
                      </span>
                    </button>

                    <button
                      type="button"
                      className={`cadastro-level-card cadastro-level-three ${
                        formData.autismLevel === "3"
                          ? "cadastro-level-card-active"
                          : ""
                      }`}
                      aria-pressed={formData.autismLevel === "3"}
                      onClick={() => selectAutismLevel("3")}
                    >
                      <span className="cadastro-level-number">3</span>
                      <span className="cadastro-level-copy">
                        <strong>Nível 3</strong>
                        <small>{isResponsible ? "Maior suporte" : "Cadastro pelo responsável"}</small>
                        <p>
                          {isResponsible
                            ? "Perfil e cuidados gerenciados pelo responsável."
                            : "O responsável precisa criar este perfil."}
                        </p>
                      </span>
                    </button>
                      </>
                    ) : null}
                  </div>
                </section>

                {isResponsibleLevelTwo ? (
                  <section className="cadastro-meu-dia-info">
                    <div className="cadastro-meu-dia-header">
                      <span className="cadastro-meu-dia-icon">✦</span>
                      <div>
                        <strong>Nível 2: o cadastro fica com o responsável</strong>
                        <p>
                          A pessoa autista não precisa criar outra conta completa.
                          Depois, você libera a Minha Rotina no celular dela.
                        </p>
                      </div>
                    </div>

                    <div className="cadastro-access-steps">
                      <article>
                        <span>1</span>
                        <div>
                          <strong>Você cadastra</strong>
                          <p>Medicamentos, consultas e informações da pessoa autista.</p>
                        </div>
                      </article>

                      <article>
                        <span>2</span>
                        <div>
                          <strong>CareTEA gera o acesso</strong>
                          <p>Um link, código ou QR Code será criado para acessar a Minha Rotina.</p>
                        </div>
                      </article>

                      <article>
                        <span>3</span>
                        <div>
                          <strong>Abra no celular dela</strong>
                          <p>O celular mostra somente a interface simplificada Minha Rotina.</p>
                        </div>
                      </article>
                    </div>

                    <div className="cadastro-assisted-features">
                      <span>💊 Medicamentos</span>
                      <span>📅 Consultas</span>
                      <span>😊 Como estou</span>
                      <span>✦ Care</span>
                      <span>♡ Preciso de ajuda</span>
                    </div>
                  </section>
                ) : null}

                {formData.autismLevel ? (
                  <section className="cadastro-form-section cadastro-data-section">
                    <div className="cadastro-section-heading">
                      <span className="cadastro-step-number">3</span>
                      <div>
                        <strong>
                          {isResponsible ? "Dados do responsável" : "Seus dados"}
                        </strong>
                        <p>
                          {isResponsible
                            ? "Estas informações serão usadas para sua conta principal."
                            : "Estas informações serão usadas para sua conta no CareTEA."}
                        </p>
                      </div>
                    </div>

                    <div className="cadastro-fields-grid cadastro-fields-grid-two">
                      <div className="cadastro-form-group">
                        <label htmlFor="fullName">
                          {isResponsible
                            ? "Nome completo do responsável"
                            : "Seu nome completo"}
                        </label>
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          autoComplete="name"
                          placeholder={
                            isResponsible ? "Nome do responsável" : "Seu nome completo"
                          }
                          value={formData.fullName}
                          onChange={updateField}
                        />
                      </div>

                      <div className="cadastro-form-group">
                        <label htmlFor="registerEmail">E-mail da conta</label>
                        <input
                          id="registerEmail"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={updateField}
                        />
                      </div>

                      <div className="cadastro-form-group cadastro-field-full">
                        <label htmlFor="whatsapp">
                          {isResponsible ? "WhatsApp do responsável" : "Seu WhatsApp"}
                        </label>
                        <input
                          id="whatsapp"
                          name="whatsapp"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          maxLength="15"
                          placeholder="(51) 99999-9999"
                          value={formData.whatsapp}
                          onChange={updateField}
                        />
                        <small className="cadastro-field-help">
                          {isResponsible
                            ? "Usaremos este número para avisos e confirmações dos cuidados."
                            : "Usaremos este número para seus lembretes do CareTEA."}
                        </small>
                      </div>
                    </div>
                  </section>
                ) : null}

                {isResponsible && formData.autismLevel ? (
                  <section className="cadastro-form-section cadastro-data-section">
                    <div className="cadastro-section-heading">
                      <span className="cadastro-step-number">4</span>
                      <div>
                        <strong>Dados da pessoa autista</strong>
                        <p>
                          Este é o perfil que você administrará dentro do CareTEA.
                        </p>
                      </div>
                    </div>

                    <div className="cadastro-fields-grid cadastro-fields-grid-two">
                      <div className="cadastro-form-group">
                        <label htmlFor="autisticPersonName">Nome completo</label>
                        <input
                          id="autisticPersonName"
                          name="autisticPersonName"
                          type="text"
                          placeholder="Nome da pessoa autista"
                          value={formData.autisticPersonName}
                          onChange={updateField}
                        />
                      </div>

                      <div className="cadastro-form-group">
                        <label htmlFor="relationship">Seu vínculo</label>
                        <select
                          id="relationship"
                          name="relationship"
                          value={formData.relationship}
                          onChange={updateField}
                        >
                          <option value="">Selecione o vínculo...</option>
                          <option value="mae">Mãe</option>
                          <option value="pai">Pai</option>
                          <option value="tutor">Tutor legal</option>
                          <option value="cuidador">Cuidador responsável</option>
                          <option value="outro">Outro</option>
                        </select>
                      </div>
                    </div>

                    {isResponsibleLevelTwo ? (
                      <div className="cadastro-access-reminder">
                        <span>📱</span>
                        <p>
                          Ao finalizar o cadastro, o próximo passo será gerar o acesso
                          <strong> Minha Rotina</strong> para o celular da pessoa autista.
                        </p>
                      </div>
                    ) : null}
                  </section>
                ) : null}

                {isAutisticLevelOne ? (
                  <section className="cadastro-form-section cadastro-data-section">
                    <div className="cadastro-section-heading">
                      <span className="cadastro-step-number">4</span>
                      <div>
                        <strong>Contato de confiança</strong>
                        <p>Opcional. Você decide se quer compartilhar alguns avisos.</p>
                      </div>
                    </div>

                    <div className="cadastro-form-group">
                      <label htmlFor="trustedWhatsapp">WhatsApp do contato</label>
                      <input
                        id="trustedWhatsapp"
                        name="trustedWhatsapp"
                        type="tel"
                        inputMode="tel"
                        maxLength="15"
                        placeholder="(51) 99999-9999"
                        value={formData.trustedWhatsapp}
                        onChange={updateField}
                      />
                    </div>

                    {formData.trustedWhatsapp ? (
                      <div className="cadastro-notification-options">
                        <label className="cadastro-notification-option">
                          <input
                            type="checkbox"
                            name="notifyMedication"
                            checked={formData.notifyMedication}
                            onChange={updateField}
                          />
                          <span>
                            <strong>Medicamentos</strong>
                            <small>Avisar quando eu confirmar que tomei.</small>
                          </span>
                        </label>

                        <label className="cadastro-notification-option">
                          <input
                            type="checkbox"
                            name="notifyAppointments"
                            checked={formData.notifyAppointments}
                            onChange={updateField}
                          />
                          <span>
                            <strong>Consultas</strong>
                            <small>Compartilhar lembretes de consultas.</small>
                          </span>
                        </label>
                      </div>
                    ) : null}
                  </section>
                ) : null}

                {formData.autismLevel ? (
                  <section className="cadastro-form-section cadastro-data-section">
                    <div className="cadastro-section-heading">
                      <span className="cadastro-step-number">
                        {isResponsible || isAutisticLevelOne ? "5" : "4"}
                      </span>
                      <div>
                        <strong>Crie sua senha</strong>
                        <p>Essa senha é da conta principal do CareTEA.</p>
                      </div>
                    </div>

                    <div className="cadastro-fields-grid cadastro-fields-grid-two">
                      <div className="cadastro-form-group">
                        <label htmlFor="registerPassword">Senha</label>
                        <div className="cadastro-password-box">
                          <input
                            id="registerPassword"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="Mínimo de 6 caracteres"
                            value={formData.password}
                            onChange={updateField}
                          />
                          <button
                            type="button"
                            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                            onClick={() => setShowPassword((current) => !current)}
                          >
                            <EyeIcon closed={showPassword} />
                          </button>
                        </div>
                      </div>

                      <div className="cadastro-form-group">
                        <label htmlFor="confirmPassword">Confirmar senha</label>
                        <div className="cadastro-password-box">
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="Digite a senha novamente"
                            value={formData.confirmPassword}
                            onChange={updateField}
                          />
                          <button
                            type="button"
                            aria-label={
                              showConfirmPassword
                                ? "Ocultar confirmação da senha"
                                : "Mostrar confirmação da senha"
                            }
                            onClick={() =>
                              setShowConfirmPassword((current) => !current)
                            }
                          >
                            <EyeIcon closed={showConfirmPassword} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <label className="cadastro-terms">
                      <input
                        name="acceptedTerms"
                        type="checkbox"
                        checked={formData.acceptedTerms}
                        onChange={updateField}
                      />
                      <span className="cadastro-checkbox">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="m5 12 4 4 10-10" />
                        </svg>
                      </span>
                      <span>
                        Li e concordo com os{" "}
                        <a href="#termos-de-uso">Termos de Uso</a> e{" "}
                        <a href="#politica-de-privacidade">Política de Privacidade</a>.
                      </span>
                    </label>

                    <button
                      className="cadastro-submit-button"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="6" y="10" width="12" height="10" rx="2" />
                        <path d="M9 10V7a3 3 0 0 1 6 0v3" />
                      </svg>
                      {isSubmitting ? "Finalizando..." : "Finalizar Cadastro"}
                    </button>

                    <button
                      className="cadastro-google-button"
                      type="button"
                      onClick={handleGoogleRegister}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fill="#4285F4"
                          d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4Z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2.1 1-3.4 1-2.6 0-4.8-1.8-5.6-4.2H3v2.6A10 10 0 0 0 12 22Z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M6.4 13.9A6 6 0 0 1 6.1 12c0-.7.1-1.3.3-1.9V7.5H3A10 10 0 0 0 2 12c0 1.6.4 3.1 1 4.5l3.4-2.6Z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A9.6 9.6 0 0 0 12 2a10 10 0 0 0-9 5.5l3.4 2.6C7.2 7.7 9.4 6 12 6Z"
                        />
                      </svg>
                      <span>ou continue com Google</span>
                    </button>

                    <div className="cadastro-login-link">
                      <span>Já possui uma conta?</span>
                      <Link to="/login" replace>
                        Entre
                      </Link>
                    </div>

                    <p
                      className={`cadastro-form-message ${
                        message.type === "success"
                          ? "cadastro-form-message-success"
                          : ""
                      }`}
                      aria-live="polite"
                    >
                      {message.text}
                    </p>
                  </section>
                ) : (
                  <p className="cadastro-select-level-message">
                    Selecione o nível de suporte para continuar o cadastro.
                  </p>
                )}
              </form>
            </section>
          </section>
        </section>

        <Footer />
      </main>
    </div>
  );
}

export default Cadastro;
