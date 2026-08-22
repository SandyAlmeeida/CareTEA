import { NavLink } from "react-router-dom";
import logoCaretea from "../../assets/logo-caretea.png";
import "./Sidebar.css";

const menuItems = [
  { id: "dashboard", path: "/dashboard", icon: "⌂", label: "Dashboard" },
  { id: "agenda", path: "/agenda", icon: "▣", label: "Agenda" },
  { id: "medicamentos", path: "/medicamentos", icon: "◊", label: "Medicamentos" },
  { id: "consultas", path: "/consultas", icon: "♧", label: "Consultas" },
  { id: "exames", path: "/exames", icon: "△", label: "Exames" },
  { id: "assistente", path: "/assistente", icon: "◉", label: "IA Assistente" },
  { id: "notificacoes", path: "/notificacoes", icon: "♢", label: "Notificações" },
  { id: "documentos", path: "/documentos", icon: "▤", label: "Documentos" },
  { id: "relatorios", path: "/relatorios", icon: "▥", label: "Relatórios" },
  { id: "configuracoes", path: "/configuracoes", icon: "⚙", label: "Configurações" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <img
        src={logoCaretea}
        alt="CareTEA"
        className="sidebar-logo"
      />

      <nav className="sidebar-nav" aria-label="Menu principal">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "sidebar-item-active" : ""}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>

            <span>{item.label}</span>

            {item.id === "notificacoes" && (
              <span className="sidebar-badge">3</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-help-card">
        <div className="help-illustration">🧩</div>

        <strong>Precisa de ajuda?</strong>

        <p>
          Nossa IA está aqui para te apoiar sempre que precisar.
        </p>

        <NavLink
          to="/assistente"
          className="sidebar-help-button"
        >
          Conversar com IA
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;