import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import PuzzleStrip from "../../components/PuzzleStrip/PuzzleStrip.jsx";
import PerfilAvatar from "../../components/PerfilAvatar/PerfilAvatar.jsx";
import ModalNotificacoes from "../../components/ModalNotificacoes/ModalNotificacoes.jsx";
import ModalPerfil from "../../components/ModalPerfil/ModalPerfil.jsx";

import {
  getCareteaProfile,
  clearCareteaSession,
} from "../../utils/careteaSession.js";

import "./Documentos.css";

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

function Documentos({
  onNavigate,
  onLogout,
}) {
  const navigate = useNavigate();

  const profile = getCareteaProfile();

  const userName =
    profile?.userName || "Usuário";

  const userLevel =
    profile?.userLevel || "";

  const [abrirNovo, setAbrirNovo] =
    useState(false);

  const [documentos, setDocumentos] =
    useState([]);

  const [descricao, setDescricao] =
    useState("");

  const [
    documentoVisualizado,
    setDocumentoVisualizado,
  ] = useState(null);

  const [
    notificacoesAbertas,
    setNotificacoesAbertas,
  ] = useState(false);

  const [perfilAberto, setPerfilAberto] =
    useState(false);

  const [
    quantidadeNotificacoes,
    setQuantidadeNotificacoes,
  ] = useState(3);

  function navegar(id) {
    setPerfilAberto(false);
    setNotificacoesAbertas(false);

    if (onNavigate) {
      onNavigate(id);
      return;
    }

    const path = routeMap[id];

    if (path) {
      navigate(path);
    }
  }

  function handleLogout() {
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

  function abrirModal() {
    setAbrirNovo(true);
  }

  function fecharModal() {
    setAbrirNovo(false);
    setDescricao("");
  }

  function salvarDocumento(event) {
    event.preventDefault();

    const arquivo =
      event.currentTarget.elements.arquivo.files[0];

    setDocumentos((documentosAtuais) => [
      ...documentosAtuais,
      {
        id: Date.now(),
        descricao:
          descricao.trim() ||
          "Documento sem descrição",
        nomeArquivo:
          arquivo?.name ||
          "Nenhum arquivo selecionado",
        arquivoUrl: arquivo
          ? URL.createObjectURL(arquivo)
          : null,
        tipoArquivo: arquivo?.type || "",
      },
    ]);

    event.currentTarget.reset();

    fecharModal();
  }

  function excluirDocumento(documento) {
    if (
      !window.confirm(
        `Deseja excluir "${documento.descricao}"?`,
      )
    ) {
      return;
    }

    if (documento.arquivoUrl) {
      URL.revokeObjectURL(
        documento.arquivoUrl,
      );
    }

    setDocumentos(
      (documentosAtuais) =>
        documentosAtuais.filter(
          (item) =>
            item.id !== documento.id,
        ),
    );

    setDocumentoVisualizado(null);
  }

  return (
    <div className="docs-page">
      <Sidebar />

      <main className="docs-main">
        <header className="docs-topbar">
          <div>
            <h1>Documentos</h1>

            <p>
              Receitas, laudos, exames e
              atestados reunidos e seguros.
            </p>
          </div>

          <div className="profile-area">
            <button
              className="bell"
              type="button"
              aria-label="Notificações"
              aria-expanded={
                notificacoesAbertas
              }
              onClick={abrirNotificacoes}
            >
              ♢

              {quantidadeNotificacoes > 0 && (
                <span>
                  {quantidadeNotificacoes}
                </span>
              )}
            </button>

            <button
              className="profile"
              type="button"
              aria-label="Abrir menu do perfil"
              aria-expanded={perfilAberto}
              onClick={abrirPerfil}
            >
              <PerfilAvatar />

              <span>
                <strong>
                  {userName}
                </strong>

                {userLevel && (
                  <small>
                    {userLevel}
                  </small>
                )}
              </span>

              <i>
                {perfilAberto
                  ? "⌃"
                  : "⌄"}
              </i>
            </button>
          </div>
        </header>

        <section className="docs-head">
          <div className="docs-head-copy">
            <h2>
              Meus documentos
            </h2>

            <p>
              Centralize os arquivos
              importantes de saúde em um só
              lugar.
            </p>

            <span className="docs-count">
              <span
                className="docs-count-dot"
                aria-hidden="true"
              />

              {documentos.length}{" "}
              {documentos.length === 1
                ? "documento salvo"
                : "documentos salvos"}
            </span>
          </div>

          <button
            className="add-btn"
            type="button"
            onClick={abrirModal}
          >
            ＋ Adicionar documento
          </button>
        </section>

        {documentos.length === 0 ? (
          <section className="docs-empty">
            <span className="empty-icon">
              🗂️
            </span>

            <strong>
              Nenhum documento por aqui
              ainda
            </strong>

            <p>
              Adicione receitas, laudos,
              exames e atestados para manter
              tudo organizado e acessível.
            </p>

            <button
              className="empty-btn"
              type="button"
              onClick={abrirModal}
            >
              ＋ Adicionar primeiro documento
            </button>
          </section>
        ) : (
          <section
            className="docs-list"
            aria-label="Documentos adicionados"
          >
            {documentos.map(
              (documento) => (
                <article
                  className="docs-card"
                  key={documento.id}
                >
                  {documento.tipoArquivo.startsWith(
                    "image/",
                  ) ? (
                    <img
                      className="docs-card-image"
                      src={
                        documento.arquivoUrl
                      }
                      alt={
                        documento.descricao
                      }
                    />
                  ) : (
                    <span className="docs-card-icon">
                      📄
                    </span>
                  )}

                  <div className="docs-card-content">
                    <button
                      className="docs-card-name"
                      type="button"
                      onClick={() =>
                        setDocumentoVisualizado(
                          documento,
                        )
                      }
                      aria-label={`Visualizar ${documento.nomeArquivo}`}
                    >
                      <strong>
                        {
                          documento.nomeArquivo
                        }
                      </strong>
                    </button>

                    <p>
                      {
                        documento.descricao
                      }
                    </p>
                  </div>
                </article>
              ),
            )}
          </section>
        )}

        <div
          className="docs-ribbon"
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </div>

        <div className="docs-puzzle-strip">
          <PuzzleStrip />
        </div>
      </main>

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
        onLogout={handleLogout}
      />

      {abrirNovo && (
        <div
          className="docs-modal-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              fecharModal();
            }
          }}
        >
          <section
            className="docs-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="docs-modal-title"
          >
            <div className="docs-modal-head">
              <h2 id="docs-modal-title">
                Adicionar documento
              </h2>

              <button
                className="docs-modal-close"
                type="button"
                onClick={fecharModal}
                aria-label="Fechar modal"
              >
                ×
              </button>
            </div>

            <form
              className="docs-form"
              onSubmit={salvarDocumento}
            >
              <label className="docs-field">
                <span>
                  Nome do documento
                </span>

                <input
                  type="text"
                  name="descricao"
                  value={descricao}
                  onChange={(event) =>
                    setDescricao(
                      event.target.value,
                    )
                  }
                  placeholder="Ex.: Laudo médico"
                  autoFocus
                />
              </label>

              <label className="docs-field">
                <span>Arquivo</span>

                <input
                  type="file"
                  name="arquivo"
                />
              </label>

              <div className="docs-modal-actions">
                <button
                  className="docs-cancel-btn"
                  type="button"
                  onClick={fecharModal}
                >
                  Cancelar
                </button>

                <button
                  className="docs-save-btn"
                  type="submit"
                >
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
            if (
              event.target ===
              event.currentTarget
            ) {
              setDocumentoVisualizado(
                null,
              );
            }
          }}
        >
          <section
            className="docs-modal docs-view-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="docs-view-title"
          >
            <div className="docs-modal-head">
              <div className="docs-view-heading">
                <h2 id="docs-view-title">
                  {
                    documentoVisualizado.nomeArquivo
                  }
                </h2>

                <p>
                  {
                    documentoVisualizado.descricao
                  }
                </p>
              </div>

              <button
                className="docs-modal-close"
                type="button"
                onClick={() =>
                  setDocumentoVisualizado(
                    null,
                  )
                }
                aria-label="Fechar visualização"
              >
                ×
              </button>
            </div>

            <div className="docs-view-content">
              {documentoVisualizado.arquivoUrl ? (
                documentoVisualizado.tipoArquivo.startsWith(
                  "image/",
                ) ? (
                  <img
                    src={
                      documentoVisualizado.arquivoUrl
                    }
                    alt={
                      documentoVisualizado.descricao
                    }
                  />
                ) : (
                  <iframe
                    src={
                      documentoVisualizado.arquivoUrl
                    }
                    title={
                      documentoVisualizado.nomeArquivo
                    }
                  />
                )
              ) : (
                <p>
                  Este documento não possui
                  um arquivo para visualizar.
                </p>
              )}
            </div>

            <div className="docs-view-actions">
              <button
                className="docs-cancel-btn"
                type="button"
                onClick={() =>
                  setDocumentoVisualizado(
                    null,
                  )
                }
              >
                Fechar
              </button>

              <button
                className="docs-delete-btn"
                type="button"
                onClick={() =>
                  excluirDocumento(
                    documentoVisualizado,
                  )
                }
              >
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