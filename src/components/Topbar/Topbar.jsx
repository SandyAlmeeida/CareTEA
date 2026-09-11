
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PerfilAvatar from "../PerfilAvatar/PerfilAvatar.jsx";
import ModalNotificacoes from "../ModalNotificacoes/ModalNotificacoes.jsx";
import ModalPerfil from "../ModalPerfil/ModalPerfil.jsx";

import {
  getCareteaProfile,
  clearCareteaSession,
} from "../../utils/careteaSession.js";

import "./Topbar.css";

const routeMap = {
  dashboard: "/dashboard",
  agenda: "/agenda",
  medicamentos: "/medicamentos",
  consultas: "/consultas",
  "bem-estar": "/bem-estar",
  "gerenciar-meu-dia": "/gerenciar-meu-dia",
  assistente: "/assistente",
  notificacoes: "/notificacoes",
  documentos: "/documentos",
  relatorios: "/relatorios",
  configuracoes: "/configuracoes",
};

function Topbar({
  title,
  subtitle = "Vamos juntos tornar o dia de hoje mais leve e organizado.",
  notifications = 3,
  onLogout,
}) {
  const navigate = useNavigate();

  const profile = getCareteaProfile();

  const userName = profile?.userName || "Usuário";
  const userLevel = profile?.userLevel || "";

  const [notificacoesAbertas, setNotificacoesAbertas] =
    useState(false);

  const [perfilAberto, setPerfilAberto] =
    useState(false);

  const [
    quantidadeNotificacoes,
    setQuantidadeNotificacoes,
  ] = useState(notifications);

  const resolvedTitle =
    title || `Olá, ${userName}! 👋`;

  function navegar(id) {
    setPerfilAberto(false);
    setNotificacoesAbertas(false);

    const path = routeMap[id];

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
    setNotificacoesAbertas(false);

    setPerfilAberto(
      (aberto) => !aberto,
    );
  }

  return (
    <>
      <header className="app-topbar">
        <div className="app-topbar-heading">
          <h1>{resolvedTitle}</h1>
          <p>{subtitle}</p>
        </div>

        <div className="app-topbar-actions">
          <button
            className="app-notification-button"
            type="button"
            aria-label="Notificações"
            aria-expanded={notificacoesAbertas}
            onClick={abrirNotificacoes}
          >
            <span className="app-notification-icon">
              ♢
            </span>

            {quantidadeNotificacoes > 0 && (
              <span className="app-notification-badge">
                {quantidadeNotificacoes}
              </span>
            )}
          </button>

          <button
            className="app-profile-button"
            type="button"
            aria-label="Abrir menu do perfil"
            aria-expanded={perfilAberto}
            onClick={abrirPerfil}
          >
            <PerfilAvatar />

            <span className="app-profile-copy">
              <strong>{userName}</strong>

              {userLevel && (
                <small>{userLevel}</small>
              )}
            </span>

            <span className="app-profile-arrow">
              {perfilAberto ? "⌃" : "⌄"}
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
        aberto={notificacoesAbertas}
        onClose={() =>
          setNotificacoesAbertas(false)
        }
        onQuantidadeAlterada={
          setQuantidadeNotificacoes
        }
        onVerTodas={() =>
          navegar("notificacoes")
        }
      />

      <ModalPerfil
        aberto={perfilAberto}
        onClose={() =>
          setPerfilAberto(false)
        }
        onNavigate={navegar}
        onLogout={sair}
      />
    </>
  );
}

export default Topbar;