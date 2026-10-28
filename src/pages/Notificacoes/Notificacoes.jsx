import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import Topbar from "../../components/Topbar/Topbar.jsx";

import {
  getCareteaSession,
} from "../../utils/careteaSession.js";
import { API_URL } from "../../services/api.js";

import "./Notificacoes.css";

const CORES_RODAPE = [
  "#2e70db",
  "#765bd9",
  "#ffbf2d",
  "#7cc66d",
  "#fa5d61",
  "#2e70db",
  "#765bd9",
  "#ffbf2d",
  "#7cc66d",
  "#fa5d61",
  "#2e70db",
  "#765bd9",
  "#ffbf2d",
  "#7cc66d",
  "#fa5d61",
  "#2e70db",
  "#765bd9",
  "#ffbf2d",
];

const TIPOS = {
  ajuda: {
    label: "Pedido de ajuda",
    icon: "♡",
    cor: "orange",
  },

  medicamento: {
    label: "Medicamentos",
    icon: "💊",
    cor: "purple",
  },

  consulta: {
    label: "Consultas",
    icon: "🩺",
    cor: "blue",
  },

  exame: {
    label: "Exames",
    icon: "🧪",
    cor: "green",
  },

  agenda: {
    label: "Agenda",
    icon: "🗓️",
    cor: "orange",
  },

  sistema: {
    label: "Sistema",
    icon: "⚙️",
    cor: "slate",
  },
};

