import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import Topbar from "../../components/Topbar/Topbar.jsx";
import { API_URL } from "../../services/api.js";

import "./GerenciarMeuDia.css";

function GerenciarMeuDia({
  userName = "Adriana",
  profileName = "Evellyn",
  autismLevel = 2,
  onLogout,
}) {
  const [access, setAccess] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  function getSession() {
    const raw =
      localStorage.getItem("careteaSession") ||
      sessionStorage.getItem("careteaSession");

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function getCacheKey(profileId) {
    return `careteaMeuDiaAccess:${profileId}`;
  }

  function saveCachedAccess(profileId, data) {
    try {
      sessionStorage.setItem(
        getCacheKey(profileId),
        JSON.stringify(data),
      );
    } catch {
      // O cache é apenas auxiliar.
    }
  }

  function getCachedAccess(profileId) {
    try {
      const raw = sessionStorage.getItem(
        getCacheKey(profileId),
      );

      if (!raw) {
        return null;
      }

      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function clearCachedAccess(profileId) {
    try {
      sessionStorage.removeItem(
        getCacheKey(profileId),
      );
    } catch {
      // Não impede o funcionamento da tela.
    }
  }

  async function readError(response) {
    try {
      const data = await response.json();

      return (
        data?.message ||
        data?.error ||
        "Não foi possível concluir a operação."
      );
    } catch {
      return "Não foi possível concluir a operação.";
    }
  }

  useEffect(() => {
    loadAccessStatus();
  }, []);

  async function loadAccessStatus() {
    const session = getSession();

    if (
      !session?.userId ||
      !session?.profileId ||
      !session?.token
    ) {
      setFeedback(
        "Não foi possível identificar a sessão do responsável.",
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/acesso-meu-dia/status?usuarioId=${session.userId}&pessoaAutistaId=${session.profileId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        },
      );

      if (response.status === 404) {
        clearCachedAccess(session.profileId);
        setAccess(null);
        return;
      }

      if (response.status === 401) {
        setFeedback(
          "Sua sessão expirou. Faça login novamente.",
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          await readError(response),
        );
      }

      const data = await response.json();

      const cached =
        getCachedAccess(session.profileId);

      let code = null;
      let link = null;

      /*
       * O backend guarda somente o HASH do código.
       *
       * Por isso, depois de recarregar a tela,
       * tentamos recuperar o código que acabou
       * de ser gerado nesta sessão do navegador.
       */
      if (cached?.code) {
        const expirationTime =
          data.codigoExpiraEm
            ? new Date(
                data.codigoExpiraEm,
              ).getTime()
            : null;

        const codeStillValid =
          expirationTime &&
          expirationTime > Date.now();

        if (codeStillValid) {
          code = cached.code;
          link = cached.link;
        } else {
          clearCachedAccess(
            session.profileId,
          );
        }
      }

      setAccess({
        ...data,
        code,
        link,
      });
    } catch (error) {
      setFeedback(
        error.message ||
          "Não foi possível consultar o acesso Meu Dia.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function generateAccess() {
    const session = getSession();

    if (
      !session?.userId ||
      !session?.profileId ||
      !session?.token
    ) {
      setFeedback(
        "Não foi possível identificar a sessão do responsável.",
      );
      return;
    }

    setGenerating(true);
    setFeedback("");

    try {
      const response = await fetch(
        `${API_URL}/acesso-meu-dia/gerar?usuarioId=${session.userId}`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${session.token}`,
          },

          body: JSON.stringify({
            pessoaAutistaId:
              session.profileId,
          }),
        },
      );

      if (response.status === 401) {
        throw new Error(
          "Sua sessão expirou. Faça login novamente.",
        );
      }

      if (!response.ok) {
        throw new Error(
          await readError(response),
        );
      }

      const data = await response.json();

      if (!data.codigo) {
        throw new Error(
          "O backend não retornou o código de acesso.",
        );
      }

      const link =
        `${window.location.origin}` +
        `/acesso-meu-dia?codigo=` +
        encodeURIComponent(data.codigo);

      const newAccess = {
        ...data,
        code: data.codigo,
        link,
      };

      saveCachedAccess(
        session.profileId,
        {
          code: data.codigo,
          link,
        },
      );

      setAccess(newAccess);

      setFeedback(
        "Novo acesso Meu Dia criado com sucesso!",
      );
    } catch (error) {
      setFeedback(
        error.message ||
          "Não foi possível gerar o acesso Meu Dia.",
      );
    } finally {
      setGenerating(false);
    }
  }

  async function revokeAccess() {
    const session = getSession();

    if (
      !session?.userId ||
      !session?.profileId ||
      !session?.token
    ) {
      setFeedback(
        "Não foi possível identificar a sessão do responsável.",
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Deseja realmente revogar o acesso Meu Dia de ${profileName}?`,
      );

    if (!confirmed) {
      return;
    }

    setGenerating(true);
    setFeedback("");

    try {
      const response = await fetch(
        `${API_URL}/acesso-meu-dia/revogar?usuarioId=${session.userId}&pessoaAutistaId=${session.profileId}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${session.token}`,
          },
        },
      );

      if (response.status === 401) {
        throw new Error(
          "Sua sessão expirou. Faça login novamente.",
        );
      }

      if (!response.ok) {
        throw new Error(
          await readError(response),
        );
      }

      clearCachedAccess(
        session.profileId,
      );

      setAccess(null);

      setFeedback(
        "Acesso Meu Dia revogado com sucesso.",
      );
    } catch (error) {
      setFeedback(
        error.message ||
          "Não foi possível revogar o acesso Meu Dia.",
      );
    } finally {
      setGenerating(false);
    }
  }

  async function copyValue(
    value,
    label,
  ) {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        value,
      );

      setFeedback(
        `${label} copiado!`,
      );
    } catch {
      setFeedback(
        `Copie o ${label.toLowerCase()} manualmente.`,
      );
    }
  }

  return (
    <div className="caretea-dashboard gerenciar-meu-dia-page">
      <Sidebar hideExames />

      <main className="gerenciar-meu-dia-main">
        <Topbar
          title="Acesso Meu Dia"
          subtitle={`Gerencie o acesso simplificado de ${profileName}.`}
          userName={userName}
          userLevel={`Responsável · Nível ${autismLevel}`}
          notifications={3}
          onLogout={onLogout}
        />

        <section className="gerenciar-intro">
          <div
            className="gerenciar-intro-icon"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24">
              <rect
                x="7"
                y="2.5"
                width="10"
                height="19"
                rx="2.5"
              />

              <path d="M10 18.5h4" />

              <path d="M9.5 7.5h5M9.5 11h5M9.5 14.5h3" />
            </svg>
          </div>

          <div>
            <span>
              Acesso assistido · Nível 2
            </span>

            <h1>
              Meu Dia no celular de{" "}
              {profileName}
            </h1>

            <p>
              Você organiza medicamentos,
              consultas e rotina pelo painel
              completo. {profileName} acessa
              apenas uma versão simples e
              direta pelo próprio celular.
            </p>
          </div>
        </section>

        <section className="gerenciar-flow">
          <article>
            <b>1</b>

            <div>
              <strong>
                Você organiza
              </strong>

              <p>
                Cadastre os cuidados
                normalmente no seu painel.
              </p>
            </div>
          </article>

          <span>→</span>

          <article>
            <b>2</b>

            <div>
              <strong>
                CareTEA gera o acesso
              </strong>

              <p>
                Um código, um link e um QR
                Code.
              </p>
            </div>
          </article>

          <span>→</span>

          <article>
            <b>3</b>

            <div>
              <strong>
                {profileName} abre o Meu Dia
              </strong>

              <p>
                Sem precisar criar outra conta
                completa.
              </p>
            </div>
          </article>
        </section>

        {loading ? (
          <section className="gerenciar-generate-card">
            <div>
              <span className="gerenciar-status-dot" />

              <div>
                <strong>
                  Verificando acesso...
                </strong>

                <p>
                  Aguarde enquanto o CareTEA
                  consulta o acesso de{" "}
                  {profileName}.
                </p>
              </div>
            </div>
          </section>
        ) : !access ? (
          <section className="gerenciar-generate-card">
            <div>
              <span className="gerenciar-status-dot" />

              <div>
                <strong>
                  Nenhum acesso gerado ainda
                </strong>

                <p>
                  Gere o primeiro acesso quando
                  o celular de {profileName}
                  estiver disponível.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={generateAccess}
              disabled={generating}
            >
              {generating
                ? "Gerando..."
                : "Gerar acesso Meu Dia"}
            </button>
          </section>
        ) : (
          <section className="gerenciar-access-card">
            <header>
              <div>
                <span className="gerenciar-success">
                  ✓
                </span>

                <div>
                  <h2>
                    Acesso criado
                  </h2>

                  <p>
                    Escolha a forma mais fácil
                    de compartilhar com{" "}
                    {profileName}.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={generateAccess}
                disabled={generating}
              >
                {generating
                  ? "Gerando..."
                  : "Gerar novo"}
              </button>
            </header>

            <div className="gerenciar-access-grid">
              <div className="gerenciar-access-data">
                <article>
                  <span>
                    Código de acesso
                  </span>

                  <div className="gerenciar-code-row">
                    <strong>
                      {access.code ||
                        "INDISPONÍVEL"}
                    </strong>

                    {access.code && (
                      <button
                        type="button"
                        onClick={() =>
                          copyValue(
                            access.code,
                            "Código",
                          )
                        }
                      >
                        Copiar
                      </button>
                    )}
                  </div>
                </article>

                <article>
                  <span>
                    Link de acesso
                  </span>

                  <div className="gerenciar-link-row">
                    <strong>
                      {access.link ||
                        "Gere um novo código para compartilhar"}
                    </strong>

                    {access.link && (
                      <button
                        type="button"
                        onClick={() =>
                          copyValue(
                            access.link,
                            "Link",
                          )
                        }
                      >
                        Copiar
                      </button>
                    )}
                  </div>
                </article>

                <div className="gerenciar-note">
                  <strong>
                    O que acontece quando abrir?
                  </strong>

                  <p>
                    O link leva para a tela de
                    acesso e depois para o
                    painel simplificado
                    <b> Meu Dia</b>.
                  </p>
                </div>

                {access.ativo && (
                  <div
                    className="gerenciar-note"
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    <strong>
                      Quer bloquear este acesso?
                    </strong>

                    <p>
                      O responsável pode revogar
                      o acesso deste aparelho a
                      qualquer momento.
                    </p>

                    <button
                      type="button"
                      onClick={revokeAccess}
                      disabled={generating}
                      style={{
                        marginTop: "9px",
                        border: 0,
                        padding: 0,
                        background:
                          "transparent",
                        color: "#6251b8",
                        fontSize: "10.5px",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      Revogar acesso
                    </button>
                  </div>
                )}

                {feedback && (
                  <p
                    className="gerenciar-feedback"
                    aria-live="polite"
                  >
                    {feedback}
                  </p>
                )}
              </div>

              <aside className="gerenciar-qr-card">
                <span>
                  QR Code
                </span>

                <div className="gerenciar-fake-qr">
                  {access.link ? (
                    <QRCodeSVG
                      value={access.link}
                      level="M"
                      marginSize={1}
                      style={{
                        gridColumn:
                          "1 / -1",
                        gridRow: "1 / -1",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        gridColumn:
                          "1 / -1",
                        gridRow: "1 / -1",
                        display: "grid",
                        placeItems: "center",
                        color: "#8993a9",
                        fontSize: "10px",
                        textAlign: "center",
                      }}
                    >
                      Gere um novo código
                    </span>
                  )}
                </div>

                <strong>
                  Escaneie no celular de{" "}
                  {profileName}
                </strong>

                <small>
                  O QR Code abre diretamente a
                  tela de acesso do Meu Dia.
                </small>
              </aside>
            </div>
          </section>
        )}

        {!access &&
          !loading &&
          feedback && (
            <p
              className="gerenciar-feedback"
              aria-live="polite"
              style={{
                marginTop: "12px",
              }}
            >
              {feedback}
            </p>
          )}
      </main>
    </div>
  );
}

export default GerenciarMeuDia;