import { useMemo, useState } from "react";
import logoCaretea from "../../assets/logo-caretea.png";
import "./Documentos.css";

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

const CATEGORIAS = {
  receita: { label: "Receita", icon: "💊", cor: "red" },
  laudo: { label: "Laudo", icon: "📋", cor: "purple" },
  exame: { label: "Exame", icon: "🧪", cor: "green" },
  atestado: { label: "Atestado", icon: "📝", cor: "blue" },
  outro: { label: "Outro", icon: "📎", cor: "orange" },
};

const DOCUMENTOS = [
  { id: 1, nome: "Receita Risperidona 1mg", categoria: "receita", data: "2025-05-10", profissional: "Dr. Almeida" },
  { id: 2, nome: "Laudo neurológico", categoria: "laudo", data: "2025-05-08", profissional: "Dra. Ribeiro" },
  { id: 3, nome: "Hemograma completo", categoria: "exame", data: "2025-04-28", profissional: "Lab. Vida" },
  { id: 4, nome: "Atestado escolar", categoria: "atestado", data: "2025-04-20", profissional: "Dr. Almeida" },
  { id: 5, nome: "Receita Metilfenidato", categoria: "receita", data: "2025-04-15", profissional: "Dra. Ribeiro" },
  { id: 6, nome: "Termo de consentimento", categoria: "outro", data: "2025-03-30", profissional: "" },
];

const fmtData = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

function formatarData(iso) {
  return fmtData.format(new Date(`${iso}T00:00:00`));
}

function Documentos({ userName = "Sandy", onNavigate, onLogout }) {
  const [, setAbrirNovo] = useState(false);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todas");

  const documentosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return DOCUMENTOS.filter((doc) => {
      const casaCategoria = categoria === "todas" || doc.categoria === categoria;
      const casaBusca =
        termo === "" ||
        doc.nome.toLowerCase().includes(termo) ||
        doc.profissional.toLowerCase().includes(termo);
      return casaCategoria && casaBusca;
    });
  }, [busca, categoria]);

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

        <section className="docs-toolbar">
          <div className="search-box">
            <span aria-hidden="true">🔍</span>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome ou profissional..."
              aria-label="Buscar documento"
            />
          </div>

          <div className="filter-chips" role="group" aria-label="Filtrar por categoria">
            <button
              type="button"
              className={`filter-chip ${categoria === "todas" ? "active" : ""}`}
              aria-pressed={categoria === "todas"}
              onClick={() => setCategoria("todas")}
            >
              Todas
            </button>
            {Object.entries(CATEGORIAS).map(([chave, cat]) => (
              <button
                key={chave}
                type="button"
                className={`filter-chip chip-${cat.cor} ${categoria === chave ? "active" : ""}`}
                aria-pressed={categoria === chave}
                onClick={() => setCategoria(chave)}
              >
                <span className="chip-icon">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {documentosFiltrados.length === 0 ? (
          <section className="docs-empty">
            <span className="empty-icon">🗂️</span>
            <strong>Nenhum documento encontrado</strong>
            <p>Ajuste a busca ou o filtro de categoria para ver seus documentos.</p>
          </section>
        ) : (
          <section className="docs-grid">
            {documentosFiltrados.map((doc) => {
              const cat = CATEGORIAS[doc.categoria];
              return (
                <article key={doc.id} className={`doc-card card-${cat.cor}`}>
                  <div className="doc-card-head">
                    <span className={`doc-icon icon-${cat.cor}`}>{cat.icon}</span>
                    <span className={`cat-tag tag-${cat.cor}`}>{cat.label}</span>
                  </div>
                  <h3 className="doc-name">{doc.nome}</h3>
                  <dl className="doc-meta">
                    <div>
                      <dt>🗓️</dt>
                      <dd>{formatarData(doc.data)}</dd>
                    </div>
                    {doc.profissional && (
                      <div>
                        <dt>👨‍⚕️</dt>
                        <dd>{doc.profissional}</dd>
                      </div>
                    )}
                  </dl>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}

export default Documentos;