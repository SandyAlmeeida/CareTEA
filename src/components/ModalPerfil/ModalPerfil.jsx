import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PerfilAvatar from "../PerfilAvatar/PerfilAvatar.jsx";

import {
  getCareteaProfile,
  clearCareteaSession,
} from "../../utils/careteaSession.js";

import "./ModalPerfil.css";

const routeMap = {
  "gerenciar-meu-dia": "/gerenciar-meu-dia",
  "bem-estar": "/bem-estar",
  configuracoes: "/configuracoes",
};

function ModalPerfil({
  aberto,
  onClose,
  onNavigate,
  onLogout,
}) {
  const navigate = useNavigate();

  const profile = getCareteaProfile();

  const userName =
    profile?.userName || "Usuário";

  const profileName =
    profile?.profileName;

  const accountType =
    profile?.accountType;

  const autismLevel =
    profile?.autismLevel;

  const userLevel =
    profile?.userLevel || "";

  const isResponsible =
    accountType === "responsavel";

  useEffect(() => {
    function fecharComEsc(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (aberto) {
      window.addEventListener(
        "keydown",
        fecharComEsc,
      );
    }

    return () => {
      window.removeEventListener(
        "keydown",
        fecharComEsc,
      );
    };
  }, [aberto, onClose]);

  if (!aberto) {
    return null;
  }

  function abrirPagina(id) {
    onClose();

    if (onNavigate) {
      onNavigate(id);
      return;
    }

    const path = routeMap[id];

    if (path) {
      navigate(path);
    }
  }

  function sairDaConta() {
    onClose();

    clearCareteaSession();

    if (onLogout) {
      onLogout();
      return;
    }

    navigate("/login");
  }

  return (
    <>
      <button
        className="profile-modal-backdrop"
        type="button"
        aria-label="Fechar menu do perfil"
        onClick={onClose}
      />

      <section
        className="profile-modal"
        role="dialog"
        aria-label="Menu do perfil"
      >
        <div className="profile-modal-user">
          <PerfilAvatar size="large" />

          <div className="profile-modal-user-copy">
            <strong>
              {userName}
            </strong>

            <span>
              {isResponsible
                ? profileName
                  ? `Responsável por ${profileName}`
                  : "Conta do responsável"
                : "Conta da pessoa autista"}
            </span>

            {userLevel && (
              <small>
                {userLevel}
              </small>
            )}
          </div>
        </div>

        <div className="profile-modal-divider" />

        <div className="profile-modal-actions">
          {isResponsible &&
            autismLevel === 2 && (
              <button
                type="button"
                onClick={() =>
                  abrirPagina(
                    "gerenciar-meu-dia",
                  )
                }
              >
                <span>▦</span>

                <div>
                  <strong>
                    Acesso da Pessoa Autista
                  </strong>

                  <small>
                    Gerenciar acesso assistido
                  </small>
                </div>

                <b>›</b>
              </button>
            )}

          {!isResponsible &&
            autismLevel === 1 && (
              <button
                type="button"
                onClick={() =>
                  abrirPagina(
                    "bem-estar",
                  )
                }
              >
                <span>♡</span>

                <div>
                  <strong>
                    Meu bem-estar
                  </strong>

                  <small>
                    Acompanhar como estou me sentindo
                  </small>
                </div>

                <b>›</b>
              </button>
            )}

          <button
            type="button"
            onClick={() =>
              abrirPagina(
                "configuracoes",
              )
            }
          >
            <span>⚙</span>

            <div>
              <strong>
                Configurações
              </strong>

              <small>
                Conta, preferências e acessibilidade
              </small>
            </div>

            <b>›</b>
          </button>
        </div>

        <div className="profile-modal-divider" />

        <button
          className="profile-modal-logout"
          type="button"
          onClick={sairDaConta}
        >
          <span>↪</span>
          Sair da conta
        </button>
      </section>
    </>
  );
}

export default ModalPerfil;