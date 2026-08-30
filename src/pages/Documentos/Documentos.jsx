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

const DOCUMENTOS_INICIAIS = [
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
  const [documentos, setDocumentos] = useState(DOCUMENTOS_INICIAIS);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [abrirNovo, setAbrirNovo] = useState(false);
  const [visualizando, setVisualizando] = useState(null);
  const [paraExcluir, setParaExcluir] = useState(null);

  const documentosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return documentos.filter((doc) => {
      const casaCategoria = categoria === "todas" || doc.categoria === categoria;
      const casaBusca =
        termo === "" ||
        doc.nome.toLowerCase().includes(termo) ||
        doc.profissional.toLowerCase().includes(termo);
      return casaCategoria && casaBusca;
    });
  }, [documentos, busca, categoria]);

  function adicionar(novo) {
    setDocumentos((atual) => [{ ...novo, id: Date.now() }, ...atual]);
    setAbrirNovo(false);
  }

  function confirmarExclusao() {
    if (!paraExcluir) return;
    if (paraExcluir.url) URL.revokeObjectURL(paraExcluir.url);
    setDocumentos((atual) => atual.filter((doc) => doc.id !== paraExcluir.id));
    setParaExcluir(null);
  }

  function baixar(doc) {
    const link = document.createElement("a");
    if (doc.url) {
      link.href = doc.url;
      link.download = doc.arquivoNome || doc.nome;
    } else {
      const conteudo =
        `CareTEA - Documento simulado\n\n` +
        `Nome: ${doc.nome}\n` +
        `Categoria: ${CATEGORIAS[doc.categoria].label}\n` +
        `Data: ${formatarData(doc.data)}\n` +
        `Profissional: ${doc.profissional || "Não informado"}\n`;
      const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
      const urlTemp = URL.createObjectURL(blob);
      link.href = urlTemp;
      link.download = `${doc.nome}.txt`;
      setTimeout(() => URL.revokeObjectURL(urlTemp), 1000);
    }
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function excluirDocumento(documento) { 
    if (!window.confirm(`Deseja excluir "${documento.descricao}"?`)) return; 

    if (documento.arquivoUrl) URL.revokeObjectURL(documento.arquivoUrl); 
    setDocumentos((documentosAtuais) => documentosAtuais.filter((item) => item.id !== documento.id)); 
    setDocumentoVisualizado(null); 
  } 

  return ( 
    <div className="docs-page">
      <Sidebar />

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
            <span className="docs-count"> 
              <span className="docs-count-dot" aria-hidden="true" /> 
              {documentos.length} {documentos.length === 1 ? "documento salvo" : "documentos salvos"} 
            </span> 
          </div> 
          <button className="add-btn" type="button" onClick={abrirModal}> 
            ＋ Adicionar documento 
          </button> 
        </section> 

        {documentos.length === 0 ? ( 
          <section className="docs-empty"> 
            <span className="empty-icon">🗂️</span> 
            <strong>Nenhum documento por aqui ainda</strong> 
            <p>Adicione receitas, laudos, exames e atestados para manter tudo organizado e acessível.</p> 
            <button className="empty-btn" type="button" onClick={abrirModal}> 
              ＋ Adicionar primeiro documento 
            </button> 
          </section> 
        ) : ( 
          <section className="docs-list" aria-label="Documentos adicionados"> 
            {documentos.map((documento) => ( 
              <article className="docs-card" key={documento.id}> 
                {documento.tipoArquivo.startsWith("image/") ? ( 
                  <img className="docs-card-image" src={documento.arquivoUrl} alt={documento.descricao} /> 
                ) : ( 
                  <span className="docs-card-icon">📄</span> 
                )} 
                <div className="docs-card-content"> 
                  <button 
                    className="docs-card-name" 
                    type="button" 
                    onClick={() => setDocumentoVisualizado(documento)} 
                    aria-label={`Visualizar ${documento.nomeArquivo}`} 
                  > 
                    <strong>{documento.nomeArquivo}</strong> 
                  </button> 
                  <p>{documento.descricao}</p> 
                </div> 
              </article> 
            ))} 
          </section> 
        )} 

        <div className="docs-ribbon" aria-hidden="true"> 
          <span /> 
          <span /> 
          <span /> 
        </div>

        {/* Acrescentado: mesmo padrão de rodapé com peças coloridas usado no CareTEA. */}
        <div className="docs-caretea-footer">
          <div className="docs-puzzle-strip" aria-hidden="true">
            {puzzleColors.map((color, index) => (
              <span className={color} key={`${color}-${index}`} />
            ))}
          </div>

          <footer className="docs-page-footer">
            <span className="docs-security">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              Seus dados estão protegidos conosco.
            </span>

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
            <p>Ajuste a busca ou o filtro, ou adicione um novo documento.</p>
            <button className="empty-btn" type="button" onClick={() => setAbrirNovo(true)}>
              ＋ Adicionar documento
            </button>
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

                  <div className="doc-actions">
                    <button type="button" onClick={() => setVisualizando(doc)} aria-label={`Visualizar ${doc.nome}`}>
                      👁 <span>Ver</span>
                    </button>
                    <button type="button" onClick={() => baixar(doc)} aria-label={`Baixar ${doc.nome}`}>
                      ⬇ <span>Baixar</span>
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => setParaExcluir(doc)}
                      aria-label={`Excluir ${doc.nome}`}
                    >
                      🗑 <span>Excluir</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>

      {abrirNovo && <ModalNovo onFechar={() => setAbrirNovo(false)} onSalvar={adicionar} />}
      {visualizando && <ModalPreview doc={visualizando} onFechar={() => setVisualizando(null)} onBaixar={baixar} />}
      {paraExcluir && (
        <ModalConfirmar doc={paraExcluir} onCancelar={() => setParaExcluir(null)} onConfirmar={confirmarExclusao} />
      )}
    </div>
  );
}

