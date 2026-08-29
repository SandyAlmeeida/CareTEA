import { useLocation, useNavigate } from "react-router-dom";
import logoCaretea from "../../assets/logo-caretea.png";
import "./Sidebar.css";

const menuItems = [
  { id: "dashboard", path: "/dashboard", icon: "⌂", label: "Dashboard" },
  { id: "agenda", path: "/agenda", icon: "▣", label: "Agenda" },
  { id: "medicamentos", path: "/medicamentos", icon: "◊", label: "Medicamentos" },
  { id: "consultas", path: "/consultas", icon: "♧", label: "Consultas" },

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

  { id: "assistente", path: "/assistente", icon: "◉", label: "IA Assistente" },
  { id: "notificacoes", path: "/notificacoes", icon: "♢", label: "Notificações" },
  { id: "documentos", path: "/documentos", icon: "▤", label: "Documentos" },
  { id: "relatorios", path: "/relatorios", icon: "▥", label: "Relatórios" },
  { id: "configuracoes", path: "/configuracoes", icon: "⚙", label: "Configurações" },
];

function getCareteaSession() {
  const rawSession =
    sessionStorage.getItem("careteaSession") ||
    localStorage.getItem("careteaSession");

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession);
  } catch {
    sessionStorage.removeItem("careteaSession");
    localStorage.removeItem("careteaSession");
    return null;
  }
}

function Sidebar({
  accountType,
  autismLevel,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const session = getCareteaSession();

  const resolvedAccountType =
    accountType ?? session?.accountType ?? "responsavel";

  const resolvedAutismLevel =
    Number(autismLevel ?? session?.autismLevel) ||
    (resolvedAccountType === "autista" ? 1 : 2);

  const visibleMenuItems = menuItems.filter((item) => {
    if (
      item.onlyFor === "autista-nivel-1" &&
      !(resolvedAccountType === "autista" && resolvedAutismLevel === 1)
    ) {
      return false;
    }

    if (
      item.onlyFor === "responsavel-nivel-2" &&
      !(resolvedAccountType === "responsavel" && resolvedAutismLevel === 2)
    ) {
      return false;
    }

    return true;
  });

  return (
    <aside className="sidebar">
      <img
        src={logoCaretea}
        alt="CareTEA"
        className="sidebar-logo"
      />

      <nav className="sidebar-nav" aria-label="Menu principal">
        {visibleMenuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-item ${isActive ? "sidebar-item-active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="sidebar-icon">{item.icon}</span>

              <span>{item.label}</span>

              {item.id === "notificacoes" && (
                <span className="sidebar-badge">3</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-help-card">
        <div className="help-illustration">🧩</div>

        <strong>Precisa de ajuda?</strong>

        <p>
          Nossa IA está aqui para te apoiar sempre que precisar.
        </p>

        <button
          type="button"
          className="sidebar-help-button"
          onClick={() => navigate("/assistente")}
        >
          Conversar com IA
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
