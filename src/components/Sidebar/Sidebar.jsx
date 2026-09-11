import { useLocation, useNavigate } from "react-router-dom";
import logoCaretea from "../../assets/logo-caretea.png";

import {
  getCareteaProfile,
  clearCareteaSession,
} from "../../utils/careteaSession.js";

import "./Sidebar.css";

const menuItems = [
  {
    id: "dashboard",
    path: "/dashboard",
    icon: "⌂",
    label: "Dashboard",
  },
  {
    id: "agenda",
    path: "/agenda",
    icon: "▣",
    label: "Agenda",
  },
  {
    id: "medicamentos",
    path: "/medicamentos",
    icon: "◊",
    label: "Medicamentos",
  },
  {
    id: "consultas",
    path: "/consultas",
    icon: "♧",
    label: "Consultas",
  },
  {
    id: "bem-estar",
    path: "/bem-estar",
    icon: "♡",
    label: "Bem-estar",
    onlyFor: "autista-nivel-1",
  },
  {
    id: "gerenciar-meu-dia",
    path: "/gerenciar-meu-dia",
    icon: "▦",
    label: "Acesso da Pessoa Autista",
    onlyFor: "responsavel-nivel-2",
  },
  {
    id: "assistente",
    path: "/assistente",
    icon: "◉",
    label: "IA Assistente",
  },
  {
    id: "notificacoes",
    path: "/notificacoes",
    icon: "♢",
    label: "Notificações",
  },
  {
    id: "documentos",
    path: "/documentos",
    icon: "▤",
    label: "Documentos",
  },
  {
    id: "relatorios",
    path: "/relatorios",
    icon: "▥",
    label: "Relatórios",
  },
  {
    id: "configuracoes",
    path: "/configuracoes",
    icon: "⚙",
    label: "Configurações",
  },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const profile = getCareteaProfile();

  const accountType = profile?.accountType;
  const autismLevel = profile?.autismLevel;

  const visibleMenuItems = menuItems.filter((item) => {
    if (
      item.onlyFor === "autista-nivel-1" &&
      !(accountType === "autista" && autismLevel === 1)
    ) {
      return false;
    }

    if (
      item.onlyFor === "responsavel-nivel-2" &&
      !(accountType === "responsavel" && autismLevel === 2)
    ) {
      return false;
    }

    return true;
  });

  function sairDaConta() {
    clearCareteaSession();
    navigate("/login");
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img
          src={logoCaretea}
          alt="CareTEA"
          className="sidebar-logo"
        />
      </div>

      <nav
        className="sidebar-nav"
        aria-label="Menu principal"
      >
        {visibleMenuItems.map((item) => {
          const isActive =
            location.pathname === item.path;

          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-item ${
                isActive ? "sidebar-item-active" : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              <span className="sidebar-icon">
                {item.icon}
              </span>

              <span className="sidebar-item-label">
                {item.label}
              </span>

              {item.id === "notificacoes" && (
                <span className="sidebar-badge">
                  3
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-help-card">
          <div className="help-illustration">
            🧩
          </div>

          <div className="sidebar-help-copy">
            <strong>Precisa de ajuda?</strong>

            <p>
              Nossa IA está aqui para te apoiar
              sempre que precisar.
            </p>
          </div>

          <button
            type="button"
            className="sidebar-help-button"
            onClick={() => navigate("/assistente")}
          >
            Conversar com IA
          </button>
        </div>

        <button
          type="button"
          className="sidebar-logout-button"
          onClick={sairDaConta}
        >
          <span className="sidebar-logout-icon">
            ↪
          </span>

          <span className="sidebar-logout-copy">
            <strong>Sair</strong>
            <small>Encerrar sessão</small>
          </span>

          <span className="sidebar-logout-arrow">
            ›
          </span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;