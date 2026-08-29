import { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar.jsx"; 
import "./Documentos.css"; 

/* Apenas acrescentado para reproduzir a faixa colorida já usada no CareTEA. */
const puzzleColors = [
  "blue",
  "purple",
  "yellow",
  "green",
  "blue",
  "red",
  "purple",
  "green",
  "yellow",
  "blue",
  "green",
  "red",
  "purple",
  "blue",
  "green",
  "yellow",
  "blue",
  "red",
];

function Documentos({ userName = "Sandy", onNavigate, onLogout }) { 
  const [abrirNovo, setAbrirNovo] = useState(false); 
  const [documentos, setDocumentos] = useState([]); 
  const [descricao, setDescricao] = useState(""); 
  const [documentoVisualizado, setDocumentoVisualizado] = useState(null); 

  function abrirModal() { 
    setAbrirNovo(true); 
  } 

  function fecharModal() { 
    setAbrirNovo(false); 
    setDescricao(""); 
  } 

  function salvarDocumento(event) { 
    event.preventDefault(); 
    const arquivo = event.currentTarget.elements.arquivo.files[0]; 

    setDocumentos((documentosAtuais) => [ 
      ...documentosAtuais, 
      { 
        id: Date.now(), 
        descricao: descricao.trim() || "Documento sem descrição", 
        nomeArquivo: arquivo?.name || "Nenhum arquivo selecionado", 
        arquivoUrl: arquivo ? URL.createObjectURL(arquivo) : null, 
        tipoArquivo: arquivo?.type || "", 
      }, 
    ]); 
    event.currentTarget.reset(); 
    fecharModal(); 
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

            <span className="docs-footer-divider" />
            <a href="#politica-de-privacidade">Política de Privacidade</a>
            <a href="#termos-de-uso">Termos de Uso</a>
          </footer>
        </div>
      </main> 

      {abrirNovo && ( 
        <div 
          className="docs-modal-overlay" 
          role="presentation" 
          onMouseDown={(event) => { 
            if (event.target === event.currentTarget) fecharModal(); 
          }} 
        > 
          <section className="docs-modal" role="dialog" aria-modal="true" aria-labelledby="docs-modal-title"> 
            <div className="docs-modal-head"> 
              <h2 id="docs-modal-title">Adicionar documento</h2> 
              <button className="docs-modal-close" type="button" onClick={fecharModal} aria-label="Fechar modal"> 
                × 
              </button> 
            </div> 

            <form className="docs-form" onSubmit={salvarDocumento}> 
              <label className="docs-field"> 
                <span>Nome do documento</span> 
                <input 
                  type="text" 
                  name="descricao" 
                  value={descricao} 
                  onChange={(event) => setDescricao(event.target.value)} 
                  placeholder="Ex.: Laudo médico" 
                  autoFocus 
                /> 
              </label> 
              <label className="docs-field"> 
                <span>Arquivo</span> 
                <input type="file" name="arquivo" /> 
              </label> 
              <div className="docs-modal-actions"> 
                <button className="docs-cancel-btn" type="button" onClick={fecharModal}> 
                  Cancelar 
                </button> 
                <button className="docs-save-btn" type="submit"> 
                  Salvar 
                </button> 
              </div> 
            </form> 
          </section> 
        </div> 
      )} 

      {documentoVisualizado && ( 
        <div 
          className="docs-modal-overlay" 
          role="presentation" 
          onMouseDown={(event) => { 
            if (event.target === event.currentTarget) setDocumentoVisualizado(null); 
          }} 
        > 
          <section className="docs-modal docs-view-modal" role="dialog" aria-modal="true" aria-labelledby="docs-view-title"> 
            <div className="docs-modal-head"> 
              <div className="docs-view-heading"> 
                <h2 id="docs-view-title">{documentoVisualizado.nomeArquivo}</h2> 
                <p>{documentoVisualizado.descricao}</p> 
              </div> 
              <button className="docs-modal-close" type="button" onClick={() => setDocumentoVisualizado(null)} aria-label="Fechar visualização"> 
                × 
              </button> 
            </div> 
            <div className="docs-view-content"> 
              {documentoVisualizado.arquivoUrl ? ( 
                documentoVisualizado.tipoArquivo.startsWith("image/") ? ( 
                  <img src={documentoVisualizado.arquivoUrl} alt={documentoVisualizado.descricao} /> 
                ) : ( 
                  <iframe src={documentoVisualizado.arquivoUrl} title={documentoVisualizado.nomeArquivo} /> 
                ) 
              ) : ( 
                <p>Este documento não possui um arquivo para visualizar.</p> 
              )} 
            </div> 
            <div className="docs-view-actions"> 
              <button className="docs-cancel-btn" type="button" onClick={() => setDocumentoVisualizado(null)}> 
                Fechar 
              </button> 
              <button className="docs-delete-btn" type="button" onClick={() => excluirDocumento(documentoVisualizado)}> 
                Excluir documento 
              </button> 
            </div> 
          </section> 
        </div> 
      )} 
    </div> 
  ); 
} 

export default Documentos;
