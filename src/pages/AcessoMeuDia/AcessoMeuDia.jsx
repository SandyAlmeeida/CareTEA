import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import logoCaretea from "../../assets/logo-caretea.png";
import Footer from "../../components/Footer/Footer";
import "./AcessoMeuDia.css";

function AcessoMeuDia() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const codigoDoLink = useMemo(
    () => (searchParams.get("codigo") || "").toUpperCase(),
    [searchParams],
  );

  const [codigo, setCodigo] = useState(codigoDoLink);
  const [message, setMessage] = useState("");

  function atualizarCodigo(event) {
    const valor = event.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 8);

    setCodigo(valor);
    setMessage("");
  }

  function acessarMeuDia(event) {
    event.preventDefault();

    if (codigo.length < 4) {
      setMessage("Digite o código compartilhado pelo responsável.");
      return;
    }

    navigate("/meu-dia");
  }

  function abrirLeitorQr() {
    setMessage(
      "O leitor de QR Code será ativado quando conectarmos esta tela ao backend e à câmera.",
    );
  }

  return (
    <div className="acesso-meu-dia-page">
      <main className="acesso-meu-dia-main">
        <Link className="acesso-meu-dia-logo-link" to="/">
          <img src={logoCaretea} alt="CareTEA" />
        </Link>

        <section className="acesso-meu-dia-card">
          <div className="acesso-meu-dia-color-line" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="acesso-meu-dia-phone" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
              <path d="M10 18.5h4" />
              <path d="M9.5 7.5h5M9.5 11h5M9.5 14.5h3" />
            </svg>
          </div>

          <span className="acesso-meu-dia-label">Acesso simplificado</span>
          <h1>Acessar Minha Rotina</h1>
          <p className="acesso-meu-dia-description">
            Digite o código enviado pelo seu responsável para acessar sua rotina,
            medicamentos, consultas, bem-estar e a Care.
          </p>

          <form onSubmit={acessarMeuDia}>
            <label htmlFor="codigoMeuDia">Código de acesso</label>

            <input
              id="codigoMeuDia"
              name="codigoMeuDia"
              type="text"
              inputMode="text"
              autoComplete="one-time-code"
              maxLength="8"
              placeholder="Ex.: C4R3T3A"
              value={codigo}
              onChange={atualizarCodigo}
            />

            <button className="acesso-meu-dia-primary" type="submit">
              Entrar na Minha Rotina
            </button>
          </form>

          <div className="acesso-meu-dia-or">
            <span />
            <p>ou</p>
            <span />
          </div>

          <button
            className="acesso-meu-dia-qr"
            type="button"
            onClick={abrirLeitorQr}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" />
              <path d="M14 14h2v2h-2zM18 14h2v6h-6v-2M16 18h2" />
            </svg>
            Escanear QR Code
          </button>

          {message && (
            <p className="acesso-meu-dia-message" aria-live="polite">
              {message}
            </p>
          )}

          <div className="acesso-meu-dia-help">
            <strong>Quem cria esse acesso?</strong>
            <p>
              O responsável configura o perfil Nível 2 e compartilha um link,
              código ou QR Code para este celular.
            </p>
          </div>

          <Link className="acesso-meu-dia-back" to="/login">
            ← Voltar para o login
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AcessoMeuDia;
