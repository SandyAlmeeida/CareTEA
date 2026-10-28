import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import PerfilAvatar from "../PerfilAvatar/PerfilAvatar.jsx";
import ModalNotificacoes from "../ModalNotificacoes/ModalNotificacoes.jsx";
import ModalPerfil from "../ModalPerfil/ModalPerfil.jsx";

import {
  getCareteaProfile,
  getCareteaSession,
  clearCareteaSession,
} from "../../utils/careteaSession.js";

import "./Topbar.css";

const API_URL =
  "http://localhost:8080";

const routeMap = {
  dashboard: "/dashboard",
  agenda: "/agenda",
  medicamentos: "/medicamentos",
  consultas: "/consultas",
  "bem-estar": "/bem-estar",
  "gerenciar-meu-dia":
    "/gerenciar-meu-dia",
  assistente: "/assistente",
  notificacoes: "/notificacoes",
  documentos: "/documentos",
  relatorios: "/relatorios",
  configuracoes: "/configuracoes",
};

function Topbar({
  title,
  subtitle =
    "Vamos juntos tornar o dia de hoje mais leve e organizado.",
  notifications = 0,
  onLogout,
}) {
  const navigate =
    useNavigate();

  const profile =
    getCareteaProfile();

  const session =
    getCareteaSession();

  const userName =
    profile?.userName ||
    session?.userName ||
    "Usuário";

  const userLevel =
    profile?.userLevel || "";

  const accountType =
    profile?.accountType ||
    session?.accountType;

  const autismLevel =
    profile?.autismLevel ??
    session?.autismLevel;

  const profileId =
    session?.profileId;

  const token =
    session?.token;

  const [
    notificacoesAbertas,
    setNotificacoesAbertas,
  ] = useState(false);

  const [
    perfilAberto,
    setPerfilAberto,
  ] = useState(false);

  const [
    quantidadeNotificacoes,
    setQuantidadeNotificacoes,
  ] = useState(notifications);

  const [
    pedidosAjuda,
    setPedidosAjuda,
  ] = useState([]);

  const resolvedTitle =
    title ||
    `Olá, ${userName}! 👋`;

  const responsavelNivel2 =
    accountType === "responsavel" &&
    Number(autismLevel) === 2;

  useEffect(() => {
    if (!responsavelNivel2) {
      return;
    }

    if (
      !token ||
      !profileId
    ) {
      return;
    }

    let ativo = true;

    async function carregarPedidosAjuda() {
      try {
        const response =
          await fetch(
            `${API_URL}/responsavel/meu-dia/ajuda/pendentes?pessoaAutistaId=${profileId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            },
          );

        if (!response.ok) {
          return;
        }

        const data =
          await response.json();

        if (
          !ativo ||
          !Array.isArray(data)
        ) {
          return;
        }

        setPedidosAjuda(data);

        /*
         * Para responsável nível 2,
         * o número do sininho passa
         * a refletir os pedidos de
         * ajuda reais.
         */
        setQuantidadeNotificacoes(
          data.length,
        );
      } catch {
        /*
         * Não derruba a página caso
         * a consulta de notificações
         * falhe.
         */
      }
    }

    carregarPedidosAjuda();

    return () => {
      ativo = false;
    };
  }, [
    responsavelNivel2,
    token,
    profileId,
  ]);

  function navegar(id) {
    setPerfilAberto(false);

    setNotificacoesAbertas(
      false,
    );

    const path =
      routeMap[id];

    if (path) {
      navigate(path);
    }
  }

  function sair() {
    clearCareteaSession();

    if (onLogout) {
      onLogout();
      return;
    }

    navigate("/login");
  }

  function abrirNotificacoes() {
    setPerfilAberto(false);

    setNotificacoesAbertas(
      (aberto) => !aberto,
    );
  }

  function abrirPerfil() {
    setNotificacoesAbertas(
      false,
    );

    setPerfilAberto(
      (aberto) => !aberto,
    );
  }

  return (
    <>
      <header className="app-topbar">
        <div className="app-topbar-heading">
          <h1>
            {resolvedTitle}
          </h1>

          <p>
            {subtitle}
          </p>
        </div>

        <div className="app-topbar-actions">
          <button
            className="app-notification-button"
            type="button"
            aria-label="Notificações"
            aria-expanded={
              notificacoesAbertas
            }
            onClick={
              abrirNotificacoes
            }
          >
            <span className="app-notification-icon">
              ♢
            </span>

            {quantidadeNotificacoes >
              0 && (
              <span className="app-notification-badge">
                {
                  quantidadeNotificacoes
                }
              </span>
            )}
          </button>

          <button
            className="app-profile-button"
            type="button"
            aria-label="Abrir menu do perfil"
            aria-expanded={
              perfilAberto
            }
            onClick={
              abrirPerfil
            }
          >
            <PerfilAvatar />

            <span className="app-profile-copy">
              <strong>
                {userName}
              </strong>

              {userLevel && (
                <small>
                  {userLevel}
                </small>
              )}
            </span>

            <span className="app-profile-arrow">
              {perfilAberto
                ? "⌃"
                : "⌄"}
            </span>
          </button>

          {onLogout && (
            <button
              className="app-logout-button"
              type="button"
              onClick={sair}
            >
              Sair
            </button>
          )}
        </div>
      </header>

      <ModalNotificacoes
        aberto={
          notificacoesAbertas
        }
        onClose={() =>
          setNotificacoesAbertas(
            false,
          )
        }
        onQuantidadeAlterada={
          setQuantidadeNotificacoes
        }
        onVerTodas={() =>
          navegar(
            "notificacoes",
          )
        }
        pedidosAjuda={
          pedidosAjuda
        }
      />

      <ModalPerfil
        aberto={perfilAberto}
        onClose={() =>
          setPerfilAberto(
            false,
          )
        }
        onNavigate={navegar}
        onLogout={sair}
      />
    </>
  );
}

export default Topbar;