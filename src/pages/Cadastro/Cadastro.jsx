import { useState } from "react";
import logoCaretea from "../../assets/logo-caretea.png";
import familiaCaretea from "../../assets/familia-caretea.png";
import "./Cadastro.css";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const puzzleColors = [
  "blue",
  "purple",
  "yellow",
  "green",
  "blue",
  "red",
  "purple",
  "green",
  "yellow",
  "blue",
  "green",
  "red",
  "purple",
  "blue",
  "green",
  "yellow",
  "blue",
  "red",
];

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
    responsibleWhatsapp: "",
    relationship: "",
    autismLevel: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      name === "whatsapp" || name === "responsibleWhatsapp"
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
      autisticPersonName:
        accountType === "responsavel" ? current.autisticPersonName : "",
      relationship:
        accountType === "responsavel" ? current.relationship : "",
      responsibleWhatsapp:
        accountType === "autista" ? current.responsibleWhatsapp : "",
      autismLevel:
        accountType === "autista" && current.autismLevel === "3"
          ? ""
          : current.autismLevel,
    }));

    clearMessage();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const fullName = formData.fullName.trim();
    const autisticPersonName = formData.autisticPersonName.trim();
    const email = formData.email.trim();

    if (fullName.length < 3) {
      setMessage({
        text:
          formData.accountType === "responsavel"
            ? "Digite o nome completo do responsável."
            : "Digite seu nome completo.",
        type: "error",
      });
      return;
    }

    if (
      formData.accountType === "responsavel" &&
      autisticPersonName.length < 3
    ) {
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
        text:
          formData.accountType === "responsavel"
            ? "Digite um WhatsApp válido do responsável."
            : "Digite um WhatsApp válido para receber as notificações.",
        type: "error",
      });
      return;
    }

    if (
      formData.accountType === "autista" &&
      formData.responsibleWhatsapp &&
      !whatsappIsValid(formData.responsibleWhatsapp)
    ) {
      setMessage({
        text: "Digite um WhatsApp válido do responsável ou deixe o campo vazio.",
        type: "error",
      });
      return;
    }

    if (
      formData.accountType === "responsavel" &&
      !formData.relationship
    ) {
      setMessage({
        text: "Informe o vínculo do responsável com a pessoa autista.",
        type: "error",
      });
      return;
    }

    if (!formData.autismLevel) {
      setMessage({
        text: "Selecione o nível de autismo.",
        type: "error",
      });
      return;
    }

    if (formData.accountType === "autista" && formData.autismLevel === "3") {
      setMessage({
        text: "O autista de nível 3 deve ser cadastrado por um responsável.",
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
        autisticPersonName:
          formData.accountType === "responsavel"
            ? autisticPersonName
            : fullName,
        email,
        whatsapp: formData.whatsapp.replace(/\D/g, ""),
        responsibleWhatsapp:
          formData.accountType === "autista" && formData.responsibleWhatsapp
            ? formData.responsibleWhatsapp.replace(/\D/g, "")
            : formData.accountType === "responsavel"
              ? formData.whatsapp.replace(/\D/g, "")
              : null,
        relationship:
          formData.accountType === "responsavel"
            ? formData.relationship
            : null,
        autismLevel: Number(formData.autismLevel),
        password: formData.password,
      });

      setMessage({
        text: "Cadastro validado. Agora conecte o formulário ao backend.",
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
                Crie sua conta para começar a organizar os cuidados, promover a
                autonomia e apoiar a jornada de pessoas autistas e seus
                responsáveis.
              </p>
            </div>

            <div
              className="cadastro-features"
              aria-label="Benefícios da plataforma"
            >
              <article className="cadastro-feature">
                <span className="cadastro-feature-icon cadastro-feature-blue">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
                  </svg>
                </span>
                <p>
                  Cuidado
                  <br />
                  com empatia
                </p>
              </article>

              <article className="cadastro-feature">
                <span className="cadastro-feature-icon cadastro-feature-green">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
                  </svg>
                </span>
                <p>
                  Rotinas e
                  <br />
                  organização
                </p>
              </article>

              <article className="cadastro-feature">
                <span className="cadastro-feature-icon cadastro-feature-yellow">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
                  </svg>
                </span>
                <p>
                  Lembretes
                  <br />
                  inteligentes
                </p>
              </article>

              <article className="cadastro-feature">
                <span className="cadastro-feature-icon cadastro-feature-red">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="9" cy="7" r="4" />
                    <path d="M3 21v-2a6 6 0 0 1 6-6h1" />
                    <circle cx="17" cy="8" r="3" />
                    <path d="M14 14h3a5 5 0 0 1 5 5v2H12v-2a5 5 0 0 1 5-5" />
                  </svg>
                </span>
                <p>
                  Autonomia
                  <br />e inclusão
                </p>
              </article>
            </div>

            <div className="cadastro-illustration-wrap">
              <img
                src={familiaCaretea}
                alt="Responsável ajudando uma criança a utilizar um tablet"
              />
            </div>
          </section>

          <section className="cadastro-form-side">
            <aside className="cadastro-inclusion-note">
              <svg viewBox="0 0 64 64" aria-hidden="true">
                <path
                  fill="#1b78d1"
                  d="M5 7h19v12a7 7 0 1 1 10 6v14H20a7 7 0 1 0-6 10H5V35h10a7 7 0 1 0 0-14H5Z"
                />
                <path
                  fill="#39b86b"
                  d="M32 7h14v10a7 7 0 1 0 10 6V7h3v24H48a7 7 0 1 0-6 10v16H32V44a7 7 0 1 0-10-6H5V32h18a7 7 0 0 0 9-9Z"
                />
                <path
                  fill="#ffbc2e"
                  d="M5 32h14a7 7 0 1 1 6 10v15H5V46h9a7 7 0 1 0-9-7Z"
                />
                <path
                  fill="#ff584e"
                  d="M32 32h11a7 7 0 1 1 7 10v15H32V47a7 7 0 1 0-7-7V32Z"
                />
              </svg>
              <div>
                <strong>Inclusão. Respeito. Compreensão.</strong>
                <span>Juntos, fazemos a diferença. 💙</span>
              </div>
            </aside>

            <section
              className="cadastro-card"
              aria-labelledby="cadastro-title"
            >
              <header className="cadastro-header">
                <h2 id="cadastro-title">Cadastro CareTEA</h2>
                <p>Seja bem-vindo! Quem está criando a conta?</p>
              </header>

              <form onSubmit={handleSubmit} noValidate>
                <div
                  className="cadastro-account-types"
                  aria-label="Tipo de conta"
                >
                  <button
                    className={`cadastro-account-card ${formData.accountType === "responsavel"
                      ? "cadastro-account-card-active"
                      : ""
                      }`}
                    type="button"
                    aria-pressed={formData.accountType === "responsavel"}
                    onClick={() => selectAccountType("responsavel")}
                  >
                    <span className="cadastro-avatar">
                      <ResponsibleAvatar />
                    </span>
                    <strong>Responsável</strong>
                    <small>(Pai, Mãe ou Tutor legal)</small>
                    <p>Cadastre-se para gerenciar os cuidados de uma pessoa autista.</p>
                  </button>

                  <button
                    className={`cadastro-account-card ${formData.accountType === "autista"
                      ? "cadastro-account-card-active"
                      : ""
                      }`}
                    type="button"
                    aria-pressed={formData.accountType === "autista"}
                    onClick={() => selectAccountType("autista")}
                  >
                    <span className="cadastro-avatar">
                      <AutisticAvatar />
                    </span>
                    <strong>Sou Autista</strong>
                    <small>(Nível 1 ou 2)</small>
                    <p>Cadastre-se para gerenciar seus próprios cuidados e autonomia.</p>
                  </button>
                </div>

                <div
                  className={`cadastro-account-guidance ${formData.accountType === "autista"
                    ? "cadastro-account-guidance-autista"
                    : ""
                    }`}
                >
                  <strong>
                    {formData.accountType === "responsavel"
                      ? "Cadastro do responsável"
                      : "Cadastro da própria pessoa autista"}
                  </strong>
                  <p>
                    {formData.accountType === "responsavel"
                      ? "Você administrará o perfil e os cuidados da pessoa autista. As notificações serão enviadas ao WhatsApp do responsável."
                      : "Você administrará sua própria conta. Informe o WhatsApp do responsável somente se precisar que ele também receba as notificações."}
                  </p>
                </div>

                <p className="cadastro-important">
                  *Importante: O autista de Nível 3 deve ser cadastrado por um
                  responsável.
                </p>

                <div className="cadastro-fields-grid cadastro-fields-grid-two">
                  <div className="cadastro-form-group">
                    <label htmlFor="fullName">
                      {formData.accountType === "responsavel"
                        ? "Nome completo do responsável"
                        : "Seu nome completo"}
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      placeholder={
                        formData.accountType === "responsavel"
                          ? "Nome do responsável"
                          : "Seu nome completo"
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
                </div>

                {formData.accountType === "responsavel" ? (
                  <div className="cadastro-fields-grid cadastro-fields-grid-two cadastro-dynamic-fields">
                    <div className="cadastro-form-group">
                      <label htmlFor="autisticPersonName">
                        Nome completo da pessoa autista
                      </label>
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
                      <label htmlFor="relationship">
                        Vínculo com a pessoa autista
                      </label>
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
                ) : null}

                <div className="cadastro-fields-grid cadastro-fields-grid-two cadastro-dynamic-fields">
                  <div className="cadastro-form-group">
                    <label htmlFor="whatsapp">
                      {formData.accountType === "responsavel"
                        ? "WhatsApp do responsável"
                        : "Seu WhatsApp"}
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
                      As notificações do CareTEA serão enviadas para este número.
                    </small>
                  </div>

                  <div className="cadastro-form-group">
                    <label htmlFor="autismLevel">Nível de Autismo</label>
                    <select
                      id="autismLevel"
                      name="autismLevel"
                      value={formData.autismLevel}
                      onChange={updateField}
                    >
                      <option value="">Selecione o nível...</option>
                      <option value="1">Nível 1</option>
                      <option value="2">Nível 2</option>
                      {formData.accountType === "responsavel" && (
                        <option value="3">Nível 3</option>
                      )}
                    </select>
                  </div>
                </div>

                {formData.accountType === "autista" ? (
                  <div className="cadastro-fields-grid cadastro-fields-grid-one cadastro-dynamic-fields">
                    <div className="cadastro-form-group">
                      <label htmlFor="responsibleWhatsapp">
                        WhatsApp do responsável (se necessário)
                      </label>
                      <input
                        id="responsibleWhatsapp"
                        name="responsibleWhatsapp"
                        type="tel"
                        inputMode="tel"
                        maxLength="15"
                        placeholder="(51) 99999-9999"
                        value={formData.responsibleWhatsapp}
                        onChange={updateField}
                      />
                      <small className="cadastro-field-help">
                        Preencha somente se precisar que um responsável também
                        receba as notificações. Este campo é opcional.
                      </small>
                    </div>
                  </div>
                ) : null}

                <div className="cadastro-fields-grid cadastro-fields-grid-two cadastro-dynamic-fields">
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
                        aria-label={
                          showPassword ? "Ocultar senha" : "Mostrar senha"
                        }
                        onClick={() => setShowPassword((current) => !current)}
                      >
                        <EyeIcon closed={showPassword} />
                      </button>
                    </div>
                  </div>

                  <div className="cadastro-form-group">
                    <label htmlFor="confirmPassword">Confirmar Senha</label>
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
                    <a href="#politica-de-privacidade">
                      Política de Privacidade
                    </a>
                    .
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
                    <button type="button">Entre</button>
                  </Link>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                </div>

                <p
                  className={`cadastro-form-message ${message.type === "success"
                    ? "cadastro-form-message-success"
                    : ""
                    }`}
                  aria-live="polite"
                >
                  {message.text}
                </p>
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