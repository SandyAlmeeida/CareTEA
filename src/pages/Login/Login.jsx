import { useRef, useState } from "react";
import logoCaretea from "../../assets/logo-caretea.png";
import familiaCaretea from "../../assets/familia-caretea.png";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import PuzzleStrip from "../../components/PuzzleStrip/PuzzleStrip";
import FormsPresentation from "../../components/FormsPresentation/FormsPresentation";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login({
  onLogin,
  onForgotPassword,
  onGoogleLogin,
  onRegister,
}) {

  const navigate = useNavigate();

  const passwordInputRef = useRef(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  function updateField(event) {
    const { name, value, checked, type } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (message.text) {
      setMessage({ text: "", type: "" });
    }
  }

  function togglePasswordVisibility() {
    setShowPassword((current) => !current);
    requestAnimationFrame(() => passwordInputRef.current?.focus());
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      setMessage({ text: "Preencha o e-mail e a senha.", type: "error" });
      return;
    }

    if (!EMAIL_PATTERN.test(email)) {
      setMessage({
        text: "Digite um endereço de e-mail válido.",
        type: "error",
      });
      return;
    }

    if (password.length < 6) {
      setMessage({
        text: "A senha deve possuir pelo menos 6 caracteres.",
        type: "error",
      });
      passwordInputRef.current?.focus();
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage({ text: "", type: "" });

      await onLogin?.({
        email,
        password,
        remember: formData.remember,
      });

      navigate("/painel")

      setMessage({
        text: "Login validado. Agora conecte o formulário ao backend.",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      setMessage({
        text: "Não foi possível entrar. Tente novamente.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleAuxiliaryAction(callback, fallbackMessage) {
    if (callback) {
      callback();
      return;
    }

    setMessage({ text: fallbackMessage, type: "success" });
  }

  return (
    <div className="caretea-login-page">
      <main className="page-shell">
        <svg
          className="decorative-puzzle puzzle-blue"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <path d="M10 20a8 8 0 0 1 8-8h24c-2 4-2 8 0 12 3 7 12 9 18 5 6-3 8-11 5-17h17a8 8 0 0 1 8 8v22c-7-3-15 0-18 6-3 7 0 15 7 18 4 2 8 2 11 0v16a8 8 0 0 1-8 8H60c3-7 0-15-7-18-7-3-15 0-18 7-2 4-2 8 0 11H18a8 8 0 0 1-8-8V60c7 3 15 0 18-7 3-7 0-15-7-18-4-2-8-2-11 0V20Z" />
        </svg>

        <svg
          className="decorative-puzzle puzzle-yellow"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <path d="M10 20a8 8 0 0 1 8-8h24c-2 4-2 8 0 12 3 7 12 9 18 5 6-3 8-11 5-17h17a8 8 0 0 1 8 8v22c-7-3-15 0-18 6-3 7 0 15 7 18 4 2 8 2 11 0v16a8 8 0 0 1-8 8H60c3-7 0-15-7-18-7-3-15 0-18 7-2 4-2 8 0 11H18a8 8 0 0 1-8-8V60c7 3 15 0 18-7 3-7 0-15-7-18-4-2-8-2-11 0V20Z" />
        </svg>

        <section className="content-grid">
          <FormsPresentation descricao={"Uma plataforma completa para apoiar pessoas autistas e seus responsáveis em todas as etapas do cuidado."} />

          <section className="login-side">
            <aside className="inclusion-note">
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

            <section className="login-card" aria-labelledby="login-title">
              <header className="login-header">
                <h2 id="login-title">
                  Bem-vindo <span>de volta!</span>
                </h2>
                <p>Entre para acessar sua conta.</p>
              </header>

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="email">E-mail</label>
                  <div className="input-box">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={updateField}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password">Senha</label>
                  <div className="input-box">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="5" y="10" width="14" height="10" rx="2" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2" />
                    </svg>

                    <input
                      ref={passwordInputRef}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Digite sua senha"
                      value={formData.password}
                      onChange={updateField}
                    />

                    <button
                      className={`password-toggle ${showPassword ? "visible" : ""}`}
                      type="button"
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      onClick={togglePasswordVisibility}
                    >
                      <svg
                        className="eye-open"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                        <circle cx="12" cy="12" r="2.7" />
                      </svg>
                      <svg
                        className="eye-closed"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="m3 3 18 18M10.6 6.2A9 9 0 0 1 12 6c6 0 9.5 6 9.5 6a15 15 0 0 1-2.2 2.8M6.2 6.2C3.8 8 2.5 12 2.5 12s3.5 6 9.5 6a10 10 0 0 0 3.2-.5" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="remember">
                    <input
                      name="remember"
                      type="checkbox"
                      checked={formData.remember}
                      onChange={updateField}
                    />
                    <span className="checkbox">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m5 12 4 4 10-10" />
                      </svg>
                    </span>
                    <span>Lembrar de mim</span>
                  </label>

                  <Link to="/reset-password">
                    <button className="text-button" type="button">Esqueci minha senha</button>
                  </Link>
                </div>

                <button
                  className="login-button"
                  type="submit"
                  disabled={isSubmitting}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="6" y="10" width="12" height="10" rx="2" />
                    <path d="M9 10V7a3 3 0 0 1 6 0v3" />
                  </svg>
                  {isSubmitting ? "Entrando..." : "Entrar"}
                </button>

                <div className="separator">
                  <span />
                  <p>ou continue com</p>
                  <span />
                </div>

                <button
                  className="google-button"
                  type="button"
                  onClick={() =>
                    handleAuxiliaryAction(
                      onGoogleLogin,
                      "Aqui será adicionada a autenticação do Google.",
                    )
                  }
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
                  Entrar com Google
                </button>

                <div className="register">
                  <span>Ainda não possui uma conta?</span>
                  <Link to="/cadastro" replace>
                    <button type="button">Cadastre-se</button>
                </Link>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                </div>

                <p
                  className={`form-message ${message.type === "success" ? "success" : ""}`}
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

export default Login;