const fmtHora =
  new Intl.DateTimeFormat(
    "pt-BR",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

const fmtDataCompleta =
  new Intl.DateTimeFormat(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );

function formatarQuando(iso) {
  if (!iso) {
    return "Agora";
  }

  const data =
    new Date(iso);

  if (
    Number.isNaN(
      data.getTime(),
    )
  ) {
    return "Agora";
  }

  const hoje =
    new Date();

  const ontem =
    new Date();

  ontem.setDate(
    hoje.getDate() - 1,
  );

  const hora =
    fmtHora.format(data);

  if (
    data.toDateString() ===
    hoje.toDateString()
  ) {
    return `Hoje, ${hora}`;
  }

  if (
    data.toDateString() ===
    ontem.toDateString()
  ) {
    return `Ontem, ${hora}`;
  }

  return `${fmtDataCompleta.format(
    data,
  )}, ${hora}`;
}

function Notificacoes({
  onNavigate,
  onLogout,
}) {
  const [
    notificacoes,
    setNotificacoes,
  ] = useState([]);

  const [
    filtroTipo,
    setFiltroTipo,
  ] = useState("todas");

  const [
    somenteNaoLidas,
    setSomenteNaoLidas,
  ] = useState(false);

  const [
    abrirPrefs,
    setAbrirPrefs,
  ] = useState(false);

  const [
    carregando,
    setCarregando,
  ] = useState(true);

  const [
    erro,
    setErro,
  ] = useState("");

  const [
    erroAcao,
    setErroAcao,
  ] = useState("");

  const [
    atualizandoIds,
    setAtualizandoIds,
  ] = useState([]);

  const [
    atendendoIds,
    setAtendendoIds,
  ] = useState([]);

  const [
    pedidosAtendidos,
    setPedidosAtendidos,
  ] = useState([]);

  const [
    marcandoTodas,
    setMarcandoTodas,
  ] = useState(false);

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

        if (
          response.status === 401
        ) {
          throw new Error(
            "Sua sessão expirou. Faça login novamente.",
          );
        }

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

            const tipoOriginal =
              String(item.tipo || "sistema").toLowerCase();

            const tipo =
              tipoOriginal.includes("ajuda")
                ? "ajuda"
                : tipoOriginal.includes("medicamento")
                  ? "medicamento"
                  : tipoOriginal.includes("consulta")
                    ? "consulta"
                    : tipoOriginal.includes("exame")
                      ? "exame"
                      : tipoOriginal.includes("agenda")
                        ? "agenda"
                        : "sistema";

            return {
              ...item,
              tipo,
              titulo:
                item.titulo ||
                item.assunto ||
                TIPOS[tipo].label,
              texto:
                item.mensagem ??
                item.descricao ??
                item.texto ??
                "",
              quando:
                item.criadaEm ||
                item.dataCriacao ||
                item.quando,
            };
          },
        );

        if (ativo) {
          setNotificacoes(
            notificacoesReais,
          );
        }
      } catch (error) {
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
  }, []);

  const naoLidas =
    useMemo(
      () =>
        notificacoes.filter(
          (item) =>
            !item.lida,
        ).length,
      [notificacoes],
    );

  const lista =
    useMemo(() => {
      return notificacoes
        .filter(
          (item) =>
            (
              filtroTipo ===
                "todas" ||
              item.tipo ===
                filtroTipo
            ) &&
            (
              !somenteNaoLidas ||
              !item.lida
            ),
        )
        .sort(
          (a, b) =>
            new Date(
              b.quando,
            ) -
            new Date(
              a.quando,
            ),
        );
    }, [
      notificacoes,
      filtroTipo,
      somenteNaoLidas,
    ]);

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
      setErroAcao(
        "Não foi possível identificar sua sessão.",
      );
      return;
    }

    setErroAcao("");
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
          atuais.map(
            (item) =>
              item.id === id
                ? {
                    ...item,
                    lida: true,
                  }
                : item,
          ),
      );
    } catch (error) {
      console.error(
        "Erro ao marcar notificação como lida:",
        error,
      );
      setErroAcao(
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
      marcandoTodas ||
      atualizandoIds.length > 0
    ) {
      return;
    }

    const session =
      getCareteaSession();

    if (!session?.token) {
      setErroAcao(
        "Não foi possível identificar sua sessão.",
      );
      return;
    }

    setErroAcao("");
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
        atuais.map(
          (item) =>
            idsMarcados.has(item.id)
              ? {
                  ...item,
                  lida: true,
                }
              : item,
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
      setErroAcao(
        "Não foi possível marcar todas as notificações como lidas.",
      );
    }

    setMarcandoTodas(false);
  }

  async function dispensar(
    notificacao,
  ) {
    const session =
      getCareteaSession();

    if (
      notificacao?.pedidoAjudaId == null ||
      atendendoIds.includes(notificacao.id)
    ) {
      return;
    }

    if (!session?.token) {
      setErroAcao(
        "Não foi possível identificar sua sessão.",
      );
      return;
    }

    setErroAcao("");
    setAtendendoIds(
      (atuais) => [...atuais, notificacao.id],
    );

    try {
      const response =
        await fetch(
          `${API_URL}/responsavel/meu-dia/ajuda/${notificacao.pedidoAjudaId}/atendido`,
          {
            method: "PATCH",

            headers: {
              Authorization:
                `Bearer ${session.token}`,
            },
          },
        );

      if (
        response.status === 401
      ) {
        throw new Error(
          "Sua sessão expirou. Faça login novamente.",
        );
      }

      if (
        response.status === 403
      ) {
        throw new Error(
          "Você não tem permissão para finalizar este pedido.",
        );
      }

      if (
        response.status === 404
      ) {
        throw new Error(
          "Pedido de ajuda não encontrado.",
        );
      }

      if (!response.ok) {
        throw new Error(
          "Não foi possível finalizar o pedido de ajuda.",
        );
      }

      setPedidosAtendidos(
        (atuais) =>
          atuais.includes(notificacao.id)
            ? atuais
            : [...atuais, notificacao.id],
      );
    } catch (error) {
      console.error(
        "Erro ao atender pedido de ajuda:",
        error,
      );
      setErroAcao(
        error.message ||
          "Não foi possível finalizar o pedido.",
      );
    } finally {
      setAtendendoIds(
        (atuais) =>
          atuais.filter(
            (id) => id !== notificacao.id,
          ),
      );
    }
  }

  return (
    <div className="notif-page">
      <Sidebar />

      <main className="notif-main">
        <Topbar
          title="Notificações"
          subtitle="Acompanhe lembretes, avisos e pedidos de ajuda."
          notifications={
            naoLidas
          }
          onLogout={
            onLogout
          }
        />

        <section className="notif-head">
          <div className="notif-head-copy">
            <h2>
              Central de notificações
            </h2>

            <p>
              {carregando
                ? "Carregando notificações..."
                : naoLidas > 0
                  ? `Você tem ${naoLidas} ${
                      naoLidas === 1
                        ? "notificação não lida"
                        : "notificações não lidas"
                    }.`
                  : "Tudo em dia, nenhuma notificação pendente."}
            </p>
          </div>

          <div className="notif-head-actions">
            <button
              type="button"
              className="mark-all-btn"
              onClick={
                marcarTodasComoLidas
              }
              disabled={
                naoLidas === 0 ||
                marcandoTodas ||
                atualizandoIds.length > 0
              }
            >
              {marcandoTodas
                ? "Marcando..."
                : "✓ Marcar todas como lidas"}
            </button>

            <button
              type="button"
              className="prefs-btn"
              onClick={() =>
                setAbrirPrefs(
                  true,
                )
              }
            >
              ⚙ Preferências
            </button>
          </div>
        </section>

        {erroAcao && (
          <p
            role="alert"
            style={{
              margin: "12px 0",
              padding: "10px 14px",
              borderRadius: "8px",
              color: "#b42318",
              background: "#fff1f0",
              fontSize: "13px",
            }}
          >
            {erroAcao}
          </p>
        )}

        <section className="notif-filters">
          <div
            className="filter-chips"
            role="group"
            aria-label="Filtrar por tipo"
          >
            <button
              type="button"
              className={`filter-chip ${
                filtroTipo ===
                "todas"
                  ? "active"
                  : ""
              }`}
              aria-pressed={
                filtroTipo ===
                "todas"
              }
              onClick={() =>
                setFiltroTipo(
                  "todas",
                )
              }
            >
              Todas
            </button>

            {Object.entries(
              TIPOS,
            ).map(
              ([
                chave,
                tipo,
              ]) => (
                <button
                  key={chave}
                  type="button"
                  className={`filter-chip chip-${tipo.cor} ${
                    filtroTipo ===
                    chave
                      ? "active"
                      : ""
                  }`}
                  aria-pressed={
                    filtroTipo ===
                    chave
                  }
                  onClick={() =>
                    setFiltroTipo(
                      chave,
                    )
                  }
                >
                  <span className="chip-icon">
                    {tipo.icon}
                  </span>

                  {tipo.label}
                </button>
              ),
            )}
          </div>

          <label className="only-unread">
            <input
              type="checkbox"
              checked={
                somenteNaoLidas
              }
              onChange={(event) =>
                setSomenteNaoLidas(
                  event.target
                    .checked,
                )
              }
            />

            <span
              className="switch"
              aria-hidden="true"
            />

            Somente não lidas
          </label>
        </section>

        {erro ? (
          <section className="notif-empty">
            <span className="empty-icon">
              ⚠
            </span>

            <strong>
              Não foi possível carregar
            </strong>

            <p>
              {erro}
            </p>
          </section>
        ) : carregando ? (
          <section className="notif-empty">
            <span className="empty-icon">
              🔔
            </span>

            <strong>
              Carregando notificações...
            </strong>
          </section>
        ) : lista.length ===
          0 ? (
          <section className="notif-empty">
            <span className="empty-icon">
              🔔
            </span>

            <strong>
              Nenhuma notificação por aqui
            </strong>

            <p>
              Quando houver avisos ou pedidos
              de ajuda, eles aparecerão nesta
              lista.
            </p>
          </section>
        ) : (
          <section className="notif-list">
            {lista.map(
              (notificacao) => {
                const tipo =
                  TIPOS[
                    notificacao.tipo
                  ] ||
                  TIPOS.sistema;

                return (
                  <article
                    key={
                      notificacao.id
                    }
                    className={`notif-item item-${tipo.cor} ${
                      notificacao.lida
                        ? "lida"
                        : "nao-lida"
                    }`}
                  >
                    <span
                      className={`notif-icon icon-${tipo.cor}`}
                    >
                      {tipo.icon}
                    </span>

                    <div className="notif-body">
                      <div className="notif-line">
                        {!notificacao.lida && (
                          <span
                            className="unread-dot"
                            aria-label="Não lida"
                          />
                        )}

                        <strong>
                          {
                            notificacao.titulo
                          }
                        </strong>

                        <span
                          className={`type-tag tag-${tipo.cor}`}
                        >
                          {
                            tipo.label
                          }
                        </span>
                      </div>

                      <p>
                        {
                          notificacao.texto
                        }
                      </p>

                      <time
                        dateTime={
                          notificacao.quando
                        }
                      >
                        🕒{" "}
                        {formatarQuando(
                          notificacao.quando,
                        )}
                      </time>
                    </div>

                    <div className="notif-actions">
                      <button
                        type="button"
                        className="read-btn"
                        disabled={
                          notificacao.lida ||
                          marcandoTodas ||
                          atualizandoIds.includes(
                            notificacao.id,
                          )
                        }
                        onClick={() =>
                          marcarComoLida(
                            notificacao.id,
                          )
                        }
                      >
                        {notificacao.lida
                          ? "Lida"
                          : "Marcar como lida"}
                      </button>

                      {notificacao.pedidoAjudaId !=
                        null && (
                        <button
                          type="button"
                          className="dismiss-btn"
                          onClick={() =>
                            dispensar(
                              notificacao,
                            )
                          }
                          disabled={
                            atendendoIds.includes(
                              notificacao.id,
                            ) ||
                            pedidosAtendidos.includes(
                              notificacao.id,
                            )
                          }
                          aria-label="Marcar pedido como atendido"
                          title="Marcar pedido como atendido"
                        >
                          {atendendoIds.includes(
                            notificacao.id,
                          )
                            ? "…"
                            : pedidosAtendidos.includes(
                                notificacao.id,
                              )
                              ? "✓"
                              : "✕"}
                        </button>
                      )}
                    </div>
                  </article>
                );
              },
            )}
          </section>
        )}

        <div
          aria-hidden="true"
          style={{
            display:
              "grid",

            gridTemplateColumns:
              `repeat(${CORES_RODAPE.length}, 1fr)`,

            width:
              "100%",

            height:
              "24px",

            marginTop:
              "28px",

            overflow:
              "hidden",

            borderRadius:
              "8px",
          }}
        >
          {CORES_RODAPE.map(
            (
              cor,
              index,
            ) => (
              <span
                key={`${cor}-${index}`}
                style={{
                  position:
                    "relative",

                  display:
                    "block",

                  height:
                    "24px",

                  background:
                    cor,
                }}
              >
                {index <
                  CORES_RODAPE.length -
                    1 && (
                  <span
                    style={{
                      position:
                        "absolute",

                      top:
                        "50%",

                      right:
                        "-6px",

                      zIndex:
                        2,

                      width:
                        "12px",

                      height:
                        "12px",

                      borderRadius:
                        "50%",

                      background:
                        cor,

                      transform:
                        "translateY(-50%)",
                    }}
                  />
                )}
              </span>
            ),
          )}
        </div>
      </main>

      {abrirPrefs && (
        <ModalPreferencias
          onFechar={() =>
            setAbrirPrefs(
              false,
            )
          }
        />
      )}
    </div>
  );
}

