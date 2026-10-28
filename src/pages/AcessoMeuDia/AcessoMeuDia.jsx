import { useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import logoCaretea from "../../assets/logo-caretea.png";
import Footer from "../../components/Footer/Footer";

import {
  setMeuDiaSession,
} from "../../utils/meuDiaSession.js";

import "./AcessoMeuDia.css";

const API_URL = "http://localhost:8080";

function AcessoMeuDia() {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const codigoDoLink = useMemo(
    () =>
      (searchParams.get("codigo") || "")
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 6),
    [searchParams],
  );

  const [codigo, setCodigo] =
    useState(codigoDoLink);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  function atualizarCodigo(event) {
    const valor =
      event.target.value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 6);

    setCodigo(valor);
    setMessage("");
  }

  async function readError(response) {
    try {
      const data =
        await response.json();

      return (
        data?.message ||
        data?.error ||
        "Não foi possível acessar o Meu Dia."
      );
    } catch {
      return "Não foi possível acessar o Meu Dia.";
    }
  }

  async function acessarMeuDia(
    event,
  ) {
    event.preventDefault();

    if (codigo.length !== 6) {
      setMessage(
        "Digite o código de 6 caracteres enviado pelo responsável.",
      );

      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/acesso-meu-dia/entrar`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            codigo,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          await readError(response),
        );
      }

      const data =
        await response.json();

      if (!data?.token) {
        throw new Error(
          "O CareTEA não retornou uma sessão válida.",
        );
      }

      setMeuDiaSession(data);

      navigate(
        "/meu-dia",
        {
          replace: true,
        },
      );
    } catch (error) {
      setMessage(
        error.message ||
          "Não foi possível acessar o Meu Dia.",
      );
    } finally {
      setLoading(false);
    }
  }

  function abrirLeitorQr() {
    setMessage(
      "Use a câmera do celular para escanear o QR Code enviado pelo responsável. O link abrirá esta tela com o código preenchido automaticamente.",
    );
  }

  return (
    <div className="acesso-meu-dia-page">
      <main className="acesso-meu-dia-main">
        <Link
          className="acesso-meu-dia-logo-link"
          to="/"
        >
          <img
            src={logoCaretea}
            alt="CareTEA"
          />
        </Link>

        <section className="acesso-meu-dia-card">
          <div
            className="acesso-meu-dia-color-line"
            aria-hidden="true"
          >
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <div
            className="acesso-meu-dia-phone"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24">
              <rect
                x="7"
                y="2.5"
                width="10"
                height="19"
                rx="2.5"
              />

              <path d="M10 18.5h4" />

              <path d="M9.5 7.5h5M9.5 11h5M9.5 14.5h3" />
            </svg>
          </div>

          <span className="acesso-meu-dia-label">
            Acesso simplificado
          </span>

          <h1>
            Acessar Meu Dia
          </h1>

          <p className="acesso-meu-dia-description">
            Digite o código enviado pelo seu
            responsável para abrir seu painel
            com medicamentos, consultas,
            bem-estar e a Care.
          </p>

          <form
            onSubmit={acessarMeuDia}
          >
            <label htmlFor="codigoMeuDia">
              Código de acesso
            </label>

            <input
              id="codigoMeuDia"
              name="codigoMeuDia"
              type="text"
              inputMode="text"
              autoComplete="one-time-code"
              maxLength="6"
              placeholder="Ex.: C4R3T3"
              value={codigo}
              onChange={atualizarCodigo}
              disabled={loading}
            />

            <button
              className="acesso-meu-dia-primary"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Entrando..."
                : "Entrar no Meu Dia"}
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
            disabled={loading}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" />

              <path d="M14 14h2v2h-2zM18 14h2v6h-6v-2M16 18h2" />
            </svg>

            Escanear QR Code
          </button>

          {message && (
            <p
              className="acesso-meu-dia-message"
              aria-live="polite"
            >
              {message}
            </p>
          )}

          <div className="acesso-meu-dia-help">
            <strong>
              Quem cria esse acesso?
            </strong>

            <p>
              O responsável configura o
              perfil Nível 2 e compartilha
              um link, código ou QR Code
              para este celular.
            </p>
          </div>

          <Link
            className="acesso-meu-dia-back"
            to="/login"
          >
            ← Voltar para o login
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AcessoMeuDia;