function ModalNovo({ onFechar, onSalvar }) {
  const hojeISO = new Date().toISOString().slice(0, 10);
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("receita");
  const [data, setData] = useState(hojeISO);
  const [profissional, setProfissional] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [erro, setErro] = useState("");

  function aoEscolherArquivo(evento) {
    const file = evento.target.files?.[0];
    if (!file) return;
    setArquivo({ url: URL.createObjectURL(file), nome: file.name, tipo: file.type });
    if (!nome) setNome(file.name.replace(/\.[^.]+$/, ""));
  }

  function salvar(evento) {
    evento.preventDefault();
    if (!nome.trim()) {
      setErro("Informe o nome do documento.");
      return;
    }
    onSalvar({
      nome: nome.trim(),
      categoria,
      data,
      profissional: profissional.trim(),
      url: arquivo?.url,
      arquivoNome: arquivo?.nome,
      tipo: arquivo?.tipo,
    });
  }

  return (
    <div className="dc-overlay" role="dialog" aria-modal="true" onClick={onFechar}>
      <div className="dc-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Adicionar documento</h3>
          <button type="button" className="modal-close" onClick={onFechar} aria-label="Fechar">
            ✕
          </button>
        </div>

        <form className="modal-form" onSubmit={salvar}>
          <label className="dropzone">
            <input type="file" accept="image/*,application/pdf" onChange={aoEscolherArquivo} />
            <span className="dropzone-icon">{arquivo ? "✅" : "⬆"}</span>
            <strong>{arquivo ? arquivo.nome : "Selecionar arquivo"}</strong>
            <small>{arquivo ? "Arquivo pronto para salvar" : "PDF ou imagem (upload simulado)"}</small>
          </label>

          <label className="field">
            <span>Nome do documento *</span>
            <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Receita Risperidona" />
          </label>

          <div className="field-row">
            <label className="field">
              <span>Categoria</span>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                {Object.entries(CATEGORIAS).map(([chave, cat]) => (
                  <option key={chave} value={chave}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Data</span>
              <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
            </label>
          </div>

          <label className="field">
            <span>Profissional / médico (opcional)</span>
            <input
              value={profissional}
              onChange={(e) => setProfissional(e.target.value)}
              placeholder="Ex.: Dr. Almeida"
            />
          </label>

          {erro && <p className="form-error">{erro}</p>}

          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onFechar}>
              Cancelar
            </button>
            <button type="submit" className="btn-solid">
              Salvar documento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModalPreview({ doc, onFechar, onBaixar }) {
  const cat = CATEGORIAS[doc.categoria];
  const ehImagem = doc.tipo?.startsWith("image/");
  const ehPdf = doc.tipo === "application/pdf";

  return (
    <div className="dc-overlay" role="dialog" aria-modal="true" onClick={onFechar}>
      <div className="dc-modal modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <span className={`doc-icon icon-${cat.cor}`}>{cat.icon}</span>
          <div>
            <span className={`cat-tag tag-${cat.cor}`}>{cat.label}</span>
            <h3>{doc.nome}</h3>
          </div>
          <button type="button" className="modal-close" onClick={onFechar} aria-label="Fechar">
            ✕
          </button>
        </div>

        <div className="preview-area">
          {doc.url && ehImagem && <img src={doc.url} alt={doc.nome} />}
          {doc.url && ehPdf && <iframe src={doc.url} title={doc.nome} />}
          {(!doc.url || (!ehImagem && !ehPdf)) && (
            <div className="preview-placeholder">
              <span>{cat.icon}</span>
              <strong>Pré-visualização indisponível</strong>
              <p>O arquivo real ficará disponível após a integração com o backend.</p>
              <ul>
                <li>
                  <b>Data:</b> {formatarData(doc.data)}
                </li>
                {doc.profissional && (
                  <li>
                    <b>Profissional:</b> {doc.profissional}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={onFechar}>
            Fechar
          </button>
          <button type="button" className="btn-solid" onClick={() => onBaixar(doc)}>
            ⬇ Baixar
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalConfirmar({ doc, onCancelar, onConfirmar }) {
  return (
    <div className="dc-overlay" role="dialog" aria-modal="true" onClick={onCancelar}>
      <div className="dc-modal modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-body">
          <span className="confirm-icon">🗑</span>
          <strong>Excluir documento?</strong>
          <p>
            Tem certeza que deseja excluir <b>{doc.nome}</b>? Esta ação não pode ser desfeita.
          </p>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={onCancelar}>
            Cancelar
          </button>
          <button type="button" className="btn-danger" onClick={onConfirmar}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

export default Documentos;

feat: adiciona ações de documento (upload simulado, visualizar, baixar, excluir)