function ModalPreferencias({
  onFechar,
}) {
  const [
    canais,
    setCanais,
  ] = useState({
    push: true,
    email: false,
    whatsapp: true,
  });

  const [
    tipos,
    setTipos,
  ] = useState({
    medicamento: true,
    consulta: true,
    exame: true,
    agenda: true,
    sistema: true,
    ajuda: true,
  });

  const [
    naoPerturbe,
    setNaoPerturbe,
  ] = useState(false);

  const toggleCanal =
    (chave) =>
      setCanais(
        (atual) => ({
          ...atual,

          [chave]:
            !atual[
              chave
            ],
        }),
      );

  const toggleTipo =
    (chave) =>
      setTipos(
        (atual) => ({
          ...atual,

          [chave]:
            !atual[
              chave
            ],
        }),
      );

  return (
    <div
      className="notif-overlay"
      role="dialog"
      aria-modal="true"
      onClick={
        onFechar
      }
    >
      <div
        className="notif-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="modal-head">
          <h3>
            Preferências de notificação
          </h3>

          <button
            type="button"
            className="modal-close"
            onClick={
              onFechar
            }
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div className="modal-content">
          <div className="prefs-group">
            <h4>
              Canais
            </h4>

            {[
              [
                "push",
                "🔔",
                "Notificações push",
              ],
              [
                "email",
                "✉️",
                "E-mail",
              ],
              [
                "whatsapp",
                "💬",
                "WhatsApp",
              ],
            ].map(
              ([
                chave,
                icon,
                label,
              ]) => (
                <label
                  key={chave}
                  className="pref-row"
                >
                  <span className="pref-label">
                    <span className="pref-icon">
                      {icon}
                    </span>

                    {label}
                  </span>

                  <input
                    type="checkbox"
                    checked={
                      canais[
                        chave
                      ]
                    }
                    onChange={() =>
                      toggleCanal(
                        chave,
                      )
                    }
                  />

                  <span
                    className="switch"
                    aria-hidden="true"
                  />
                </label>
              ),
            )}
          </div>

          <div className="prefs-group">
            <h4>
              Tipos de notificação
            </h4>

            {Object.entries(
              TIPOS,
            ).map(
              ([
                chave,
                tipo,
              ]) => (
                <label
                  key={chave}
                  className="pref-row"
                >
                  <span className="pref-label">
                    <span className="pref-icon">
                      {tipo.icon}
                    </span>

                    {
                      tipo.label
                    }
                  </span>

                  <input
                    type="checkbox"
                    checked={
                      tipos[
                        chave
                      ] ??
                      true
                    }
                    onChange={() =>
                      toggleTipo(
                        chave,
                      )
                    }
                  />

                  <span
                    className="switch"
                    aria-hidden="true"
                  />
                </label>
              ),
            )}
          </div>

          <div className="prefs-group">
            <h4>
              Silêncio
            </h4>

            <label className="pref-row">
              <span className="pref-label">
                <span className="pref-icon">
                  🌙
                </span>

                Não perturbe
                (22h às 07h)
              </span>

              <input
                type="checkbox"
                checked={
                  naoPerturbe
                }
                onChange={() =>
                  setNaoPerturbe(
                    (atual) =>
                      !atual,
                  )
                }
              />

              <span
                className="switch"
                aria-hidden="true"
              />
            </label>
          </div>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn-ghost"
            onClick={
              onFechar
            }
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn-solid"
            onClick={
              onFechar
            }
          >
            Salvar preferências
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notificacoes;