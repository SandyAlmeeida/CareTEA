import { useState } from "react";
import logoCaretea from "../../assets/logo-caretea.png";
import "./Documentos.css";

/* Menu lateral (mesmo do restante do app, com "documentos" ativo). */
const menu = [
  ["dashboard", "⌂", "Dashboard"],
  ["agenda", "▣", "Agenda"],
  ["medicamentos", "◊", "Medicamentos"],
  ["consultas", "♧", "Consultas"],
  ["exames", "△", "Exames"],
  ["terapias", "♡", "Terapias"],
  ["assistente", "◉", "IA Assistente"],
  ["notificacoes", "♢", "Notificações"],
  ["documentos", "▤", "Documentos"],
  ["relatorios", "▥", "Relatórios"],
  ["perfil", "♙", "Perfil"],
  ["responsaveis", "♧", "Responsáveis"],
  ["configuracoes", "⚙", "Configurações"],
];

function Documentos({ userName = "Sandy", onNavigate, onLogout }) {
  const [, setAbrirNovo] = useState(false); // usado nos próximos commits

  return (
    <div className="docs-page">
      <aside className="docs-sidebar">
        <img className="docs-logo" src={logoCaretea} alt="CareTEA" />

        <nav className="docs-menu" aria-label="Menu principal">
          {menu.map(([id, icon, label]) => (
            <button
              key={id}
              type="button"
              className={id === "documentos" ? "active" : ""}
              onClick={() => onNavigate?.(id)}
            >
              <span className="menu-icon">{icon}</span>
              <span>{label}</span>
              {id === "notificacoes" && <b>3</b>}
            </button>
          ))}
        </nav>

        <div className="docs-help">
          <div className="help-title">
            <span>🧩</span>
            <div>
              <strong>Precisa de ajuda?</strong>
              <p>A IA pode explicar receitas e laudos em linguagem simples.</p>
            </div>
          </div>
          <button type="button">Conversar com IA</button>
        </div>
      </aside>

      <main className="docs-main">
        <header className="docs-topbar">
          <div>
            <h1>Documentos</h1>
            <p>Receitas, laudos, exames e atestados reunidos e seguros.</p>
          </div>

          <div className="profile-area">
            <button className="bell" type="button" aria-label="Notificações">
              ♢ <span>3</span>
            </button>
            <button className="profile" type="button">
              <span className="avatar">👩🏻</span>
              <span>
                <strong>{userName}</strong>
                <small>Nível 2 - Assistida</small>
              </span>
              <i>⌄</i>
            </button>
            {onLogout && (
              <button className="logout" type="button" onClick={onLogout}>
                Sair
              </button>
            )}
          </div>
        </header>

        <section className="docs-head">
          <div className="docs-head-copy">
            <h2>Meus documentos</h2>
            <p>Centralize os arquivos importantes de saúde em um só lugar.</p>
          </div>
          <button className="add-btn" type="button" onClick={() => setAbrirNovo(true)}>
            ＋ Adicionar documento
          </button>
        </section>

        {/* Estado inicial: ainda sem documentos (a lista chega no próximo commit). */}
        <section className="docs-empty">
          <span className="empty-icon">🗂️</span>
          <strong>Nenhum documento por aqui ainda</strong>
          <p>Adicione receitas, laudos, exames e atestados para manter tudo organizado e acessível.</p>
          <button className="empty-btn" type="button" onClick={() => setAbrirNovo(true)}>
            ＋ Adicionar primeiro documento
          </button>
        </section>
      </main>
    </div>
  );
}

export default Documentos;
