import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useLocation,
} from "react-router-dom";

import {
  getCareteaSession,
} from "../../utils/careteaSession.js";

import "./ModalNotificacoes.css";

const API_URL =
  "http://localhost:8080";

function formatarTempo(
  solicitadoEm,
) {
  if (!solicitadoEm) {
    return "Agora";
  }

  const data =
    new Date(solicitadoEm);

  if (
    Number.isNaN(
      data.getTime(),
    )
  ) {
    return "Agora";
  }

  const diferenca =
    Date.now() -
    data.getTime();

  const minutos =
    Math.floor(
      diferenca / 60000,
    );

  if (minutos < 1) {
    return "Agora";
  }

  if (minutos < 60) {
    return `Há ${minutos} min`;
  }

  const horas =
    Math.floor(
      minutos / 60,
    );

  if (horas < 24) {
    return `Há ${horas} ${
      horas === 1
        ? "hora"
        : "horas"
    }`;
  }

  return data.toLocaleString(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}

function ModalNotificacoes({
  aberto,
  onClose,
  onQuantidadeAlterada,
  onVerTodas,
}) {
  const location =
    useLocation();

  const pathnameAnterior =
    useRef(location.pathname);

  const [
    notificacoes,
    setNotificacoes,
  ] = useState([]);

  const [
    carregando,
    setCarregando,
  ] = useState(false);

  const [
    erro,
    setErro,
  ] = useState("");

  const [
    atualizandoIds,
    setAtualizandoIds,
  ] = useState([]);

  const [
    marcandoTodas,
    setMarcandoTodas,
  ] = useState(false);

  const naoLidas =
    notificacoes.filter(
      (item) =>
        !item.lida,
    ).length;

  useEffect(() => {
    if (
      pathnameAnterior.current !==
      location.pathname
    ) {
      pathnameAnterior.current =
        location.pathname;
      onClose();
    }
  }, [
    location.pathname,
    onClose,
  ]);

  useEffect(() => {
    let ativo = true;

    async function carregarNotificacoes() {
      const session =
        getCareteaSession();

      if (
        !session?.token ||
        !session?.userId
      ) {
        if (ativo) {
          setErro(
            "Não foi possível identificar sua sessão.",
          );
          setCarregando(false);
        }

        return;
      }

      setCarregando(true);
      setErro("");

      try {
        const response =
          await fetch(
            `${API_URL}/notificacoes/usuario/${session.userId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${session.token}`,
              },
            },
          );

        if (!response.ok) {
          throw new Error(
            "Não foi possível carregar as notificações.",
          );
        }

        const dados =
          await response.json();

        if (!Array.isArray(dados)) {
          throw new Error(
            "O servidor retornou uma lista inválida.",
          );
        }

        const notificacoesReais = dados.map(
          (item) => {
            if (
              item?.id == null ||
              typeof item.lida !== "boolean"
            ) {
              throw new Error(
                "O servidor retornou uma notificação inválida.",
              );
            }

            const tipo =
              String(item.tipo || "sistema").toLowerCase();

            const estiloTipo =
              tipo.includes("ajuda")
                ? "orange"
                : tipo.includes("medicamento")
                  ? "purple"
                  : tipo.includes("consulta")
                    ? "blue"
                    : tipo.includes("exame")
                      ? "green"
                      : "slate";

            return {
              ...item,
              icon:
                tipo.includes("ajuda")
                  ? "♡"
                  : "♢",
              titulo:
                item.titulo ||
                item.assunto ||
                "Notificação",
              descricao:
                item.mensagem ??
                item.descricao ??
                item.texto ??
                "",
              tempo:
                formatarTempo(
                  item.criadaEm ||
                  item.dataCriacao ||
                  item.quando,
                ),
              tipo: estiloTipo,
            };
          },
        );

        if (ativo) {
          setNotificacoes(
            notificacoesReais.filter(
              (item) => !item.lida,
            ),
          );
        }
      } catch (error) {
        console.error(
          "Erro ao carregar notificações:",
          error,
        );

        if (ativo) {
          setErro(
            error.message ||
              "Não foi possível carregar as notificações.",
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarNotificacoes();

    return () => {
      ativo = false;
    };
  }, [aberto]);

  /*
   * Atualiza o número que aparece
   * no sininho do Topbar.
   */
  useEffect(() => {
    onQuantidadeAlterada?.(
      naoLidas,
    );
  }, [
    naoLidas,
    onQuantidadeAlterada,
  ]);

  useEffect(() => {
    function fecharComEsc(
      event,
    ) {
      if (
        event.key === "Escape"
      ) {
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
  }, [
    aberto,
    onClose,
  ]);

  if (!aberto) {
    return null;
  }

  async function marcarComoLida(id) {
    const notificacao =
      notificacoes.find(
        (item) => item.id === id,
      );

    if (
      !notificacao ||
      notificacao.lida ||
      atualizandoIds.includes(id) ||
      marcandoTodas
    ) {
      return;
    }

    const session =
      getCareteaSession();

    if (!session?.token) {
      setErro(
        "Não foi possível identificar sua sessão.",
      );
      return;
    }

    setErro("");
    setAtualizandoIds(
      (atuais) => [...atuais, id],
    );

    try {
      const response =
        await fetch(
          `${API_URL}/notificacoes/${encodeURIComponent(id)}/lida`,
          {
            method: "PATCH",
            headers: {
              Authorization:
                `Bearer ${session.token}`,
            },
          },
        );

      if (!response.ok) {
        throw new Error(
          "Não foi possível marcar a notificação como lida.",
        );
      }

      setNotificacoes(
        (atuais) =>
          atuais.filter(
            (item) => item.id !== id,
          ),
      );
    } catch (error) {
      console.error(
        "Erro ao marcar notificação como lida:",
        error,
      );
      setErro(
        error.message ||
          "Não foi possível marcar a notificação como lida.",
      );
    } finally {
      setAtualizandoIds(
        (atuais) =>
          atuais.filter(
            (atualId) => atualId !== id,
          ),
      );
    }
  }

  async function marcarTodasComoLidas() {
    const pendentes =
      notificacoes.filter(
        (item) => !item.lida,
      );

    if (
      pendentes.length === 0 ||
      marcandoTodas
    ) {
      return;
    }

    const session =
      getCareteaSession();

    if (!session?.token) {
      setErro(
        "Não foi possível identificar sua sessão.",
      );
      return;
    }

    setErro("");
    setMarcandoTodas(true);

    const resultados =
      await Promise.allSettled(
        pendentes.map(async (item) => {
          const response =
            await fetch(
              `${API_URL}/notificacoes/${encodeURIComponent(item.id)}/lida`,
              {
                method: "PATCH",
                headers: {
                  Authorization:
                    `Bearer ${session.token}`,
                },
              },
            );

          if (!response.ok) {
            throw new Error(
              `Não foi possível marcar a notificação ${item.id} como lida.`,
            );
          }

          return item.id;
        }),
      );

    const idsMarcados = new Set(
      resultados
        .filter(
          (resultado) =>
            resultado.status === "fulfilled",
        )
        .map(
          (resultado) => resultado.value,
        ),
    );

    setNotificacoes(
      (atuais) =>
        atuais.filter(
          (item) => !idsMarcados.has(item.id),
        ),
    );

    const falhas =
      resultados.filter(
        (resultado) =>
          resultado.status === "rejected",
      );

    if (falhas.length > 0) {
      console.error(
        "Erro ao marcar todas as notificações como lidas:",
        falhas.map(
          (resultado) => resultado.reason,
        ),
      );
      setErro(
        "Não foi possível marcar todas as notificações como lidas.",
      );
    }

    setMarcandoTodas(false);
  }

  return (
    <>
      <button
        className="notification-backdrop"
        type="button"
        aria-label="Fechar notificações"
        onClick={onClose}
      />

      <section
        className="notification-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Notificações"
      >
        <header className="notification-modal-header">
          <div>
            <span>
              Central de avisos
            </span>

            <h2>
              Notificações
            </h2>
          </div>

          <button
            className="notification-close"
            type="button"
            onClick={onClose}
            aria-label="Fechar"
          >
            ×
          </button>
        </header>

        <div className="notification-actions">
          <span>
            {carregando
              ? "Carregando..."
              : naoLidas === 0
                ? "Tudo em dia"
                : `${naoLidas} ${
                    naoLidas === 1
                      ? "nova"
                      : "novas"
                  }`}
          </span>

          {!carregando &&
            naoLidas > 0 && (
              <button
                type="button"
                onClick={
                  marcarTodasComoLidas
                }
                disabled={marcandoTodas}
              >
                {marcandoTodas
                  ? "Marcando..."
                  : "Marcar todas como lidas"}
              </button>
            )}
        </div>

        {erro && (
          <div
            role="alert"
            style={{
              padding: "10px 18px",
              color: "#b42318",
              background: "#fff1f0",
              fontSize: "13px",
            }}
          >
            {erro}
          </div>
        )}

        <div className="notification-list">
          {carregando ? (
            <div
              style={{
                padding:
                  "24px 18px",
                textAlign:
                  "center",
                color:
                  "#7b8499",
                fontSize:
                  "13px",
              }}
            >
              Carregando avisos...
            </div>
          ) : notificacoes.length ===
            0 ? (
            <div
              style={{
                padding:
                  "24px 18px",
                textAlign:
                  "center",
                color:
                  "#7b8499",
                fontSize:
                  "13px",
              }}
            >
              {erro
                ? "Não foi possível carregar as notificações."
                : "Nenhuma notificação pendente."}
            </div>
          ) : (
            notificacoes.map(
              (item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`notification-item ${
                    !item.lida
                      ? "notification-item-unread"
                      : ""
                  }`}
                  onClick={() =>
                      marcarComoLida(item.id)
                    }
                    disabled={
                      item.lida ||
                      atualizandoIds.includes(item.id) ||
                      marcandoTodas
                    }
                  >
                  <span
                    className={`notification-item-icon notification-item-${item.tipo}`}
                  >
                    {item.icon}
                  </span>

                  <span className="notification-item-content">
                    <span className="notification-item-title-row">
                      <strong>
                        {
                          item.titulo
                        }
                      </strong>

                      {!item.lida && (
                        <i />
                      )}
                    </span>

                    <span className="notification-description">
                      {
                        item.descricao
                      }
                    </span>

                    <small>
                      {item.tempo}
                    </small>
                  </span>

                  <b>›</b>
                </button>
              ),
            )
          )}
        </div>

        <footer className="notification-modal-footer">
          <button
            type="button"
            onClick={() => {
              onClose();

              onVerTodas?.();
            }}
          >
            Ver todas as notificações
            <span>→</span>
          </button>
        </footer>
      </section>
    </>
  );
}

export default ModalNotificacoes;