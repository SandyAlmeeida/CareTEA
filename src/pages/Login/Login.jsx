import { useRef, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import FormsPresentation from "../../components/FormsPresentation/FormsPresentation";
import CoracaoCareTEA from "../../assets/imagens/coracao_careTEA.svg?react";
import Mail from "../../assets/icons/envelope-simple.svg?react";
import Lock from "../../assets/icons/lock.svg?react";
import EyeOpen from "../../assets/icons/eye.svg?react";
import EyeClosed from "../../assets/icons/eye-slash.svg?react";
import LockSimple from "../../assets/icons/lock-simple.svg?react";
import Google from "../../assets/icons/google-logo.svg?react";

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
              <img src={CoracaoCareTEA} />
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
                    <img src={Mail} />
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
                    <img src={Lock} />
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
                      <img className="eye-open" src={EyeOpen} />
                      <img className="eye-closed" src={EyeClosed} />
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
                  <img src={LockSimple} />
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
                  <img src={Google} />
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
